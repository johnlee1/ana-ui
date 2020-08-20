import React, { useState } from "react";
import { Link } from "@reach/router";

import "./Join.css";

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

const Join = () => {
  const [name, setName] = useState("");
  const [room, setRoom] = useState("");

  return (
    <div className="main">
      <TextField
        id="outlined-basic"
        label="Name"
        variant="outlined"
        onChange={(e) => setName(e.target.value)}
      />
      <TextField
        id="outlined-basic"
        label="Room Code"
        variant="outlined"
        onChange={(e) => setRoom(e.target.value)}
      />
      <Link
        onClick={(event) => (!name || !room ? event.preventDefault() : null)}
        to="/study"
        state={{ name: name, room: room }}
      >
        <Button variant="outlined" color="primary">
          Join Room
        </Button>
      </Link>
    </div>
  );
};

export default Join;
