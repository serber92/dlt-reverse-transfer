import React, { useContext } from "react";
import clsx from "clsx";
import { Redirect } from "react-router-dom";
import { GoogleLogout } from "react-google-login";
import { AuthContext } from "../App";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { AppBar, Toolbar, Typography, IconButton } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import { googleClientID } from "../helper/Constant";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: "none",
  },
  title: {
    flexGrow: 1,
  },
}));

const Topbar = ({ open, handleDrawerOpen, studentName }) => {
  const classes = useStyles();

  const {
    state: { auth: authState },
  } = useContext(AuthContext);
  const { dispatch } = React.useContext(AuthContext);
  const history = useHistory();

  const logout = (response) => {
    dispatch({
      type: "LOGOUT",
      payload: response,
    });
    history.push("/login");
  };

  if (!authState.isAuthenticated) return <Redirect to="/login" />;

  return (
    <AppBar position="fixed" className={clsx(classes.appBar, open && classes.appBarShift)}>
      <Toolbar className={classes.toolbar}>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerOpen}
          className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
        >
          <MenuIcon />
        </IconButton>
        <Typography id="studentName" component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
          {studentName}
        </Typography>
        <IconButton color="inherit" size="small">
          {authState.user.name}
        </IconButton>
        <GoogleLogout clientId={googleClientID} buttonText="Logout" onLogoutSuccess={logout}></GoogleLogout>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
