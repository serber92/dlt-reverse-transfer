import React, { useContext, useState, useEffect } from "react";
import { useHistory, withRouter } from "react-router-dom";
import { useLazyQuery, useMutation } from "@apollo/client";
import { confirmAlert } from "react-confirm-alert";
import {
  Button,
  Grid,
  IconButton,
  TableHead,
  TableRow,
  TableCell,
  CircularProgress,
  TableSortLabel,
  Toolbar,
  Typography,
  Backdrop,
  TableContainer,
  Table,
  TableBody,
  TablePagination,
  Paper,
} from "@material-ui/core";
import { AuthContext } from "../../App";
import useStyles, { useToolbarStyles } from "./style";
import { GET_TSQLQUERY, DELETE_TSQL } from "../../helper/graphql";
import { Delete as DeleteIcon, FilterList as FilterListIcon } from "@material-ui/icons";

const headCells = [
  { id: "TSQL", numeric: false, label: "TSQL" },
  { id: "action", numeric: false, label: "" },
];

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc" ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

function EnhancedTableHead(props) {
  const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "default"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel active={orderBy === headCell.id} direction={orderBy === headCell.id ? order : "asc"} onClick={createSortHandler(headCell.id)}>
              {headCell.label}
              {orderBy === headCell.id ? <span className={classes.visuallyHidden}>{order === "desc" ? "sorted descending" : "sorted ascending"}</span> : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

const EnhancedTableToolbar = (props) => {
  const classes = useToolbarStyles();

  return (
    <Toolbar>
      <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
        Saved TSQL Queries
      </Typography>
    </Toolbar>
  );
};

const SavedQueryListPage = () => {
  const classes = useStyles();
  const { dispatch, state } = useContext(AuthContext);
  const [getTSQL, { loading, error, data = null }] = useLazyQuery(GET_TSQLQUERY);
  const [deleteTSQLQuery, { loading: deleteLoading }] = useMutation(DELETE_TSQL);
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const history = useHistory();

  useEffect(() => {
    console.log("========Y4=========");
    getTSQL({
      variables: {
        email: state.auth.user.email,
      },
    });
  }, []);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const onDeleteHandler = (row) => {
    confirmAlert({
      title: "Please confirm",
      message: `Are you sure you want to delete this query?`,
      buttons: [
        {
          label: "OK",
          onClick: () => {
            deleteTSQLQuery({
              variables: {
                id: row.id,
              },
              update: (cache) => {
                try {
                  const existingQueries = cache.readQuery({ query: GET_TSQLQUERY });
                  console.log(existingQueries, " existingQueries");
                  if (existingQueries && existingQueries.getTSQL) {
                    const newQuery = existingQueries.getTSQL.filter((t) => t.id !== row.id);
                    cache.writeQuery({
                      query: GET_TSQLQUERY,
                      data: { getTSQL: newQuery },
                    });
                  }
                } catch (error) {
                  history.go();
                }
              },
            });
          },
        },
        {
          label: "NO",
          onClick: () => {},
        },
      ],
    });
  };

  const rowCount = data ? data.getTSQL.length : 0;
  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rowCount - page * rowsPerPage);
  if (error) {
    if (error.message && error.message === "Not Authorised!") {
      history.push("/login");
      return <p></p>;
    } else {
      return <p>Error: {error.message}</p>;
    }
  }

  return (
    <>
      <Grid item xs={12}>
        <Paper className={classes.paper}>
          <EnhancedTableToolbar numSelected={selected.length} />
          <TableContainer>
            <Table className={classes.table}>
              <EnhancedTableHead
                classes={classes}
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
                rowCount={rowCount}
              />
              <TableBody>
                {data &&
                  stableSort(data.getTSQL, getComparator(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      return (
                        <TableRow hover onClick={(event) => handleClick(event, row.id)} role="checkbox" tabIndex={-1} key={row.id}>
                          <TableCell>{row.TSQL}</TableCell>
                          <TableCell align="right">
                            <IconButton onClick={() => onDeleteHandler(row)}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 55 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={rowCount}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </Paper>
      </Grid>
      <Backdrop className={classes.backdrop} open={loading || deleteLoading}>
        <CircularProgress color="primary" />
      </Backdrop>
    </>
  );
};

export default withRouter(SavedQueryListPage);
