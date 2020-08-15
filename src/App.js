import React from "react";
import ReactDOM from "react-dom";
// import { Router, Link } from "@reach/router";
import MyEditor from "./Editor";

const App = () => {
  return (
    <div>
      Hello world!
      <MyEditor path="/"></MyEditor>
      {/* <Router>
        <MyEditor path="/"></MyEditor>
      </Router> */}
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
