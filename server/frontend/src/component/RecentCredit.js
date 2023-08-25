import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Title from "./Title";

const useStyles = makeStyles({
  depositContext: {
    flex: 1,
  },
});

const Deposits = ({ profile }) => {
  const classes = useStyles();
  return (
    <React.Fragment>
      <Title>Student Detail</Title>
      <Typography id="profileId" component="p" variant="h4">
        {profile.studentId}
      </Typography>
      <Typography color="textSecondary" className={classes.depositContext}>
        <b id="profileName">{profile.name}</b>
        <hr></hr>
        <div>
          Email: <span id="profileEmail">{profile.profileEmail}</span>
        </div>
        <div>
          DOB: <span id="profileDOB">{profile.birthdate}</span>
        </div>
        <div>
          Phone: <span id="profilePhone">{profile.telephone}</span>
        </div>
      </Typography>
    </React.Fragment>
  );
};

export default Deposits;
