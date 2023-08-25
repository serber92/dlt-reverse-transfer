const { GraphQLInt, GraphQLString, GraphQLList } = require("graphql");

const { NotesType } = require("../types");
const { Notes } = require("../../models");

const NotesQuery = {
  type: new GraphQLList(NotesType),
  args: {
    id: {
      name: "id",
      type: GraphQLInt,
    },
    email: {
      name: "email",
      type: GraphQLString,
    },
    note: {
      name: "note",
      type: GraphQLString,
    },
    createdAt: {
      name: "createdAt",
      type: GraphQLString,
    },
    updatedAt: {
      name: "updatedAt",
      type: GraphQLString,
    },
  },
  resolve: (parent, args) => Notes.findAll({ where: args }),
};

module.exports = { NotesQuery };
