import React from "react";
import Link from "@material-ui/core/Link";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
// import Title from './Title';

// Generate Order Data
const createData = (school, id, program, level, hours, admit, last) => {
  return { school, id, program, level, hours, admit, last };
};

const rows = [createData("Arizona State University", "9991237713", "Biology", "Senior", "32", "10/2018", "1/2020")];

const useStyles = makeStyles((theme) => ({
  seeMore: {
    marginTop: theme.spacing(3),
  },
}));

export default function StudentDegrees() {
  const classes = useStyles();
  return (
    <React.Fragment>
      {/* <Title>Recent Orders</Title> */}
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>School</TableCell>
            <TableCell>Id</TableCell>
            <TableCell>Program/Plan</TableCell>

            <TableCell>Hours</TableCell>

            <TableCell>Last Term</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.school}</TableCell>
              <TableCell>{row.id}</TableCell>
              <TableCell>{row.program}</TableCell>

              <TableCell>{row.hours}</TableCell>

              <TableCell>{row.last}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </React.Fragment>
  );
}
