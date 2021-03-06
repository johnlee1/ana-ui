import React, { useState, useEffect } from "react";
import {
  EditorState,
  ContentState,
  RichUtils,
  convertToRaw,
  convertFromRaw,
} from "draft-js";
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
  //   const endpoint = "http://localhost:4001";
  const [commentReady, setCommentReady] = useState(false); // this is for knowing when a comment is ready to be typed in a comment box
  const [comments, setComments] = useState([]);
  const [commentDataOffsetKey, setCommentDataOffsetKey] = useState("");
  const [currentComment, setCurrentComment] = useState("");
  const [currentDraftSelection, setCurrentDraftSelection] = useState("");
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [users, setUsers] = useState([]);
  const [dataOffsetKeys, setDataOffsetKeys] = useState([]);
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
      if (data.dataOffsetKeys) {
        setDataOffsetKeys(data.dataOffsetKeys);
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

  // only called when click on highlight button
  const addComment = (comment) => {
    setCurrentComment(comment);
    setComments([...comments, comment]);
  };

  const commentSubmitted = (uuid, text) => {
    const newEditorState = RichUtils.toggleInlineStyle(
      editorState,
      "HIGHLIGHT"
    );
    setEditorState(newEditorState);

    let newComments = [...comments];
    let comment = newComments.find((comment) => comment.id === uuid);
    comment.text = text;
    setComments(newComments);

    const outgoingData = {
      comments: comments,
      dataOffsetKeys: dataOffsetKeys,
      editor: convertToRaw(newEditorState.getCurrentContent()),
    };
    sendDataOverSocket("data", outgoingData);
    setCurrentComment("");
    setCommentReady(false);
  };

  const commentCancelled = (uuid) => {
    let newComments = [...comments];
    newComments = newComments.filter((comment) => comment.id !== uuid);
    setComments(newComments);

    const newEditorState = EditorState.forceSelection(
      editorState,
      currentDraftSelection
    );

    setEditorState(RichUtils.toggleInlineStyle(newEditorState, "TEMP")); // remove comment highlight
    setCommentReady(false);
  };

  //   returns true if Study.js decides that nothing should be done on editor change
  const editorChange = () => {
    if (currentComment !== "" && commentReady) {
      commentCancelled(currentComment.id);
      return true;
    }
    return false;
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
            dataOffsetKeys={dataOffsetKeys}
            setDataOffsetKeys={setDataOffsetKeys}
            editorChange={editorChange}
          />
        </Grid>
        <Grid item xs={5}>
          <Comments
            editorState={editorState}
            commentDataOffsetKey={commentDataOffsetKey}
            setCommentDataOffsetKey={setCommentDataOffsetKey}
            comments={comments}
            commentSubmitted={commentSubmitted}
            commentCancelled={commentCancelled}
            setCurrentDraftSelection={setCurrentDraftSelection}
            setCommentReady={setCommentReady}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default Study;
