import React, { useState } from "react";

const Comment = () => {
  const [comment, updateComment] = useState("");
  const [testcomment, updateTestComment] = useState("");

  const Text = () => {
    return <div>{comment}</div>;
  };

  return (
    <div>
      {comment ? (
        <Text />
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            updateComment(testcomment);
          }}
        >
          <input
            value={testcomment}
            onChange={(e) => updateTestComment(e.target.value)}
          ></input>
          <button>Add</button>
        </form>
      )}
    </div>
  );
};

export default Comment;
