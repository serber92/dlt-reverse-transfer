const { GraphQLObjectType, GraphQLString } = require("graphql");

const ResultType = new GraphQLObjectType({
  name: "ResultType",
  description: "This represents a Result",
  fields: () => ({
    id: {
      type: GraphQLString,
      resolve: (assertion) => assertion.id,
    },
    // last_updated: {
    //   type: GraphQLString,
    //   resolve: (assertion) => assertion.last_updated,
    // },
    // type: {
    //   type: GraphQLString,
    //   resolve: (assertion) => assertion.type,
    // },
    // created_by: {
    //   type: GraphQLString,
    //   resolve: (assertion) => assertion.created_by,
    // },
    result_type: {
      type: GraphQLString,
      resolve: (assertion) => assertion.result_type,
    },
    alignment: {
      type: GraphQLString,
      resolve: (assertion) => assertion.alignment,
    },
    value: {
      type: GraphQLString,
      resolve: (assertion) => assertion.value,
    },
  }),
});

module.exports = { ResultType };
