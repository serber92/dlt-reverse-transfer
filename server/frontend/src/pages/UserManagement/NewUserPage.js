import React, { useContext, useState, useEffect } from "react";
import { useHistory, withRouter } from "react-router-dom";
import { useMutation } from "@apollo/client";
import { NotificationManager } from "react-notifications";
import { AuthContext } from "../../App";
import AdornedButton from "../../component/AdornedButton";
import { SIGNUP } from "../../helper/graphql";

import { FormControl, Select, MenuItem, Grid, InputLabel, OutlinedInput, Typography, Button } from "@material-ui/core";

import { ArrowBack as ArrowBackIcon } from "@material-ui/icons";

import useStyles from "./style";
const RegisterUserPage = () => {
  const classes = useStyles();
  const { dispatch } = useContext(AuthContext);
  const history = useHistory();

  const [signupUser, { error, loading: signupLoading }] = useMutation(SIGNUP, {
    onCompleted(data) {
      console.log(data, "=== data ===");
      NotificationManager.success("Register account success");
      setFormState({
        isValid: false,
        values: {},
        touched: {},
        errors: {},
      });
    },
  });

  const [formState, setFormState] = useState({
    isValid: false,
    values: {},
    touched: {},
    errors: {},
  });

  useEffect(() => {
    const errors = false; //validate(formState.values, schema);

    setFormState((formState) => ({
      ...formState,
      isValid: errors ? false : true,
      errors: errors || {},
    }));
  }, [formState.values]);

  const handleChange = (event) => {
    event.persist();

    setFormState((formState) => ({
      ...formState,
      values: {
        ...formState.values,
        [event.target.name]: event.target.type === "checkbox" ? event.target.checked : event.target.value,
      },
      touched: {
        ...formState.touched,
        [event.target.name]: true,
      },
    }));
  };

  const handleSignUp = (event) => {
    event.preventDefault();

    signupUser({
      variables: {
        email: formState.values.email,
        name: formState.values.name,
        participant_type: formState.values.participant_type ? formState.values.participant_type : "user",
        ip_address: "{}",
        telephone: formState.values.phone,
        url: formState.values.imageUrl,
        student_id: formState.values.student_id,
        public_key: formState.values.public_key,
      },
    });
  };

  const handleBack = () => {
    dispatch({
      type: "SET_PAGE",
      payload: "userlist",
    });
  };

  const hasError = (field) => (formState.touched[field] && formState.errors[field] ? true : false);

  if (error) {
    if (error.message && error.message === "Not Authorised!") {
      history.push("/login");
      return <p></p>;
    } else {
      return <p>Error: {error.message}</p>;
    }
  }

  return (
    <Grid item xs={12} md={6} lg={6}>
      <div className={classes.heading}>
        <Button onClick={handleBack} color="primary" startIcon={<ArrowBackIcon />}>
          Back to Catalogue
        </Button>
      </div>
      <form className={classes.form} onSubmit={handleSignUp}>
        <Typography component="h1" variant="h4">
          Create new account
        </Typography>

        <Typography color="textSecondary" gutterBottom>
          input name and email to create new account
        </Typography>
        <p></p>
        <FormControl fullWidth className={classes.margin} variant="outlined">
          <InputLabel htmlFor="fullnameinput">Full Name</InputLabel>
          <OutlinedInput
            id="fullnameinput"
            className={classes.textField}
            error={hasError("name")}
            label="Full Name"
            fullWidth
            helperText={hasError("name") ? formState.errors.name[0] : null}
            name="name"
            onChange={handleChange}
            type="text"
            value={formState.values.name || ""}
          />
        </FormControl>
        <FormControl fullWidth className={classes.margin} variant="outlined">
          <InputLabel htmlFor="fullnameinput">Email address</InputLabel>
          <OutlinedInput
            id="fullnameinput"
            className={classes.textField}
            error={hasError("email")}
            fullWidth
            helperText={hasError("email") ? formState.errors.email[0] : null}
            label="Email address"
            name="email"
            onChange={handleChange}
            type="text"
            value={formState.values.email || ""}
          />
        </FormControl>

        <FormControl fullWidth className={classes.margin} variant="outlined">
          <InputLabel htmlFor="fullnameinput">Type</InputLabel>
          <Select
            labelId="demo-simple-select-outlined-label"
            id="demo-simple-select-outlined"
            name="participant_type"
            value={formState.values.participant_type || "user"}
            onChange={handleChange}
            label="Type"
          >
            <MenuItem value={"user"}>user</MenuItem>
            <MenuItem value={"admin"}>admin</MenuItem>
          </Select>
        </FormControl>

        <AdornedButton
          className={classes.signUpButton}
          color="primary"
          disabled={!formState.values.email || !formState.values.name}
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={signupLoading}
        >
          Submit
        </AdornedButton>
      </form>
    </Grid>
  );
};

export default withRouter(RegisterUserPage);
