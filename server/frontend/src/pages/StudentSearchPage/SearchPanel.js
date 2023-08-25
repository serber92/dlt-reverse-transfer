import React, { useContext, memo, useState } from "react";
import { useMutation } from "@apollo/client";
import { NotificationManager } from "react-notifications";
import { get } from "lodash";
import moment from "moment";
import { CSVLink } from "react-csv";
import parser from "js-sql-parser";
import "date-fns";
import {
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Grid,
  Divider,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Popper,
  Tooltip,
  Fade,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@material-ui/core";

import DateFnsUtils from "@date-io/date-fns";
import { KeyboardDatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";

import { makeStyles } from "@material-ui/core/styles";
import SendIcon from "@material-ui/icons/Send";
import CloseIcon from "@material-ui/icons/Close";
import ExpandMoreOutlinedIcon from "@material-ui/icons/ExpandMoreOutlined";
import ArrowDownwardOutlinedIcon from "@material-ui/icons/ArrowDownwardOutlined";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { AuthContext } from "../../App";
import { CREATE_TSQLQUERY } from "../../helper/graphql";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },

  row: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },

  submitContainer: {
    display: "flex",
    flexDirection: "column",
    paddingTop: "30px",
  },
  formControl: {
    marginRight: theme.spacing(5),
    marginLeft: theme.spacing(3),
    minWidth: 120,
  },

  labelOpted: {
    margin: "20px",
    marginTop: "40px",
  },

  title: {
    fontWeight: "bold",
  },

  formControlF: {
    marginLeft: theme.spacing(3),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  searchDiv: {
    display: "flex",
    justifyContent: "space-between",
    padding: "12px",
    width: "100%",
  },
  filterDiv: {},
  submitDiv: {
    width: "160px",
  },
  paper: {
    border: "1px solid",
    padding: theme.spacing(1),
    backgroundColor: theme.palette.background.paper,

    overflow: "auto",
    height: "400px",
    width: "400px",
    boxShadow: "0px 11px 15px -7px rgb(0 0 0 / 20%), 0px 24px 38px 3px rgb(0 0 0 / 14%), 0px 9px 46px 8px rgb(0 0 0 / 12%)",
    borderRadius: "4px",
  },
  code: {
    padding: "4px",
    backgroundColor: "#f5f5f5",
    borderRadius: "3px",
  },
  closehelp: {
    position: "absolute",
    right: "10px",
    top: "-5px",
  },
}));

const SearchPanel = memo((props) => {
  const { onTSQLSearchStudent, SelectedStudents, getCsvData } = props;

  const classes = useStyles();
  const { dispatch, state } = useContext(AuthContext);
  const [creditHours, setCreditHours] = useState();
  const [creditHoursValue, setCreditHoursValue] = useState("");
  const [school, setSchool] = useState("ASU");
  const [hasDegree, setHasDegree] = useState(false);
  const [saveQuery, setSaveQuery] = useState(false);
  const [fromDate, setFromDate] = useState(new Date("2014-01-01T00:00:00"));
  const [toDate, setToDate] = useState(new Date());
  const [TSQL, setTSQL] = useState("");
  const [StudentID, setStudentID] = useState("");
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [expanded, setExpanded] = React.useState("search");

  const headers = [
    { label: "line Number", key: "lineNumber" },
    { label: "host Name", key: "hostName" },
    { label: "Certified Date", key: "CertifiedDate" },
    { label: "Last 4 of SSN", key: "Last4ofSSN" },
    { label: "Last 4 of ITIN", key: "Last4ofITIN" },
    { label: "Host StudentID", key: "HostStudentID" },
    { label: "DGI StudentID", key: "DGIStudentID" },
    { label: "First Name", key: "FirstName" },
    { label: "Middle Name", key: "MiddleName" },
    { label: "Last Name", key: "LastName" },
    { label: "suffix", key: "suffix" },
    { label: "Date of Birth", key: "DateofBirth" },
    { label: "Street line 1", key: "Streetline1" },
    { label: "Street line 2", key: "Streetline2" },
    { label: "City", key: "City" },
    { label: "State", key: "State" },
    { label: "ZIP", key: "ZIP" },
    { label: "Country", key: "Country" },
    { label: "Student Phonenumber", key: "StudentPhonenumber" },
    { label: "Student email", key: "Studentemail" },
    { label: "Host Core Competency Completed", key: "HostCoreCompetencyCompleted" },
    { label: "Course Name", key: "CourseName" },
    { label: "Course No", key: "CourseNo" },
    { label: "Course Description", key: "CourseDescription" },
    { label: "Term Detail", key: "TermDetail" },
    { label: "Course Begin Date", key: "CourseBeginDate" },
    { label: "Course End Date", key: "CourseEndDate" },
    { label: "Grade", key: "Grade" },
    { label: "Course Grade Effective Date", key: "CourseGradeEffectiveDate" },
    { label: "Number of Credits", key: "NumberofCredits" },
    { label: "Credit Description", key: "CreditDescription" },
    { label: "Core Course", key: "CoreCourse" },
    { label: "Core Course Type", key: "CoreCourseType" },
    { label: "Grade Scale", key: "GradeScale" },
    { label: "Total Earned And Transferred Credits", key: "TotalEarnedAndTransferredCredits" },
    { label: "Host OPEID", key: "HostOPEID" },
    { label: "Semester GPA", key: "SemesterGPA" },
    { label: "Overall GPA", key: "OverallGPA" },
    { label: "DGI OPEID", key: "DGIOPEID" },
    { label: "Host SOI OPEID", key: "HostSOIOPEID" },
    { label: "DGI Name", key: "DGIName" },
    { label: "Filler 1", key: "Filler1" },
    { label: "Filler 2", key: "Filler2" },
    { label: "Filler 3", key: "Filler3" },
  ];
  
  const handleChangeCreditHours = (e) => {
    setCreditHours(e.target.value);
  };

  const handleChangeSchool = (e) => {
    setSchool(e.target.value);
  };

  const handleDateChangeFrom = (date) => {
    setFromDate(date);
  };

  const handleDateChangeTo = (date) => {
    setToDate(date);
  };

  const handleClickSendTSQL = () => {
    try {
      const ast = parser.parse(`select *from STUDENT WHERE ${TSQL}`); // mysql sql grammer parsed by default

      const whereCondition = get(ast, "value.where");
      const sqlValid = filterData(whereCondition);
      if (sqlValid) {
        onTSQLSearchStudent(StudentID, school, TSQL);
      }
    } catch (error) {
      NotificationManager.error("SQL syntax error");
    }
  };

  const filterData = (condition) => {
    if (condition.type === "OrExpression" || condition.type === "AndExpression") {
      // we only have AND and OR condition for now
      const leftData = filterData(condition.left);
      const rightData = filterData(condition.right);

      return leftData && rightData;
    } else {
      return filterUserData(condition);
    }
  };

  const filterUserData = (condition) => {
    const fieldName = condition.left.value.toLowerCase();
    const value = condition.right.value.replace(/["']/g, "");

    if (fieldName === "name") {
      if (condition.type === "LikePredicate") {
        return true;
      } else if (condition.operator === "=") {
        return true;
      } else {
        NotificationManager.error("SQL syntax error: name supports like or =");
        return false;
      }
    } else if (fieldName === "credit") {
      if (
        condition.operator === ">" ||
        condition.operator === ">=" ||
        condition.operator === "<" ||
        condition.operator === "<=" ||
        condition.operator === "<>" ||
        condition.operator === "="
      ) {
        return true;
      } else {
        NotificationManager.error("SQL syntax error: credit supports >, >=, <, <=, <>, =");
        return false;
      }
    } else if (fieldName === "issuedon") {
      if (value.length !== 10) {
        NotificationManager.error("SQL syntax error: issuedon invalid date");

        return false;
      }
      const valueDate = moment(value, "YYYY-MM-DD").valueOf();
      console.log(valueDate);
      if (
        condition.operator === ">" ||
        condition.operator === ">=" ||
        condition.operator === "<" ||
        condition.operator === "<=" ||
        condition.operator === "<>" ||
        condition.operator === "="
      ) {
        if (!valueDate) {
          NotificationManager.error("SQL syntax error: issuedon invalid date");
        }
        return true;
      } else {
        NotificationManager.error("SQL syntax error: issuedon supports >, >=, <, <=, <>, =");
        return false;
      }
    } else if (fieldName === "class") {
      if (condition.operator === "=") {
        return true;
      } else {
        NotificationManager.error("SQL syntax error: class supports =");
        return false;
      }
    } else if (fieldName === "degree") {
      if (condition.operator === "=" || condition.operator === "!=") {
        return true;
      } else {
        NotificationManager.error("SQL syntax error: Degree supports =");
        return false;
      }
    } else {
      NotificationManager.error(`SQL syntax error: unknown field: ${fieldName}`);
      return false;
    }
  };

  const handleChangeTSQL = (e) => {
    setTSQL(e.target.value);
  };
  const onClickSubmit = () => {
    if (fromDate > toDate) {
      NotificationManager.error("Please ensure that the To Date is greater than or equal to the From Date.");
      return;
    }
    let SQLValue = `IssuedOn >= '${moment(fromDate).format("YYYY-MM-DD")}' and IssuedOn <= '${moment(toDate).format("YYYY-MM-DD")}'`;
    if (creditHours && creditHoursValue === "") {
      NotificationManager.error("Please input Credit Hours");
      return;
    }

    if (creditHours && creditHoursValue !== "") {
      SQLValue = `${SQLValue} and Credit ${creditHours} ${creditHoursValue}`;
    }

    if (hasDegree) {
      SQLValue = `${SQLValue} and Degree = true`;
    } else {
      SQLValue = `${SQLValue} and Degree = false`;
    }

    setTSQL(SQLValue);
    onTSQLSearchStudent(StudentID, school, SQLValue);

    if (saveQuery) {
      createTSQLQuery({
        variables: {
          email: state.auth.user.email,
          TSQL: SQLValue,
        },
      });
    }
  };

  const [createTSQLQuery, { loading }] = useMutation(CREATE_TSQLQUERY, {
    onCompleted(data) {
      console.log(data, "=== data ===");
      NotificationManager.success("save TSQL success");
    },
  });

  const handleChangeHasDegree = (e) => {
    setHasDegree(e.target.checked);
  };

  const handleChangeSaveQuery = (e) => {
    setSaveQuery(e.target.checked);
  };

  const keyInputSearchText = (event) => {
    if (event.which === 13 || event.keyCode === 13) {
      onTSQLSearchStudent(StudentID, school, TSQL);
    }
  };

  const onClickHelp = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const handleClickClose = () => {
    setAnchorEl(null);
  };

  const handleChangePanel = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const open = Boolean(anchorEl);
  const id = open ? "transitions-popper" : undefined;

  return (
    <Grid container spacing={1} alignItems="center">
      <Grid item xs={12}>
        <Accordion expanded={expanded === "search"} onChange={handleChangePanel("search")}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
            <Typography className={classes.title}>Search Students</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div className={classes.searchDiv}>
              <div className={classes.filterDiv}>
                <div className={classes.row}>
                  <FormControl variant="outlined" className={classes.formControlF}>
                    <InputLabel size="small" id="creditlabel1">
                      Credit Hours
                    </InputLabel>
                    <Select labelId="creditlabel" id="creditlabel" value={creditHours} onChange={handleChangeCreditHours}>
                      <MenuItem value={null}>None</MenuItem>
                      <Divider />
                      <MenuItem value={"<"}>{"<"}</MenuItem>
                      <MenuItem value={"<="}>{"<="}</MenuItem>
                      <MenuItem value={"="}>{"="}</MenuItem>
                      <MenuItem value={">"}>{">"}</MenuItem>
                      <MenuItem value={">="}>{">="}</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    size="small"
                    className={classes.formControl}
                    id="outlined-search"
                    label=""
                    type="search"
                    variant="outlined"
                    onChange={(e) => setCreditHoursValue(e.target.value)}
                  />

                  <FormControl variant="outlined" className={classes.formControl}>
                    <InputLabel id="schoollabel1">School</InputLabel>
                    <Select labelId="schoollabel" id="schoollabel" value={school} onChange={handleChangeSchool}>
                      <MenuItem value={null}>None</MenuItem>
                      <Divider />
                      <MenuItem value={"ASU"}>ASU</MenuItem>
                      <MenuItem value={"MCC"}>MCC</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControlLabel
                    control={<Checkbox checked={hasDegree} onChange={handleChangeHasDegree} name="checkedB" color="primary" />}
                    label="Has Degree"
                  />
                </div>
                <div className={classes.row}>
                  <Typography className={classes.labelOpted}>Credit Earned </Typography>
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardDatePicker
                      format="yyyy-MM-dd"
                      variant="outlined"
                      margin="normal"
                      id="date-picker-from"
                      label="Date From"
                      value={fromDate}
                      onChange={handleDateChangeFrom}
                      KeyboardButtonProps={{
                        "aria-label": "change date",
                      }}
                    />
                    <KeyboardDatePicker
                      format="yyyy-MM-dd"
                      variant="outlined"
                      margin="normal"
                      id="date-picker-to"
                      label="Date to"
                      value={toDate}
                      onChange={handleDateChangeTo}
                      KeyboardButtonProps={{
                        "aria-label": "change date",
                      }}
                    />
                  </MuiPickersUtilsProvider>
                </div>
              </div>

              <div className={classes.submitDiv}>
                <div className={classes.submitContainer}>
                  <Button variant="contained" color="primary" style={{ marginTop: "15px" }} onClick={onClickSubmit}>
                    Submit
                  </Button>
                  <FormControlLabel
                    value="end"
                    control={<Checkbox color="primary" checked={saveQuery} onChange={handleChangeSaveQuery} />}
                    label="Save Query"
                    labelPlacement="end"
                  />
                </div>
              </div>
            </div>
          </AccordionDetails>
        </Accordion>
      </Grid>

      <Grid item xs={12}>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1a-content" id="panel1a-header">
            <Typography className={classes.title}>TSQL</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={0} alignItems="center">
              <Grid item xs={8}>
                <FormControlLabel
                  value="end"
                  control={<Checkbox color="primary" checked={saveQuery} onChange={handleChangeSaveQuery} />}
                  label="Save Query"
                  labelPlacement="end"
                />
              </Grid>
              <Grid item xs={4}>
                <Button color="primary" style={{ marginTop: "15px" }} onClick={onClickHelp}>
                  TSQL HELP
                </Button>
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel htmlFor="tsqlinput">Display TSQL here</InputLabel>
                  <OutlinedInput
                    id="tsqlinput"
                    value={TSQL}
                    fullWidth
                    multiline
                    rows={4}
                    onChange={handleChangeTSQL}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton disabled={TSQL === ""} aria-label="Display TSQL here" onClick={(e) => handleClickSendTSQL()} edge="end">
                          <SendIcon />
                        </IconButton>
                      </InputAdornment>
                    }
                    labelWidth={170}
                  />
                </FormControl>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      </Grid>

      <Grid item xs={6}>
        <FormControl fullWidth variant="outlined">
          <Typography className={classes.title}>Students Found:</Typography>
        </FormControl>
      </Grid>
      <Grid item xs={5}>
        <FormControl variant="outlined" className={classes.formControl} style={{ marginTop: "8px", marginLeft: "62px" }}>
          <TextField
            size="small"
            fullWidth
            className={classes.formControl}
            id="outlined-search"
            label="Student ID"
            type="search"
            variant="outlined"
            value={StudentID}
            onChange={(e) => setStudentID(e.target.value)}
            onKeyDown={(event) => keyInputSearchText(event)}
          />
        </FormControl>
      </Grid>
      <Grid item xs={1}>
        <CSVLink headers={headers} filename="Students.csv" data={getCsvData(0)} disabled={SelectedStudents && SelectedStudents.length === 0}>
          <Tooltip title="Export Selected Student(s)">
            <IconButton edge="end">
              <ExpandMoreOutlinedIcon />
            </IconButton>
          </Tooltip>
        </CSVLink>
        <CSVLink headers={headers} filename="AllStudents.csv" data={getCsvData(-1)}>
          <Tooltip title="Export All">
            <IconButton edge="end">
              <ArrowDownwardOutlinedIcon />
            </IconButton>
          </Tooltip>
        </CSVLink>
      </Grid>
      <Popper id={id} open={open} anchorEl={anchorEl} transition>
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <div className={classes.paper}>
              <IconButton className={classes.closehelp} onClick={(e) => handleClickClose()} edge="end">
                <CloseIcon />
              </IconButton>
              <h2>1. TSQL query fields</h2>
              <h3>Name</h3>
              <p>
                avaiable operator: <b>like</b>, <b>=</b>
              </p>
              <li>Example:</li>
              <div className={classes.code}>Name like 'Anastasia'</div>

              <h3>Credit</h3>
              <p>
                avaiable operator: <b>{">"}</b>, <b>{">="}</b>, <b>{"<"}</b>, <b>{"<="}</b>, <b>{"<>"}</b>, <b>{"="}</b>
              </p>
              <li>Example:</li>
              <div className={classes.code}>{"Credit > 10"}</div>

              <h3>IssuedOn</h3>
              <p>
                avaiable operator: <b>{">"}</b>, <b>{">="}</b>, <b>{"<"}</b>, <b>{"<="}</b>, <b>{"<>"}</b>, <b>{"="}</b>
              </p>
              <li>Example:</li>
              <div className={classes.code}>{"IssuedOn < '2021-04-10'"}</div>

              <h3>Degree</h3>
              <p>
                avaiable operator: <b>{"="}</b>, <b>{"!="}</b>
              </p>
              <li>Example:</li>
              <div className={classes.code}>{"Degree = true"}</div>

              <h3>Class</h3>
              <p>
                avaiable operator: <b>{"="}</b>
              </p>
              <li>Example:</li>
              <div className={classes.code}>{"Class = 'Special Topics'"}</div>

              <h2>2. TSQL query operators</h2>
              <h3>And</h3>
              <li>Example:</li>
              <div className={classes.code}>
                {"Name like 'sa' "} <b>And</b> {"credit > 10"}
              </div>
              <h3>Or</h3>
              <li>Example:</li>
              <div className={classes.code}>
                {"Name like 'sa' "} <b>Or</b> {"credit > 100"}
              </div>
            </div>
          </Fade>
        )}
      </Popper>
    </Grid>
  );
});

export default SearchPanel;
