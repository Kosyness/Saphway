
import 'reflect-metadata';
import '..';

import {
  ArgsType,
  Field,
  InputType,
  Int,
} from 'type-graphql';

import { AddressFilter } from '../address';
import { Day, getMongoConnection } from '../../models';
import { Coordinates, Store } from './object';
import { FilterQuery } from 'mongoose';
import { Store as StoreInterface} from '../../models/store';
import { Max, Min } from 'class-validator';


@InputType()
export class OpenHourFilter { 
    @Field({
        deprecationReason: 'Temporarily deprecated'
    })
    public is_open: number = 0;

    @Field()
    public day: Day = Day.Monday;
}

@InputType()
export class StoreWhereInput {
  @Field((type) => String, { nullable: true })
  public name?: String;

  @Field((type) => AddressFilter, { nullable: true })
  public address?: AddressFilter;

  @Field((type) => OpenHourFilter, { 
    nullable: true,
  })
  public open_hours?: OpenHourFilter;

  public generateMongoQuery() {
    let query: FilterQuery<StoreInterface> = {};

    if (this.name) {
      query.name = this.name;
    }

    if(this.address) { 
      if(this.address.street) { 
        query['address.street'] = this.address.street;
      }

      if(this.address.city) {
        query['address.city'] = this.address.city;
      }

      if(this.address.state) {
        query['address.state'] = this.address.state;
      }

      if(this.address.zip) {
        query['address.zip'] = this.address.zip;
      }

      if(this.address.country) {
        query['address.country'] = this.address.country;
      }
    }

    if(this.open_hours) {
      if(this.open_hours.day) {
        query['open_hours.day'] = this.open_hours.day.toLowerCase();
      }

      // !BUG: Mongo Cast Error, Investigate this
      // if(where.open_hours.is_open) {
      //   query['open_hours.start'] = { $$lte: where.open_hours.is_open };
      //   query['open_hours.end'] = { $gte: where.open_hours.is_open };
      // }
    }

    return query;
  }
}




@ArgsType()
export class NearbyFilterInput { 
    @Field(type => Int, {
        description: 'Distance in KM',
        nullable: true,
        defaultValue: 5,
    })
    @Min(0)
    @Max(100000)
    public distance: number = 5;

    @Field(type => Boolean, {
      defaultValue: false
    })
    public include_closed: boolean = false;
}