import React, { useState, useEffect } from "react";
// import ReactDOM from "react-dom";
import { Editor, EditorState, ContentState, RichUtils } from "draft-js";
// import { socketIOClient, io } from "socket.io-client";
import "draft-js/dist/Draft.css";
import "./Editor.css";
import Comment from "./Comment";
import BibleText from "./Text";
import Grid from "@material-ui/core/Grid";

// let socket;
let UID = 1;
let UID2 = 1;
const dataOffsetKeyString = "data-offset-key";
// const isaiah6 = `
// In the year that King Uzziah died I saw the Lord sitting upon a throne, high and lifted up; and the train of his robe filled the temple. Above him stood the seraphim. Each had six wings: with two he covered his face, and with two he covered his feet, and with two he flew. And one called to another and said:

// “Holy, holy, holy is the Lord of hosts;
// the whole earth is full of his glory!”

// And the foundations of the thresholds shook at the voice of him who called, and the house was filled with smoke. And I said: “Woe is me! For I am lost; for I am a man of unclean lips, and I dwell in the midst of a people of unclean lips; for my eyes have seen the King, the Lord of hosts!”

// Then one of the seraphim flew to me, having in his hand a burning coal that he had taken with tongs from the altar. And he touched my mouth and said: “Behold, this has touched your lips; your guilt is taken away, and your sin atoned for.”

// And I heard the voice of the Lord saying, “Whom shall I send, and who will go for us?” Then I said, “Here I am! Send me.” And he said, “Go, and say to this people:

// “‘Keep on hearing, but do not understand;
// keep on seeing, but do not perceive.’
// Make the heart of this people dull,
//     and their ears heavy,
//     and blind their eyes;
// lest they see with their eyes,
//     and hear with their ears,
// and understand with their hearts,
//     and turn and be healed.”
// Then I said, “How long, O Lord?”
// And he said:
// “Until cities lie waste
//     without inhabitant,
// and houses without people,
//     and the land is a desolate waste,
// and the Lord removes people far away,
//     and the forsaken places are many in the midst of the land.
// And though a tenth remain in it,
//     it will be burned again,
// like a terebinth or an oak,
//     whose stump remains
//     when it is felled.”
// The holy seed is its stump."`;

const MyEditor = () => {
  //   let state = {
  //     response: "",
  //     endpoint: "http://127.0.0.1:4001",
  //   };

  const [editorState, setEditorState] = useState(
    EditorState.createWithContent(
      ContentState.createFromText(BibleText.isaiah6)
    )
  );
  const [comments, setComments] = useState([]);
  const [currentComment, setcurrentComment] = useState(0);

  //   useEffect(() => {
  //     const { endpoint } = state;
  //     // const socket = socketIOClient(endpoint);
  //     // socket = io(endpoint);
  //     // socket.on("FromAPI", (data) => this.setState({ response: data }));
  //     // socket.on("FromAPI", (data) => (state.response = data));

  //     // code to run on component mount
  //   }, []);

  // let's find a more elegant solution in the future
  useEffect(() => {
    const selection = window.getSelection();
    if (selection.type === "None") return;
    const highlightedTextSpan = selection.getRangeAt(0).startContainer
      .parentElement.parentElement;
    const highlightedTextSpanDistanceToTop = highlightedTextSpan.getBoundingClientRect()
      .top;
    const dataOffsetKey = highlightedTextSpan.getAttribute(dataOffsetKeyString);
    const currentCommentIndex = comments.findIndex(
      (comment) => comment.key === UID
    );
    const currentComment = comments[currentCommentIndex];
    const updatedCurrentComment = {
      ...currentComment,
      dataOffsetKey: dataOffsetKey,
      distanceToTop: highlightedTextSpanDistanceToTop,
    };
    let newComments = [...comments];
    newComments[currentCommentIndex] = updatedCurrentComment;
    setComments(newComments);
  }, [currentComment]);

  const styleMap = {
    HIGHLIGHT: {
      backgroundColor: "#faed27",
    },
  };

  // let's find a more elegant solution in the future
  const getSelectedSpan = () => {
    const selection2 = window.getSelection();
    const node = selection2.getRangeAt(0).startContainer;
    const selectedSpan = node.parentNode.parentNode.parentNode;
    return selectedSpan;
  };

  const _onHighlightClick = () => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, "HIGHLIGHT"));
    UID++;
    const comment = { key: UID };
    setComments((comments) => [...comments, comment]);

    const currentSpan = getSelectedSpan();
    setcurrentComment(currentSpan);
  };

  return (
    <div>
      <Grid container spacing={3}>
        <Grid item xs={1}></Grid>
        <Grid item xs={7}>
          <button onMouseDown={_onHighlightClick}>Highlight</button>
          <Editor
            customStyleMap={styleMap}
            editorState={editorState}
            onChange={setEditorState}
          />
        </Grid>
        <Grid item xs={3}>
          {comments.map((comment) => (
            <div
              key={++UID2}
              style={{
                position: "absolute",
                top: comment.distanceToTop + "px",
              }}
            >
              <Comment></Comment>
            </div>
          ))}
        </Grid>
      </Grid>
    </div>
  );
};

export default MyEditor;
