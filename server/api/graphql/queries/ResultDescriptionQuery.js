const { GraphQLString, GraphQLList } = require("graphql");

const { ResultDescriptionType } = require("../types");
const { ResultDescription } = require("../../models");

const ResultDescriptionQuery = {
  type: new GraphQLList(ResultDescriptionType),
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
    ResultDescription.findAll({
      where: args,
    }),
};

module.exports = { ResultDescriptionQuery };
