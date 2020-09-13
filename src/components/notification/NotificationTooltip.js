import React from "react";
import { useNavbarStyles } from "../../styles";
import { Typography } from "@material-ui/core";

function NotificationTooltip({ notifications }) {
  const classes = useNavbarStyles();
  function countTotal(type) {
    return notifications.reduce(
      (acc, noti) => (noti.type === type ? acc + 1 : acc),
      0
    );
  }
  const likesCount = countTotal("like");
  const followsCount = countTotal("follow");

  return (
    <div className={classes.tooltipContainer}>
      {likesCount > 0 && (
        <div className={classes.tooltip}>
          <span aria-label="Likes" className={classes.likes} />
          <Typography>{likesCount}</Typography>
        </div>
      )}
      {followsCount > 0 && (
        <div className={classes.tooltip}>
          <span aria-label="Follows" className={classes.followers} />
          <Typography>{followsCount}</Typography>
        </div>
      )}
    </div>
  );
}

export default NotificationTooltip;
