import { useReducer } from "react";

const initState = {
  loading: false,
  error: null,
  data: null,
  extra: null,
  identifier: null,
};

const httpReducer = (httpState, action) => {
  switch (action.type) {
    case "SEND":
      return {
        loading: true,
        error: null,
        data: null,
        extra: null,
        identifier: action.identifier,
      };
    case "RESPONSE":
      return {
        loading: false,
        error: null,
        data: action.responseData,
        extra: action.extra,
      };
    case "ERROR":
      return {
        loading: false,
        error: action.error,
      };
    case "CLEAR":
      return initState;

    default:
      throw new Error("error");
  }
};

const useHttp = () => {
  const [http, dispatchHttp] = useReducer(httpReducer, initState);

  const clear = () => dispatchHttp({ type: "CLEAR" });

  const sendRequest = (url, method, body, reqExtra, reqIdentifier) => {
    dispatchHttp({ type: "SEND", identifier: reqIdentifier });
    fetch(url, {
      method: method,
      body: body,
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => {
        return response.json();
      })
      .then((res) => {
        dispatchHttp({ type: "RESPONSE", responseData: res, extra: reqExtra });
      })
      .catch((error) => {
        dispatchHttp({ type: "ERROR", error: error.message });
      });
  };

  return {
    isLoading: http.loading,
    data: http.data,
    error: http.error,
    reqExtra: http.extra,
    reqIdentifier: http.identifier,
    sendRequest: sendRequest,
    clear: clear,
  };
};

export default useHttp;
