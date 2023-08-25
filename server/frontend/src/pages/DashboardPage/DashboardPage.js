import React, { useContext } from "react";
import { Redirect } from "react-router-dom";
import clsx from "clsx";
import { Box, Button, CssBaseline, Toolbar, Typography, IconButton, Container, Grid, Paper, AppBar } from "@material-ui/core";
import { useHistory } from "react-router-dom";

import { GoogleLogout } from "react-google-login";
import { AuthContext } from "../../App";
import BarChart from "../../component/BarChart.js";
import { ReactComponent as Logo } from "../../logo.svg";
import Copyright from "../../component/Copyright";
import useStyles from "./style";

const DashboardPage = () => {
  const classes = useStyles();
  const history = useHistory();
  const {
    state: { auth: authState },
  } = useContext(AuthContext);
  const { dispatch } = React.useContext(AuthContext);
  const urlParams = new URLSearchParams(window.location.search);
  const nm = urlParams.get("nm");

  const logout = (response) => {
    dispatch({
      type: "LOGOUT",
      payload: response,
    });
  };

  const welcomeHandler = () => {
    history.push("/auth-search");
  };
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  if (!authState.isAuthenticated) return <Redirect to="/login" />;

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" color="#fff" className={clsx(classes.appBar, false && classes.appBarShift)}>
        <Toolbar className={classes.toolbar}>
          <Typography id="studentName" component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
            <Logo className={classes.myLogo} />
          </Typography>
          <IconButton color="#000" size="small">
            {authState.user.name}
          </IconButton>
          <GoogleLogout
            clientId="118143094017-peounae5olknel526orf748dp43rt38n.apps.googleusercontent.com"
            buttonText="Logout"
            onLogoutSuccess={logout}
          ></GoogleLogout>
        </Toolbar>
      </AppBar>

      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Paper className={[fixedHeightPaper, classes.myCard]}>
                <React.Fragment>
                  <Button className={classes.redBackdrop} onClick={(e) => welcomeHandler()}>
                    Welcome
                  </Button>

                  <span className={classes.welcomeText}>
                    Hey 👋 <strong>{authState.user.name}</strong>
                  </span>
                  <p>
                    What can I help with?{" "}
                    <a className={classes.darkLink} href="#">
                      Query many students
                    </a>
                    ,{" "}
                    <a className={classes.darkLink} href="#">
                      Find a student
                    </a>
                  </p>
                </React.Fragment>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Paper className={[fixedHeightPaper, classes.myCard]}>
                <React.Fragment>
                  <Button className={classes.redBackdrop}>My Activity</Button>
                  <ul>
                    {["Placeholder", "Placeholder", "Placeholder", "Placeholder"].map((data) => {
                      return <li>{data}</li>;
                    })}
                  </ul>
                </React.Fragment>
              </Paper>
            </Grid>
          </Grid>
          {/* CHARTS */}
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Paper className={[fixedHeightPaper, classes.myCard]}>
                <React.Fragment>
                  <Button className={classes.redBackdrop}>My Notes</Button>

                  <ul>
                    {["Placeholder", "Placeholder", "Placeholder", "Placeholder"].map((data) => {
                      return <li>{data}</li>;
                    })}
                  </ul>
                </React.Fragment>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Paper className={[fixedHeightPaper, classes.myCard]}>
                <React.Fragment>
                  <Button className={classes.redBackdrop}>Recent Searches</Button>

                  <ul>
                    {["Placeholder", "Placeholder", "Placeholder", "Placeholder"].map((data) => {
                      return <li>{data}</li>;
                    })}
                  </ul>
                </React.Fragment>
              </Paper>
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={12}>
              <Paper className={[classes.paper, classes.myCard]}>
                <React.Fragment>
                  <Button className={classes.redBackdrop}>Key Metrics</Button>

                  <BarChart />
                </React.Fragment>
              </Paper>
            </Grid>
          </Grid>
          <Box pt={4}>
            <Copyright />
          </Box>
        </Container>
      </main>
    </div>
  );
};

export default DashboardPage;
