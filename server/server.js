/**
 * third party libraries
 */
const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const path = require("path");
const { applyMiddleware } = require("graphql-middleware");
const { ApolloServer } = require("apollo-server-express");
const { makeExecutableSchema } = require("graphql-tools");
const helmet = require("helmet");
const http = require("http");
const permissions = require("./api/permissions");
/**
 * server configuration
 */
const config = require("./config/");
const auth = require("./api/policies/auth.policy");
const dbService = require("./api/services/db.service");
const { typeDefs, resolvers } = require("./api/graphql");

// environment: development, testing, production
const environment = process.env.NODE_ENV;

/**
 * express application
 */
const api = express();
const server = http.Server(api);
const DB = dbService(environment, config.migrate).start();

// allow cross origin requests
// configure to allow only requests from certain origins
api.use(cors());

// secure express app
api.use(
  helmet({
    dnsPrefetchControl: false,
    frameguard: false,
    ieNoOpen: false,
  })
);

// parsing the request bodys
api.use(bodyParser.urlencoded({ extended: false }));
api.use(bodyParser.json());

const graphQLServer = new ApolloServer({
  schema: applyMiddleware(
    makeExecutableSchema({
      typeDefs,
      resolvers,
    }),
    // permissions
  ),
  resolvers,
  context: ({ req }) => ({
    ...req,
    user: auth(req),
  }),
});

graphQLServer.applyMiddleware({
  app: api,
  cors: {
    origin: true,
    credentials: true,
    methods: ["POST"],
    allowedHeaders: ["X-Requested-With", "X-HTTP-Method-Override", "Content-Type", "Accept", "Authorization", "Access-Control-Allow-Origin"],
  },
  playground: {
    settings: {
      "editor.theme": "light",
    },
  },
});

api.use("/", express.static(path.join(__dirname, "./frontend/build")));
api.use("/static", express.static(path.join(__dirname, "./frontend/build/static")));

api.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "./frontend/build/index.html"), function (err) {
    if (err) {
      res.status(500).send(err);
    }
  });
});

server.listen(config.port, () => {
  if (environment !== "production" && environment !== "development" && environment !== "testing") {
    console.error(`NODE_ENV is set to ${environment}, but only production and development are valid.`);
    process.exit(1);
  }
  return DB;
});
