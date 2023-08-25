import React, { useContext } from "react";
import { Typography, Grid, Container } from "@material-ui/core";
import { useMutation } from "@apollo/client";
import GoogleLogin from "react-google-login";
import { AuthContext } from "../../App";
import { useHistory } from "react-router-dom";
import { SIGNIN } from "../../helper/graphql";
import { makeStyles } from "@material-ui/styles";
import { googleClientID } from "../../helper/Constant";

const useStyles = makeStyles((theme) => ({
  content: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    height: "400px !important",
  },
  form: {
    background: "white",
    paddingLeft: 100,
    paddingRight: 100,
    flexBasis: 700,
    boxShadow: '0 10px 25px rgb(0 0 0 / 5%), 0 20px 48px rgb(0 0 0 / 5%), 0 1px 4px rgb(0 0 0 / 10%)',
    borderRadius: '7px',
    padding: "24px",
    margin: "24px",
  },
}));

const LoginPage = () => {
  const { dispatch } = useContext(AuthContext);
  const history = useHistory();
  const classes = useStyles();

  const [signinUser, {}] = useMutation(SIGNIN, {
    onCompleted(data) {
      dispatch({
        type: "LOGIN",
        payload: data.loginUser,
      });
      history.push("/");
    },
  });

  const responseGoogle = (response) => {
    signinUser({
      variables: {
        email: response.profileObj.email,
      },
    });
  };

  const responseGoogleError = (response) => {
    console.log(response);
    dispatch({
      type: "LOGIN-ERROR",
      payload: response,
    });
  };

  return (
    <Container>
      <Grid container>
        <Grid className={classes.content} item lg={7} xs={12}>
          <div className={classes.form}>
            <div className={classes.contentBody}>
              <Typography component="h1" variant="h4">
                Sign into Reverse Transfer <br />
                <br />
              </Typography>
            </div>
            <p></p>
            <div id="buttonContainer">
              <GoogleLogin
                clientId={googleClientID}
                buttonText="Sign in with Google"
                onSuccess={responseGoogle}
                onFailure={responseGoogleError}
                cookiePolicy={"single_host_origin"}
              />
            </div>
          </div>
        </Grid>
      </Grid>
    </Container>
  );
};

export default LoginPage;
