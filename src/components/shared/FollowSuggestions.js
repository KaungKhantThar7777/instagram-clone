import React from "react";
import { useFollowSuggestionsStyles } from "../../styles";
import { Typography, Link, Avatar } from "@material-ui/core";
import { LoadingLargeIcon } from "../../icons";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// import { getDefaultUser } from "../../data";
import FollowButton from "./FollowButton";
import { useQuery } from "@apollo/react-hooks";
import { UserContext } from "../../App";
import { SUGGEST_USER } from "../../graphql/queries";
function FollowSuggestions({ hiddenHeader }) {
  const classes = useFollowSuggestionsStyles();
  const { followerIds, me } = React.useContext(UserContext);
  const variables = {
    limit: 10,
    followerIds,
    createdAt: me.created_at,
  };
  const { data, loading } = useQuery(SUGGEST_USER, { variables });
  return (
    <div className={classes.container}>
      {!hiddenHeader && (
        <Typography
          variant="subtitle2"
          color="textSecondary"
          className={classes.typography}
        >
          Suggestions For You
        </Typography>
      )}
      {loading ? (
        <LoadingLargeIcon />
      ) : (
        <Slider
          arrows
          className={classes.slide}
          dots={false}
          easing="ease-in-out"
          infinite
          swipeToSlide
          slidesToScroll={3}
          variableWidth
          speed={1000}
          touchThreshold={1000}
        >
          {data.users.map((user) => (
            <FollowSuggestionItem key={user.id} user={user} />
          ))}
        </Slider>
      )}
    </div>
  );
}

function FollowSuggestionItem({ user }) {
  const classes = useFollowSuggestionsStyles();
  const { profile_image, username, name, id } = user;

  return (
    <div>
      <div className={classes.card}>
        <Link to={`/${username}`}>
          <Avatar
            src={profile_image}
            alt={`${username}'s profile`}
            classes={{ root: classes.avatar, img: classes.avatarImg }}
          />
        </Link>
        <Link to={`/${username}`}>
          <Typography
            variant="subtitle1"
            className={classes.text}
            align="center"
          >
            {username}
          </Typography>
        </Link>
        <Typography
          variant="subtitle2"
          color="textSecondary"
          className={classes.text}
          align="center"
        >
          {name}
        </Typography>
        <FollowButton side={false} id={id} />
      </div>
    </div>
  );
}

export default FollowSuggestions;
