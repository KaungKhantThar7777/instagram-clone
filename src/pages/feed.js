import React, { useState } from "react";
import { useFeedPageStyles } from "../styles";
import Layout from "../components/shared/Layout";
// import { getDefaultPost } from "../data";
import { Hidden } from "@material-ui/core";
import FeedSideSuggestions from "../components/feed/FeedSideSuggestions";
import UserCard from "../components/shared/UserCard";
import LoadingScreen from "../components/shared/LoadingScreen";
import { LoadingLargeIcon } from "../icons";
import FeedPostSkeleton from "../components/feed/FeedPostSkeleton";
import { UserContext } from "../App";
import { useQuery } from "@apollo/react-hooks";
import { GET_FEED } from "../graphql/queries";
import usePageBottom from "../utils/usePageBottom";
const FeedPost = React.lazy(() => import("../components/feed/FeedPost"));

function FeedPage() {
  const classes = useFeedPageStyles();
  const [isEndOfFeed, setIsEndOfFeed] = useState(false);
  const { feedIds, me } = React.useContext(UserContext);
  const variables = {
    feedIds,
    limit: 2,
  };
  const isBottom = usePageBottom();

  const { data, loading, fetchMore } = useQuery(GET_FEED, { variables });

  const handleUpdateQuery = React.useCallback((prev, { fetchMoreResult }) => {
    if (fetchMoreResult.posts.length === 0) {
      setIsEndOfFeed(true);
      return prev;
    }
    return { posts: [...prev.posts, ...fetchMoreResult.posts] };
  }, []);

  React.useEffect(() => {
    if (!isBottom || !data) return;

    const lastTimestamp = data.posts[data.posts.length - 1].created_at;
    const variables = { feedIds, limit: 2, lastTimestamp };

    fetchMore({
      variables,
      updateQuery: handleUpdateQuery,
    });
  }, [data, isBottom, feedIds, fetchMore, handleUpdateQuery]);
  if (loading) return <LoadingScreen />;

  return (
    <Layout>
      <div className={classes.container}>
        {/* feed posts */}
        <div>
          {data.posts.map((post, index) => (
            <React.Suspense key={post.id} fallback={<FeedPostSkeleton />}>
              <FeedPost key={post.id} post={post} index={index} />
            </React.Suspense>
          ))}
        </div>
        {/* sidebar */}
        <Hidden smDown>
          <div className={classes.sidebarContainer}>
            <div className={classes.sidebarWrapper}>
              <UserCard avatarSize={50} user={me} />
              <FeedSideSuggestions />
            </div>
          </div>
        </Hidden>
        {!isEndOfFeed && <LoadingLargeIcon />}
      </div>
    </Layout>
  );
}

export default FeedPage;
