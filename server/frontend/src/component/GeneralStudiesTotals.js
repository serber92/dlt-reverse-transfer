import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Title from "./Title";

//const useStyles = makeStyles({
const useStyles = makeStyles((theme) => ({
  depositContext: {
    flex: 1,
  },
}));

const Deposits = ({ genStudies }) => {
  const classes = useStyles();
  return (
    <React.Fragment>
      <Title>General Studies</Title>
      <Typography id="gs-tot" component="p" variant="h4">
        {genStudies.tot.toFixed(1) + " Credits"}
      </Typography>
      <Typography color="textSecondary" className={classes.depositContext}>
        <b id="gs-recent">Recent</b>
        <hr></hr>
        <ul style={{ listStyleType: "none", float: "left", marginLeft: -35, marginTop: -3, fontSize: 13 }}>
          <li>
            C: <span id="gs-c">{genStudies.C.toFixed(1)}</span>
          </li>
          <li>
            G: <span id="gs-g">{genStudies.G.toFixed(1)}</span>
          </li>
          <li>
            H: <span id="gs-h">{genStudies.H.toFixed(1)}</span>
          </li>
          <li>
            HU: <span id="gs-hu">{genStudies.HU.toFixed(1)}</span>
          </li>
        </ul>
        <ul style={{ listStyleType: "none", float: "right", marginLeft: -30, marginTop: -3, fontSize: 13 }}>
          <li>
            L: <span id="gs-l">{genStudies.L.toFixed(1)}</span>
          </li>
          <li>
            MA: <span id="gs-ma">{genStudies.MA.toFixed(1)}</span>
          </li>
          <li>
            SB: <span id="gs-sb">{genStudies.SB.toFixed(1)}</span>
          </li>
          <li>
            SQ: <span id="gs-sq">{genStudies.SQ.toFixed(1)}</span>
          </li>
        </ul>
      </Typography>
    </React.Fragment>
  );
};

export default Deposits;
