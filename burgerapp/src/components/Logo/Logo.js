import React from "react";

import logoPng from "../../assests/images/burger-logo.png";
import classes from "../Logo/Logo.css";

const logo = (props) => (
  <div className={classes.Logo}>
    <img src={logoPng} alt="burger" />
  </div>
);

export default logo;
