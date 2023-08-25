const {
  createNote,
  updateNote,
  deleteNote,
} = require('./NoteMutation');
const {
  createUser,
  loginUser,
  deleteUser,
} = require('./UserMutation');
const {
  createTSQLQuery,
  updateTSQLQuery,
  deleteTSQLQuery,
} = require('./TSQLMutation');

module.exports = {
  createNote,
  updateNote,
  deleteNote,
  createUser,
  loginUser,
  deleteUser,
  createTSQLQuery,
  updateTSQLQuery,
  deleteTSQLQuery,
};
