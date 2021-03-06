import * as actionTypes from "../actions/actionType";
import { updateObject } from "../utility/utility";

const initState = {
  token: null,
  userId: null,
  error: null,
  loading: false,
  authRedirect: "/",
};

const reducer = (state = initState, action) => {
  switch (action.type) {
    case actionTypes.AUTH_START:
      return updateObject(state, { error: null, loading: true });

    case actionTypes.AUTH_SUCCESS:
      return updateObject(state, {
        token: action.idToken,
        userId: action.userId,
        error: null,
        loading: false,
      });

    case actionTypes.AUTH_FAIL:
      return updateObject(state, { error: action.error, loading: false });

    case actionTypes.AUTH_LOGOUT:
      return updateObject(state, { token: null, userId: null });
    case actionTypes.SET_AUTH_REDIRECT_PATH:
      return updateObject(state, { authRedirect: action.path });
    default:
      return state;
  }
};

export default reducer;
