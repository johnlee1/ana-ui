import React from "react";

import Comment from "../Comment/Comment";

import "./Comments.css";

import Grid from "@material-ui/core/Grid";

const Comments = (props) => {
  return (
    <div>
      <Grid container>
        <Grid item xs={6}>
          {props.comments
            .filter((comment) => {
              return (
                comment.dataOffsetKey === props.commentDataOffsetKey || // highlight clicked on
                comment.text === "" // comment to be written
              );
            })
            .map((comment) => (
              <div
                key={comment.id}
                style={{
                  position: "absolute",
                  top: comment.distanceToTop + "px",
                  width: "20vw",
                  marginLeft: "-10px",
                }}
              >
                <Comment
                  uuid={comment.id}
                  name={comment.name}
                  commentSubmitted={props.commentSubmitted}
                  commentCancelled={props.commentCancelled}
                  text={comment.text}
                ></Comment>
              </div>
            ))}
        </Grid>
        <Grid item xs={6}>
          {props.comments
            .filter(
              (comment) =>
                comment.dataOffsetKey !== props.commentDataOffsetKey && // highlight not clicked on
                comment.text !== "" // comment is written
            )
            .map((comment) => (
              <div key={comment.id} className="comments">
                <Comment
                  uuid={comment.id}
                  name={comment.name}
                  commentSubmitted={props.commentSubmitted}
                  commentCancelled={props.commentCancelled}
                  text={comment.text}
                ></Comment>
              </div>
            ))}
        </Grid>
      </Grid>
    </div>
  );
};

export default Comments;
