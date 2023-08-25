const { GraphQLObjectType, GraphQLString } = require("graphql");

const VerificationType = new GraphQLObjectType({
  name: "Verification",
  description: "This represents a verification",
  fields: () => ({
    id: {
      type: GraphQLString,
      resolve: (verification) => verification.id,
    },
    last_updated: {
      type: GraphQLString,
      resolve: (verification) => verification.last_updated,
    },
    type: {
      type: GraphQLString,
      resolve: (verification) => verification.type,
    },
    allowed_origins: {
      type: GraphQLString,
      resolve: (verification) => verification.allowed_origins,
    },
    creator: {
      type: GraphQLString,
      resolve: (verification) => verification.creator,
    },
    starts_with: {
      type: GraphQLString,
      resolve: (verification) => verification.starts_with,
    },
    verification_property: {
      type: GraphQLString,
      resolve: (verification) => verification.verification_property,
    },
  }),
});

module.exports = { VerificationType };
