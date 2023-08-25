const { GraphQLString, GraphQLList } = require("graphql");

const { AssertionType } = require("../types");
const { Assertion, Verification, Achievement } = require("../../models");

const AssertionQuery = {
  type: new GraphQLList(AssertionType),
  args: {
    id: {
      name: "id",
      type: GraphQLString,
    },
    recipient: {
      name: "recipient",
      type: GraphQLString,
    },
  },
  resolve: (parent, args) =>
  Assertion.findAll({
      where: args,
      include: [
        {
          model: Verification,
        },
        {
          model: Achievement,
        },
      ],
    }),
};

module.exports = { AssertionQuery };
