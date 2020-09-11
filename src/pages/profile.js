import React, { useState, useContext } from "react";
import { useProfilePageStyles } from "../styles";
import Layout from "../components/shared/Layout";
import { defaultCurrentUser } from "../data";
import {
  Hidden,
  Card,
  CardContent,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  Zoom,
  Divider,
  Avatar,
} from "@material-ui/core";
import ProfilePicture from "../components/shared/ProfilePicture";
import { Link } from "react-router-dom";
import { GearIcon } from "../icons";
import ProfileTabs from "../components/profile/ProfileTabs";
import { AuthContext } from "../auth";

function ProfilePage() {
  const classes = useProfilePageStyles();
  const isOwner = true;
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);

  const handleShowOptionsMenu = () => {
    setShowOptionsMenu((prev) => !prev);
  };
  return (
    <Layout
      title={`${defaultCurrentUser.name} (@${defaultCurrentUser.username})`}
    >
      <div className={classes.container}>
        <Hidden xsDown>
          <Card className={classes.cardLarge}>
            <ProfilePicture isOwner={isOwner} />
            <CardContent className={classes.cardContentLarge}>
              <ProfileNameSection
                isOwner={isOwner}
                user={defaultCurrentUser}
                handleMenu={handleShowOptionsMenu}
              />
              <PostCountSection user={defaultCurrentUser} />
              <NameBioSection user={defaultCurrentUser} />
            </CardContent>
          </Card>
        </Hidden>
        <Hidden smUp>
          <Card className={classes.cardSmall}>
            <CardContent>
              <section className={classes.sectionSmall}>
                <ProfilePicture isOwner={isOwner} size={77} />
                <ProfileNameSection
                  isOwner={isOwner}
                  user={defaultCurrentUser}
                  handleMenu={handleShowOptionsMenu}
                />
              </section>
              <NameBioSection user={defaultCurrentUser} />
            </CardContent>
            <PostCountSection user={defaultCurrentUser} />
          </Card>
        </Hidden>
      </div>
      {showOptionsMenu && <OptionsMenu handleClick={handleShowOptionsMenu} />}
      <ProfileTabs isOwner={isOwner} user={defaultCurrentUser} />
    </Layout>
  );
}

function ProfileNameSection({ user, isOwner, handleMenu }) {
  const classes = useProfilePageStyles();

  let FollowBtn;
  const isFollowing = true;
  const isFollower = false;

  const [showUnfollowDialog, setUnfollowDialog] = useState(false);
  if (isFollowing) {
    FollowBtn = (
      <Button variant="outlined" onClick={() => setUnfollowDialog(true)}>
        Following
      </Button>
    );
  } else if (isFollower) {
    FollowBtn = (
      <Button variant="contained" color="primary">
        Follow Back
      </Button>
    );
  } else {
    FollowBtn = (
      <Button variant="contained" color="primary">
        Follow
      </Button>
    );
  }
  return (
    <>
      <Hidden xsDown>
        <section className={classes.usernameSection}>
          <Typography className={classes.username}>{user.username}</Typography>
          {isOwner ? (
            <>
              <Link to="/accounts/edit">
                <Button variant="outlined">Edit Profile</Button>
              </Link>
              <div onClick={handleMenu} className={classes.settingsWrapper}>
                <GearIcon className={classes.settings} />
              </div>
            </>
          ) : (
            FollowBtn
          )}
        </section>
      </Hidden>

      <Hidden smUp>
        <section>
          <div className={classes.usernameDivSmall}>
            <Typography className={classes.username}>
              {user.username}
            </Typography>
            {isOwner && (
              <div onClick={handleMenu} className={classes.settingsWrapper}>
                <GearIcon className={classes.settings} />
              </div>
            )}
          </div>
          {isOwner ? (
            <Link to="/accounts/edit">
              <Button variant="outlined" style={{ width: "90%" }}>
                Edit Profile
              </Button>
            </Link>
          ) : (
            FollowBtn
          )}
        </section>
      </Hidden>
      {showUnfollowDialog && (
        <UnfollowDialog user={user} onClose={() => setUnfollowDialog(false)} />
      )}
    </>
  );
}

function UnfollowDialog({ onClose, user }) {
  const classes = useProfilePageStyles();

  return (
    <Dialog
      open
      classes={{
        scrollPaper: classes.unfollowDialogScrollPaper,
      }}
      onClose={onClose}
      TransitionComponent={Zoom}
    >
      <div className={classes.wrapper}>
        <Avatar
          src={user.profile_image}
          alt={`${user.username}'s avatar`}
          className={classes.avatar}
        />
      </div>
      <Typography
        align="center"
        variant="h6"
        className={classes.unfollowDialogText}
      >
        Unfollow @{user.username}?
      </Typography>

      <Divider />
      <Button className={classes.unfollowButton}>Unfollow</Button>
      <Button onClick={onClose} className={classes.cancelButton}>
        Cancel
      </Button>
    </Dialog>
  );
}
function PostCountSection({ user }) {
  const classes = useProfilePageStyles();
  const options = ["posts", "followers", "following"];

  return (
    <>
      <Hidden smUp>
        <Divider />
      </Hidden>
      <section className={classes.followingSection}>
        {options.map((option) => (
          <div key={option} className={classes.followingText}>
            <Typography className={classes.followingCount} component="span">
              {user[option].length}
            </Typography>
            <Hidden xsDown>
              <Typography>{option}</Typography>
            </Hidden>
            <Hidden smUp>
              <Typography color="textSecondary">{option}</Typography>
            </Hidden>
          </div>
        ))}
      </section>
      <Hidden smUp>
        <Divider />
      </Hidden>
    </>
  );
}
function NameBioSection({ user }) {
  const classes = useProfilePageStyles();

  return (
    <section className={classes.section}>
      <Typography className={classes.typography}>{user.name}</Typography>
      <Typography>{user.bio}</Typography>
      <a href={user.website} target="_blank" rel="noopener noreferrer">
        <Typography className={classes.typography} color="secondary">
          {user.website}
        </Typography>
      </a>
    </section>
  );
}

function OptionsMenu({ handleClick }) {
  const classes = useProfilePageStyles();
  const [showLogoutMenu, setShowOptionsMenu] = useState(false);
  const { signOut } = useContext(AuthContext);
  const handleShowLogoutMenu = () => {
    setShowOptionsMenu(true);
    setTimeout(() => {
      signOut();
    }, 2000);
  };
  return (
    <Dialog
      open
      classes={{
        scrollPaper: classes.dialogScrollPaper,
        paper: classes.paper,
      }}
      onClose={handleClick}
      TransitionComponent={Zoom}
    >
      {showLogoutMenu ? (
        <DialogTitle className={classes.dialogTitle}>
          Logging out
          <Typography color="textSecondary">
            You need to log back in to continue using Instagram.
          </Typography>
        </DialogTitle>
      ) : (
        <>
          <OptionsItem text="Change Password" />
          <OptionsItem text="Nametag" />
          <OptionsItem text="Authorized Apps" />
          <OptionsItem text="Notifications" />
          <OptionsItem text="Privacy and Security" />
          <OptionsItem text="Log out" handleClick={handleShowLogoutMenu} />
          <OptionsItem text="Cancel" handleClick={handleClick} />
        </>
      )}
    </Dialog>
  );
}

function OptionsItem({ text, handleClick }) {
  return (
    <>
      <Button onClick={handleClick} style={{ padding: "12px 8px" }}>
        {text}
      </Button>
      <Divider />
    </>
  );
}
export default ProfilePage;
