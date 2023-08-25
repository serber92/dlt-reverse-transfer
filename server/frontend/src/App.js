import React, { useEffect } from "react";
import { NotificationContainer } from "react-notifications";
import "react-notifications/lib/notifications.css";
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css
import "./App.css";
import { BrowserRouter as Router } from "react-router-dom";
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from "@apollo/client";
import { onError } from "apollo-link-error";
import { setContext } from "@apollo/client/link/context";
import { ThemeProvider } from "@material-ui/core/styles";
import theme from "./theme";
import Routes from "./Routes";
import { reducer, initialState } from "./store";
import AxiosConfig from "./AxiosConfig";

export const AuthContext = React.createContext();

const address = process.env.NODE_ENV === "development" ? "http://127.0.0.1:5000" : window.location.protocol + "//" + window.location.host;

const httpLink = createHttpLink({
  uri: `${address}/graphql`,
});

const logoutLink = onError(({ networkError }) => {
  console.log(networkError, "networkError");
  if (networkError && networkError.statusCode === 401) {
    sessionStorage.clear();
    window.location.href = "/login";
  }
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = sessionStorage.getItem("token");
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: logoutLink.concat(authLink.concat(httpLink)),
  cache: new InMemoryCache(),
});

const App = () => {
  useEffect(() => {
    AxiosConfig.init();
  }, []);
  const [state, dispatch] = React.useReducer(reducer, initialState);

  return (
    <AuthContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      <ThemeProvider theme={theme}>
        <ApolloProvider client={client}>
          <Router>
            <Routes />
          </Router>
          <NotificationContainer />
        </ApolloProvider>
      </ThemeProvider>
    </AuthContext.Provider>
  );
};

export default App;
