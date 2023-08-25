const { GraphQLObjectType, GraphQLString } = require("graphql");
const { ParticipantType } = require("./ParticipantType");

const LoginType = new GraphQLObjectType({
  name: "LoginType",
  description: "This represents a StudentData",
  fields: () => ({
    token: {
      type: GraphQLString,
      resolve: (parent) => parent.token,
    },
    user: {
      type: ParticipantType,
      resolve: (parent) => parent.user,
    },
  }),
});

module.exports = { LoginType };
