import React from "react";
import { useMorePostsFromUserStyles } from "../../styles";
import { Typography } from "@material-ui/core";
// import { getDefaultPost, defaultUser } from "../../data";
import GridPost from "../shared/GridPost";
import { Link } from "react-router-dom";
import { useLazyQuery, useQuery } from "@apollo/react-hooks";
import { GET_POST, MORE_POST_FROM_USER } from "../../graphql/queries";
import { LoadingLargeIcon } from "../../icons";

function ExploreGrid({ postId }) {
  const classes = useMorePostsFromUserStyles();
  const variables = { postId };
  const { data, loading } = useQuery(GET_POST, { variables });
  const [
    getMorePostsFromUser,
    { data: morePosts, loading: loading2 },
  ] = useLazyQuery(MORE_POST_FROM_USER);

  React.useEffect(() => {
    if (loading) return;
    const postId = data.posts_by_pk.id;
    const userId = data.posts_by_pk.user.id;
    const variables = { userId, postId };
    getMorePostsFromUser({ variables });
  }, [data, loading, getMorePostsFromUser]);

  return (
    <div className={classes.container}>
      {loading || loading2 ? (
        <LoadingLargeIcon />
      ) : (
        <>
          <Typography
            color="textSecondary"
            variant="subtitle1"
            component="h2"
            className={classes.typography}
          >
            More Posts from{" "}
            <Link
              to={`/${data.posts_by_pk.user.username}`}
              className={classes.link}
            >
              @{data.posts_by_pk.user.username}
            </Link>
          </Typography>
          <article className={classes.article}>
            <div className={classes.postContainer}>
              {morePosts?.posts.map((post) => (
                <GridPost key={post.id} post={post} />
              ))}
            </div>
          </article>
        </>
      )}
    </div>
  );
}

export default ExploreGrid;
