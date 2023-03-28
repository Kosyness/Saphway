import {
  ArgsType,
  Field,
  FieldOptions,
  ObjectType,
  Args,
  InputType,
} from 'type-graphql';
import { StoreResolver } from './store/resolver';
import { FilterQuery } from 'mongoose';

const NullableString = (options?: FieldOptions) =>
  Field((type) => String, { nullable: true, ...options });

@InputType()
export class StringSearch {
  @NullableString()
  eq?: string;

  @NullableString()
  contains?: string;

  @NullableString()
  not_contains?: string;

  @NullableString()
  starts_with?: string;

  @NullableString()
  not_starts_with?: string;

  @NullableString()
  ends_with?: string;

  public toMongoQuery() {
    const query: FilterQuery<unknown> = {};
    if (this.eq) {
      query.$eq = this.eq;
    }
    if (this.contains) {
      query.$regex = this.contains;
    }
    if (this.not_contains) {
      query.$not = { $regex: this.not_contains };
    }
    if (this.starts_with) {
      query.$regex = `^${this.starts_with}`;
    }
    if (this.not_starts_with) {
      query.$not = { $regex: `^${this.not_starts_with}` };
    }
    if (this.ends_with) {
      query.$regex = `${this.ends_with}$`;
    }
    return query;
  }
}

export const STATES = [
  { state: 'Alabama', abbreviation: 'AL' },
  { state: 'Alaska', abbreviation: 'AK' },
  { state: 'Arizona', abbreviation: 'AZ' },
  { state: 'Arkansas', abbreviation: 'AR' },
  { state: 'California', abbreviation: 'CA' },
  { state: 'Colorado', abbreviation: 'CO' },
  { state: 'Connecticut', abbreviation: 'CT' },
  { state: 'Delaware', abbreviation: 'DE' },
  { state: 'District of Columbia', abbreviation: 'DC' },
  { state: 'Florida', abbreviation: 'FL' },
  { state: 'Georgia', abbreviation: 'GA' },
  { state: 'Hawaii', abbreviation: 'HI' },
  { state: 'Idaho', abbreviation: 'ID' },
  { state: 'Illinois', abbreviation: 'IL' },
  { state: 'Indiana', abbreviation: 'IN' },
  { state: 'Iowa', abbreviation: 'IA' },
  { state: 'Kansas', abbreviation: 'KS' },
  { state: 'Kentucky', abbreviation: 'KY' },
  { state: 'Louisiana', abbreviation: 'LA' },
  { state: 'Maine', abbreviation: 'ME' },
  { state: 'Montana', abbreviation: 'MT' },
  { state: 'Nebraska', abbreviation: 'NE' },
  { state: 'Nevada', abbreviation: 'NV' },
  { state: 'New Hampshire', abbreviation: 'NH' },
  { state: 'New Jersey', abbreviation: 'NJ' },
  { state: 'New Mexico', abbreviation: 'NM' },
  { state: 'New York', abbreviation: 'NY' },
  { state: 'North Carolina', abbreviation: 'NC' },
  { state: 'North Dakota', abbreviation: 'ND' },
  { state: 'Ohio', abbreviation: 'OH' },
  { state: 'Oklahoma', abbreviation: 'OK' },
  { state: 'Oregon', abbreviation: 'OR' },
  { state: 'Maryland', abbreviation: 'MD' },
  { state: 'Massachusetts', abbreviation: 'MA' },
  { state: 'Michigan', abbreviation: 'MI' },
  { state: 'Minnesota', abbreviation: 'MN' },
  { state: 'Mississippi', abbreviation: 'MS' },
  { state: 'Missouri', abbreviation: 'MO' },
  { state: 'Pennsylvania', abbreviation: 'PA' },
  { state: 'Rhode Island', abbreviation: 'RI' },
  { state: 'South Carolina', abbreviation: 'SC' },
  { state: 'South Dakota', abbreviation: 'SD' },
  { state: 'Tennessee', abbreviation: 'TN' },
  { state: 'Texas', abbreviation: 'TX' },
  { state: 'Utah', abbreviation: 'UT' },
  { state: 'Vermont', abbreviation: 'VT' },
  { state: 'Virginia', abbreviation: 'VA' },
  { state: 'Washington', abbreviation: 'WA' },
  { state: 'West Virginia', abbreviation: 'WV' },
  { state: 'Wisconsin', abbreviation: 'WI' },
  { state: 'Wyoming', abbreviation: 'WY' },
] as const;

export const state_string_to_object = (state: string) => {
  const state_object = STATES.find((s) => s.abbreviation === state);

  if(!state_object) throw new Error(`Invalid state: ${state}`);

  return state_object;
};
