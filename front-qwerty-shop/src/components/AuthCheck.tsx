import { useState } from 'react';
import { Route, Redirect } from 'react-router-dom';

interface AuthCheck {
    checkCachedUser: any;
    client?: any;
    component: any;
    exact: any;
    path: any;
    setToken?: any;
    token?: any;
}

export const ProtectedRoute: React.FC<AuthCheck> = (props: any) => {
    const { checkCachedUser, component: Component, exact, path, setToken, token } = props;
    const [error, setError] = useState('');
    const client = props.client ? props.client : null;
    const existingUser = checkCachedUser();
    const localToken = localStorage.getItem('token');

    if (!localToken && token != '') setToken('');

    if (error === 'Invalid token' || error === 'Forbidden resource') return (
        <Redirect to='/login' />
    );

    return (
        <Route
            path={path}
            exact={exact}
            render={(reactProps) =>
                existingUser && token && localToken ?
                    <Component {...reactProps} checkCachedUser={checkCachedUser} client={client} error={error} setError={setError} /> :
                    <Redirect to='/login' />
            }
        />
    );
};

export const AuthRoute: React.FC<AuthCheck> = (props: any) => {
    const { checkCachedUser, component: Component, exact, path, setToken, token } = props;
    const existingUser = checkCachedUser();

    return (
        <Route
            path={path}
            exact={exact}
            render={(reactProps) =>
                !existingUser || !token ?
                    <Component {...reactProps} checkCachedUser={checkCachedUser} setToken={setToken} /> :
                    <Redirect to="/profile" />
            }
        />
    );
}