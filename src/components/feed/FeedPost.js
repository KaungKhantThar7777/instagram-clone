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
import {
  Typography,
  Button,
  Hidden,
  Divider,
  TextField,
} from "@material-ui/core";
import HTMLEllipsis from "react-lines-ellipsis/lib/html";
import UserCard from "../shared/UserCard";
import FollowSuggestions from "../shared/FollowSuggestions";
import OptionsDialog from "../shared/OptionsDialog";

function FeedPost({ post, index }) {
  const classes = useFeedPostStyles();
  const { media, id, likes, user, caption, comments } = post;
  const [showCaption, setShowCaption] = useState(false);
  const [showModel, setShowModel] = useState(false);

  const showSuggestions = index === 1;

  return (
    <>
      <article
        className={classes.article}
        style={{ marginBottom: showSuggestions && 30 }}
      >
        {/* Post Header */}
        <div className={classes.postHeader}>
          <UserCard user={user} />
          <MoreIcon
            className={classes.moreIcon}
            onClick={() => setShowModel(true)}
          />
        </div>
        {/* Post Image */}
        <div>
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
            <span>{likes === 1 ? "1 Like" : `${likes} Likes`}</span>
          </Typography>
          <div className={showCaption ? classes.expanded : classes.collapsed}>
            <Link to={`/${user.username}`}>
              <Typography
                variant="subtitle2"
                component="span"
                className={classes.username}
              >
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
                <HTMLEllipsis
                  unsafeHTML={caption}
                  maxLine={0}
                  ellipsis="..."
                  basedOn="letters"
                />
                <Button
                  className={classes.moreButton}
                  onClick={() => setShowCaption(true)}
                >
                  more
                </Button>
              </div>
            )}
          </div>
          <Link to={`/p/${id}`}>
            <Typography
              variant="body2"
              component="div"
              className={classes.commentsLink}
            >
              View all {comments.length} comments
            </Typography>
          </Link>
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
          <Typography color="textSecondary" className={classes.datePosted}>
            5 DAYS AGO
          </Typography>
        </div>

        <Hidden xsDown>
          <Divider />
          <Comment />
        </Hidden>
      </article>
      {showSuggestions && <FollowSuggestions />}
      {showModel && <OptionsDialog onClose={() => setShowModel(false)} />}
    </>
  );
}
function LikeButton() {
  const classes = useFeedPostStyles();
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
  const classes = useFeedPostStyles();
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
  const classes = useFeedPostStyles();
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
export default FeedPost;
