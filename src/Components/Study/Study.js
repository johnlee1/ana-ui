import React, { useState, useEffect, useCallback } from "react";
import { EditorState, ContentState, RichUtils, convertFromRaw } from "draft-js";
import io from "socket.io-client";

import Comments from "../Comments/Comments";
import HeaderBar from "../HeaderBar/HeaderBar";
import MyEditor from "../Editor/Editor";

import BibleText from "../../Text";

import Grid from "@material-ui/core/Grid";

let socket;

const Study = (props) => {
  const endpoint = "http://127.0.0.1:4001";
  const [comments, setComments] = useState([]);
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [editorState, setEditorState] = useState(
    EditorState.createWithContent(
      ContentState.createFromText(BibleText.isaiah6)
    )
  );

  useEffect(() => {
    const { name, room } = props.location.state;
    setName(name);
    setRoom(room);

    socket = io(endpoint);
    socket.emit("join", { name, room });
    socket.on("NewData", (data) => {
      if (data.editor) {
        setEditorState(
          EditorState.createWithContent(convertFromRaw(data.editor))
        );
      }
      if (data.comments) {
        setComments(data.comments);
      }
    });

    return () => {
      socket.emit("disconnect");
      socket.off();
    };
  }, [endpoint, props.location.state]);

  const sendDataOverSocket = (dataName, data) => {
    data.room = room;
    socket.emit(dataName, data);
  };

  const addComment = (comment) => {
    setComments((comments) => [...comments, comment]);
  };

  const commentSubmittedCallback = useCallback((uuid, text) => {
    let newComments = [...comments];
    let comment = newComments.find((comment) => comment.id === uuid);
    comment.text = text;
    setComments(newComments);

    const outgoingData = {
      comments: comments,
    };
    sendDataOverSocket("data", outgoingData);
  });

  const commentCancelledCallback = useCallback((uuid) => {
    let newComments = [...comments];
    newComments = newComments.filter((comment) => comment.id !== uuid);
    setComments(newComments);

    // remove comment highlight
    setEditorState(RichUtils.toggleInlineStyle(editorState, "HIGHLIGHT"));
  });

  return (
    <div>
      <HeaderBar room={room}></HeaderBar>
      <Grid container spacing={3}>
        <Grid item xs={1}></Grid>
        <Grid item xs={7}>
          <MyEditor
            name={name}
            room={room}
            editorState={editorState}
            setEditorState={setEditorState}
            sendDataOverSocket={sendDataOverSocket}
            addComment={addComment}
          />
        </Grid>
        <Grid item xs={3}>
          <Comments
            comments={comments}
            commentSubmittedCallback={commentSubmittedCallback}
            commentCancelledCallback={commentCancelledCallback}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default Study;
