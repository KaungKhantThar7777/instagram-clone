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
} from "@material-ui/core";
import UserCard from "../shared/UserCard";
import OptionsDialog from "../shared/OptionsDialog";
import { defaultPost } from "../../data";
import { PostSkeleton } from "./PostSkeleton";

function Post() {
  const classes = usePostStyles();
  const { media, id, likes, user, caption, comments } = defaultPost;
  const [showModel, setShowModel] = useState(false);
  const [loading, setLoading] = useState(true);
  setTimeout(() => setLoading(false), 3000);
  if (loading) return <PostSkeleton />;

  return (
    <div className={classes.postContainer}>
      <article className={classes.article}>
        {/* Post Header */}
        <div className={classes.postHeader}>
          <UserCard user={user} avatarSize={32} />
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
            <LikeButton />
            <Link to={`/p/${id}`}>
              <CommentIcon />
            </Link>
            <ShareIcon />
            <SaveButton />
          </div>

          <Typography className={classes.likes}>
            <span>{likes === 1 ? "1 like" : `${likes} likes`}</span>
          </Typography>
          <div className={classes.postCaptionContainer}>
            <Typography
              variant="body2"
              component="span"
              className={classes.postCaption}
              dangerouslySetInnerHTML={{ __html: caption }}
            />

            {comments.map((comment) => (
              <div key={comment.id}>
                <Link to={`/${comment.user.username}`}>
                  <Typography
                    variant="body2"
                    component="span"
                    className={classes.commentUsername}
                  >
                    {comment.user.username}
                  </Typography>{" "}
                  <Typography variant="body2" component="span">
                    {comment.content}
                  </Typography>
                </Link>
              </div>
            ))}
          </div>

          <Typography
            color="textSecondary"
            className={classes.datePosted}
            component="span"
          >
            5 DAYS AGO
            <Hidden xsDown>
              <div className={classes.comment}>
                <Divider />
                <Comment />
              </div>
            </Hidden>
          </Typography>
        </div>
      </article>

      {showModel && <OptionsDialog onClose={() => setShowModel(false)} />}
    </div>
  );
}
function LikeButton() {
  const classes = usePostStyles();
  const [liked, setLiked] = useState(false);
  const Icon = liked ? UnlikeIcon : LikeIcon;
  const className = liked ? classes.liked : classes.like;

  function handleLike() {
    setLiked(true);
  }
  function handleUnlike() {
    setLiked(false);
  }
  const onClick = liked ? handleUnlike : handleLike;
  return <Icon className={className} onClick={onClick} />;
}

function SaveButton() {
  const classes = usePostStyles();
  const [save, setSave] = useState(false);
  const Icon = save ? RemoveIcon : SaveIcon;

  function handleSave() {
    setSave(true);
  }
  function handleUnsave() {
    setSave(false);
  }
  const onClick = save ? handleUnsave : handleSave;
  return <Icon className={classes.saveIcon} onClick={onClick} />;
}

function Comment() {
  const classes = usePostStyles();
  const [content, setContent] = useState("");
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
      >
        Post
      </Button>
    </div>
  );
}
export default Post;
