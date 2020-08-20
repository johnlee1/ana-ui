import React from "react";
import ReactDOM from "react-dom";
import { Router } from "@reach/router";

import Join from "./Components/Join/Join";
import Study from "./Components/Study/Study";

const App = () => {
  return (
    <div>
      <Router>
        <Join path="/"></Join>
        <Study path="/study"></Study>
      </Router>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
