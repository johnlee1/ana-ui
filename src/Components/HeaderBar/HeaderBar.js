import React from "react";

import "./HeaderBar.css";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

const HeaderBar = (props) => {
  const useStyles = makeStyles({
    title: {
      flexGrow: 1,
    },
  });

  const classes = useStyles();

  return (
    <AppBar position="sticky" style={{ background: "#f8f9fa" }}>
      <Toolbar>
        <Typography
          variant="h6"
          className={classes.title}
          style={{ color: "black" }}
        >
          {props.room}
        </Typography>
        <div className="icons">
          {props.users.map((user) => (
            <Tooltip key={user.name} title={user.name} arrow>
              <img
                className="icon"
                src="//ssl.gstatic.com/docs/common/profile/otter_lg.png"
                alt="Anonymous Otter"
              />
            </Tooltip>
          ))}
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default HeaderBar;
