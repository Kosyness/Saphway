# Saphway

Saphway is a basic GraphQL Implementation for access to some of Subway's Data.

## Features and Technologies

- [x] GraphQL
- [x] MongoDB
- [x] TypeScript
- [x] TypeGraphQL
- [x] NextJS

## More Info about the Project

The project is using TypeGraphQL, for the generation of the GraphQL Schema, as well as a fully typed GraphQL API.

The Database that is used is MongoDB with Mongoose. Although a Cache Layer is planned to be added in the future (Redis)

The GraphQL Object Files and Resolvers are stored in `src/graphql`. 
Decided to go with the route of splitting a big file into smaller files (object file, resolver file, filters file, etc.)
That way, it is easier to maintain and add new features.

The GraphQL API Consists of the following Queries and Mutations:

### Queries

- `stores` - Returns all Stores (paginated) with an option to filter by `name` and `city` and `open_hours`
- `store` - Returns a single Store by `id`

- (for each store) `nearby` - Returns all Stores that are nearby to the current store

### Mutations

open/close store - Opens or Closes a Store by `id`

## Requirements

Envornment Variables:
- MONGO_URI

## How to use

Recommended to use `pnpm` instead of `npm`

### Building

You can use the following commands to build the project

```bash
    npm install
    npm run build
    # Starting
    npm run start
```

### Running Development Server
    
```bash
    npm install
    npm run dev
```


