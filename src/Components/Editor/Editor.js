import React, { useState } from "react";
import { Editor, RichUtils, convertToRaw } from "draft-js";
import "draft-js/dist/Draft.css";
import uuid from "react-uuid";

import "./Editor.css";

import CommentIcon from "@material-ui/icons/Comment";

const MyEditor = (props) => {
  const [showHighlightButton, setShowHighlightButton] = useState(false);
  const [highlightBtnDistanceToTop, setHighlightBtnDistanceToTop] = useState(0);
  const [highlightedTexts, setHighlightedTexts] = useState([]);
  const dataOffsetKeyString = "data-offset-key";

  const handleEditorChange = (editorState) => {
    const selection = window.getSelection();

    if (selection.toString().length === 0) {
      setShowHighlightButton(false);
      let found;

      // see if we need to display comment
      highlightedTexts.some((span) => {
        found = selection.containsNode(span);
        if (found) {
          const dataOffsetKey = span.parentElement.parentElement.getAttribute(
            dataOffsetKeyString
          );
          props.setCommentDataOffsetKey(dataOffsetKey);
        }
        return found;
      });
      if (!found) {
        props.setCommentDataOffsetKey("");
      }
    }

    // see if selection was made so that we know when to show the highlight button
    if (selection.toString().length > 0) {
      const selectedRange = selection.getRangeAt(0);
      const startNode = selectedRange.startContainer;
      const startOffset = selectedRange.startOffset;

      const range = document.createRange();
      range.setStart(startNode, startOffset);
      range.setEnd(startNode, startOffset);
      const top = range.getBoundingClientRect().top;

      setHighlightBtnDistanceToTop(top);
      setShowHighlightButton(true);
    }

    props.setEditorState(editorState);
    const outgoingData = {
      editor: convertToRaw(editorState.getCurrentContent()),
    };

    props.sendDataOverSocket("data", outgoingData);
  };

  const handleReturn = (e, editorState) => {
    return "handled"; // don't allow edits to the text
  };

  const handleKeyCommand = (command, editorState, eventTimeStamp) => {
    return "handled"; // don't allow edits to the text
  };

  const handleBeforeInput = (command, editorState, eventTimeStamp) => {
    return "handled"; // don't allow edits to the text
  };

  const keyBindingFn = (e) => {
    if (e.key === "Backspace" || e.key === "Delete") {
      return "delete";
    }
    return;
  };

  // let's find a more elegant solution in the future
  const getSelectedSpan = () => {
    const selection2 = window.getSelection();
    const node = selection2.getRangeAt(0).startContainer;
    const selectedSpan = node.parentNode.parentNode.parentNode;
    return selectedSpan;
  };

  const _onHighlightClick = () => {
    props.setEditorState(
      RichUtils.toggleInlineStyle(props.editorState, "HIGHLIGHT")
    );

    // const selectedRange = window.getSelection().getRangeAt(0);
    // const startNode = selectedRange.startContainer;
    // const startOffset = selectedRange.startOffset;
    // const range = document.createRange();
    // range.setStart(startNode, startOffset);
    // range.setEnd(startNode, startOffset);
    // const top = range.getBoundingClientRect().top;
    // const comment = {
    //   id: uuid(),
    //   name: props.name,
    //   text: "",
    //   distanceToTop: top,
    // };
    // props.addComment(comment);

    // Select the node that will be observed for mutations
    const currentSpan = getSelectedSpan();

    // Options for the observer (which mutations to observe)
    const config = { childList: true };

    // Callback function to execute when mutations are observed
    const callback = (mutationsList, observer) => {
      for (let mutation of mutationsList) {
        if (
          mutation.type === "childList" &&
          mutation?.addedNodes[0]?.attributes["style"]?.value?.includes(
            "background-color"
          )
        ) {
          const selection = window.getSelection();
          if (selection.type === "None") return;
          const highlightedTextSpan = selection.getRangeAt(0).startContainer
            .parentElement.parentElement;
          setHighlightedTexts((highlightedTexts) => [
            ...highlightedTexts,
            selection.getRangeAt(0).startContainer,
          ]);
          const highlightedTextSpanDistanceToTop = highlightedTextSpan.getBoundingClientRect()
            .top;
          const dataOffsetKey = highlightedTextSpan.getAttribute(
            dataOffsetKeyString
          );

          const comment = {
            id: uuid(),
            name: props.name,
            text: "",
            dataOffsetKey: dataOffsetKey,
            distanceToTop: highlightedTextSpanDistanceToTop,
          };
          props.addComment(comment);
        }
      }
      observer.disconnect();
    };
    const observer = new MutationObserver(callback);
    observer.observe(currentSpan, config);
  };

  const styleMap = {
    HIGHLIGHT: {
      backgroundColor: "#faed27",
    },
  };

  return (
    <div>
      <Editor
        customStyleMap={styleMap}
        editorState={props.editorState}
        onChange={handleEditorChange}
        handleReturn={handleReturn}
        handleBeforeInput={handleBeforeInput}
        keyBindingFn={keyBindingFn}
        handleKeyCommand={handleKeyCommand}
      />

      {showHighlightButton && (
        <div
          style={{
            position: "absolute",
            top: highlightBtnDistanceToTop + "px",
            marginLeft: "56vw",
          }}
        >
          <CommentIcon
            onMouseDown={_onHighlightClick}
            className="commentIcon"
          />
        </div>
      )}
    </div>
  );
};

export default MyEditor;
