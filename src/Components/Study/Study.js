import React, { useState, useEffect } from "react";
import { EditorState, ContentState, RichUtils, convertFromRaw } from "draft-js";
import io from "socket.io-client";

import Comments from "../Comments/Comments";
import HeaderBar from "../HeaderBar/HeaderBar";
import MyEditor from "../Editor/Editor";

import BibleText from "../../Text";

import "./Study.css";

import Grid from "@material-ui/core/Grid";

let socket;

const Study = (props) => {
  const endpoint =
    "http://anaapi-env.eba-5hhwjjyg.us-east-2.elasticbeanstalk.com/";
  const [comments, setComments] = useState([]);
  const [commentDataOffsetKey, setCommentDataOffsetKey] = useState("");
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [users, setUsers] = useState([]);
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
    socket.on("RoomData", (data) => {
      const { users } = data;
      setUsers(users);
    });

    return () => {
      socket.emit("disconnect", { room });
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

  const commentSubmitted = (uuid, text) => {
    let newComments = [...comments];
    let comment = newComments.find((comment) => comment.id === uuid);
    comment.text = text;
    setComments(newComments);

    const outgoingData = {
      comments: comments,
    };
    sendDataOverSocket("data", outgoingData);
  };

  const commentCancelled = (uuid) => {
    let newComments = [...comments];
    newComments = newComments.filter((comment) => comment.id !== uuid);
    setComments(newComments);

    // remove comment highlight
    setEditorState(RichUtils.toggleInlineStyle(editorState, "HIGHLIGHT"));
  };

  return (
    <div className="study">
      <HeaderBar room={room} users={users}></HeaderBar>
      <Grid container spacing={0}>
        <Grid item xs={7}>
          <MyEditor
            name={name}
            room={room}
            editorState={editorState}
            setEditorState={setEditorState}
            sendDataOverSocket={sendDataOverSocket}
            addComment={addComment}
            setCommentDataOffsetKey={setCommentDataOffsetKey}
          />
        </Grid>
        <Grid item xs={5}>
          <Comments
            commentDataOffsetKey={commentDataOffsetKey}
            setCommentDataOffsetKey={setCommentDataOffsetKey}
            comments={comments}
            commentSubmitted={commentSubmitted}
            commentCancelled={commentCancelled}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default Study;
