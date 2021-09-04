import * as actionType from "../actions/actionType";
import { updateObject } from "../utility/utility";

const initialState = {
  orders: [],
  loading: false,
  purchased: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionType.PURCHASE_BURGER_SUCCESS:
      const newOrder = {
        ...action.orderData,
        id: action.orderId,
      };
      return updateObject(state, {
        loading: false,
        purchased: true,
        orders: state.orders.concat(newOrder),
      });

    case actionType.PURCHASE_BURGER_FAIL:
      return updateObject(state, {
        loading: false,
      });

    case actionType.PURCHASE_BURGER_START:
      return updateObject(state, {
        loading: true,
      });
    case actionType.PURCHASE_INIT:
      return updateObject(state, {
        purchased: false,
      });
    case actionType.FETCH_ORDERS_START:
      return updateObject(state, {
        loading: true,
      });
    case actionType.FETCH_ORDERS_SUCCESS:
      return updateObject(state, {
        orders: action.orders,
        loading: false,
      });
    case actionType.FETCH_ORDERS_FAIL:
      return updateObject(state, {
        loading: false,
      });

    default:
      return state;
  }
};

export default reducer;
