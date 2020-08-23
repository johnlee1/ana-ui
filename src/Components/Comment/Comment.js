import React, { useState, useEffect, useRef } from "react";

import "./Comment.css";

import { makeStyles } from "@material-ui/core/styles";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

const Comment = (props) => {
  const [comment, setComment] = useState(props.text);
  const [commentSubmitted, setCommentSubmitted] = useState(props.text !== "");
  const textfieldRef = useRef(null);

  useEffect(() => {
    if (!commentSubmitted) {
      setTimeout(function () {
        textfieldRef.current.focus();
      }, 1);
    }
  });

  const submitComment = () => {
    setCommentSubmitted(true);
    props.commentSubmitted(props.uuid, comment);
  };
  const cancelComment = () => {
    props.commentCancelled(props.uuid);
  };

  const onBlur = () => {
    if (!submitComment) cancelComment();
  };

  const useStyles = makeStyles({
    root: {
      minWidth: 50,
    },
    title: {
      color: "rgb(60, 64, 67)",
      fontWeight: 500,
      fontSize: "14px",
      letterSpacing: "0.25px",
      lineHeight: "20px",
    },
  });
  const classes = useStyles();

  return (
    <div>
      <Card className={classes.root} variant="outlined">
        <CardContent>
          <Typography className={classes.title}>{props.name}</Typography>
          {commentSubmitted ? (
            <div>{comment}</div>
          ) : (
            <div>
              <FormControl fullWidth>
                <TextField
                  id="outlined-multiline-flexible"
                  label="Comment"
                  rowsMax={20}
                  size="small"
                  multiline
                  value={comment}
                  inputRef={textfieldRef}
                  onChange={(e) => setComment(e.target.value)}
                  variant="outlined"
                  onBlur={onBlur}
                />
              </FormControl>
              <Button
                variant="contained"
                color="primary"
                size="small"
                disableElevation
                disabled={comment.length < 1}
                onClick={(e) => {
                  e.preventDefault();
                  submitComment();
                }}
              >
                Comment
              </Button>
              <Button
                variant="outlined"
                color="primary"
                size="small"
                disableElevation
                onClick={(e) => {
                  e.preventDefault();
                  cancelComment();
                }}
              >
                Cancel
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Comment;