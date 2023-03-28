import { Field, ObjectType, registerEnumType } from 'type-graphql';
import { Day } from '../../models';
import { Address } from '../address';

/**
 * The Open Hour Object
 */
@ObjectType()
export class OpenHour {
  @Field()
  public day: string = '';
  @Field()
  public open: number = 0;
  @Field()
  public close: number = 0;
}

/**
 * Day Enum
 */
registerEnumType(Day, {
  name: 'Day',
  description: 'Days of the week',
});

/**
 * Coordinates Object
 *
 * (latitude, longitude)
 */
@ObjectType()
export class Coordinates {
  public constructor(latitude: number, longitude: number) {
    this.latitude = latitude;
    this.longitude = longitude;
  }

  @Field()
  public latitude: number = 0;
  @Field()
  public longitude: number = 0;
}

@ObjectType()
export class Socials {
  @Field({ nullable: true })
  public facebook?: string;

  @Field({
    nullable: true,
  })
  public twitter?: string;

  @Field({
    nullable: true,
  })
  public instagram?: string;

  @Field({
    nullable: true,
  })
  public pinterest?: string;

  @Field({
    nullable: true,
  })
  public youtube?: string;
}

/**
 * The Store Object
 *
 * Contains the most basic information about the store
 */
@ObjectType()
export class Store {
  @Field()
  public id: string = '';

  @Field()
  public name: string = '';

  @Field({ nullable: true })
  public url?: string;

  @Field((type) => Address)
  public address: Address = new Address();

  @Field((type) => [String])
  public phone_numbers: string[] = [];

  @Field((type) => [String])
  public fax_numbers: string[] = [];

  @Field((type) => [String])
  public emails: string[] = [];

  @Field({
    nullable: true,
  })
  public website: string = '';

  @Field((type) => [OpenHour])
  public open_hours: OpenHour[] = [];

  @Field((type) => Coordinates)
  public coordinates: Coordinates = new Coordinates(0, 0);

  @Field((type) => Boolean)
  public closed: boolean = false;

  @Field((type) => Socials, { nullable: true })
  public socials?: Socials;
}

