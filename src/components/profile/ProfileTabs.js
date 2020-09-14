import { Divider, Hidden, Tab, Tabs, Typography } from "@material-ui/core";
import React, { useState } from "react";
import { GridIcon, SaveIcon } from "../../icons";
import { useProfileTabsStyles } from "../../styles";
import GridPost from "../shared/GridPost";

function ProfileTabs({ user, isOwner }) {
  const classes = useProfileTabsStyles();
  const [value, setValue] = useState(0);

  return (
    <section className={classes.section}>
      <Hidden xsDown>
        <Divider />
      </Hidden>
      <Hidden xsDown>
        <Tabs
          value={value}
          onChange={(_, value) => setValue(value)}
          centered
          classes={{ indicator: classes.tabsIndicator }}
        >
          <Tab
            icon={<span className={classes.postsIconLarge} />}
            label="POSTS"
            classes={{
              root: classes.tabRoot,
              labelIcon: classes.tabLabelIcon,
              wrapper: classes.tabWrapper,
            }}
          ></Tab>
          {isOwner && (
            <Tab
              icon={<span className={classes.savedIconLarge} />}
              label="SAVED"
              classes={{
                root: classes.tabRoot,
                labelIcon: classes.tabLabelIcon,
                wrapper: classes.tabWrapper,
              }}
            ></Tab>
          )}
        </Tabs>
      </Hidden>
      <Hidden smUp>
        <Tabs
          value={value}
          onChange={(_, value) => setValue(value)}
          centered
          className={classes.tabs}
          classes={{ indicator: classes.tabsIndicator }}
        >
          <Tab
            icon={<GridIcon fill={value === 0 ? "#3987f0" : undefined} />}
            classes={{ root: classes.tabRoot }}
          />
          {isOwner && (
            <Tab
              icon={<SaveIcon fill={value === 1 ? "#3987f0" : undefined} />}
              classes={{ root: classes.tabRoot }}
            />
          )}
        </Tabs>
      </Hidden>
      <Hidden smUp>{user.posts.length === 0 && <Divider />}</Hidden>
      {value === 0 && <ProfilePosts isOwner={isOwner} user={user} />}
      {value === 1 && isOwner && <SavePosts user={user} />}
    </section>
  );
}

function ProfilePosts({ isOwner, user }) {
  const classes = useProfileTabsStyles();

  if (user.posts.length === 0) {
    return (
      <section className={classes.profilePostsSection}>
        <div className={classes.noContent}>
          <div className={classes.uploadPhotoIcon} />
          <Typography variant="h4">
            {isOwner ? "Upload a Photo" : "No Photos"}
          </Typography>
        </div>
      </section>
    );
  }

  return (
    <article className={classes.article}>
      <div className={classes.postContainer}>
        {user.posts.map((post, index) => (
          <GridPost key={index} post={post} />
        ))}
      </div>
    </article>
  );
}

function SavePosts({ user }) {
  const classes = useProfileTabsStyles();

  if (user.save_posts.length === 0)
    return (
      <section className={classes.savedPostsSection}>
        <div className={classes.noContent}>
          <div className={classes.savePhotoIcon} />
          <Typography variant="h4">Save</Typography>
          <Typography align="center">
            Save photos and videos that you want to see again.No one is
            notified, and only you can see what you've saved.
          </Typography>
        </div>
      </section>
    );

  return (
    <article className={classes.article}>
      <div className={classes.postContainer}>
        {user.save_posts.map(({ post }) => (
          <GridPost key={post.id} post={post} />
        ))}
      </div>
    </article>
  );
}

export default ProfileTabs;
