import React, { useEffect, useState, useCallback } from "react";
import { connect, useSelector, useDispatch } from "react-redux";

import Aux from "../../hoc/Auxiliary/Auxiliary";

import Burger from "../../components/Burger/Burger";
import BuildControls from "../../components/Burger/BuildControls/BuildControls";
import Modal from "../../components/UI/Modal/Modal";
import OrderSummary from "../../components/Burger/OrderSummary/OrderSummary";
import axios from "../../axios-orders";
import Spinner from "../../components/UI/Spinner/Spinner";
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";
import * as burgerActions from "../../store/actions/index";

const BurgerBuilder = (props) => {
  const [purchasing, setPurchasing] = useState(false);
  const dispatch = useDispatch();

  const ings = useSelector((state) => {
    return state.burgerBuilder.ingredients;
  });
  const price = useSelector((state) => {
    return state.burgerBuilder.totalPrice;
  });
  const error = useSelector((state) => {
    return state.burgerBuilder.error;
  });
  const isAuth = useSelector((state) => {
    return state.auth.token !== null;
  });

  const onIngredientAdded = (name) =>
    dispatch(burgerActions.addIngredient(name));
  const onIngredientRemoved = (name) =>
    dispatch(burgerActions.removeIngredient(name));
  const onInitIngredients = useCallback(
    () => dispatch(burgerActions.initIngredients()),
    []
  );
  const onInitPurchase = () => dispatch(burgerActions.purchaseInt());
  const onSetAuthRedirect = (path) =>
    dispatch(burgerActions.setAuthRedirectPath(path));

  useEffect(() => {
    onInitIngredients();
  }, [onInitIngredients]);

  const updatePurchaseState = (ing) => {
    const ingredients = { ...ing };

    const sum = Object.keys(ingredients)
      .map((key) => {
        return ingredients[key];
      })
      .reduce((sum, el) => {
        return sum + el;
      }, 0);

    return sum > 0;
  };

  const purchaseHandler = () => {
    if (isAuth === true) {
      setPurchasing(true);
    } else {
      onSetAuthRedirect("/checkout");
      props.history.push("/auth");
    }
  };
  const purchaseCanceledHandler = () => {
    setPurchasing(false);
  };
  const purchaseContinuedHandler = () => {
    onInitPurchase();
    props.history.push("/checkout");
  };

  const disableInfo = {
    ...ings,
  };

  for (const key in disableInfo) {
    disableInfo[key] = disableInfo[key] <= 0;
  }
  let orderSummary = null;
  if (ings) {
    orderSummary = (
      <OrderSummary
        price={price}
        ingredients={ings}
        cancel={purchaseCanceledHandler}
        continue={purchaseContinuedHandler}
      />
    );
  }

  let burger = error ? <p>Ingredient cant be loadet</p> : <Spinner />;

  if (ings) {
    burger = (
      <Aux>
        <Burger ingredients={ings} />
        <BuildControls
          isAuth={isAuth}
          price={price}
          ingredientAdded={onIngredientAdded}
          ingredientRemoved={onIngredientRemoved}
          disabled={disableInfo}
          ordered={purchaseHandler}
          purchasable={updatePurchaseState(ings)}
        />
      </Aux>
    );
  }

  return (
    <Aux>
      <Modal show={purchasing} modalClosed={purchaseCanceledHandler}>
        {orderSummary}
      </Modal>
      {burger}
    </Aux>
  );
};

export default withErrorHandler(BurgerBuilder, axios);
