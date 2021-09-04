import * as actionType from "../actions/actionType";
import { updateObject } from "../utility/utility";

const initialState = {
  ingredients: null,
  totalPrice: 4,
  error: false,
  building: false,
};

const INGREDIENT_PRICES = {
  salad: 0.5,
  cheese: 0.4,
  meat: 1.3,
  bacon: 0.7,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionType.ADD_INGREDIENT:
      const updatedIngredient = {
        [action.ingredientName]: state.ingredients[action.ingredientName] + 1,
      };
      const updatedIgredients = updateObject(
        state.ingredients,
        updatedIngredient
      );
      const updateState = {
        ingredients: updatedIgredients,
        totalPrice: state.totalPrice + INGREDIENT_PRICES[action.ingredientName],
        building: true,
      };
      return updateObject(state, updateState);

    case actionType.REMOVE_INGREDIENT:
      const updatedIng = {
        [action.ingredientName]: state.ingredients[action.ingredientName] - 1,
      };
      const updatedIngs = updateObject(state.ingredients, updatedIng);
      const updateS = {
        ingredients: updatedIngs,
        totalPrice: state.totalPrice - INGREDIENT_PRICES[action.ingredientName],
        building: true,
      };
      return updateObject(state, updateS);

    case actionType.SET_INGREDIENT:
      return updateObject(state, {
        ingredients: action.ingredients,
        error: false,
        totalPrice: 4,
        building: false,
      });

    case actionType.FETCH_INGREDIENTS_FAILED:
      return updateObject(state, {
        error: true,
      });

    default:
      return state;
  }
};

export default reducer;
