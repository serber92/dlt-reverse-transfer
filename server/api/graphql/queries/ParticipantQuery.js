const { GraphQLString, GraphQLList } = require("graphql");

const { ParticipantType } = require("../types");
const { Participant } = require("../../models");

const ParticipantQuery = {
  type: new GraphQLList(ParticipantType),
  args: {
    id: {
      name: "id",
      type: GraphQLString,
    },
    name: {
      name: "name",
      type: GraphQLString,
    },
  },
  resolve: (parent, args) =>
    Participant.findAll({
      where: args,
    }),
};

module.exports = { ParticipantQuery };
