import React, { useState } from "react";
import {
  Card,
  TextField,
  Button,
  Typography,
  InputAdornment,
} from "@material-ui/core";
import SEO from "../components/shared/Seo";
import { Link, useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useSignUpPageStyles } from "../styles";
import { LoginWithFacebook } from "./login";
import { useContext } from "react";
import { AuthContext } from "../auth";
import isEmail from "validator/lib/isEmail";
import { HighlightOff, CheckCircleOutline } from "@material-ui/icons";
import { useApolloClient } from "@apollo/react-hooks";
import { FIND_USERS } from "../graphql/queries";

function SignUpPage() {
  const { register, handleSubmit, formState, errors } = useForm({
    mode: "onBlur",
  });
  const history = useHistory();
  const classes = useSignUpPageStyles();
  const { signUpWithEmailAndPassword } = useContext(AuthContext);
  const [error, setError] = useState("");
  const client = useApolloClient();

  const errorIcon = (
    <InputAdornment>
      <HighlightOff
        style={{
          color: "red",
          height: 30,
          width: 30,
          backgroundColor: "transparent",
        }}
      />
    </InputAdornment>
  );

  const validIcon = (
    <InputAdornment>
      <CheckCircleOutline
        style={{
          color: "#ccc",
          height: 30,
          width: 30,
          backgroundColor: "transparent",
        }}
      />
    </InputAdornment>
  );

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  // };
  async function onSubmit(data) {
    try {
      setError("");
      await signUpWithEmailAndPassword(data);
      history.push("/");
    } catch (err) {
      console.log(err);
      handleError(err);
    }
  }

  function handleError(error) {
    if (error.message.includes("users_username_key")) {
      setError("Username already taken");
    } else if (error.code.includes("auth")) {
      setError(error.message);
    }
  }

  async function validateUsername(username) {
    const variables = { username };
    const res = await client.query({
      query: FIND_USERS,
      variables,
    });

    return res.data.users.length === 0;
  }

  return (
    <>
      <SEO title="Signup" />
      <section className={classes.section}>
        <div>
          <Card className={classes.card}>
            <div className={classes.cardHeader} />
            <Typography className={classes.cardHeaderSubHeader}>
              Sign up to see photos or videos from your friends
            </Typography>
            <LoginWithFacebook
              color="primary"
              iconColor="white"
              variant="contained"
            />
            <div className={classes.orContainer}>
              <div className={classes.orLine} />
              <div>
                <Typography variant="body2" color="textSecondary">
                  OR
                </Typography>
              </div>
              <div className={classes.orLine} />
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <TextField
                name="email"
                inputRef={register({
                  required: true,
                  validate: (input) => isEmail(input),
                })}
                InputProps={{
                  endAdornment: errors.email
                    ? errorIcon
                    : formState.touched.email && validIcon,
                }}
                fullWidth
                label="Email"
                variant="filled"
                margin="dense"
                autoComplete="Email"
                className={classes.textField}
              />
              <TextField
                name="name"
                inputRef={register({
                  required: true,
                  minLength: 5,
                  maxLength: 20,
                })}
                InputProps={{
                  endAdornment: errors.name
                    ? errorIcon
                    : formState.touched.name && validIcon,
                }}
                fullWidth
                label="Full Name"
                variant="filled"
                margin="dense"
                className={classes.textField}
              />
              <TextField
                name="username"
                inputRef={register({
                  required: true,
                  minLength: 5,
                  maxLength: 20,
                  pattern: /^[a-zA-Z0-9_.]*$/,
                  validate: async (input) => validateUsername(input),
                })}
                InputProps={{
                  endAdornment: errors.username
                    ? errorIcon
                    : formState.touched.username && validIcon,
                }}
                fullWidth
                label="Username"
                variant="filled"
                margin="dense"
                className={classes.textField}
              />

              <TextField
                name="password"
                inputRef={register({ required: true, minLength: 6 })}
                InputProps={{
                  endAdornment: errors.password
                    ? errorIcon
                    : formState.touched.password && validIcon,
                }}
                fullWidth
                label="Password"
                margin="dense"
                variant="filled"
                autoComplete="current-password"
                className={classes.textField}
                type="password"
              />

              <Button
                disabled={!formState.isValid || formState.isSubmitting}
                variant="contained"
                fullWidth
                color="primary"
                className={classes.button}
                type="submit"
              >
                Sign up
              </Button>
            </form>

            <AuthError error={error} />
          </Card>
          <Card className={classes.loginCard}>
            <Typography variant="body2" align="right">
              Already have an account?{" "}
            </Typography>
            <Link to="/accounts/login">
              <Button color="primary" className={classes.loginButton}>
                Login
              </Button>
            </Link>
          </Card>
        </div>
      </section>
    </>
  );
}

function AuthError({ error }) {
  return (
    Boolean(error) && (
      <Typography
        align="center"
        gutterBottom
        variant="body2"
        style={{ color: "red" }}
      >
        {error}
      </Typography>
    )
  );
}

export default SignUpPage;
