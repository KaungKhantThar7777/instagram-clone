import React, { useState, useContext } from "react";
import { useProfilePageStyles } from "../styles";
import Layout from "../components/shared/Layout";
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
import { Link, useParams, useHistory } from "react-router-dom";
import { GearIcon } from "../icons";
import ProfileTabs from "../components/profile/ProfileTabs";
import { AuthContext } from "../auth";
import { useApolloClient, useMutation, useQuery } from "@apollo/react-hooks";
import { GET_USER_PROFILE } from "../graphql/queries";
import LoadingScreen from "../components/shared/LoadingScreen";
import { UserContext } from "../App";
import { FOLLOW_USER, UNFOLLOW_USER } from "../graphql/mutations";

function ProfilePage() {
  const classes = useProfilePageStyles();
  const { username } = useParams();
  const { currentId } = React.useContext(UserContext);
  const variables = { username };
  const [showOptionsMenu, setShowOptionsMenu] = React.useState(false);
  const { data, loading } = useQuery(GET_USER_PROFILE, {
    variables,
    fetchPolicy: "no-cache",
  });
  if (loading) return <LoadingScreen />;

  const [user] = data.users;
  const isOwner = user.id === currentId;

  const handleShowOptionsMenu = () => {
    setShowOptionsMenu((prev) => !prev);
  };
  return (
    <Layout title={`${user.name} (@${user.username})`}>
      <div className={classes.container}>
        <Hidden xsDown>
          <Card className={classes.cardLarge}>
            <ProfilePicture isOwner={isOwner} image={user.profile_image} />
            <CardContent className={classes.cardContentLarge}>
              <ProfileNameSection
                isOwner={isOwner}
                user={user}
                handleMenu={handleShowOptionsMenu}
              />
              <PostCountSection user={user} />
              <NameBioSection user={user} />
            </CardContent>
          </Card>
        </Hidden>
        <Hidden smUp>
          <Card className={classes.cardSmall}>
            <CardContent>
              <section className={classes.sectionSmall}>
                <ProfilePicture
                  isOwner={isOwner}
                  size={77}
                  image={user.profile_image}
                />
                <ProfileNameSection
                  isOwner={isOwner}
                  user={user}
                  handleMenu={handleShowOptionsMenu}
                />
              </section>
              <NameBioSection user={user} />
            </CardContent>
            <PostCountSection user={user} />
          </Card>
        </Hidden>
      </div>
      {showOptionsMenu && <OptionsMenu handleClick={handleShowOptionsMenu} />}
      <ProfileTabs isOwner={isOwner} user={user} />
    </Layout>
  );
}

function ProfileNameSection({ user, isOwner, handleMenu }) {
  const classes = useProfilePageStyles();
  const { currentId, followingIds, followerIds } = React.useContext(
    UserContext
  );
  const isAlreadyFollowing = followingIds.some((id) => currentId);
  let FollowBtn;
  const [isFollowing, setIsFollowing] = React.useState(isAlreadyFollowing);
  const isFollower = !isFollowing && followerIds.some((id) => id === currentId);
  const [followUser] = useMutation(FOLLOW_USER);
  const [showUnfollowDialog, setUnfollowDialog] = useState(false);

  const variables = {
    userIdToFollow: user.id,
    currentUserId: currentId,
  };

  const handleFollowUser = () => {
    setIsFollowing(true);
    followUser({ variables });
  };

  const onUnfollowUser = () => {
    setIsFollowing(false);
    setUnfollowDialog(false);
  };

  if (isFollowing) {
    FollowBtn = (
      <Button variant="outlined" onClick={() => setUnfollowDialog(true)}>
        Following
      </Button>
    );
  } else if (isFollower) {
    FollowBtn = (
      <Button onClick={handleFollowUser} variant="contained" color="primary">
        Follow Back
      </Button>
    );
  } else {
    FollowBtn = (
      <Button onClick={handleFollowUser} variant="contained" color="primary">
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
        <UnfollowDialog
          onUnfollowUser={onUnfollowUser}
          user={user}
          onClose={() => setUnfollowDialog(false)}
        />
      )}
    </>
  );
}

function UnfollowDialog({ onClose, user, onUnfollowUser }) {
  const classes = useProfilePageStyles();
  const { currentId } = React.useContext(UserContext);
  const variables = {
    userIdToFollow: user.id,
    currentUserId: currentId,
  };

  const [unfollowUser] = useMutation(UNFOLLOW_USER);

  const handleUnfollowUser = () => {
    unfollowUser({ variables });
    onUnfollowUser();
  };
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
      <Button onClick={handleUnfollowUser} className={classes.unfollowButton}>
        Unfollow
      </Button>
      <Button onClick={onClose} className={classes.cancelButton}>
        Cancel
      </Button>
    </Dialog>
  );
}
function PostCountSection({ user }) {
  const classes = useProfilePageStyles();
  const options = ["posts", "followers", "followings"];

  return (
    <>
      <Hidden smUp>
        <Divider />
      </Hidden>
      <section className={classes.followingSection}>
        {options.map((option) => (
          <div key={option} className={classes.followingText}>
            <Typography className={classes.followingCount} component="span">
              {user[`${option}_aggregate`]?.aggregate?.count}
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
  const history = useHistory();
  const client = useApolloClient();

  const handleShowLogoutMenu = async () => {
    setShowOptionsMenu(true);

    setTimeout(async () => {
      await client.clearStore();
      signOut();
      history.push("/accounts/login");
      window.location.reload();
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
