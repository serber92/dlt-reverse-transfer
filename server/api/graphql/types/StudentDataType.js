const { GraphQLObjectType, GraphQLList } = require("graphql");
const { AssertionType } = require("./AssertionType");
const { ProfileType } = require("./ProfileType");

const StudentDataType = new GraphQLObjectType({
  name: "StudentDataType",
  description: "This represents a StudentData",
  fields: () => ({
    profile: {
      type: ProfileType,
      resolve: (student) => student.profile,
    },
    assertions: {
      type: new GraphQLList(AssertionType),
      resolve: (student) => student.assertions,
    },
  }),
});

module.exports = { StudentDataType };
