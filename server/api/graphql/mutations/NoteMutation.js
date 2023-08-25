const { GraphQLString, GraphQLInt, GraphQLNonNull } = require("graphql");
const { NotesType } = require("../types");
const { Notes, sequelize } = require("../../models/Notes");

const createNote = {
  type: NotesType,
  description: "The mutation that allows you to create a new Note",
  args: {
    email: {
      name: "email",
      type: new GraphQLNonNull(GraphQLString),
    },
    note: {
      name: "note",
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  resolve: (value, { email, note }) =>
    Notes.create({
      email,
      note,
    }),
};

const updateNote = {
  type: NotesType,
  description: "The mutation that allows you to update an existing Note by Id",
  args: {
    email: {
      name: "email",
      type: new GraphQLNonNull(GraphQLString),
    },
    note: {
      name: "note",
      type: GraphQLString,
    },
  },
  resolve: async (value, { email, note }) => {
    try {
      const result = await sequelize.transaction(async (t) => {
        
        const [noteResult] = await Notes.findOrCreate({
          where: {
            email,
          },
          defaults: {
            email,
            note,
          },
          transaction: t,
        });

        await noteResult.update({
          email,
          note,
        });

        return noteResult.get({ plain: true });
      });

      return result;
    } catch (error) {
      return null;
    }
  },
};

const deleteNote = {
  type: NotesType,
  description: "The mutation that allows you to delete a existing Note by Id",
  args: {
    id: {
      name: "id",
      type: new GraphQLNonNull(GraphQLInt),
    },
  },
  resolve: async (value, { id }) => {
    const foundNote = await Notes.findByPk(id);

    if (!foundNote) {
      throw new Error(`Note with id: ${id} not found!`);
    }

    await Notes.destroy({
      where: {
        id,
      },
    });

    return foundNote;
  },
};

module.exports = {
  createNote,
  updateNote,
  deleteNote,
};
