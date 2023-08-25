import React from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';
import StudentPage from "./pages/StudentPage/StudentPage";
import StudentSearchPage from "./pages/StudentSearchPage/StudentSearchPage";
import LoginPage from "./pages/LoginPage/LoginPage";
import UserManagement from "./pages/UserManagement/UserManagement";
import SavedQueryManagement from "./pages/SavedQueryManagement/SavedQueryManagement";

import DashboardPage from "./pages/DashboardPage/DashboardPage";
import { ButtonAppBar } from "./component/Navbar";

const AuthSearch = () => (
  <div>
    <ButtonAppBar title="Student Search" />
    <StudentSearchPage />
  </div>
);

const AuthStudent = () => (
  <div>
    <ButtonAppBar title="Student Detail" />
    <StudentPage />
  </div>
);

const Login = () => (
  <div>
    <ButtonAppBar title="" />
    <LoginPage />
  </div>
);

const Routes = () => {
    return (
      <Switch>
        <Route path="/auth-student" exact component={AuthStudent} />
        <Route path="/auth-search" exact component={AuthSearch} />
        <Route path="/" exact component={DashboardPage} />
        <Route
          component={Login}
          exact
          path="/login"
        />
        <Route
          component={UserManagement}
          exact
          path="/usermanagement"
        />
        <Route
          component={SavedQueryManagement}
          exact
          path="/savedqueries"
        />
        <Redirect to="/login" />
      </Switch>
    );
};

export default Routes;
