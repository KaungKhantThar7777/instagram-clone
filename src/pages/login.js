import React from "react";
import { useLoginPageStyles } from "../styles";
import {
  Card,
  CardHeader,
  TextField,
  Button,
  Typography,
} from "@material-ui/core";
import SEO from "../components/shared/Seo";
import { Link } from "react-router-dom";
import FacebookIconBlue from "../images/facebook-icon-blue.svg";
import FacebookIconWhite from "../images/facebook-icon-white.png";

function LoginPage() {
  const classes = useLoginPageStyles();

  return (
    <>
      <SEO title="Login" />
      <section className={classes.section}>
        <div>
          <Card className={classes.card}>
            <CardHeader className={classes.cardHeader} />
            <form>
              <TextField
                fullWidth
                label="Username"
                variant="filled"
                margin="dense"
                autoComplete="username"
                className={classes.textField}
              />

              <TextField
                fullWidth
                label="Password"
                margin="dense"
                variant="filled"
                autoComplete="password"
                className={classes.textField}
                type="password"
              />

              <Button
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

  return (
    <Button fullWidth color={color} variant={variant}>
      <img
        src={FacebookIcon}
        alt="Facebook Icon"
        className={classes.facebookIcon}
      />
      Log In with Facebook
    </Button>
  );
}

export default LoginPage;
