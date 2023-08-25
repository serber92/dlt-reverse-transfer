const jsonwebtoken = require("jsonwebtoken");
const { GraphQLString, GraphQLNonNull } = require("graphql");
const { ParticipantType, LoginType } = require("../types");
const { Participant, sequelize } = require("../../models/Participant");

const createUser = {
  type: ParticipantType,
  description: "The mutation that allows you to update an existing User by Id",
  args: {
    email: {
      name: "email",
      type: new GraphQLNonNull(GraphQLString),
    },
    name: {
      name: "name",
      type: new GraphQLNonNull(GraphQLString),
    },
    participant_type: {
      name: "participant_type",
      type: new GraphQLNonNull(GraphQLString),
    },
    ip_address: {
      name: "ip_address",
      type: GraphQLString,
    },
  },
  resolve: async (value, { email, name, participant_type, ip_address }) => {
    try {
      const result = await sequelize.transaction(async (t) => {
       
        const [participant] = await Participant.findOrCreate({
          where: {
            email,
          },
          defaults: {
            created_by: "admin",
            type: "Participant",
            active: true,
            email,
            ip_address,
            name,
            participant_type,
          },
          transaction: t,
        });

        await participant.update({
          ip_address,
          name,
          participant_type,
        });

        return participant.get({ plain: true });
      });

      return result;
    } catch (error) {
      return null;
    }
  },
};

const loginUser = {
  type: LoginType,
  description: "The mutation that allows you to login User by Id",
  args: {
    email: {
      name: "email",
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  resolve: async (value, { email }) => {
    try {
      const result = await sequelize.transaction(async (t) => {
        const participant = await Participant.findOne({ where: { email }, transaction: t });
        if (!participant) {
          throw new Error("No user with that email");
        }

        // return jwt
        const token = jsonwebtoken.sign({ email: participant.email }, 'secdltnln12@#$', { expiresIn: "1d" });
        return {
          token,
          user: participant,
        };
      });

      return result;
    } catch (error) {
      return null;
    }
  },
};

const deleteUser = {
  type: ParticipantType,
  description: "The mutation that allows you to delete a existing User by Id",
  args: {
    id: {
      name: "id",
      type: new GraphQLNonNull(GraphQLString),
    },
  },
  resolve: async (value, { id }) => {
    const foundUser = await Participant.findByPk(id);

    if (!foundUser) {
      throw new Error(`Note with id: ${id} not found!`);
    }

    await Participant.destroy({
      where: {
        id,
      },
    });

    return foundUser;
  },
};

module.exports = {
  createUser,
  loginUser,
  deleteUser,
};
