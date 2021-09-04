import React, { useState } from "react";
import { connect } from "react-redux";

import Button from "../../../components/UI/Button/Button";
import Spinner from "../../../components/UI/Spinner/Spinner";
import classes from "./ContactData.css";
import axios from "../../../axios-orders";
import Input from "../../../components/UI/Input/Input";
import withErrorHandler from "../../../hoc/withErrorHandler/withErrorHandler";
import * as OrderActions from "../../../store/actions/index";

const ContactData = (props) => {
  const [orderForm, setOrderForm] = useState({
    name: {
      elementType: "input",
      elementConfig: { type: "text", placeholder: "Your Name" },
      value: "",
      validation: {
        required: true,
      },
      valid: false,
      touched: false,
    },
    street: {
      elementType: "input",
      elementConfig: { type: "text", placeholder: "Your Street" },
      value: "",
      validation: {
        required: true,
      },
      valid: false,
      touched: false,
    },
    zip: {
      elementType: "input",
      elementConfig: { type: "text", placeholder: "Your Zip Code" },
      value: "",
      validation: {
        required: true,
        minLength: 5,
        maxLength: 5,
      },
      valid: false,
      touched: false,
    },
    country: {
      elementType: "input",
      elementConfig: { type: "text", placeholder: "Your Country" },
      value: "",
      validation: {
        required: true,
      },
      valid: false,
      touched: false,
    },
    email: {
      elementType: "input",
      elementConfig: { type: "email", placeholder: "Your Email" },
      value: "",
      validation: {
        required: true,
      },
      valid: false,
      touched: false,
    },
    deliveryMethod: {
      elementType: "select",
      elementConfig: {
        options: [
          { value: "fastest", displayValue: "Fastest" },
          { value: "cheapest", displayValue: "Cheapest" },
        ],
      },
      validation: {},
      valid: true,
      value: "fastest",
      touched: false,
    },
  });
  const [formIsValid, setFormIsValid] = useState(false);

  const orderHandler = (event) => {
    event.preventDefault();

    const formData = {};
    for (let key in orderForm) {
      formData[key] = orderForm[key].value;
    }
    const order = {
      ingredients: props.ingredients,
      price: props.price,
      orderData: formData,
      userId: props.userId,
    };

    props.onOrderBurger(order, props.token);
  };

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

  const inputChangeHandler = (event, inputIdentifier) => {
    const updatedOrderForm = { ...orderForm };
    const formElement = { ...updatedOrderForm[inputIdentifier] };
    formElement.value = event.target.value;
    formElement.valid = checkValidity(
      formElement.value,
      formElement.validation
    );
    formElement.touched = true;
    updatedOrderForm[inputIdentifier] = formElement;
    let validForm = true;
    for (let key in updatedOrderForm) {
      validForm = updatedOrderForm[key].valid && validForm;
    }
    setOrderForm(updatedOrderForm);

    setFormIsValid(validForm);
  };

  const formElementsArray = [];
  for (let key in orderForm) {
    formElementsArray.push({
      id: key,
      config: orderForm[key],
    });
  }
  let form = (
    <form onSubmit={orderHandler}>
      {formElementsArray.map((element) => {
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
      })}

      <Button btnType="Success" disabled={!formIsValid}>
        ORDER
      </Button>
    </form>
  );
  if (props.loading) {
    form = <Spinner />;
  }
  return <div className={classes.ContactData}>{form}</div>;
};
const mapStateToProps = (state) => {
  return {
    ingredients: state.burgerBuilder.ingredients,
    price: state.burgerBuilder.totalPrice,
    loading: state.order.loading,
    token: state.auth.token,
    userId: state.auth.userId,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onOrderBurger: (orderData, token) =>
      dispatch(OrderActions.purchaseBurger(orderData, token)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withErrorHandler(ContactData, axios));
