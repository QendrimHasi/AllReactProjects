import React, { useEffect, Suspense } from "react";

import Layout from "./hoc/Layout/Layout";
import { Route, Switch, withRouter, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import * as actions from "./store/actions/index";

import BurgerBuilder from "./containers/BurgerBuilder/BurgerBuilder";
import Spinner from "./components/UI/Spinner/Spinner";

const Checkout = React.lazy(() => {
  return import("./containers/Checkout/Checkout");
});
const Orders = React.lazy(() => {
  return import("./containers/Orders/Orders");
});
const Auth = React.lazy(() => {
  return import("./containers/Auth/Auth");
});
const Logout = React.lazy(() => {
  return import("./containers/Auth/Logout/Logout");
});

const App = ({ onAutoSignIn, isAuth }) => {
  useEffect(() => {
    onAutoSignIn();
  }, [onAutoSignIn]);

  let routes = (
    <Switch>
      <Route path="/auth" render={(props) => <Auth {...props} />} />
      <Route path="/" component={BurgerBuilder} />
      <Redirect to="/" />
    </Switch>
  );

  if (isAuth) {
    routes = (
      <Switch>
        <Route path="/checkout" render={(props) => <Checkout {...props} />} />
        <Route path="/auth" render={(props) => <Auth {...props} />} />
        <Route path="/orders" render={(props) => <Orders {...props} />} />
        <Route path="/logout" render={(props) => <Logout {...props} />} />
        <Route path="/" component={BurgerBuilder} />
        <Redirect to="/" />
      </Switch>
    );
  }
  return (
    <div>
      <Layout>
        <Suspense fallback={<Spinner />}>{routes}</Suspense>
      </Layout>
    </div>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    onAutoSignIn: () => dispatch(actions.authCheckState()),
  };
};

const mapStateToProps = (state) => {
  return {
    isAuth: state.auth.token !== null,
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
