import React, { useState } from "react";
import { Editor, RichUtils } from "draft-js";
import "draft-js/dist/Draft.css";
import uuid from "react-uuid";

import "./Editor.css";

import CommentIcon from "@material-ui/icons/Comment";

const MyEditor = (props) => {
  const [showHighlightButton, setShowHighlightButton] = useState(false);
  const [highlightBtnDistanceToTop, setHighlightBtnDistanceToTop] = useState(0);
  const dataOffsetKeyString = "data-offset-key";

  const handleEditorChange = (editorState) => {
    if (props.editorChange()) return; // give props.editorChange a better name! returns true if Study.js decides that nothing should be done

    const selection = window.getSelection();

    if (selection.toString().length === 0) {
      setShowHighlightButton(false);
      let found = false;

      // see if we need to display comment
      props.dataOffsetKeys.some((dataOffsetKey) => {
        const attribute = `span[data-offset-key='${dataOffsetKey}']`;
        const span = document.querySelector(attribute);
        if (
          span != null &&
          span.childNodes[0] != null &&
          span.childNodes[0].childNodes[0] != null
        )
          found = selection.containsNode(span.childNodes[0].childNodes[0]); // text node
        if (found) {
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
  };

  const handleReturn = () => {
    return "handled"; // don't allow edits to the text
  };

  const handleKeyCommand = () => {
    return "handled"; // don't allow edits to the text
  };

  const handleBeforeInput = () => {
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

  const createComment = () => {
    const selection = window.getSelection();
    if (selection.type === "None") return;
    const highlightedTextSpan = selection.getRangeAt(0).startContainer
      .parentElement.parentElement;
    const highlightedTextSpanDistanceToTop = highlightedTextSpan.getBoundingClientRect()
      .top;
    const dataOffsetKey = highlightedTextSpan.getAttribute(dataOffsetKeyString);

    props.setDataOffsetKeys(() => [...props.dataOffsetKeys, dataOffsetKey]);

    const comment = {
      id: uuid(),
      name: props.name,
      text: "",
      dataOffsetKey: dataOffsetKey,
      distanceToTop: highlightedTextSpanDistanceToTop,
    };
    props.addComment(comment);
  };

  const _onHighlightClick = () => {
    props.setEditorState(
      RichUtils.toggleInlineStyle(props.editorState, "TEMP")
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
          createComment();
        }
      }
      observer.disconnect();
      observer2.disconnect();
    };

    // Options for the observer (which mutations to observe)
    const config2 = { attributes: true };

    // Callback function to execute when mutations are observed
    const callback2 = (mutationsList, observer) => {
      for (let mutation of mutationsList) {
        if (mutation.type === "attributes") {
          createComment();
        }
      }
      observer1.disconnect();
      observer.disconnect();
    };

    const observer1 = new MutationObserver(callback);
    observer1.observe(currentSpan, config);

    const observer2 = new MutationObserver(callback2);
    observer2.observe(currentSpan.childNodes[0], config2);
  };

  const styleMap = {
    HIGHLIGHT: {
      backgroundColor: "#faed27",
    },
    TEMP: {
      backgroundColor: "#ffc30b",
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
