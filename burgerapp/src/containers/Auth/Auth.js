import React, { useEffect, useState } from "react";
import Input from "../../components/UI/Input/Input";
import Button from "../../components/UI/Button/Button";
import classes from "./Auth.css";
import axios from "../../axios-orders";
import * as actions from "../../store/actions/index";
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";
import Spinner from "../../components/UI/Spinner/Spinner";
import { Redirect } from "react-router-dom";

import { connect } from "react-redux";

const Auth = (props) => {
  const [controls, setControls] = useState({
    email: {
      elementType: "input",
      elementConfig: { type: "email", placeholder: "Email address" },
      value: "",
      validation: {
        required: true,
        isEmail: true,
      },
      valid: false,
      touched: false,
    },
    password: {
      elementType: "input",
      elementConfig: { type: "password", placeholder: "Password" },
      value: "",
      validation: {
        required: true,
        minLength: 6,
      },
      valid: false,
      touched: false,
    },
  });
  const [isSignUp, setIsSignUp] = useState(true);

  const checkValidity = (value, rules) => {
    let isValid = true;
    if (!rules) {
      return true;
    }

    if (rules.required) {
      isValid = value.trim() !== "" && isValid;
    }

    if (rules.minLength) {
      isValid = value.length >= rules.minLength && isValid;
    }

    if (rules.maxLength) {
      isValid = value.length <= rules.maxLength && isValid;
    }

    if (rules.isEmail) {
      const pattern =
        /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
      isValid = pattern.test(value) && isValid;
    }

    if (rules.isNumeric) {
      const pattern = /^\d+$/;
      isValid = pattern.test(value) && isValid;
    }

    return isValid;
  };

  const inputChangeHandler = (event, controlName) => {
    const updatedControls = {
      ...controls,
      [controlName]: {
        ...controls[controlName],
        value: event.target.value,
        valid: checkValidity(
          event.target.value,
          controls[controlName].validation
        ),
        touched: true,
      },
    };
    setControls(updatedControls);
  };

  const onSubmitHandler = (event) => {
    event.preventDefault();
    props.onAuth(controls.email.value, controls.password.value, isSignUp);
  };

  const switchAuthModeHandler = () => {
    setIsSignUp(!isSignUp);
  };

  const { building, authRedirect, onSetAuthRedirect } = props;
  useEffect(() => {
    if (!building && authRedirect !== "/") {
      onSetAuthRedirect();
    }
  }, [building, authRedirect, onSetAuthRedirect]);

  const formElementsArray = [];
  for (let key in controls) {
    formElementsArray.push({
      id: key,
      config: controls[key],
    });
  }

  let form = formElementsArray.map((element) => {
    return (
      <Input
        key={element.id}
        elementType={element.config.elementType}
        elementConfig={element.config.elementConfig}
        value={element.config.value}
        invalid={!element.config.valid}
        shouldValidate={element.config.validation}
        touched={element.config.touched}
        change={(event) => inputChangeHandler(event, element.id)}
      />
    );
  });

  if (props.loading) {
    form = <Spinner />;
  }

  let errorMessage = null;

  if (props.error) {
    errorMessage = <p>{props.error.message}</p>;
  }

  return (
    <div className={classes.AuthData}>
      <form onSubmit={onSubmitHandler}>
        {errorMessage}
        {form}
        <Button btnType="Success">Submit</Button>
      </form>
      <Button btnType="Danger" clicked={switchAuthModeHandler}>
        Switch to {isSignUp ? "SignIn" : "SignUp"}
      </Button>
      {props.isAuth ? <Redirect to={props.authRedirect} /> : null}
    </div>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    onAuth: (email, password, isSignUp) =>
      dispatch(actions.auth(email, password, isSignUp)),
    onSetAuthRedirect: () => dispatch(actions.setAuthRedirectPath("/")),
  };
};

const mapStateToProps = (state) => {
  return {
    loading: state.auth.loading,
    error: state.auth.error,
    isAuth: state.auth.token !== null,
    building: state.burgerBuilder.building,
    authRedirect: state.auth.authRedirect,
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withErrorHandler(Auth, axios));
