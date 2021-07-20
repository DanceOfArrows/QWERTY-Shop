import { useEffect } from "react";
import {
  Redirect,
  Route,
  RouteComponentProps,
  withRouter,
} from "react-router-dom";
// import { GET_USER_INFO } from '../App';
import LoadingSpinner from "./LoadingSpinner";

interface AuthCheck extends RouteComponentProps<any> {
  checkCachedUser: any;
  client?: any;
  component: any;
  exact: any;
  getUserInfo: any;
  loading: any;
  path: any;
  setToken?: any;
  token?: any;
}

/* Just a few things -> destructure inside (not here) */
const ProtectedRoute: React.FC<AuthCheck> = (props: any) => {
  const {
    checkCachedUser,
    component: Component,
    exact,
    getUserInfo,
    path,
    setToken,
    token,
  } = props;
  const client = props.client ? props.client : null;
  const existingUser = checkCachedUser();
  const localToken = localStorage.getItem("token");
  // const [getUserInfo] = useLazyQuery(GET_USER_INFO, {
  //     fetchPolicy: 'network-only',
  //     nextFetchPolicy: 'network-only'
  // });

  useEffect(() => {
    getUserInfo();
  }, [getUserInfo]);

  if (!localToken && token !== "") setToken("");

  return (
    <Route
      path={path}
      exact={exact}
      render={(reactProps) =>
        existingUser && existingUser.id && token ? (
          <Component
            {...reactProps}
            checkCachedUser={checkCachedUser}
            client={client}
            getUserInfo={getUserInfo}
          />
        ) : (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location.pathname },
            }}
          />
        )
      }
    />
  );
};

const AuthRoute: React.FC<AuthCheck> = (props: any) => {
  const {
    checkCachedUser,
    component: Component,
    exact,
    getUserInfo,
    loading,
    path,
    setToken,
    token,
  } = props;
  const existingUser = checkCachedUser();
  const loadingText = "Checking user info!".split("");
  const redirectRoute =
    props.location.state &&
    props.location.state.from !== "/login" &&
    props.location.state.from !== "/signup"
      ? props.location.state.from
      : "/";

  useEffect(() => {
    if (token && (!existingUser || !existingUser.id)) {
      console.log("in");
      getUserInfo();
    }
  }, [existingUser, getUserInfo, token]);

  return (
    <>
      {loading ? (
        <div className="qwerty-shop-loading-full">
          <LoadingSpinner />
          <div className="qwerty-shop-loading-text-container">
            {loadingText.map((char, idx) => (
              <div
                className={`qwerty-shop-loading-text-${idx}`}
                key={`qwerty-shop-loading-text-${idx}`}
              >
                {char}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <Route
          path={path}
          exact={exact}
          render={(reactProps) =>
            !existingUser || !existingUser.id || !token ? (
              <Component
                {...reactProps}
                checkCachedUser={checkCachedUser}
                setToken={setToken}
              />
            ) : (
              <Redirect to={`${redirectRoute}`} />
            )
          }
        />
      )}
    </>
  );
};

export const ProtectedRouteWithRouter = withRouter(ProtectedRoute);
export const AuthRouteWithRouter = withRouter(AuthRoute);
