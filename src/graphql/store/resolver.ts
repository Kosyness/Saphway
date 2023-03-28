import 'reflect-metadata';
import '..';

import {
  Arg,
  Args,
  ArgsType,
  Field,
  FieldResolver,
  InputType,
  Int,
  Mutation,
  Query,
  Resolver,
  Root,
} from 'type-graphql';

import { Min, Max } from 'class-validator';
import StoreModel from '../../models/store';
import { getMongoConnection } from '../../models';
import { Store } from './object';
import { NearbyFilterInput, OpenHourFilter } from './filters';
import { StoreWhereInput } from './filters';

/**
 * The Input Arguments for the Store Query
 *
 * Contains pagination information, as well as filters for the query
 */
@ArgsType()
class GetStoresArgs {
  @Field((type) => Int, { defaultValue: 1 })
  @Min(1)
  public page: number = 1;

  @Field((type) => Int, { defaultValue: 50 })
  @Min(1)
  @Max(100)
  public limit: number = 50;

  @Field((type) => StoreWhereInput, { nullable: true })
  public where?: StoreWhereInput;

  @Field((type) => Boolean, { defaultValue: false })
  public include_closed: boolean = false;
}

@InputType()
class StoreSocialsInput {
  @Field((type) => String, { nullable: true })
  public facebook?: string;

  @Field((type) => String, { nullable: true })
  public instagram?: string;

  @Field((type) => String, { nullable: true })
  public twitter?: string;

  @Field((type) => String, { nullable: true })
  public website?: string;

  @Field((type) => String, { nullable: true })
  public youtube?: string;

  @Field((type) => String, { nullable: true })
  public tiktok?: string;
}

@InputType()
class StoreUpdateInput {
  @Field((type) => String, { nullable: true })
  public name?: string;

  @Field((type) => String, { nullable: true })
  public url?: string;

  @Field((type) => String, { nullable: true })
  public socials?: StoreSocialsInput;
}

@ArgsType()
class UpdateStoreArgs {
  @Field((type) => String)
  public id: string = '';

  @Field((type) => StoreWhereInput, { nullable: true })
  public update?: StoreUpdateInput;
}

@Resolver((type) => Store)
export class StoreResolver {
  /**
   * The Store Query
   *
   * Takes the input arguments, and returns a list of stores (paginated)
   */
  @Query((returns) => [Store])
  async stores(
    @Args()
    args?: GetStoresArgs
  ) {
    await getMongoConnection();

    const { limit, page, where, include_closed } = {
      limit: 50,
      page: 1,
      where: new StoreWhereInput(),
      include_closed: false,
      ...args,
    };

    const query = where.generateMongoQuery();
    const closed_query = include_closed ? {} : { closed: { $ne: true } };

    const stores = await StoreModel.find({
      ...closed_query,
      ...query,
    })
      .limit(limit)
      .skip((page - 1) * limit)
      .exec();

    return stores.map((s) => s.toJSON());
  }

  @Query((returns) => Store)
  async store(@Arg('id') store_id: string) {
    await getMongoConnection();

    const store = await StoreModel.findOne({
      _id: store_id,
    }).exec();

    if (!store) {
      throw new Error('Store not found');
    }

    return store.toJSON();
  }

  /**
   * Field in the Store Object that returns a list of nearby stores
   */
  @FieldResolver((type) => [Store])
  public async nearby(
    @Args()
    filter?: NearbyFilterInput,
    @Root()
    store?: Store
  ) {
    if (!store) {
      return [];
    }

    const closed = filter?.include_closed ? {} : { closed: { $ne: true } };

    const stores = await StoreModel.find({
      ...closed,
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [
              store.coordinates.latitude,
              store.coordinates.longitude,
            ],
          },
          $maxDistance: filter?.distance || 0,
        },
      },
    });

    return stores.map((s) => s.toJSON());
  }

  /**
   * A mutation to Close Down a Store
   */
  @Mutation((returns) => Store)
  public async close(@Arg('id') id: string) {
    await getMongoConnection();

    const store = await StoreModel.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          closed: true,
        },
      },
      {
        new: true,
      }
    ).exec();

    if (!store) {
      throw new Error('Store not found');
    }

    return store.toJSON();
  }

  /**
   * A mutation to Open Up a Store
   */
  @Mutation((returns) => Store)
  public async open(@Arg('id') id: string) {
    await getMongoConnection();

    const store = await StoreModel.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          closed: false,
        },
      },
      {
        new: true,
      }
    ).exec();

    if (!store) {
      throw new Error('Store not found');
    }

    return store.toJSON();
  }

  @Mutation((returns) => Store)
  public async updateStore(
    @Args()
    args: UpdateStoreArgs
  ) {
    await getMongoConnection();

    const { id, update } = args;

    const updated_document = await StoreModel.findOneAndUpdate(
      {
        _id: id,
      },
      {
        $set: {
          ...update,
        },
      },
      {
        new: true,
      }
    ).exec();

    if (!updated_document) {
      throw new Error('Store not found');
    }

    return updated_document.toJSON();
  }
}
