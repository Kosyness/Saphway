import { Field, InputType, ObjectType } from 'type-graphql';

/**
 * The State Object
 */
@ObjectType()
export class State {
  @Field()
  state: string = '';

  @Field()
  abbreviation: string = '';
}

/**
 * The Address Object
 */
@ObjectType()
export class Address {
  @Field()
  street: string = '';

  @Field()
  city: string = '';

  @Field((returns) => State)
  state: State = new State();

  @Field()
  zip: string = '';

  @Field()
  country: string = '';
}

/**
 * The Address State Filter
 */
@InputType()
export class StateFilter {
  @Field({
    nullable: true,
  })
  state?: String;

  @Field({
    nullable: true,
  })
  abbreviation?: String;
}

/**
 * The Address Filter
 */
@InputType()
export class AddressFilter {
  @Field({
    nullable: true,
  })
  street?: String;

  @Field({
    nullable: true,
  })
  city?: String;

  @Field((returns) => StateFilter, {
    nullable: true,
  })
  state?: StateFilter;

  @Field({
    nullable: true,
  })
  zip?: String;

  @Field({
    nullable: true,
  })
  country?: String;
}
