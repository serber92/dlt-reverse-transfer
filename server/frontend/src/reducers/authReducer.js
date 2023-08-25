export const initialState = {
  user: sessionStorage.getItem("user") ? JSON.parse(sessionStorage.getItem("user")) : null,
  token: sessionStorage.getItem("token"),
  isAuthenticated: sessionStorage.getItem("user") ? true : false,
  page: "",
};

const authReducer = (state, action) => {
  /// This isn't true anymore - I can login on localhost:3000
  /// We should likely remove this - leaving for now

  // if (!/trustedlearnernetwork.org/.test(window.location.host)) {
  //   alert("You are at a bad domain - Google Auth will not work");
  //   return {
  //     ...state,
  //     isAuthenticated: false,
  //     user: null,
  //   };
  // }

  switch (action.type) {
    case "LOGIN":
      console.log(action.payload, "===action.payload===");
      sessionStorage.setItem("user", JSON.stringify(action.payload.user));
      sessionStorage.setItem("token", action.payload.token);
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
      };
    case "LOGIN-ERROR":
      sessionStorage.setItem("user", null);
      sessionStorage.setItem("token", null);
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
      };
    case "LOGOUT":
      sessionStorage.clear();
      alert("You are logged out!");
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        token: null,
      };
    case "SET_PAGE":
      return {
        ...state,
        page: action.payload,
      };
    default:
      return state;
  }
};

export default authReducer;
