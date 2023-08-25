import React from "react";
import { useTheme } from "@material-ui/core/styles";
import { LineChart, Line, XAxis, YAxis, Label, ResponsiveContainer } from "recharts";
import Title from "./Title";

// Generate Sales Data
const createData = (time, amount) => {
  return { time, amount };
};

const data = [
  createData("Spring 2016", 8.0),
  createData("Fall 2016", 12.0),
  createData("Spring 2017", 20.0),
  createData("Fall 2017", 28.0),
  createData("Spring 2018", 36.0),
  createData("Fall 2018", 44.0),
  createData("Spring 2019", 54.0),
  createData("Fall 2019", 66.0),
  //createData('24:00', undefined),
];

const Chart = () => {
  const theme = useTheme();

  return (
    <React.Fragment>
      <Title>ASU Credits</Title>
      <ResponsiveContainer>
        <LineChart
          data={data}
          margin={{
            top: 16,
            right: 16,
            bottom: 0,
            left: 24,
          }}
        >
          <XAxis dataKey="time" stroke={theme.palette.text.secondary} />
          <YAxis stroke={theme.palette.text.secondary}>
            <Label angle={270} position="left" style={{ textAnchor: "middle", fill: theme.palette.text.primary }}>
              Total Hours
            </Label>
          </YAxis>
          <Line type="monotone" dataKey="amount" stroke={theme.palette.primary.main} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </React.Fragment>
  );
};

export default Chart;
