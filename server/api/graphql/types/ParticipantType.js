const { GraphQLObjectType, GraphQLList, GraphQLString, GraphQLBoolean } = require("graphql");

const ParticipantType = new GraphQLObjectType({
  name: "Participant",
  description: "This represents a Participant",
  fields: () => ({
    id: {
      type: GraphQLString,
      resolve: (parent) => parent.id,
    },
    last_updated: {
      type: GraphQLString,
      resolve: (parent) => parent.last_updated,
    },
    created_by: {
      type: GraphQLString,
      resolve: (parent) => parent.created_by,
    },
    type: {
      type: GraphQLString,
      resolve: (parent) => parent.type,
    },
    active: {
      type: GraphQLBoolean,
      resolve: (parent) => parent.active,
    },
    email: {
      type: GraphQLString,
      resolve: (parent) => parent.email,
    },
    ip_address: {
      type: new GraphQLList(GraphQLString),
      resolve: (parent) => parent.ip_address,
    },
    name: {
      type: GraphQLString,
      resolve: (parent) => parent.name,
    },
    owner: {
      type: GraphQLString,
      resolve: (parent) => parent.owner,
    },
    participant_type: {
      type: GraphQLString,
      resolve: (parent) => parent.participant_type,
    },
    public_key: {
      type: GraphQLString,
      resolve: (parent) => parent.public_key,
    },
  }),
});

module.exports = { ParticipantType };
