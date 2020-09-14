import React, { useState } from "react";
import { useFollowButtonStyles } from "../../styles";
import { Button } from "@material-ui/core";
import { UserContext } from "../../App";
import { useMutation } from "@apollo/react-hooks";
import { FOLLOW_USER, UNFOLLOW_USER } from "../../graphql/mutations";

function FollowButton({ side, id }) {
  const classes = useFollowButtonStyles({ side });
  const { followingIds, currentId } = React.useContext(UserContext);
  const isAlreadyFollowing = followingIds.some(
    (followingId) => followingId === id
  );
  const [isFollowing, setIsFollowing] = useState(isAlreadyFollowing);
  const [followUser] = useMutation(FOLLOW_USER);
  const [unfollowUser] = useMutation(UNFOLLOW_USER);

  const variables = {
    userIdToFollow: id,
    currentUserId: currentId,
  };

  const handleFollowUser = () => {
    setIsFollowing(true);
    followUser({ variables });
  };

  const handleUnfollowUser = () => {
    setIsFollowing(false);
    unfollowUser({ variables });
  };
  const followBtn = (
    <Button
      variant={side ? "text" : "contained"}
      color="primary"
      className={classes.button}
      onClick={handleFollowUser}
      fullWidth
    >
      Follow
    </Button>
  );
  const followingBtn = (
    <Button
      variant={side ? "text" : "outlined"}
      color="secondary"
      className={classes.button}
      onClick={handleUnfollowUser}
      fullWidth
    >
      Following
    </Button>
  );
  return isFollowing ? followingBtn : followBtn;
}

export default FollowButton;
