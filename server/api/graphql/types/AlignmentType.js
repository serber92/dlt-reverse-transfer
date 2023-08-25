const { GraphQLObjectType, GraphQLString } = require("graphql");

const AlignmentType = new GraphQLObjectType({
  name: "AlignmentType",
  description: "This represents a Alignment",
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
    framework_name: {
      type: GraphQLString,
      resolve: (assertion) => assertion.framework_name,
    },
    target_code: {
      type: GraphQLString,
      resolve: (assertion) => assertion.target_code,
    },
    target_description: {
      type: GraphQLString,
      resolve: (assertion) => assertion.target_description,
    },
    target_name: {
      type: GraphQLString,
      resolve: (assertion) => assertion.target_name,
    },
    target_url: {
      type: GraphQLString,
      resolve: (assertion) => assertion.target_url,
    },
  }),
});

module.exports = { AlignmentType };
