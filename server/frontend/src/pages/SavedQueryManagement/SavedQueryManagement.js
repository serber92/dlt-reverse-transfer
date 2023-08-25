import React, { useContext, useEffect } from "react";
import { Container, Grid, CssBaseline, Box } from "@material-ui/core";
import { AuthContext } from "../../App";
import SavedQueryListPage from "./SavedQueryListPage";
import { ButtonAppBar } from "../../component/Navbar";
import Sidebar from "../../component/Sidebar";
import Copyright from "../../component/Copyright";
import Topbar from "../../component/Topbar";
import useStyles from "./style";
const SavedQueryManagement = () => {
  const classes = useStyles();

  const { dispatch, state } = useContext(AuthContext);
  const [open, setOpen] = React.useState(true);

  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    dispatch({
      type: "SET_PAGE",
      payload: "querylist",
    });
  }, []);
  return (
    <div>
      <ButtonAppBar title="Queries" />
      <div className={classes.root}>
        <CssBaseline />
        <Topbar open={open} handleDrawerOpen={handleDrawerOpen} />
        <Sidebar open={open} handleDrawerClose={handleDrawerClose} />
        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
          <Container maxWidth="lg" className={classes.container}>
            <Grid container spacing={3}>
              <SavedQueryListPage />
            </Grid>
            <Box pt={4}>
              <Copyright />
            </Box>
          </Container>
        </main>
      </div>
    </div>
  );
};

export default SavedQueryManagement;
