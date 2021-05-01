import React, { useEffect, useState } from 'react';
import {
  Route,
  Switch,
  useLocation,
} from 'react-router-dom';
import { gql, useLazyQuery } from '@apollo/client';
import { AnimatePresence } from 'framer-motion';
import { ToastProvider } from 'react-toast-notifications';

import * as Components from './components/exportComponents';
import { ApolloClientInterface } from './components/exportInterfaces';
import LoadingSpinner from './components/LoadingSpinner';

const {
  AddAddress,
  AuthRoutes,
  Cart,
  Checkout,
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
const { AuthRouteWithRouter, ProtectedRouteWithRouter } = AuthRoutes;

export const GET_USER_INFO = gql`
  query getUserData {
    getUserData {
      id,
      email,
      addresses {
          country,
          full_name,
          phone_number,
          address_line_one,
          address_line_two,
          city,
          state,
          zip_code,
          default
      },
      cart {
          item {
              id,
              name,
          },
          item_variation {
              id,
              option,
              variant,
              price,
              image
          },
          quantity
      },
    }
  }
`;

const App: React.FC<ApolloClientInterface> = (props) => {
  const { client } = props;
  const [token, setToken] = useState('');
  const location = useLocation();
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
        fragment UserInfo on FullUser {
            id,
            email,
            addresses {
              country,
              full_name,
              phone_number,
              address_line_one,
              address_line_two,
              city,
              state,
              zip_code,
              default
            },
            cart {
              item {
                  id,
                  name,
                  image,
                  description,
                  type
              },
              item_variation {
                  id,
                  option,
                  variant,
                  quantity,
                  price,
                  image
              },
              quantity
            },            
        }
      `,
    });

    return existingUser;
  };

  const localToken = localStorage.getItem('token');
  useEffect(() => {
    function removeToken() {
      setToken('');
      client.writeFragment({
        id: 'userInfo',
        fragment:
          gql`
                fragment UserInfo on FullUser {
                    id,
                    email,
                    addresses {
                      country,
                      full_name,
                      phone_number,
                      address_line_one,
                      address_line_two,
                      city,
                      state,
                      zip_code,
                      default
                    },
                    cart {
                      item {
                          id,
                          name,
                          image,
                          description,
                          type
                      },
                      item_variation {
                          id,
                          option,
                          variant,
                          quantity,
                          price,
                          image
                      },
                    quantity
            },
              }
            `,
        data: {
          _id: null,
          email: null,
          addresses: [],
          cart: [],
        }
      })

      alert('Login session expired.');
    }

    getUserInfo();

    window.addEventListener('storage', removeToken);
    return () => window.removeEventListener('storage', removeToken);
  }, [localToken, token]);

  if (localToken && localToken != '' && token === '') {
    if (!error && data) setToken(localToken);
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
        <ToastProvider
          autoDismiss
          autoDismissTimeout={6000}
          placement='bottom-left'
        >
          <NavBar checkCachedUser={checkCachedUser} client={client} key={token} setToken={setToken} token={token} />
          <div className='qwerty-shop-app' style={document.location.pathname === '/' ? { marginTop: 0 } : undefined}>
            <AnimatePresence exitBeforeEnter={true} >
              <Switch location={location} key={location.pathname}>
                <Route exact path='/' component={Home} />
                <ProtectedRouteWithRouter
                  checkCachedUser={checkCachedUser}
                  exact path='/addaddress'
                  client={client}
                  component={AddAddress}
                  getUserInfo={getUserInfo}
                  loading={loading}
                  setToken={setToken}
                  token={token}
                />
                <Route exact path='/products' component={ProductCategories} />
                <Route exact path='/products/:productType' component={Product} />
                <Route
                  exact path='/item/:itemId'
                  render={(reactProps) => <Item {...reactProps} checkCachedUser={checkCachedUser} client={client} />} />
                <AuthRouteWithRouter
                  checkCachedUser={checkCachedUser} exact path='/login'
                  component={Login}
                  getUserInfo={getUserInfo}
                  loading={loading}
                  setToken={setToken}
                  token={token}
                />
                <AuthRouteWithRouter
                  checkCachedUser={checkCachedUser}
                  exact path='/signup'
                  component={SignUp}
                  getUserInfo={getUserInfo}
                  loading={loading}
                  setToken={setToken}
                  token={token}
                />
                <ProtectedRouteWithRouter
                  checkCachedUser={checkCachedUser}
                  exact path='/profile'
                  component={Profile}
                  getUserInfo={getUserInfo}
                  loading={loading} setToken={setToken} token={token} />
                <ProtectedRouteWithRouter
                  exact path='/cart'
                  component={Cart}
                  checkCachedUser={checkCachedUser}
                  client={client}
                  getUserInfo={getUserInfo}
                  loading={loading}
                  token={token}
                />
                <ProtectedRouteWithRouter
                  exact
                  path='/checkout'
                  component={Checkout}
                  checkCachedUser={checkCachedUser}
                  client={client}
                  getUserInfo={getUserInfo}
                  loading={loading}
                  token={token}
                />
              </Switch>
            </AnimatePresence>
          </div>
          <Footer />
        </ToastProvider>
      )
      }

    </>
  );
};

export default App;
