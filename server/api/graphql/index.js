const { gql } = require("apollo-server-express");

const {
  ProfileQuery,
  NotesQuery,
  AssertionQuery,
  AchievementQuery,
  ResultDescriptionQuery,
  AlignmentQuery,
  GetStudentDataQuery,
  ListStudentsQuery,
  GetMeQuery,
  ParticipantQuery,
  TSQLQueryQuery,
} = require("./queries");
const { deleteUser, createUser, loginUser, createNote, updateNote, deleteNote, createTSQLQuery, updateTSQLQuery, deleteTSQLQuery } = require("./mutations");

const typeDefs = gql`
  type Query {
    user: String
    notes: String
    profile: String
    assertion: String
    achievement: String
    resultDescription: String
    alignment: String
    getStudent: String
    listStudents: String
    me: String
    getUsers: String
    getTSQL: String
  }

  type Mutation {
    createUser: String
    loginUser: String
    deleteUser: String
    createNote: String
    updateNote: String
    deleteNote: String
    createTSQLQuery: String
    updateTSQLQuery: String
    deleteTSQLQuery: String
  }
`;

const resolvers = {
  Query: {
    notes: NotesQuery,
    profile: ProfileQuery,
    assertion: AssertionQuery,
    achievement: AchievementQuery,
    resultDescription: ResultDescriptionQuery,
    alignment: AlignmentQuery,
    getStudent: GetStudentDataQuery,
    listStudents: ListStudentsQuery,
    me: GetMeQuery,
    getUsers: ParticipantQuery,
    getTSQL: TSQLQueryQuery,
  },

  Mutation: {
    createUser,
    loginUser,
    createNote,
    updateNote,
    deleteNote,
    deleteUser,
    createTSQLQuery,
    updateTSQLQuery,
    deleteTSQLQuery,
  },
};

module.exports = { typeDefs, resolvers };
