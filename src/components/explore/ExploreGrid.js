import React from "react";
import { useExploreGridStyles } from "../../styles";
import { Typography } from "@material-ui/core";
// import { getDefaultPost } from "../../data";
import GridPost from "../shared/GridPost";
import { UserContext } from "../../App";
import { useQuery } from "@apollo/react-hooks";
import { EXPLORE_POSTS } from "../../graphql/queries";
import { LoadingLargeIcon } from "../../icons";

function ExploreGrid() {
  const classes = useExploreGridStyles();
  const { followingIds } = React.useContext(UserContext);
  const variables = { followingIds };
  const { data, loading } = useQuery(EXPLORE_POSTS, { variables });
  if (loading) return <LoadingLargeIcon />;
  return (
    <article className={classes.article}>
      <Typography
        color="textSecondary"
        variant="subtitle2"
        component="h2"
        className={classes.typography}
      >
        Explore
      </Typography>
      <div className={classes.postContainer}>
        {data.posts.map((post) => (
          <GridPost key={post.id} post={post} />
        ))}
      </div>
    </article>
  );
}

export default ExploreGrid;
