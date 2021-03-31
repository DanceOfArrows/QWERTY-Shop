import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { gql } from '@apollo/client';
import { withRouter } from 'react-router-dom';

interface NavBar {
    checkCachedUser: any;
    client?: any;
    history: any;
    location: any;
    match: any;
    setToken: any;
    token: any;
}

const NavBar: React.FC<NavBar> = (props: any) => {
    let [isLoggedIn, setLoggedIn] = useState(false);
    const { checkCachedUser, client, setToken, token } = props;
    const [isScrollZero, setIsScrollZero] = React.useState(document.documentElement.scrollTop === 0 ? true : false);
    const loggedInDropdown: any = { profile: 'Profile', signout: 'Sign Out' };
    const productsDropdown: any = {
        accessories: 'Accessories',
        cases: 'Cases',
        diykits: 'DIY Kits',
        keycaps: 'Keycaps',
        newArrivals: 'New Arrivals',
        switches: 'Switches'
    };

    const handleScroll = (e: any) => {
        if (e.target.documentElement.scrollTop === 0) setIsScrollZero(true);
        else if (e.target.documentElement.scrollTop !== 0 && isScrollZero === true) setIsScrollZero(false);
        else return;
    }

    /* Used to check if the scroll is @ 0 and if it is on the home page */
    const shouldElementStyleChange = () => {
        return document.location.pathname === '/' && isScrollZero === true;
    }

    const signOut = () => {
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
                        color,
                        size
                    }
              }
            `,
            data: {
                _id: null,
                addresses: [],
                email: null,
                token: null,
                cart: [],
            }
        });
        localStorage.removeItem('token');
        setToken('');
    }

    useEffect(() => {
        const isCachedUser = checkCachedUser();

        if (document.location.pathname === '/') document.addEventListener("scroll", handleScroll);

        if (isCachedUser && token) setLoggedIn(true);
        else setLoggedIn(false);

        return () => {
            if (document.location.pathname === '/') document.removeEventListener("scroll", handleScroll);
        };
    }, [token]);

    return (
        <header
            className='qwerty-shop-navbar'
            style={
                shouldElementStyleChange() ?
                    { backgroundColor: 'transparent', borderBottom: 'none' } :
                    undefined
            }
        >
            <div className='qwerty-shop-navbar-left'>
                <NavLink className={shouldElementStyleChange() ? 'qwerty-shop-navbar-logo-stroke' : 'qwerty-shop-navbar-logo-filled'} to='/'>QWERTY Shop</NavLink>
            </div>
            <div className='qwerty-shop-navbar-right'>
                <nav>
                    <div>
                        <NavLink exact to='/' activeClassName='qwerty-shop-navbar-active'>Home</NavLink>
                    </div>
                    <div>
                        <NavLink
                            to='/products'
                            activeClassName='qwerty-shop-navbar-active'
                            onClick={(e) => {
                                e.preventDefault();
                                const productContainer = document.querySelector('.qwerty-shop-home-product-container');
                                if (productContainer === null) {
                                    props.history.push('/products');
                                } else {
                                    productContainer.scrollIntoView({ behavior: 'smooth' });
                                }
                            }}
                        >Products</NavLink>
                        <div className='qwerty-shop-navbar-products-dropdown'>
                            {
                                <>
                                    {
                                        Object.keys(productsDropdown).map((productType: string, idx) => {
                                            /* Renders all elements and sets the first and last boxes to be rounded if needed */
                                            if (idx === 0) {
                                                return (
                                                    <div className={`qwerty-shop-navbar-products-dropdown-option-${idx}`} key={`dropdown-${productType}`} style={
                                                        shouldElementStyleChange() ?
                                                            { borderRadius: '12px 12px 0 0', borderTop: 'solid 2px #1C1C1D' } :
                                                            undefined
                                                    }>
                                                        <NavLink to={`/products/${productType}`}>{productsDropdown[productType]}</NavLink>
                                                    </div>
                                                )
                                            } else if (idx === Object.keys(productsDropdown).length - 1) {
                                                /* This should always be the signout. */
                                                return (
                                                    <div
                                                        className={`qwerty-shop-navbar-products-dropdown-option-${idx}`}
                                                        key={`dropdown-${productType}`}
                                                        style={{
                                                            borderRadius: '0 0 12px 12px',
                                                            borderBottom: 'solid 2px #1C1A23',
                                                        }}>
                                                        <NavLink to={`/products/${productType}`}>{productsDropdown[productType]}</NavLink>
                                                    </div>
                                                )
                                            } else {
                                                return (
                                                    <div className={`qwerty-shop-navbar-products-dropdown-option-${idx}`} key={`dropdown-${productType}`}>
                                                        <NavLink to={`/products/${productType}`}>{productsDropdown[productType]}</NavLink>
                                                    </div>
                                                )
                                            }
                                        })
                                    }
                                </>
                            }
                        </div>
                    </div>
                    <div className='qwerty-shop-dropdown-container'>
                        <NavLink to='/profile'>
                            <i className="fas fa-user-circle" />
                        </NavLink>
                        <div className='qwerty-shop-navbar-user-dropdown'>
                            {
                                isLoggedIn ? (
                                    <>
                                        {
                                            Object.keys(loggedInDropdown).map((route: string, idx) => {
                                                /* Renders all elements and sets the first and last boxes to be rounded if needed */
                                                if (idx === 0) {
                                                    return (
                                                        <div className={`qwerty-shop-navbar-user-dropdown-option-${idx}`} key={`dropdown-${route}`} style={
                                                            shouldElementStyleChange() ?
                                                                { borderRadius: '12px 12px 0 0', borderTop: 'solid 2px #1C1C1D' } :
                                                                undefined
                                                        }>
                                                            <NavLink to={`/${route}`}>{loggedInDropdown[route]}</NavLink>
                                                        </div>
                                                    )
                                                } else if (idx === Object.keys(loggedInDropdown).length - 1) {
                                                    /* This should always be the signout. */
                                                    return (
                                                        <div
                                                            className={`qwerty-shop-navbar-user-dropdown-option-${idx}`}
                                                            key={`dropdown-${route}`}
                                                            style={{
                                                                borderRadius: '0 0 12px 12px',
                                                                borderBottom: 'solid 2px #1C1A23',
                                                            }}>
                                                            <div className='qwerty-shop-navbar-logout' onClick={signOut}>Sign Out</div>
                                                        </div>
                                                    )
                                                } else {
                                                    return (
                                                        <div className={`qwerty-shop-navbar-user-dropdown-option-${idx}`} key={`dropdown-${route}`}>
                                                            <NavLink to={`/${route}`}>{loggedInDropdown[route]}</NavLink>
                                                        </div>
                                                    )
                                                }
                                            })
                                        }
                                    </>
                                ) : (
                                    <>
                                        <div className='qwerty-shop-navbar-user-dropdown-option-0' style={
                                            shouldElementStyleChange() ?
                                                { borderRadius: '12px 12px 0 0', borderTop: 'solid 2px #1C1C1D' } :
                                                { borderRadius: '0' }
                                        }>
                                            <NavLink to='/login'>Login</NavLink>
                                        </div>
                                        <div className='qwerty-shop-navbar-user-dropdown-option-0' style={
                                            { borderRadius: '0 0 12px 12px', borderBottom: 'solid 2px #1C1A23' }
                                        }>
                                            <NavLink to='/signup'>Sign Up</NavLink>
                                        </div>
                                    </>
                                )
                            }
                        </div>

                    </div>
                    <div>
                        <NavLink to='/cart'>
                            <i className="fas fa-shopping-cart" />
                        </NavLink>
                    </div>
                </nav>
            </div>
        </header >
    );
}

export default withRouter(NavBar);
