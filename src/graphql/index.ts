import { ArgsType, buildSchemaSync, Field, FieldOptions } from 'type-graphql';
import { StoreResolver } from './store/resolver';

export const schema = buildSchemaSync({
  resolvers: [StoreResolver],
});
