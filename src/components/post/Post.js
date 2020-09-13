import React, { useState } from "react";
import { usePostStyles } from "../../styles";
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
import {
  Typography,
  Button,
  Hidden,
  Divider,
  TextField,
  Avatar,
} from "@material-ui/core";
import UserCard from "../shared/UserCard";
import OptionsDialog from "../shared/OptionsDialog";
// import { defaultPost } from "../../data";
import { PostSkeleton } from "./PostSkeleton";
import { useMutation, useSubscription } from "@apollo/react-hooks";
import { GET_POST } from "../../graphql/subscription";
import { UserContext } from "../../App";
import {
  LIKE_POST,
  UNLIKE_POST,
  UNSAVE_POST,
  SAVE_POST,
  CREATE_COMMENT,
} from "../../graphql/mutations";
import { formatDateToNowShort, formatPostDate } from "../../utils/formatDate";

function Post({ postId }) {
  const classes = usePostStyles();
  const [showModel, setShowModel] = React.useState(false);
  const variables = { postId };
  console.log({ postId });
  const res = useSubscription(GET_POST, { variables });

  const { data, loading, error } = res;
  console.log({ data, loading, error });
  if (loading) return <PostSkeleton />;
  const {
    media,
    id,
    likes,
    save_posts,
    likes_aggregate,
    user,
    caption,
    comments,
    created_at,
    location,
  } = data.posts_by_pk;

  const likesCount = likes_aggregate.aggregate.count;

  return (
    <div className={classes.postContainer}>
      <article className={classes.article}>
        {/* Post Header */}
        <div className={classes.postHeader}>
          <UserCard user={user} avatarSize={32} location={location} />
          <MoreIcon
            className={classes.moreIcon}
            onClick={() => setShowModel(true)}
          />
        </div>
        {/* Post Image */}
        <div className={classes.postImage}>
          <img src={media} alt="Profile" className={classes.image} />
        </div>
        {/* Post Buttons */}
        <div className={classes.postButtonsWrapper}>
          <div className={classes.postButtons}>
            <LikeButton likes={likes} postId={id} authorId={user.id} />
            <Link to={`/p/${id}`}>
              <CommentIcon />
            </Link>
            <ShareIcon />
            <SaveButton savedPosts={save_posts} postId={postId} />
          </div>

          <Typography className={classes.likes}>
            <span>{likesCount === 1 ? "1 like" : `${likesCount} likes`}</span>
          </Typography>

          <div style={{ overflowY: "scroll", height: "100%" }}>
            <AuthorCaption
              user={user}
              createdAt={created_at}
              caption={caption}
            />
            {comments.map((comment) => (
              <UserComment key={comment.id} comment={comment} />
            ))}
          </div>

          <Typography
            color="textSecondary"
            className={classes.datePosted}
            component="span"
          >
            {formatPostDate.created_at}
            <Hidden xsDown>
              <div className={classes.comment}>
                <Divider />
                <Comment postId={id} />
              </div>
            </Hidden>
          </Typography>
        </div>
      </article>

      {showModel && <OptionsDialog onClose={() => setShowModel(false)} />}
    </div>
  );
}

function AuthorCaption({ user, caption, createdAt }) {
  const classes = usePostStyles();
  return (
    <div style={{ display: "flex", padding: 16, paddingBottom: 0 }}>
      <Avatar
        src={user.profile_image}
        alt="User avatar"
        style={{ marginRight: 14, width: 32, height: 32 }}
      />
      <div style={{ display: "flex" }}>
        <Link to={`/${user.username}`}>
          <Typography
            variant="subtitle2"
            component="span"
            className={classes.username}
          >
            {user.username}
          </Typography>
          <Typography
            variant="body2"
            component="span"
            className={classes.postCaption}
            dangerouslySetInnerHTML={{ __html: caption }}
          />
          <Typography variant="caption" color="textSecondary">
            {formatDateToNowShort(createdAt)}
          </Typography>
        </Link>
      </div>
    </div>
  );
}

function UserComment({ comment }) {
  const classes = usePostStyles();
  return (
    <div style={{ display: "flex", padding: 16, paddingTop: 0 }}>
      <Avatar
        src={comment.user.profile_image}
        alt="User avatar"
        style={{ marginRight: 14, width: 32, height: 32 }}
      />
      <div style={{ display: "flex" }}>
        <Link to={`/${comment.user.username}`}>
          <Typography
            variant="subtitle2"
            component="span"
            className={classes.username}
          >
            {comment.user.username}
          </Typography>
          <Typography
            variant="body2"
            component="span"
            className={classes.postCaption}
          >
            {comment.content}
          </Typography>
        </Link>
        <Typography variant="caption" color="textSecondary">
          {formatDateToNowShort(comment.created_at)}
        </Typography>
      </div>
    </div>
  );
}
function LikeButton({ likes, authorId, postId }) {
  const classes = usePostStyles();
  const { currentId } = React.useContext(UserContext);
  const isAlreadyLiked = likes.some((like) => like.user_id === currentId);

  const [liked, setLiked] = useState(isAlreadyLiked);
  const Icon = liked ? UnlikeIcon : LikeIcon;
  const className = liked ? classes.liked : classes.like;
  const [likePost] = useMutation(LIKE_POST);
  const [unlikePost] = useMutation(UNLIKE_POST);

  const variables = {
    userId: currentId,
    postId,
    profileId: authorId,
  };
  function handleLike() {
    setLiked(true);
    likePost({ variables });
  }
  function handleUnlike() {
    setLiked(false);
    unlikePost({ variables });
  }
  const onClick = liked ? handleUnlike : handleLike;
  return <Icon className={className} onClick={onClick} />;
}

function SaveButton({ savedPosts, postId }) {
  const classes = usePostStyles();
  const { currentId } = React.useContext(UserContext);
  const isAlreadySaved = savedPosts.some((post) => post.user_id === currentId);
  const [save, setSave] = useState(isAlreadySaved);
  const Icon = save ? RemoveIcon : SaveIcon;
  const [savePost] = useMutation(SAVE_POST);
  const [unsavePost] = useMutation(UNSAVE_POST);

  const variables = {
    userId: currentId,
    postId,
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
  const classes = usePostStyles();
  const [content, setContent] = useState("");
  const [createComment] = useMutation(CREATE_COMMENT);
  const { currentId } = React.useContext(UserContext);

  const handleAddComment = () => {
    const variables = {
      userId: currentId,
      postId,
      content,
    };
    createComment({ variables });
    setContent("");
  };
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
        onClick={handleAddComment}
        color="primary"
        className={classes.commentButton}
        disabled={!content.trim()}
      >
        Post
      </Button>
    </div>
  );
}
export default Post;
