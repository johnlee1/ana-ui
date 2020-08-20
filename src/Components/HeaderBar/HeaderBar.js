import React from "react";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
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
    <AppBar position="sticky">
      <Toolbar>
        <Typography variant="h6" className={classes.title}>
          {props.room}
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default HeaderBar;
