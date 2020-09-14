import React, { useState, useContext } from "react";
import { useEditProfilePageStyles } from "../styles";
import Layout from "../components/shared/Layout";
import {
  IconButton,
  Hidden,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Typography,
  TextField,
  Button,
  Snackbar,
  Slide,
} from "@material-ui/core";
import { Menu } from "@material-ui/icons";
import ProfilePicture from "../components/shared/ProfilePicture";
// import { defaultCurrentUser } from "../data";
import { UserContext } from "../App";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { GET_USER_BY_PK } from "../graphql/queries";
import LoadingScreen from "../components/shared/LoadingScreen";
import { useForm } from "react-hook-form";
import isURL from "validator/lib/isURL";
import isEmail from "validator/lib/isEmail";
import isMobilePhone from "validator/lib/isMobilePhone";
import { UPDATE_AVATAR, UPDATE_USER } from "../graphql/mutations";
import { AuthContext } from "../auth";
import handleImageUpload from "../utils/handleImageUpload";

function EditProfilePage({ history }) {
  const { currentId } = React.useContext(UserContext);
  const variables = { id: currentId };
  const { data, loading } = useQuery(GET_USER_BY_PK, { variables });
  const classes = useEditProfilePageStyles();
  const [showDrawer, setShowDrawer] = useState(false);
  const path = history.location.pathname;

  const handleSelected = (index) => {
    switch (index) {
      case 0:
        return path.includes("edit");
      default:
        break;
    }
  };

  const handleListClick = (index) => {
    switch (index) {
      case 0:
        return history.push("/accounts/edit");
      default:
        break;
    }
  };
  const options = [
    "Edit Profile",
    "Change Password",
    "App and Websites",
    "Emails and SMS",
    "Push Notifications",
    "Manage Contacts",
    "Privacy and Security",
    "Login Activity",
    "Emails from Instagrams",
  ];
  const drawer = (
    <List style={{ paddingTop: 0 }}>
      {options.map((option, index) => (
        <ListItem
          key={option}
          button
          selected={handleSelected(index)}
          onClick={() => handleListClick(index)}
          classes={{
            selected: classes.listItemSelected,
            button: classes.listItemButton,
          }}
        >
          <ListItemText primary={option} />
        </ListItem>
      ))}
    </List>
  );
  const handleToggleDrawer = () => setShowDrawer((prev) => !prev);

  if (loading) {
    return <LoadingScreen />;
  }
  return (
    <Layout title="Edit Page">
      <section className={classes.section}>
        <IconButton
          edge="start"
          onClick={handleToggleDrawer}
          className={classes.menuButton}
        >
          <Menu />
        </IconButton>
        <nav>
          <Hidden smUp implementation="css">
            <Drawer
              anchor="left"
              variant="temporary"
              open={showDrawer}
              onClose={handleToggleDrawer}
              classes={{
                paperAnchorLeft: classes.temporaryDrawer,
              }}
            >
              {drawer}
            </Drawer>
          </Hidden>

          <Hidden
            xsDown
            implementation="css"
            className={classes.permanentDrawerRoot}
          >
            <Drawer
              variant="permanent"
              open
              classes={{
                paper: classes.permanentDrawerPaper,
                root: classes.permanentDrawerRoot,
              }}
            >
              {drawer}
            </Drawer>
          </Hidden>
        </nav>
        <main>
          {path.includes("edit") && <EditUserInfo user={data.users_by_pk} />}
        </main>
      </section>
    </Layout>
  );
}

const DEFAULT_ERROR = {
  type: "",
  message: "",
};
function EditUserInfo({ user }) {
  const classes = useEditProfilePageStyles();
  const { register, handleSubmit } = useForm();
  const [updateUsers] = useMutation(UPDATE_USER);
  const [open, setOpen] = useState(false);
  const { updateEmail } = useContext(AuthContext);
  const [error, setError] = useState(DEFAULT_ERROR);
  const [avatar, setAvatar] = useState(user.profile_image);
  const [updateAvatar] = useMutation(UPDATE_AVATAR);

  const setClose = () => setOpen(false);

  async function onSubmit(data) {
    try {
      setError(DEFAULT_ERROR);
      const variables = { ...data, id: user.id };
      await updateEmail(data.email);
      await updateUsers({ variables });
      setOpen(true);
    } catch (err) {
      console.log("Error Edit page", err);
      handleError(err);
    }
  }

  function handleError(error) {
    if (error.message.includes("users_username_key")) {
      setError({ type: "username", message: "Username already taken" });
    } else if (error.code.includes("auth")) {
      setError({ type: "email", message: error.message });
    }
  }

  async function handleChangeImg(e) {
    const url = await handleImageUpload(e.target.files[0], "instagram-avatar");
    setAvatar(url);
    const variables = { id: user.id, profileImage: url };
    await updateAvatar({ variables });
  }
  return (
    <section className={classes.container}>
      <div className={classes.pictureSectionItem}>
        <ProfilePicture size={38} image={avatar} />
        <div className={classes.justifySelfStart}>
          <Typography className={classes.typography}>
            {user.username}
          </Typography>
          <input
            style={{ display: "none" }}
            type="file"
            accept="image/*"
            id="image"
            onChange={handleChangeImg}
          />
          <label htmlFor="image">
            <Typography
              color="primary"
              variant="body2"
              className={classes.typographyChangePic}
            >
              Change Profile Photo
            </Typography>
          </label>
        </div>
      </div>
      <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
        <SectionItem
          text="Name"
          name="name"
          inputRef={register({
            required: true,
            minLength: 5,
            maxLength: 20,
          })}
          formItem={user.name}
        />
        <SectionItem
          text="Username"
          formItem={user.username}
          error={error}
          name="username"
          inputRef={register({
            required: true,
            minLength: 5,
            maxLength: 20,
            pattern: /^[a-zA-Z0-9_.]*$/,
          })}
        />
        <SectionItem
          text="Website"
          formItem={user.website}
          name="website"
          inputRef={register({
            validate: (input) =>
              Boolean(input)
                ? isURL(input, {
                    protocols: ["https", "http"],
                    require_protocol: true,
                  })
                : true,
          })}
        />
        <div className={classes.sectionItem}>
          <aside
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              height: "70%",
            }}
          >
            <Typography className={classes.typography}>Bio</Typography>
          </aside>
          <TextField
            name="bio"
            inputRef={register({
              maxLength: 120,
            })}
            variant="outlined"
            multiline
            defaultValue={user.bio}
            rowsMax={3}
            rows={3}
            fullWidth
          />
        </div>

        <div className={classes.sectionItem}>
          <div />
          <Typography
            color="textSecondary"
            className={classes.justifySelfStart}
          >
            Personal Information
          </Typography>
        </div>
        <SectionItem
          text="Email"
          error={error}
          formItem={user.email}
          type="email"
          name="email"
          inputRef={register({
            required: true,
            validate: (input) => isEmail(input),
          })}
        />
        <SectionItem
          text="Phone Number"
          formItem={user.phone_number}
          name="phoneNumber"
          inputRef={register({
            validate: (input) => (Boolean(input) ? isMobilePhone(input) : true),
          })}
        />
        <div className={classes.sectionItem}>
          <div />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            className={classes.justifySelfStart}
          >
            Submit
          </Button>
        </div>
      </form>
      <Snackbar
        open={open}
        TransitionComponent={Slide}
        autoHideDuration={5000}
        onClose={() => setClose()}
        message={<span>Profile Updated</span>}
      />
    </section>
  );
}

function SectionItem({ type = "text", text, formItem, inputRef, name, error }) {
  const classes = useEditProfilePageStyles();

  return (
    <div className={classes.sectionItemWrapper}>
      <aside
        style={{
          display: "flex",
          justifyContent: "flex-end",
          paddingTop: "10px",
        }}
      >
        <Hidden xsDown>
          <Typography className={classes.typography} align="right">
            {text}
          </Typography>
        </Hidden>
        <Hidden smUp>
          <Typography className={classes.typography}>{text}</Typography>
        </Hidden>
      </aside>
      <TextField
        name={name}
        inputRef={inputRef}
        error={error?.type === name}
        helperText={error?.type === name && error.message}
        variant="outlined"
        defaultValue={formItem}
        type={type}
        fullWidth
        className={classes.textField}
        InputProps={{
          className: classes.textFieldInput,
        }}
      />
    </div>
  );
}

export default EditProfilePage;
