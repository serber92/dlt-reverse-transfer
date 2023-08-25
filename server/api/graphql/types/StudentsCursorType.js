const { GraphQLObjectType, GraphQLList, GraphQLBoolean, GraphQLString } = require("graphql");
const { StudentDataType } = require("./StudentDataType");

const Edge = new GraphQLObjectType({
  name: "Edge",
  description: "This represents a StudentData",
  fields: () => ({
    cursor: {
      type: GraphQLString,
      resolve: (student) => student.cursor,
    },
    node: {
      type: StudentDataType,
      resolve: (student) => student.node,
    },
  }),
});

const PageInfo = new GraphQLObjectType({
  name: "PageInfo",
  description: "This represents a StudentData",
  fields: () => ({
    lastCursor: {
      type: GraphQLString,
      resolve: (student) => student.lastCursor,
    },
    hasNextPage: {
      type: GraphQLBoolean,
      resolve: (student) => student.hasNextPage,
    },
  }),
});

const StudentsCursorType = new GraphQLObjectType({
  name: "StudentsCursor",
  description: "This represents a StudentsCursor",
  fields: () => ({
    edges: {
      type: new GraphQLList(Edge),
      resolve: (address) => address.edges,
    },
    pageInfo: {
      type: PageInfo,
      resolve: (address) => address.pageInfo,
    },
  }),
});

module.exports = { StudentsCursorType };
