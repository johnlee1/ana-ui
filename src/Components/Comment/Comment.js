import React, { useState } from "react";

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

  const submitComment = () => {
    setCommentSubmitted(true);
    props.commentSubmittedCallback(props.uuid, comment);
  };
  const cancelComment = () => {
    props.commentCancelledCallback(props.uuid);
  };

  const useStyles = makeStyles({
    root: {
      minWidth: 275,
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
                  multiline
                  rowsMax={20}
                  size="small"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  variant="outlined"
                />
              </FormControl>
              <Button
                variant="contained"
                color="primary"
                size="small"
                disableElevation
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
