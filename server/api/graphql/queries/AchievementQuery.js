const { GraphQLString, GraphQLList } = require("graphql");

const { AchievementType } = require("../types");
const { Achievement } = require("../../models");

const AchievementQuery = {
  type: new GraphQLList(AchievementType),
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
  Achievement.findAll({
      where: args,
    }),
};

module.exports = { AchievementQuery };
