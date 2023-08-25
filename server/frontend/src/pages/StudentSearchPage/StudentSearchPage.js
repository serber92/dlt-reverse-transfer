import React, { useState } from "react";

import { CssBaseline,  Box, Typography,   Container, Grid, Paper } from "@material-ui/core";
import Copyright from "../../component/Copyright";
import StudentsMT from "./StudentsMT";
import Topbar from "../../component/Topbar";
import Sidebar from "../../component/Sidebar";
import useStyles from "./style";

const StudentSearchPage = () => {
  const classes = useStyles();
  const [open, setOpen] = useState(true);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Topbar open={open} handleDrawerOpen={handleDrawerOpen} />
      <Sidebar open={open} handleDrawerClose={handleDrawerClose}/>
      
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            <Typography component="h4" variant="h6" color="inherit" noWrap className={classes.title}></Typography>
            {/* Students */}
            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <StudentsMT />
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

export default StudentSearchPage;
