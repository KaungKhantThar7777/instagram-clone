import React from "react";
import Modal from "react-modal";
import { usePostModalStyles } from "../../styles";
import { useHistory, useParams } from "react-router-dom";
import Post from "./Post";
import { CloseIcon } from "../../icons";

function PostModal() {
  const classes = usePostModalStyles();
  const history = useHistory();
  const { postId } = useParams();

  return (
    <>
      <Modal
        isOpen
        ariaHideApp={false}
        onRequestClose={() => history.goBack()}
        overlayClassName={classes.overlay}
        style={{
          content: {
            maxWidth: 1200,
            width: "100%",
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            transform: "translate(-50%,-50%)",
            margin: 0,
            padding: 0,
            overflow: "hidden",
            WebkitOverflowScrolling: "touch",
          },
        }}
      >
        <Post id={postId} />
      </Modal>
      <div onClick={() => history.goBack()} className={classes.close}>
        <CloseIcon />
      </div>
    </>
  );
}

export default PostModal;
