const { GraphQLObjectType, GraphQLString } = require("graphql");

const TSQLQueryType = new GraphQLObjectType({
  name: "TSQLQueryType",
  description: "This represents a TSQLQueryType",
  fields: () => ({
    id: {
      type: GraphQLString,
      resolve: (parent) => parent.id,
    },
    email: {
      type: GraphQLString,
      resolve: (parent) => parent.email,
    },
    TSQL: {
      type: GraphQLString,
      resolve: (parent) => parent.TSQL,
    },
    createdAt: {
      type: GraphQLString,
      resolve: (parent) => parent.createdAt,
    },
    updatedAt: {
      type: GraphQLString,
      resolve: (parent) => parent.updatedAt,
    },
  }),
});

module.exports = { TSQLQueryType };
