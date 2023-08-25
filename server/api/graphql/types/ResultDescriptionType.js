const { GraphQLObjectType, GraphQLString } = require("graphql");

const ResultDescriptionType = new GraphQLObjectType({
  name: "ResultDescriptionType",
  description: "This represents a ResultDescription",
  fields: () => ({
    id: {
      type: GraphQLString,
      resolve: (assertion) => assertion.id,
    },
    last_updated: {
      type: GraphQLString,
      resolve: (assertion) => assertion.last_updated,
    },
    type: {
      type: GraphQLString,
      resolve: (assertion) => assertion.type,
    },
    created_by: {
      type: GraphQLString,
      resolve: (assertion) => assertion.created_by,
    },
    alignment: {
      type: GraphQLString,
      resolve: (assertion) => assertion.alignment,
    },
    name: {
      type: GraphQLString,
      resolve: (assertion) => assertion.name,
    },
    result_min: {
      type: GraphQLString,
      resolve: (assertion) => assertion.result_min,
    },
    result_max: {
      type: GraphQLString,
      resolve: (assertion) => assertion.result_max,
    },
  }),
});

module.exports = { ResultDescriptionType };
