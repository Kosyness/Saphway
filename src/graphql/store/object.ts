


import {
    Arg,
    Args,
    ArgsType,
    Field,
    FieldResolver,
    InputType,
    Int,
    ObjectType,
    Query,
    registerEnumType,
    Resolver,
    Root,
  } from 'type-graphql';
import { Day } from '../../models';
import StoreModel from '../../models/store';
  import { Address } from '../address';
import { NearbyFilterInput, StoreWhereInput } from './filters';
  
@ObjectType() 
export class OpenHour { 
    @Field() 
    public day: string = ''; 
    @Field() 
    public open: number = 0; 
    @Field() 
    public close: number = 0;
}

registerEnumType(Day, {
    name: 'Day',
    description: 'Days of the week',
});


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
  export class Store {
    @Field()
    public id: string = '';
    
    @Field()
    public name: string = '';
  
    @Field({ nullable: true })
    public url?: string;

    @Field(type => Address)
    public address: Address = new Address();

    @Field(type => [String])
    public phone_numbers: string[] = [];

    @Field(type => [String])
    public fax_numbers: string[] = [];

    @Field(type => [String])
    public emails: string[] = [];

    @Field({
        nullable: true,
    })
    public website: string = '';

    @Field(type => [OpenHour])
    public open_hours: OpenHour[] = [];

    @Field(type => Coordinates)
    public coordinates: Coordinates = new Coordinates(0, 0);
  }