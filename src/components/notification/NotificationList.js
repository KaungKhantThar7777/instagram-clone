import React from "react";
import { useNotificationListStyles } from "../../styles";
// import { defaultNotifications } from "../../data";
import { Avatar, Typography, Grid } from "@material-ui/core";
import { Link } from "react-router-dom";
import FollowButton from "../shared/FollowButton";
import useOutsideClick from "@rooks/use-outside-click";
import { useMutation } from "@apollo/react-hooks";
import { CHECK_NOTIFICATIONS } from "../../graphql/mutations";
import { formatDateToNowShort } from "../../utils/formatDate";

function NotificationList({ handleCloseList, notifications, currentId }) {
  console.log({ notifications });
  const listContainerRef = React.useRef();
  const classes = useNotificationListStyles();
  const [checkNotifications] = useMutation(CHECK_NOTIFICATIONS);
  useOutsideClick(listContainerRef, handleCloseList);

  React.useEffect(() => {
    const variables = {
      userId: currentId,
      lastChecked: new Date().toISOString(),
    };
    checkNotifications({ variables });
  }, [checkNotifications, currentId]);
  return (
    <Grid ref={listContainerRef} className={classes.listContainer} container>
      {notifications.map((notification) => {
        const isLike = notification.type === "like";
        const isFollow = notification.type === "follow";
        return (
          <Grid key={notification.id} className={classes.listItem} item>
            <div className={classes.listItemWrapper}>
              <div className={classes.avatarWrapper}>
                <Avatar src={notification.user.profile_image} alt="User avatar" />
              </div>
              <div className={classes.nameWrapper}>
                <Typography variant="body1">{notification.user.username}</Typography>
                <Typography variant="body2" color="textSecondary" className={classes.typography}>
                  {isLike && `likes your photo. ${formatDateToNowShort(notification.created_at)}`}
                  {isFollow &&
                    `started following you. ${formatDateToNowShort(notification.created_at)}`}
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
