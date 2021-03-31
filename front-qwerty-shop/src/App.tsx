import React, { useEffect, useState } from 'react';
import {
  Route,
  Switch,
  useLocation,
} from 'react-router-dom';
import { gql, useLazyQuery } from '@apollo/client';
import { AnimatePresence } from 'framer-motion';

import * as Components from './components/exportComponents';
import { ApolloClientInterface } from './components/exportInterfaces';
import LoadingSpinner from './components/LoadingSpinner';

const {
  AddAddress,
  AuthRoutes,
  Footer,
  Home,
  Item,
  Login,
  NavBar,
  Product,
  ProductCategories,
  Profile,
  SignUp
} = Components;
const { AuthRoute, ProtectedRoute } = AuthRoutes;

const GET_USER_INFO = gql`
  query getUserData {
    getUserData {
      _id,
        addresses {
            country,
            fullName,
            phoneNumber,
            addressLineOne,
            addressLineTwo,
            city,
            state,
            zipCode,
            default
        },
        cart {
            itemId,
            color,
            size
        },
        email,
    }
  }
`;

const App: React.FC<ApolloClientInterface> = (props) => {
  const { client } = props;
  const [token, setToken] = useState('');
  const location = useLocation();
  const localCart = localStorage.getItem('localCart');
  const loadingText = 'Checking user info!'.split('');
  const [getUserInfo, { data, error, loading }] = useLazyQuery(GET_USER_INFO, {
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'network-only'
  });

  const checkCachedUser = () => {
    const existingUser = client.readFragment({
      id: 'userInfo',
      fragment:
        gql`
        fragment UserInfo on AuthUser {
            addresses {
              country,
              fullName,
              phoneNumber,
              addressLineOne,
              addressLineTwo,
              city,
              state,
              zipCode,
              default
            },
            email,
            cart {
              itemId,
              color,
              size
            }
        }
      `,
    });

    return existingUser;
  };

  useEffect(() => {
    getUserInfo();
  }, [])

  const localToken = localStorage.getItem('token');
  if (localToken && localToken != '' && token === '') {

    /* Verify user or grab user data */
    if (!error && data) {
      setToken(localToken);
    }

    if (error) {
      localStorage.removeItem('token');
      console.log(error)
    }
  }

  if (!checkCachedUser()) {
    const cartToStore = localCart ? JSON.parse(localCart) : [];

    client.writeFragment({
      id: 'userInfo',
      fragment:
        gql`
          fragment UserInfo on AuthUser {
              _id,
              addresses {
                  country,
                  fullName,
                  phoneNumber,
                  addressLineOne,
                  addressLineTwo,
                  city,
                  state,
                  zipCode,
                  default
              },
              email,
              token,
              cart {
                itemId,
                addresses,
                size
              },
        }
      `,
      data: {
        _id: null,
        addresses: [],
        email: null,
        token: null,
        cart: cartToStore
      }
    });
  }


  return (
    <>
      { loading ? (
        <div className='qwerty-shop-loading-full'>
          <LoadingSpinner />
          <div className='qwerty-shop-loading-text-container'>
            {
              loadingText.map((char, idx) => (
                <div
                  className={`qwerty-shop-loading-text-${idx}`}
                  key={`qwerty-shop-loading-text-${idx}`}
                >
                  {char}
                </div>
              ))
            }
          </div>
        </div>
      ) : (
        <>
          <NavBar checkCachedUser={checkCachedUser} client={client} setToken={setToken} token={token} />
          <div className='qwerty-shop-app' style={document.location.pathname === '/' ? { marginTop: 0 } : undefined}>
            <AnimatePresence exitBeforeEnter={true} >
              <Switch location={location} key={location.pathname}>
                <Route exact path='/' component={Home} />
                <ProtectedRoute checkCachedUser={checkCachedUser} exact path='/addaddress' client={client} component={AddAddress} setToken={setToken} token={token} />
                <Route exact path='/products' component={ProductCategories} />
                <Route exact path='/products/:productType' component={Product} />
                <Route
                  exact path='/item/:itemId'
                  render={(reactProps) => <Item {...reactProps} checkCachedUser={checkCachedUser} client={client} />} />
                <AuthRoute checkCachedUser={checkCachedUser} exact path='/login' component={Login} setToken={setToken} token={token} />
                <AuthRoute checkCachedUser={checkCachedUser} exact path='/signup' component={SignUp} />
                <ProtectedRoute checkCachedUser={checkCachedUser} exact path='/profile' component={Profile} setToken={setToken} token={token} />
              </Switch>
            </AnimatePresence>
          </div>
          <Footer />
        </>
      )
      }

    </>
  );
}

export default App;
