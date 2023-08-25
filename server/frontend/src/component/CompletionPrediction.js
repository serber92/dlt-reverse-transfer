import React from "react";
import moment from "moment";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Title from "./Title";

const useStyles = makeStyles({
  depositContext: {
    flex: 1,
  },
});

const CompletionPrediction = ({ studentInfo }) => {
  const classes = useStyles();
  return (
    <React.Fragment>
      <Title>Total Credits</Title>
      <Typography id="totalCredits" component="p" variant="h4">
        {studentInfo.totalCredit.toFixed(1)}
      </Typography>
      <Typography color="textSecondary" className={classes.depositContext}>
        <b id="lastCredit">{"+" + studentInfo.lastCredit.toFixed(1) + " on " + moment(studentInfo.lastIssuedOn, "x").format("YYYY-MM-DD")}</b>
        <hr></hr>
        <div id="fos1" style={{ fontSize: 13 }}>
          {studentInfo.fos1}
        </div>
        <div id="fos2" style={{ fontSize: 13 }}>
          {studentInfo.fos2}
        </div>
      </Typography>
    </React.Fragment>
  );
};

export default CompletionPrediction;
