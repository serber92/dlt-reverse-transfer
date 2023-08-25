const { rule, and, or, shield } = require("graphql-shield");
const { Participant } = require("./models");
const isAdmin = rule()(async (parent, args, ctx, info) => {
  const user = await ctx.user;
  if (!user) return false;
  const participant = await Participant.findOne({
    where: {
      email: user.email,
    },
  });
  return participant && participant.participant_type === "admin";
});

const isAuth = rule()(async (parent, args, ctx, info) => {
  const user = await ctx.user;
  if (!user) return false;
  const participant = await Participant.findOne({
    where: {
      email: user.email,
    },
  });
  return participant && (participant.participant_type === "user" || participant.participant_type === "admin");
});

const permissions = shield({
  Query: {
    user: or(isAdmin, isAuth),
    notes: or(isAdmin, isAuth),
    profile: or(isAdmin, isAuth),
    assertion: or(isAdmin, isAuth),
    achievement: or(isAdmin, isAuth),
    resultDescription: or(isAdmin, isAuth),
    alignment: or(isAdmin, isAuth),
    getStudent: or(isAuth),
    listStudents: or(isAuth),
    me: or(isAuth),
    getUsers: or(isAdmin, isAuth),
  },
  Mutation: {
    createNote: or(isAdmin),
    updateNote: or(isAdmin),
    deleteNote: or(isAdmin),
    createUser: or(isAdmin),
    deleteUser: or(isAdmin),
    createTSQLQuery: or(isAuth),
    updateTSQLQuery: or(isAuth),
    deleteTSQLQuery: or(isAuth),
  },
});
module.exports = permissions;
