import React, { useState } from "react";
import { useFeedPageStyles } from "../styles";
import Layout from "../components/shared/Layout";
import { getDefaultPost } from "../data";
import { Hidden } from "@material-ui/core";
import FeedSideSuggestions from "../components/feed/FeedSideSuggestions";
import UserCard from "../components/shared/UserCard";
import LoadingScreen from "../components/shared/LoadingScreen";
import { LoadingLargeIcon } from "../icons";
import FeedPostSkeleton from "../components/feed/FeedPostSkeleton";
const FeedPost = React.lazy(() => import("../components/feed/FeedPost"));

function FeedPage() {
  const classes = useFeedPageStyles();
  const [isEndOfFeed] = useState(false);
  let loading = false;
  if (loading) return <LoadingScreen />;
  return (
    <Layout>
      <div className={classes.container}>
        {/* feed posts */}
        <div>
          {Array.from({ length: 5 }, () => getDefaultPost()).map(
            (post, index) => (
              <React.Suspense key={post.id} fallback={<FeedPostSkeleton />}>
                <FeedPost key={post.id} post={post} index={index} />
              </React.Suspense>
            )
          )}
        </div>
        {/* sidebar */}
        <Hidden smDown>
          <div className={classes.sidebarContainer}>
            <div className={classes.sidebarWrapper}>
              <UserCard avatarSize={50} />
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
