const { GraphQLObjectType, GraphQLInt, GraphQLString } = require("graphql");

const NotesType = new GraphQLObjectType({
  name: "Notes",
  description: "This represents a Notes",
  fields: () => ({
    id: {
      type: GraphQLInt,
      resolve: (note) => note.id,
    },
    email: {
      type: GraphQLString,
      resolve: (note) => note.email,
    },
    note: {
      type: GraphQLString,
      resolve: (note) => note.note,
    },
    createdAt: {
      type: GraphQLString,
      resolve: (note) => note.createdAt,
    },
    updatedAt: {
      type: GraphQLString,
      resolve: (note) => note.updatedAt,
    },
  }),
});

module.exports = { NotesType };
