import React from "react";
import moment from "moment";
import { get } from "lodash";
import { makeStyles } from "@material-ui/core/styles";
import MaterialTable from "material-table";
import { Paper, Grid, Button, Divider } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "left",
    color: theme.palette.text.secondary,
    background: "#f0f0f0",
  },
  seeMore: {
    marginTop: theme.spacing(3),
  },
}));

const StudentTranscriptsMT = ({ result }) => {
  const classes = useStyles();

  const getSunNumber = (rowData) => {
    const alignments = get(rowData, "achievement.alignments");
    if (alignments) {
      const sunRow = alignments.filter((el) => el.framework_name === "Arizona Shared Unique Number System");
      if (sunRow.length > 0) {
        return ` SUN ${sunRow[0].target_code}`;
      }
    }
    return "";
  };

  return (
    <React.Fragment>
      <MaterialTable
        title="Degrees / Certs"
        columns={[
          { title: "Type", field: "achievement.achievement_type" },
          { title: "Status", field: "achievement.human_code" },
          { title: "Description", field: "achievement.description" },
          { title: "Institution", field: "achievement.field_of_study" },
          { title: "GPA", field: "results[0].value" },
          {
            title: "Date",
            field: "issued_on",
            defaultSort: "desc",
            render: (rowData) => {
              return moment(rowData.issued_on, "x").format("YYYY-MM-DD");
            },
          },
        ]}
        data={result?.Degrees}
        options={{
          sorting: true,
          paging: false,
          search: false,
        }}
      />

      <br />
      <br />

      <MaterialTable
        title="Courses / Assertions"
        columns={[
          { title: "Type", field: "achievement.achievement_type" },
          { title: "Term", field: "term" },
          { title: "Class", field: "achievement.human_code" },
          { title: "Name", field: "achievement.name" },
          {
            title: "Issued",
            field: "issued_on",
            defaultSort: "desc",
            render: (rowData) => {
              return moment(rowData.issued_on, "x").format("YYYY-MM-DD");
            },
          },
          { title: "Grade", field: "results[0].value" },
          { title: "Credit", field: "credits_earned" },
        ]}
        data={result?.classes}
        options={{
          search: true,
          exportButton: true,
          exportAllData: true,
          paging: false,
          sorting: true,
        }}
        detailPanel={(rowData) => {
          return (
            <Grid container spacing={3}>
              <Grid item xs>
                <Paper className={classes.paper}>
                  {rowData?.institution} Course {getSunNumber(rowData)}
                  <Divider />
                  <b>{get(rowData, "achievement.human_code", "")}</b> {get(rowData, "achievement.name", "")} <br />
                  {get(rowData, "achievement.description", "")} <p />
                  {get(rowData, "genStudies", "")} <p />
                  <Grid container spacing={3}></Grid>
                </Paper>
              </Grid>
              <Grid item xs>
                <Paper className={classes.paper}>
                  Student Action
                  <Divider />
                  <Grid container spacing={3}>
                    <Grid item xs>
                      <b>Completed:</b> {moment(rowData?.issued_on, "x").format("YYYY-MM-DD")} <br />
                      <b>Hours:</b> {get(rowData, "credits_earned", "")}
                      <br />
                      <b>Attribute:</b> {get(rowData, "achievement.field_of_study", "")}
                      <br />
                    </Grid>
                    <Grid item xs justify="flex-end">
                      <Button size="large" variant="outlined" disableElevation disabled>
                        {" "}
                        Grade: {rowData?.results[0]?.value}
                      </Button>
                      <p />
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          );
        }}
      />
    </React.Fragment>
  );
};

export default StudentTranscriptsMT;
