import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";

function BarGroup(props) {
  const classes = useStyles();

  let barPadding = 2;
  let barColour = "#FFCB25";
  let widthScale = (d) => d * 3;
  let width = widthScale(props.d.value);
  let yMid = props.barHeight * 0.5;

  return (
    <g className="bar-group">
      <text className={classes.chartbarGroupNameLabel} x="-6" y={yMid} alignmentBaseline="middle">
        {props.d.name}
      </text>
      <rect
        y={barPadding * 0.5}
        // x={props.i * (50 + barPadding)}
        // height={props.barHeight - barPadding}
        // height={props.d.value}
        // width={20}
        width={width}
        height={props.barHeight - barPadding}
        fill={barColour}
      />
      <text className={classes.chartbarGroupValueLabel} x={width - 8} y={yMid} alignmentBaseline="middle">
        {props.d.value}
      </text>
    </g>
  );
}

// export default class BarChart extends React.Component {

const BarChart = (props) => {
  const [data, setData] = useState([
    { name: "Mon", value: 20 },
    { name: "Tue", value: 40 },
    { name: "Wed", value: 35 },
    { name: "Thu", value: 50 },
    { name: "Fri", value: 55 },
    { name: "Sat", value: 40 },
    { name: "Sun", value: 30 },
  ]);
  const classes = useStyles();

  let barHeight = 30;
  let barGroups = data.map((d, i) => (
    <g transform={`translate(0, ${i * barHeight})`}>
      <BarGroup d={d} i={i} barHeight={barHeight} classes />
    </g>
  ));
  return (
    <svg width="800" height="300">
      <g className="container">
        <text className="title" x="10" y="30">
          Week beginning 9th July
        </text>
        <g
          className="chart"
          // transform="translate(100,60)"
          className={classes.chart}
        >
          {barGroups}
        </g>
      </g>
    </svg>
  );
};

const useStyles = makeStyles((theme) => ({
  charttitle: {
    fontSize: "1.4em",
    fontWeight: 300,
  },
  chartbarGroupNameLabel: {
    textAnchor: "end",
    fontWeight: 300,
    fontSize: "1em",
    fill: "#333",
  },
  chartbarGroupValueLabel: {
    textAnchor: "end",
    fill: "#fff",
    fontWeight: 900,
    fontSize: "0.7em",
  },
  chart: {
    transform: "rotate(-90deg) translate(-250px, 10px)",
  },
}));

export default BarChart;
