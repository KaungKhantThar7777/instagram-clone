import React from "react";
import { useNotificationListStyles } from "../../styles";
import { defaultNotifications } from "../../data";
import { Avatar, Typography, Grid } from "@material-ui/core";
import { Link } from "react-router-dom";
import FollowButton from "../shared/FollowButton";
import useOutsideClick from "@rooks/use-outside-click";

function NotificationList({ handleCloseList }) {
  const listContainerRef = React.useRef();
  const classes = useNotificationListStyles();

  useOutsideClick(listContainerRef, handleCloseList);

  return (
    <Grid ref={listContainerRef} className={classes.listContainer} container>
      {defaultNotifications.map((notification) => {
        const isLike = notification.type === "like";
        const isFollow = notification.type === "follow";
        return (
          <Grid className={classes.listItem} item>
            <div className={classes.listItemWrapper}>
              <div className={classes.avatarWrapper}>
                <Avatar
                  src={notification.user.profile_image}
                  alt="User avatar"
                />
              </div>
              <div className={classes.nameWrapper}>
                <Typography variant="body1">
                  {notification.user.username}
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  className={classes.typography}
                >
                  {isLike && "likes your photo. 4d"}
                  {isFollow && "started following you. 5d"}
                </Typography>
              </div>
            </div>
            <div className={classes.buttonWrapper}>
              {isLike && (
                <Link to={`/p/${notification.id}`}>
                  <Avatar src={notification.post.media} alt="post avatar" />
                </Link>
              )}
              {isFollow && <FollowButton />}
            </div>
          </Grid>
        );
      })}
    </Grid>
  );
}

export default NotificationList;
