const { GraphQLString, GraphQLList } = require("graphql");

const { ProfileType } = require("../types");
const { Profile, Verification, Address } = require("../../models");

const ProfileQuery = {
  type: new GraphQLList(ProfileType),
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
    Profile.findAll({
      where: args,
      include: [
        {
          model: Verification,
        },
        {
          model: Address,
        },
      ],
    }),
};

module.exports = { ProfileQuery };
