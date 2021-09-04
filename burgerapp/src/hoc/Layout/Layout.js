import React, { useState } from "react";
import { connect } from "react-redux";

import Aux from "../Auxiliary/Auxiliary";
import classes from "./Layout.css";
import Toolbar from "../../components/Navigation/Toolbar/Toolbar";
import SideDrawer from "../../components/Navigation/SideDrawer/SideDrawer";

const Layout = ({ isAuthenticated, children }) => {
  const [sideDrawer, setSideDrawer] = useState(false);

  const sideDrawCloseHandler = () => {
    setSideDrawer(false);
  };
  const sideDrawToggleHandler = () => {
    setSideDrawer(!sideDrawer);
  };
  return (
    <Aux>
      <Toolbar open={sideDrawToggleHandler} isAuth={isAuthenticated} />
      <SideDrawer
        isAuth={isAuthenticated}
        open={sideDrawer}
        close={sideDrawCloseHandler}
      />
      <main className={classes.Content}>{children}</main>
    </Aux>
  );
};

const mapStateToProps = (state) => {
  return { isAuthenticated: state.auth.token !== null };
};

export default connect(mapStateToProps)(Layout);
