import React, { useState, useContext } from "react";
import { useLoginPageStyles } from "../styles";
import {
  Card,
  CardHeader,
  TextField,
  Button,
  Typography,
  InputAdornment,
} from "@material-ui/core";
import SEO from "../components/shared/Seo";
import { Link, useHistory } from "react-router-dom";
import FacebookIconBlue from "../images/facebook-icon-blue.svg";
import FacebookIconWhite from "../images/facebook-icon-white.png";
import { useForm } from "react-hook-form";
import { AuthContext } from "../auth";
import isEmail from "validator/lib/isEmail";
import { useApolloClient } from "@apollo/react-hooks";
import { GET_USER_EMAIL } from "../graphql/queries";
import { AuthError } from "./signup";
function LoginPage() {
  const classes = useLoginPageStyles();
  const { register, handleSubmit, watch, formState } = useForm({
    mode: "onBlur",
  });
  const [showPassword, setShowPassword] = useState(false);
  const { signInWithEmailAndPassword } = useContext(AuthContext);
  const history = useHistory();
  const hasPassword = Boolean(watch("password"));
  const client = useApolloClient();
  const [error, setError] = useState("");

  const onSubmit = async ({ input, password }) => {
    try {
      setError("");
      if (!isEmail(input)) {
        input = await getUserEmail(input);
      }
      await signInWithEmailAndPassword(input, password);
      setTimeout(() => history.push("/"), 0);
    } catch (err) {
      if (err.code.includes("auth")) {
        setError(err.message);
      }
    }
  };

  async function getUserEmail(input) {
    const variables = { input };
    const res = await client.query({
      query: GET_USER_EMAIL,
      variables,
    });
    const email = res.data.users[0]?.email || "no@gmail.com";
    return email;
  }
  return (
    <>
      <SEO title="Login" />
      <section className={classes.section}>
        <div>
          <Card className={classes.card}>
            <CardHeader className={classes.cardHeader} />
            <form onSubmit={handleSubmit(onSubmit)}>
              <TextField
                name="input"
                inputRef={register({
                  required: true,
                  minLength: 5,
                })}
                fullWidth
                label="Phone, Email or Username"
                variant="filled"
                margin="dense"
                autoComplete="username"
                className={classes.textField}
              />

              <TextField
                name="password"
                inputRef={register({
                  required: true,
                  minLength: 6,
                })}
                InputProps={{
                  endAdornment: hasPassword && (
                    <InputAdornment>
                      <Button onClick={() => setShowPassword((prev) => !prev)}>
                        {showPassword ? "Hide" : "Show"}
                      </Button>
                    </InputAdornment>
                  ),
                }}
                fullWidth
                label="Password"
                margin="dense"
                variant="filled"
                autoComplete="password"
                className={classes.textField}
                type={showPassword ? "text" : "password"}
              />

              <Button
                disabled={!formState.isValid || formState.isSubmitting}
                variant="contained"
                fullWidth
                color="primary"
                className={classes.button}
                type="submit"
              >
                Login
              </Button>
            </form>
            <div className={classes.orContainer}>
              <div className={classes.orLine} />
              <div>
                <Typography variant="body2" color="textSecondary">
                  OR
                </Typography>
              </div>
              <div className={classes.orLine} />
            </div>
            <LoginWithFacebook color="secondary" iconColor="blue" />
            <Button fullWidth color="secondary">
              <Typography variant="caption">Forgot Password?</Typography>
            </Button>
            <AuthError error={error} />
          </Card>
          <Card className={classes.signUpCard}>
            <Typography>Don't have an account? </Typography>
            <Link to="/accounts/emailsignup">
              <Button color="primary" className={classes.button}>
                Sign up
              </Button>
            </Link>
          </Card>
        </div>
      </section>
    </>
  );
}

export function LoginWithFacebook({ color, iconColor, variant }) {
  const classes = useLoginPageStyles();
  const FacebookIcon =
    iconColor === "blue" ? FacebookIconBlue : FacebookIconWhite;
  const { loginWithGoogle } = useContext(AuthContext);
  const [error, setError] = useState("");
  const history = useHistory();

  async function handleLoginWithGoogle() {
    try {
      setError("");
      await loginWithGoogle();
      setTimeout(() => history.push("/"), 0);
    } catch (err) {
      console.log(err);
      setError(err.message);
    }
  }
  return (
    <>
      <Button
        fullWidth
        color={color}
        variant={variant}
        onClick={handleLoginWithGoogle}
      >
        <img
          src={FacebookIcon}
          alt="Facebook Icon"
          className={classes.facebookIcon}
        />
        Log In with Facebook
      </Button>
      <AuthError error={error} />
    </>
  );
}

export default LoginPage;
