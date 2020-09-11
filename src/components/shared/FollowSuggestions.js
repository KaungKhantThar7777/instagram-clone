import React from "react";
import { useFollowSuggestionsStyles } from "../../styles";
import { Typography, Link, Avatar } from "@material-ui/core";
import { LoadingLargeIcon } from "../../icons";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { getDefaultUser } from "../../data";
import FollowButton from "./FollowButton";
function FollowSuggestions({ hiddenHeader, slideToShow = 3 }) {
  const classes = useFollowSuggestionsStyles();
  let loading = false;

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
          className={classes.slide}
          dots={false}
          easing="ease-in-out"
          infinite
          swipeToSlide
          slidesToScroll={3}
          slidesToShow={slideToShow}
          speed={1000}
          touchThreshold={1000}
        >
          {Array.from({ length: 10 }, () => getDefaultUser()).map((user) => (
            <FollowSuggestionItem key={user.id} user={user} />
          ))}
        </Slider>
      )}
    </div>
  );
}

function FollowSuggestionItem({ user }) {
  const classes = useFollowSuggestionsStyles();
  const { profile_image, username } = user;

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
          Follows you
        </Typography>
        <FollowButton side={false} />
      </div>
    </div>
  );
}

export default FollowSuggestions;
