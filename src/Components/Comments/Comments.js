import React from "react";

import Comment from "../Comment/Comment";

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
                  marginLeft: "-100px",
                }}
              >
                <Comment
                  uuid={comment.id}
                  name={comment.name}
                  commentSubmitted={props.commentSubmitted}
                  commentCancelled={props.commentCancelled}
                  text={comment.text}
                  distanceToTop={comment.distanceToTop}
                ></Comment>
              </div>
            ))}
        </Grid>
        <Grid item xs={6}>
          {props.comments
            .filter(
              (comment) =>
                comment.dataOffsetKey !== props.commentDataOffsetKey && // highlight clicked on
                comment.text !== "" // comment to be written
            )
            .map((comment) => (
              <div key={comment.id}>
                <Comment
                  uuid={comment.id}
                  name={comment.name}
                  commentSubmitted={props.commentSubmitted}
                  commentCancelled={props.commentCancelled}
                  text={comment.text}
                  distanceToTop={comment.distanceToTop}
                ></Comment>
              </div>
            ))}
        </Grid>
      </Grid>
    </div>
  );
};

export default Comments;
