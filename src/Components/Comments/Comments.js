import React from "react";

import Comment from "../Comment/Comment";

const Comments = (props) => {
  return (
    <div>
      {props.comments.map((comment) => (
        <div
          key={comment.id}
          style={{
            position: "absolute",
            top: comment.distanceToTop + "px",
          }}
        >
          <Comment
            uuid={comment.id}
            name={name}
            commentSubmittedCallback={props.commentSubmittedCallback}
            commentCancelledCallback={props.commentCancelledCallback}
            text={comment.text}
          ></Comment>
        </div>
      ))}
    </div>
  );
};

export default Comments;
