const { GraphQLString, GraphQLNonNull } = require("graphql");
const merge = require("lodash.merge");

const { TSQLQueryType } = require("../types");
const { TSQLQuery } = require("../../models");

const createTSQLQuery = {
  type: TSQLQueryType,
  description: "The mutation that allows you to create a new TSQLQuery",
  args: {
    email: {
      name: "email",
      type: new GraphQLNonNull(GraphQLString),
    },
    TSQL: {
      name: "TSQL",
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  resolve: (value, { email, TSQL }) =>
    TSQLQuery.create({
      email,
      TSQL,
    }),
};

const updateTSQLQuery = {
  type: TSQLQueryType,
  description: "The mutation that allows you to update an existing TSQLQuery by Id",
  args: {
    id: {
      name: "id",
      type: new GraphQLNonNull(GraphQLString),
    },
    email: {
      name: "email",
      type: new GraphQLNonNull(GraphQLString),
    },
    TSQL: {
      name: "TSQL",
      type: GraphQLString,
    },
  },
  resolve: async (value, { id, email, TSQL }) => {
    const foundTSQL = await TSQLQuery.findByPk(id);

    if (!foundTSQL) {
      throw new Error(`TSQL with id: ${id} not found!`);
    }

    const updatedTSQL = merge(foundTSQL, {
      email,
      TSQL,
    });

    return foundTSQL.update(updatedTSQL);
  },
};

const deleteTSQLQuery = {
  type: TSQLQueryType,
  description: "The mutation that allows you to delete a existing TSQLQuery by Id",
  args: {
    id: {
      name: "id",
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  resolve: async (value, { id }) => {
    const foundTSQL = await TSQLQuery.findByPk(id);

    if (!foundTSQL) {
      throw new Error(`TSQL with id: ${id} not found!`);
    }

    await TSQLQuery.destroy({
      where: {
        id,
      },
    });

    return foundTSQL;
  },
};

module.exports = {
  createTSQLQuery,
  updateTSQLQuery,
  deleteTSQLQuery,
};
