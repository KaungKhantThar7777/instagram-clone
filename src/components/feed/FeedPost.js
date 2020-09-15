import React, { useState } from "react";
import { useFeedPostStyles } from "../../styles";
import {
  MoreIcon,
  CommentIcon,
  ShareIcon,
  UnlikeIcon,
  LikeIcon,
  RemoveIcon,
  SaveIcon,
} from "../../icons";
import { Link } from "react-router-dom";
import { Typography, Button, Hidden, Divider, TextField } from "@material-ui/core";
import HTMLEllipsis from "react-lines-ellipsis/lib/html";
import UserCard from "../shared/UserCard";
import FollowSuggestions from "../shared/FollowSuggestions";
import OptionsDialog from "../shared/OptionsDialog";
import { formatDateToNow } from "../../utils/formatDate";
import Img from "react-graceful-image";
import {
  LIKE_POST,
  UNLIKE_POST,
  UNSAVE_POST,
  SAVE_POST,
  CREATE_COMMENT,
} from "../../graphql/mutations";
import { UserContext } from "../../App";
import { useMutation } from "@apollo/react-hooks";
import { GET_FEED } from "../../graphql/queries";

function FeedPost({ post, index }) {
  const classes = useFeedPostStyles();

  const {
    media,
    id,
    user,
    likes,
    caption,
    likes_aggregate,
    save_posts,
    comments,
    comments_aggregate,
    location,
    created_at,
  } = post;

  const [showCaption, setShowCaption] = useState(false);
  const [showModel, setShowModel] = useState(false);
  const likesCount = likes_aggregate.aggregate.count;
  const commentsCount = comments_aggregate.aggregate.count;
  const showSuggestions = index === 1;

  return (
    <>
      <article className={classes.article} style={{ marginBottom: showSuggestions && 30 }}>
        {/* Post Header */}
        <div className={classes.postHeader}>
          <UserCard user={user} location={location} />
          <MoreIcon className={classes.moreIcon} onClick={() => setShowModel(true)} />
        </div>
        {/* Post Image */}
        <div>
          <Img src={media} alt="Profile" className={classes.image} />
        </div>
        {/* Post Buttons */}
        <div className={classes.postButtonsWrapper}>
          <div className={classes.postButtons}>
            <LikeButton likes={likes} postId={id} authorId={user.id} />
            <Link to={`/p/${id}`}>
              <CommentIcon />
            </Link>
            <ShareIcon />
            <SaveButton savePosts={save_posts} postId={id} />
          </div>

          <Typography className={classes.likes}>
            <span>{likesCount === 1 ? "1 Like" : `${likesCount} Likes`}</span>
          </Typography>
          <div className={showCaption ? classes.expanded : classes.collapsed}>
            <Link to={`/${user.username}`}>
              <Typography variant="subtitle2" component="span" className={classes.username}>
                {user.username}
              </Typography>
            </Link>
            {showCaption ? (
              <Typography
                variant="body2"
                component="span"
                dangerouslySetInnerHTML={{ __html: caption }}
              />
            ) : (
              <div className={classes.captionWrapper}>
                <HTMLEllipsis unsafeHTML={caption} maxLine={0} ellipsis="..." basedOn="letters" />
                <Button className={classes.moreButton} onClick={() => setShowCaption(true)}>
                  more
                </Button>
              </div>
            )}
          </div>
          <Link to={`/p/${id}`}>
            <Typography variant="body2" component="div" className={classes.commentsLink}>
              View all {commentsCount} comments
            </Typography>
          </Link>
          {comments.map((comment) => (
            <div key={comment.id}>
              <Link to={`/${comment.user.username}`}>
                <Typography variant="body2" component="span" className={classes.commentUsername}>
                  {comment.user.username}
                </Typography>{" "}
                <Typography variant="body2" component="span">
                  {comment.content}
                </Typography>
              </Link>
            </div>
          ))}
          <Typography color="textSecondary" className={classes.datePosted}>
            {formatDateToNow(created_at)}
          </Typography>
        </div>

        <Hidden xsDown>
          <Divider />
          <Comment postId={id} />
        </Hidden>
      </article>
      {showSuggestions && <FollowSuggestions />}
      {showModel && (
        <OptionsDialog authorId={user.id} postId={id} onClose={() => setShowModel(false)} />
      )}
    </>
  );
}
function LikeButton({ likes, postId, authorId }) {
  const classes = useFeedPostStyles();
  const { currentId, feedIds } = React.useContext(UserContext);
  const isAlreadyLiked = likes.some((like) => like.user_id === currentId);
  const [liked, setLiked] = useState(isAlreadyLiked);
  const Icon = liked ? UnlikeIcon : LikeIcon;
  const className = liked ? classes.liked : classes.like;
  const [likePost] = useMutation(LIKE_POST);
  const [unlikePost] = useMutation(UNLIKE_POST);
  const variables = {
    postId,
    userId: currentId,
    profileId: authorId,
  };

  function handleUpdate(cache, result) {
    const variables = { limit: 2, feedIds };
    const data = cache.readQuery({
      query: GET_FEED,
      variables,
    });
    const typename = result.data.insert_likes?.__typename;
    const count = typename === "likes_mutation_response" ? 1 : -1;
    const posts = data.posts.map((post) => ({
      ...post,
      likes_aggregate: {
        ...post.likes_aggregate,
        aggregate: {
          ...post.likes_aggregate.aggregate,
          count: post.likes_aggregate.aggregate.count + count,
        },
      },
    }));

    cache.writeQuery({ query: GET_FEED, data: { posts } });
  }
  function handleLike() {
    setLiked(true);
    likePost({ variables, update: handleUpdate });
  }
  function handleUnlike() {
    setLiked(false);
    unlikePost({ variables, update: handleUpdate });
  }
  const onClick = liked ? handleUnlike : handleLike;
  return <Icon className={className} onClick={onClick} />;
}

function SaveButton({ savePosts, postId }) {
  const classes = useFeedPostStyles();
  const { currentId } = React.useContext(UserContext);
  const isAlreadySaved = savePosts.some((post) => post.user_id === currentId);
  const [save, setSave] = useState(isAlreadySaved);
  const Icon = save ? RemoveIcon : SaveIcon;
  const [savePost] = useMutation(SAVE_POST);
  const [unsavePost] = useMutation(UNSAVE_POST);

  const variables = {
    postId,
    userId: currentId,
  };
  function handleSave() {
    setSave(true);
    savePost({ variables });
  }
  function handleUnsave() {
    setSave(false);
    unsavePost({ variables });
  }
  const onClick = save ? handleUnsave : handleSave;
  return <Icon className={classes.saveIcon} onClick={onClick} />;
}

function Comment({ postId }) {
  const classes = useFeedPostStyles();
  const [content, setContent] = useState("");
  const { feedIds } = React.useContext(UserContext);
  const [createComment] = useMutation(CREATE_COMMENT);
  const { currentId } = React.useContext(UserContext);

  function handleUpdate(cache, result) {
    const variables = { limit: 2, feedIds };
    const data = cache.readQuery({
      query: GET_FEED,
      variables,
    });

    const oldComment = result.data.insert_comments.returning[0];
    const newComment = {
      ...oldComment,
      user: { ...oldComment.user },
    };

    const posts = data.posts.map((post) => {
      const newPost = {
        ...post,
        comments: [...post.comments, newComment],
        comments_aggregate: {
          ...post.comments_aggregate,
          aggregate: {
            ...post.comments_aggregate.aggregate,
            count: post.comments_aggregate.aggregate.count + 1,
          },
        },
      };

      return post.id === postId ? newPost : post;
    });

    cache.writeQuery({ query: GET_FEED, data: { posts } });
    setContent("");
  }
  function handleAddComment() {
    const variables = {
      content,
      postId,
      userId: currentId,
    };

    createComment({ variables, update: handleUpdate });
  }
  return (
    <div className={classes.commentContainer}>
      <TextField
        className={classes.textField}
        rowsMax={2}
        rows={1}
        fullWidth
        multiline
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Add a comment..."
        InputProps={{
          classes: {
            root: classes.root,
            underline: classes.underline,
          },
        }}
      />
      <Button
        color="primary"
        className={classes.commentButton}
        disabled={!content.trim()}
        onClick={handleAddComment}
      >
        Post
      </Button>
    </div>
  );
}
export default FeedPost;
