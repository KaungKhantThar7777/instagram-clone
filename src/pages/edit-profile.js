import React, { useState } from "react";
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
} from "@material-ui/core";
import { Menu } from "@material-ui/icons";
import ProfilePicture from "../components/shared/ProfilePicture";
import { defaultCurrentUser } from "../data";

function EditProfilePage({ history }) {
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
          {path.includes("edit") && <EditUserInfo user={defaultCurrentUser} />}
        </main>
      </section>
    </Layout>
  );
}

function EditUserInfo({ user }) {
  const classes = useEditProfilePageStyles();

  return (
    <section className={classes.container}>
      <div className={classes.pictureSectionItem}>
        <ProfilePicture size={38} user={user} />
        <div className={classes.justifySelfStart}>
          <Typography className={classes.typography}>
            {user.username}
          </Typography>
          <Typography
            color="primary"
            variant="body2"
            className={classes.typographyChangePic}
          >
            Change Profile Photo
          </Typography>
        </div>
      </div>
      <form className={classes.form}>
        <SectionItem text="Name" formItem={user.name} />
        <SectionItem text="Username" formItem={user.username} />
        <SectionItem text="Website" formItem={user.website} />
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
            variant="outlined"
            multiline
            value={user.bio}
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
        <SectionItem text="Email" formItem={user.email} type="email" />
        <SectionItem text="Phone Number" formItem={user.phone_number} />
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
    </section>
  );
}

function SectionItem({ type = "text", text, formItem }) {
  const classes = useEditProfilePageStyles();

  return (
    <div className={classes.sectionItemWrapper}>
      <aside
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
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
        variant="outlined"
        value={formItem}
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
