import React, { memo, useEffect, useState } from "react";
import moment from "moment";
import { useHistory, withRouter } from "react-router-dom";
import "react-perfect-scrollbar/dist/css/styles.css";
import PerfectScrollbar from "react-perfect-scrollbar";
import { useLazyQuery } from "@apollo/client";
import { cloneDeep, get } from "lodash";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import MaterialTable from "material-table";
import Paper from "@material-ui/core/Paper";
import { TableContainer } from "@material-ui/core";
import { CircularProgress } from "@material-ui/core";
import SearchPanel from "./SearchPanel";
import { LIST_STUDENTS } from "../../helper/graphql";

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
    display: "flex",
    justifyContent: "center",
    textAlign: "center",
    paddingTop: "20px",
  },
}));

const sortByIssuedOn = (aJson, bJson) => {
  let a = aJson?.issuedOn;
  let b = bJson?.issuedOn;
  if (a > b) {
    return -1;
  }
  if (a < b) {
    return 1;
  }
  // a must be equal to b
  return 0;
};
const processData = (classesForStudentArr) => {
  let classesTaken = [];
  let Degrees = [];

  if (classesForStudentArr == null || classesForStudentArr === undefined) {
    console.log("classesForStudentArr is empty or null--not processing data");
    return;
  }
  //summarize students records
  for (let i = 0; i < classesForStudentArr.node.assertions.length; i++) {
    const row = classesForStudentArr.node.assertions[i];
    row["key"] = row.recipient ? row.recipient.identity + "-" + i : "";

    let rowType = get(row, "achievement.achievement_type");
    if (rowType === "Course" || rowType === "TransferCredit" || rowType === "ExamCredit") {
      classesTaken.push(row);
    }
    if (rowType === "Degree") {
      Degrees.push(row);
    }
  }
  classesTaken.sort(sortByIssuedOn);
  classesForStudentArr["classes"] = classesTaken;
  Degrees.sort(sortByIssuedOn);
  classesForStudentArr["Degrees"] = Degrees;

  const birthdate = get(classesForStudentArr, "node.profile.birthdate", "0000-00-00");
  if (birthdate && birthdate.length >= 10) {
    classesForStudentArr.node.profile.birthdate = "xxxx" + birthdate.substr(4);
  } else {
    classesForStudentArr.node.profile.birthdate = "xxxx-xx-xx";
  }

  return classesForStudentArr;
};

let timer;
const StudentsMT = memo((props) => {
  const history = useHistory();
  const [result, setResult] = useState([]);
  const [TSQL, setTSQL] = useState("");
  const [school, setSchool] = useState("ASU");
  const [StudentID, setStudentID] = useState("");
  const [loadingMore, setLoadingMore] = useState(false);
  const classes = useStyles();
  const [loadStudent, { loading, error, data = null, fetchMore }] = useLazyQuery(LIST_STUDENTS, { fetchPolicy: "network-only" });
  const [SelectedStudents, setSelectedStudents] = useState([])
  useEffect(() => {
    if (!data) {
      return; //not logged in, don't look up data
    }

    fetchStudents(data.listStudents.edges);
  }, [data]);

  useEffect(() => {
    loadStudent({
      variables: { school, first: 10, SQL: TSQL },
    });
  }, []);

  const fetchStudents = (students) => {
    let studentsArr = cloneDeep(students);

    let oldList = cloneDeep(result);

    studentsArr = studentsArr.slice(oldList.length, studentsArr.length);

    for (let s = 0; s < studentsArr.length; s++) {
      studentsArr[s].node.profile["review"] = "/auth-student?student_id=" + studentsArr[s].node.profile.student_id;
      studentsArr[s] = processData(studentsArr[s]);
      oldList.push(studentsArr[s]);
    }
    setResult(oldList);
    setLoadingMore(false);
  };

  const handleYScrollEnd = (e) => {
    if (!data) return;
    if (!data.listStudents.pageInfo.hasNextPage || loadingMore || loading) return;

    clearTimeout(timer);
    timer = setTimeout(() => {
      fetchMoreStudent();
    }, 500);
  };

  const fetchMoreStudent = () => {
    setLoadingMore(true);
    fetchMore({
      variables: { StudentID, school, first: 10, after: data.listStudents.pageInfo.lastCursor, SQL: TSQL },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        const newEdges = fetchMoreResult.listStudents.edges;
        const pageInfo = fetchMoreResult.listStudents.pageInfo;

        return newEdges.length
          ? {
              // Put the new comments at the end of the list and update `pageInfo`
              // so we have the new `endCursor` and `hasNextPage` values
              listStudents: {
                __typename: previousResult.listStudents.__typename,
                edges: [...previousResult.listStudents.edges, ...newEdges],
                pageInfo,
              },
            }
          : previousResult;
      },
    });
  };

  const onTSQLSearchStudent = (StudentID, school, TSQL) => {
    setTSQL(TSQL);
    setSchool(school);
    setStudentID(StudentID);
    setResult([]);
    loadStudent({
      variables: { StudentID, school, first: 10, SQL: TSQL, after: "" },
    });
  };

  const getCsvData = mode => {
    let data = null
    if (mode === 0) {
      data = SelectedStudents
    } else {
      data = result
    }
    let lineNumber = 0
    let csvData = []
    data.forEach((el, index) => {
      const namedata = el.node.profile.name.split(' ')
      const FirstName = namedata.length > 0 ? namedata[0]: '';
      const MiddleName = namedata.length === 3 ? namedata[1]: '';
      const LastName = namedata.length === 2 ? namedata[1]: namedata.length === 3 ? namedata[2]: '';

      if (el.node.assertions.length > 0) {
        el.node.assertions.forEach((row, index) => {
          lineNumber ++;
          csvData.push({
            lineNumber,
            hostName: 'ASU',
            CertifiedDate: '',
            Last4ofSSN: '',
            Last4ofITIN: '',
            HostStudentID: el.node.profile.ASU_ID,
            DGIStudentID: el.node.profile.MCC_ID,
            FirstName,
            MiddleName,
            LastName,
            suffix : '',
            DateofBirth: el.node.profile.birthdate,
            Streetline1: el.node.profile.address?.street_address, //
            Streetline2 : '', //
            City: el.node.profile.address?.address_locality, //
            State: el.node.profile.address?.address_region, //
            ZIP: el.node.profile.address?.postal_code, //
            Country: el.node.profile.address?.address_country, //
            StudentPhonenumber: el.node.profile.telephone,
            Studentemail: el.node.profile.email,
            HostCoreCompetencyCompleted: '',
            CourseName : row?.achievement?.name, //
            CourseNo : row?.term, //
            CourseDescription: row?.achievement?.description, //
            TermDetail: row?.term,
            CourseBeginDate: row?.start_date ? moment(row?.start_date, "x").format("YYYY-MM-DD") : '', //
            CourseEndDate: row?.end_date ? moment(row?.end_date, "x").format("YYYY-MM-DD"): '', //
            Grade: row?.results[0]?.value, //
            CourseGradeEffectiveDate: moment(row?.issued_on, "x").format("YYYY-MM-DD"), //
            NumberofCredits: row?.credits_earned, //
            CreditDescription: '', //
            CoreCourse: '', //
            CoreCourseType: get(row, "achievement.achievement_type"), //
            GradeScale: '', //
            TotalEarnedAndTransferredCredits: '', //
            HostOPEID: el.node.profile.source_id,
            SemesterGPA: '',
            OverallGPA: '',
            DGIOPEID: '',
            HostSOIOPEID: '',
            DGIName: '',
            Filler1: '',
            Filler2: '',
            Filler3: '',
          })
        })
        
      } else {
        csvData.push({
          lineNumber,
          hostName: '',
          CertifiedDate: '',
          Last4ofSSN: '',
          Last4ofITIN: '',
          HostStudentID: el.node.profile.ASU_ID,
          DGIStudentID: el.node.profile.MCC_ID,
          FirstName,
          MiddleName,
          LastName,
          suffix : '',
          DateofBirth: el.node.profile.birthdate,
          Streetline1: '', //
          Streetline2 : '', //
          City: '', //
          State: '', //
          ZIP: '', //
          Country: '', //
          StudentPhonenumber: el.node.profile.telephone,
          Studentemail: el.node.profile.email,
          HostCoreCompetencyCompleted: '',
          CourseName : '', //
          CourseNo : '', //
          CourseDescription: '', //
          TermDetail: '', //
          CourseBeginDate: '', //
          CourseEndDate: '', //
          Grade: '' , //
          CourseGradeEffectiveDate: '', //
          NumberofCredits: '', //
          CreditDescription: '', //
          CoreCourse: '', //
          CoreCourseType: '' , //
          GradeScale: '', //
          TotalEarnedAndTransferredCredits: '', //
          HostOPEID: el.node.profile.source_id,
          SemesterGPA: '',
          OverallGPA: '',
          DGIOPEID: '',
          HostSOIOPEID: '',
          DGIName: '',
          Filler1: '',
          Filler2: '',
          Filler3: '',
        })
      }
      
    })
    return csvData;
  }

  if (error) {
    if (error.message && error.message === "Not Authorised!") {
      history.push("/login");
      return <p></p>;
    } else {
      return <p>Error: {error.message}</p>;
    }
  }
  console.log("why redendering");
  return (
    <React.Fragment>
      <SearchPanel onTSQLSearchStudent={onTSQLSearchStudent} SelectedStudents={SelectedStudents} getCsvData={getCsvData}/>
      <PerfectScrollbar onYReachEnd={(e) => handleYScrollEnd(e)} style={{ height: "60vh" }}>
        <MaterialTable
          title=""
          columns={[
            {
              title: "ASU ID",
              field: "node.profile.ASU_ID",
              cellStyle: {
                backgroundColor: "#f0f0f0",
                color: "#000000",
              },
            },
            {
              title: "MCC ID",
              field: "node.profile.MCC_ID",
              cellStyle: {
                backgroundColor: "#f0f0f0",
                color: "#000000",
              },
            },
            // { title: 'Name', field: 'name',export: false},
            { title: "Name", field: "node.profile.name" },
            { title: "Email", field: "node.profile.email" },
            { title: "DOB", field: "node.profile.birthdate" },
            { title: "Phone", field: "node.profile.telephone" },
            {
              title: "Last Issued",
              field: "node.profile.lastIssuedOn",
              render: (rowData) => {
                return moment(rowData.node.profile.lastIssuedOn, "x").format("YYYY-MM-DD");
              },
            },
            { title: "Total Credits", field: "node.profile.totalCredit" },
            {
              title: "Review",
              field: "node.profile.review",
              filtering: false,
              render: (rowData) => {
                return <a href={rowData.node.profile.review}>Review</a>;
              },
            },
          ]}
          // onSearchChange={onSearchChange}
          data={result}
          //data={[]}
          count={-1}
          // onRowClick={(evt, selectedRow) => alert('click') }
          options={{
            search: false,
            exportButton: false,
            exportAllData: false,
            sorting: true,
            //filtering: true,
            // grouping: true,
            selection: true,
            paging: false,
          }}
          localization={{
            toolbar:{
              nRowsSelected:"{0} student(s) selected"
            }
          }}
          onSelectionChange={(rows) => setSelectedStudents(rows)}
          detailPanel={(rowData) => {
            return (
              <div id="project-features">
                {rowData?.Degrees && rowData?.Degrees.length > 0 && (
                  <div>
                    <TableContainer component={Paper}>
                      <Table size="small">
                        <TableHead>
                          <TableRow style={{ background: "#f0f0f0" }}>
                            <TableCell>
                              <b>Degrees</b>
                            </TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Institution</TableCell>
                            <TableCell>GPA</TableCell>
                            <TableCell>Date</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {rowData?.Degrees?.map((ccc) => (
                            <TableRow>
                              <TableCell component="th" scope="row"></TableCell>
                              <TableCell component="th" scope="row">
                                {ccc?.achievement?.achievement_type}
                              </TableCell>
                              <TableCell component="th" scope="row">
                                {ccc?.achievement?.human_code}
                              </TableCell>
                              <TableCell component="th" scope="row">
                                {ccc?.achievement?.description}
                              </TableCell>
                              <TableCell component="th" scope="row">
                                {ccc?.achievement?.field_of_study}
                              </TableCell>
                              <TableCell component="th" scope="row">
                                {ccc?.results[0]?.value}
                              </TableCell>
                              <TableCell component="th" scope="row">
                                {moment(ccc?.issued_on, "x").format("YYYY-MM-DD")}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    <br />
                    <br />
                  </div>
                )}

                <TableContainer component={Paper}>
                  <Table size="small">
                    <TableHead>
                      <TableRow style={{ background: "#f0f0f0" }}>
                        <TableCell>
                          <b>Type</b>
                        </TableCell>
                        <TableCell>Term</TableCell>
                        <TableCell>Class</TableCell>
                        <TableCell>Code</TableCell>
                        <TableCell>Credit</TableCell>
                        <TableCell>IssuedOn</TableCell>
                        <TableCell>Grade</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rowData.classes.map((ccc) => (
                        <TableRow>
                          <TableCell component="th" scope="row">
                            {ccc?.achievement?.achievement_type}
                          </TableCell>
                          <TableCell component="th" scope="row">
                            {ccc?.term}
                          </TableCell>
                          <TableCell component="th" scope="row">
                            {ccc?.achievement?.name}
                          </TableCell>
                          <TableCell component="th" scope="row">
                            {ccc?.achievement?.human_code}
                          </TableCell>
                          <TableCell component="th" scope="row">
                            {ccc?.credits_earned}
                          </TableCell>
                          <TableCell component="th" scope="row">
                            {moment(ccc?.issued_on, "x").format("YYYY-MM-DD")}
                          </TableCell>
                          <TableCell component="th" scope="row">
                            {ccc?.results[0]?.value}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            );
          }}
        />
      </PerfectScrollbar>
      {(loadingMore || loading) && (
        <div id="spinner" className={classes.seeMore}>
          <CircularProgress />
          <span className={classes.seeMore} id="callsLeft"></span>
        </div>
      )}
    </React.Fragment>
  );
});

export default withRouter(StudentsMT);
