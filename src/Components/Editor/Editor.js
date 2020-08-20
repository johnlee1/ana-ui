import React from "react";
import { Editor, RichUtils, convertToRaw } from "draft-js";
import "draft-js/dist/Draft.css";
import uuid from "react-uuid";

import "./Editor.css";

// let socket;

const MyEditor = (props) => {
  const dataOffsetKeyString = "data-offset-key";

  const handleEditorChange = (editorState) => {
    props.setEditorState(editorState);
    const outgoingData = {
      editor: convertToRaw(editorState.getCurrentContent()),
    };

    props.sendDataOverSocket("data", outgoingData);
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
          const highlightedTextSpanDistanceToTop = highlightedTextSpan.getBoundingClientRect()
            .top;
          const dataOffsetKey = highlightedTextSpan.getAttribute(
            dataOffsetKeyString
          );

          const comment = {
            id: uuid(),
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
      <button onMouseDown={_onHighlightClick}>Highlight</button>
      <Editor
        customStyleMap={styleMap}
        editorState={props.editorState}
        onChange={handleEditorChange}
      />
    </div>
  );
};

export default MyEditor;
