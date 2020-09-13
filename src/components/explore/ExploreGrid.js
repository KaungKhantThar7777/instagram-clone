import React from "react";
import { useExploreGridStyles } from "../../styles";
import { Typography } from "@material-ui/core";
import { getDefaultPost } from "../../data";
import GridPost from "../shared/GridPost";

function ExploreGrid() {
  const classes = useExploreGridStyles();

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
        {/* {Array.from({ length: 20 }, () => getDefaultPost()).map((post) => (
          <GridPost key={post.id} post={post} />
        ))} */}
      </div>
    </article>
  );
}

export default ExploreGrid;
