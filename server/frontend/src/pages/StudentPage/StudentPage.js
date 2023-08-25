import React, { useState, useEffect } from "react";
import { useHistory, withRouter } from "react-router-dom";
import clsx from "clsx";
import { cloneDeep, get } from "lodash";
import { CssBaseline, Box, Typography, Container, Grid, Paper, CircularProgress } from "@material-ui/core";
import { useQuery, useLazyQuery, useMutation } from "@apollo/client";
import Sidebar from "../../component/Sidebar";
import RecentCredit from "../../component/RecentCredit";
import CompletionPrediction from "../../component/CompletionPrediction";
import GeneralStudiesTotals from "../../component/GeneralStudiesTotals";
import StudentTranscriptsMT from "./StudentTranscriptsMT";
import Copyright from "../../component/Copyright";
import Topbar from "../../component/Topbar";
import useStyles from "./style";
import { GET_STUDENT, GET_NOTE, UPDATE_NOTE } from "../../helper/graphql";

const StudentPage = () => {
  const classes = useStyles();
  const history = useHistory();
  const [open, setOpen] = React.useState(true);
  const [profile, setProfile] = useState({
    name: "",
    studentId: "",
    profileEmail: "",
    birthdate: "",
    telephone: "",
  });
  const [genStudies, setGenStudies] = useState({ tot: 0, C: 0, L: 0, MA: 0, SB: 0, SQ: 0, HU: 0, H: 0, G: 0, gsLast: null, gsLastString: "" });
  const [studentInfo, setStudentInfo] = useState({ totalCredit: 0, lastIssuedOn: "0000-00-00", lastCredit: 0, lastClass: "" });
  const urlParams = new URLSearchParams(window.location.search);
  const studentId = urlParams.get("student_id");
  const [notes, setNotes] = useState("");

  const [getNote, { data: noteData = null }] = useLazyQuery(GET_NOTE);
  const [updateNote, { }] = useMutation(UPDATE_NOTE);

  const handleChange = (e) => {
    setNotes(e.target.value);
  };

  useEffect(() => {
    let timeOutId;
    if (notes && profile.profileEmail !== "") {
      timeOutId = setTimeout(
        () =>
          updateNote({
            variables: {
              email: profile.profileEmail,
              note: notes,
            },
          }),
        1500
      );
    }

    return () => clearTimeout(timeOutId);
  }, [notes]);

  useEffect(() => {
    if (profile.profileEmail !== "") {
      getNote({
        variables: {
          email: profile.profileEmail,
        },
      });
    }
  }, [profile]);

  useEffect(() => {
    if (noteData && noteData.notes && noteData.notes.length > 0) {
      setNotes(noteData.notes[0].note);
    }
  }, noteData);

  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };

  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

  const [result, setResult] = useState([]);

  const { loading, error, data = null } = useQuery(GET_STUDENT, {
    variables: { studentId, name: "", email: "" },
    onCompleted: () => {
      let studentData = cloneDeep(data);
      studentData = processData(studentData);
      setResult(studentData);
    },
  });

  const profileUpdate = (results) => {
    let name = results.getStudent.profile.name;
    let studentId = results.getStudent.profile.student_id;
    let profileEmail = results.getStudent.profile.email;

    let birthdate = get(results, "getStudent.profile.birthdate", "0000-00-00");
    if (birthdate && birthdate.length >= 10) {
      birthdate = "xxxx" + birthdate.substr(4);
    } else {
      birthdate = "xxxx-xx-xx";
    }
    let telephone = results.getStudent.profile.telephone;

    setProfile({
      name,
      studentId,
      profileEmail,
      birthdate,
      telephone,
    });
  };

  const generalStudiesCounts = (resultsArr) => {
    for (let i = 0; i < resultsArr.length; i++) {
      const row = resultsArr[i];
      if (row && row.achievement && row.achievement.alignments) {
        let rowAlignments = row.achievement.alignments;
        if (rowAlignments.length > 0) {
          for (let j = 0; j < rowAlignments.length; j++) {
            let thisAlignment = rowAlignments[j];
            let anyGSFound = false;
            if (thisAlignment && thisAlignment.target_name !== "ASU Grades and Grading Policies") {
              console.log("thisAlignment: " + thisAlignment.target_name);
              row.genStudies = thisAlignment.target_name; //add general studies for display in template

              let credits_earned = get(row, "credits_earned", 0.0);
              credits_earned = parseFloat(credits_earned);

              if (/C(?!o)/.test(thisAlignment.target_name)) {
                console.log("matched C");
                genStudies.C = genStudies.C + credits_earned;
                genStudies.tot = genStudies.tot + credits_earned;
                anyGSFound = true;
              }
              if (/L/.test(thisAlignment.target_name)) {
                genStudies.L = genStudies.L + credits_earned;
                genStudies.tot = genStudies.tot + credits_earned;
                anyGSFound = true;
              }
              if (/MA/.test(thisAlignment.target_name)) {
                genStudies.MA = genStudies.MA + credits_earned;
                genStudies.tot = genStudies.tot + credits_earned;
                anyGSFound = true;
              }
              if (/SB/.test(thisAlignment.target_name)) {
                genStudies.SB = genStudies.SB + credits_earned;
                genStudies.tot = genStudies.tot + credits_earned;
                anyGSFound = true;
              }
              if (/SQ/.test(thisAlignment.target_name)) {
                genStudies.SQ = genStudies.SQ + credits_earned;
                genStudies.tot = genStudies.tot + credits_earned;
                anyGSFound = true;
              }
              if (/HU/.test(thisAlignment.target_name)) {
                genStudies.HU = genStudies.HU + credits_earned;
                genStudies.tot = genStudies.tot + credits_earned;
                anyGSFound = true;
              }
              if (/H(?!U)/.test(thisAlignment.target_name)) {
                genStudies.H = genStudies.H + credits_earned;
                genStudies.tot = genStudies.tot + credits_earned;
                anyGSFound = true;
              }
              if (/G(?!o)/.test(thisAlignment.target_name)) {
                genStudies.G = genStudies.G + credits_earned;
                genStudies.tot = genStudies.tot + credits_earned;
                anyGSFound = true;
              }
              if (anyGSFound) {
                if (genStudies.gsLast) {
                  var lastGSIssuedOn = genStudies.gsLast;
                  var thisIssuedOn = row.issued_on;
                  if (thisIssuedOn > lastGSIssuedOn) {
                    genStudies.gsLast = thisIssuedOn;
                    genStudies.gsLastString = thisAlignment.target_name;
                  }
                } else {
                  genStudies.gsLast = row.issuedOn;
                  genStudies.gsLastString = thisAlignment.target_name;
                }
              }
            }
          }
        }
      }
    }

    setGenStudies(genStudies);
  };

  const processData = (results) => {
    let classesTaken = [];
    let Degrees = [];
    let transferCredit = [];

    if (results == null || results === undefined) {
      console.log("no results");
      return;
    }
    console.log(results, "results");
    let assertions = results.getStudent.assertions;
    profileUpdate(results);
    generalStudiesCounts(assertions);

    const fieldOfStudies = {};

    for (let i = 0; i < assertions.length; i++) {
      const row = assertions[i];
      let rowType = row?.achievement?.achievement_type;
      console.log("======rowType  taken", rowType);
      let credits_earned = get(row, "credits_earned", 0.0);
      credits_earned = parseFloat(credits_earned);

      if (rowType === "Course" || rowType === "TransferCredit" || rowType === "ExamCredit") {
        studentInfo.totalCredit = studentInfo.totalCredit + credits_earned;
        var lastIssuedOn = studentInfo.lastIssuedOn;
        var thisIssuedOn = row.issued_on;
        if (thisIssuedOn > lastIssuedOn) {
          studentInfo.lastIssuedOn = thisIssuedOn;
          if (credits_earned) {
            studentInfo.lastCredit = credits_earned;
          }
          if (row.lastClass) {
            studentInfo.lastClass = row.achievement.humanCode;
          }
        }

        //field of study credit counts

        if (row && row.achievement && row.achievement.field_of_study) {
          var field_of_studyRow = fieldOfStudies[row.achievement.field_of_study];
          if (field_of_studyRow === undefined) {
            fieldOfStudies[row.achievement.field_of_study] = credits_earned;
          } else {
            fieldOfStudies[row.achievement.field_of_study] = field_of_studyRow + credits_earned;
          }
        }

        classesTaken.push(row);
      }
      if (rowType === "Degree") {
        Degrees.push(row);
      }
      if (rowType === "TransferCredit") {
        transferCredit.push(row);
      }
    }

    var sortable = [];
    for (var fos in fieldOfStudies) {
      sortable.push([fos, fieldOfStudies[fos]]);
    }
    sortable.sort(function (a, b) {
      return b[1] - a[1];
    });

    if (sortable.length > 0) {
      studentInfo.fos1 = sortable[0][0] + ": " + sortable[0][1].toFixed(1);
    }
    if (sortable.length > 1) {
      studentInfo.fos2 = sortable[1][0] + ": " + sortable[1][1].toFixed(1);
    }

    setStudentInfo(studentInfo);
    return { classes: classesTaken, Degrees: Degrees, transferCredit: transferCredit };
  };

  if (loading)
    return (
      <div id="spinner" style={{ marginLeft: 400 }}>
        <CircularProgress />
      </div>
    );
  if (error) {
    if (error.message && error.message === "Not Authorised!") {
      history.push("/login");
      return <p></p>;
    } else {
      return <p>Error: {error.message}</p>;
    }
  }

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Topbar open={open} handleDrawerOpen={handleDrawerOpen} studentName={`${profile.name} / ${profile.studentId}`} />
      <Sidebar open={open} handleDrawerClose={handleDrawerClose} />
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4} lg={3}>
              <Paper className={fixedHeightPaper}>
                <RecentCredit profile={profile} />
              </Paper>
            </Grid>

            <Grid item xs={12} md={4} lg={3}>
              <Paper className={fixedHeightPaper}>
                <GeneralStudiesTotals genStudies={genStudies} />
              </Paper>
            </Grid>

            <Grid item xs={12} md={4} lg={3}>
              <Paper className={fixedHeightPaper}>
                <CompletionPrediction studentInfo={studentInfo} />
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <Typography component="h4" variant="h6" color="inherit" noWrap className={classes.title}>
                  Notes <span className={classes.smallText}>notes will auto-save as you type</span>
                </Typography>
                <textarea className={classes.notesTextArea} value={notes} onChange={handleChange} rows="10" placeholder="Add notes here"></textarea>
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Paper className={classes.paper}>
                <StudentTranscriptsMT result={result} />
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

export default withRouter(StudentPage);
