import React, { useState } from "react";
import { useFollowButtonStyles } from "../../styles";
import { Button } from "@material-ui/core";

function FollowButton({ side }) {
  const classes = useFollowButtonStyles({ side });
  const [isFollowing, setIsFollowing] = useState(false);
  console.log(side);
  const followBtn = (
    <Button
      variant={side ? "text" : "contained"}
      color="primary"
      className={classes.button}
      onClick={() => setIsFollowing(true)}
      fullWidth
    >
      Follow
    </Button>
  );
  const followingBtn = (
    <Button
      variant={side ? "text" : "contained"}
      color="secondary"
      className={classes.button}
      onClick={() => setIsFollowing(false)}
      fullWidth
    >
      Following
    </Button>
  );
  return isFollowing ? followingBtn : followBtn;
}

export default FollowButton;
