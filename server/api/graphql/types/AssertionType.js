const { GraphQLObjectType, GraphQLString, GraphQLList } = require("graphql");
const { AchievementType } = require("./AchievementType");
const { ResultType } = require("./ResultType");

const AssertionType = new GraphQLObjectType({
  name: "AssertionType",
  description: "This represents a Assertion",
  fields: () => ({
    id: {
      type: GraphQLString,
      resolve: (assertion) => assertion.id,
    },
    credits_earned: {
      type: GraphQLString,
      resolve: (assertion) => assertion.credits_earned,
    },
    end_date: {
      type: GraphQLString,
      resolve: (assertion) => assertion.end_date,
    },
    issued_on: {
      type: GraphQLString,
      resolve: (assertion) => assertion.issued_on,
    },
    recipient: {
      type: GraphQLString,
      resolve: (assertion) => assertion.recipient,
    },
    results: {
      type: new GraphQLList(ResultType),
      resolve: (assertion) => assertion.results,
    },
    start_date: {
      type: GraphQLString,
      resolve: (assertion) => assertion.start_date,
    },
    term: {
      type: GraphQLString,
      resolve: (assertion) => assertion.term,
    },
    achievement: {
      type: AchievementType,
      resolve: (assertion) => assertion.achievement,
    },
  }),
});

module.exports = { AssertionType };
