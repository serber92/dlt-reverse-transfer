const { GraphQLString, GraphQLList } = require("graphql");

const { AlignmentType } = require("../types");
const { Alignment } = require("../../models");

const AlignmentQuery = {
  type: new GraphQLList(AlignmentType),
  args: {
    id: {
      name: "id",
      type: GraphQLString,
    },
    created_by: {
      name: "created_by",
      type: GraphQLString,
    },
  },
  resolve: (parent, args) =>
  Alignment.findAll({
      where: args,
    }),
};

module.exports = { AlignmentQuery };
