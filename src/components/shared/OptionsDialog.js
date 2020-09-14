import React from "react";
import { useOptionsDialogStyles } from "../../styles";
import { Dialog, Zoom, Button, Divider } from "@material-ui/core";
import { Link, useHistory } from "react-router-dom";
// import { defaultPost } from "../../data";
import { UserContext } from "../../App";
import { useMutation } from "@apollo/react-hooks";
import { DELETE_POST, UNFOLLOW_USER } from "../../graphql/mutations";

function OptionsDialog({ onClose, postId, authorId }) {
  const history = useHistory();
  const classes = useOptionsDialogStyles();
  const { currentId, followingIds } = React.useContext(UserContext);
  const [unfollowUser] = useMutation(UNFOLLOW_USER);
  const [deletePost] = useMutation(DELETE_POST);
  const isOwner = authorId === currentId;
  const onClick = isOwner ? handleDeletePost : handleUnfollowUser;

  function handleDeletePost() {
    const variables = {
      postId,
      userId: currentId,
    };
    deletePost({ variables });
    onClose();
    history.push("/");
    window.location.reload();
  }

  function handleUnfollowUser() {
    const variables = {
      userIdToFollow: authorId,
      currentUserId: currentId,
    };
    unfollowUser({ variables });
    onClose();
  }

  const buttonText = isOwner ? "Delete" : "Unfollow";
  const isFollowing = followingIds.some((id) => id === authorId);
  const isUnrelatedUser = !isOwner && !isFollowing;
  return (
    <Dialog
      open
      classes={{ scrollPaper: classes.dialogScrollPaper }}
      onClose={onClose}
      TransitionComponent={Zoom}
    >
      {!isUnrelatedUser && (
        <Button onClick={onClick} className={classes.redButton}>
          {buttonText}
        </Button>
      )}
      <Divider />
      <Button className={classes.button}>
        <Link to={`/p/${postId}`}>Go to post</Link>
      </Button>
      <Divider />
      <Button className={classes.button}>Share</Button>
      <Divider />
      <Button className={classes.button}>Copy Link</Button>
      <Divider />
      <Button className={classes.button}>Embed</Button>
      <Divider />
      <Button className={classes.button} onClick={onClose}>
        Cancel
      </Button>
      <Divider />
    </Dialog>
  );
}

export default OptionsDialog;
