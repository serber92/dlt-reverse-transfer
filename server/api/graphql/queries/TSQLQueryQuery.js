const { GraphQLString, GraphQLList } = require("graphql");

const { TSQLQueryType } = require("../types");
const { TSQLQuery } = require("../../models");

const TSQLQueryQuery = {
  type: new GraphQLList(TSQLQueryType),
  args: {
    id: {
      name: "id",
      type: GraphQLString,
    },
    email: {
      name: "email",
      type: GraphQLString,
    },
    TSQL: {
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
  resolve: (parent, args) => TSQLQuery.findAll({ where: args }),
};

module.exports = { TSQLQueryQuery };
