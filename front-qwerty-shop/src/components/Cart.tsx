import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';

import { pageVariants } from './Home';
import LoadingSpinner from './LoadingSpinner';

const Cart = (props: any) => {
    document.title = 'QWERTY Shop - Cart';
    const userInfo = props.checkCachedUser();
    const localCart = localStorage.getItem('localCart') ? JSON.parse(localStorage.getItem('localCart') || '[]') : [];
    const cart = !userInfo || !userInfo._id ?
        localCart && localCart.length > 0 ? localCart : [] :
        userInfo && userInfo._id ? userInfo.cart : [];

    console.log(userInfo)
    console.log(cart);

    return (
        <motion.div
            initial='enter'
            animate='center'
            exit='exit'
            transition={{ duration: 0.5 }}
            variants={pageVariants}
            className='qwerty-shop-app-page-transition'
        >
            <div className='qwerty-shop-cart'>
                <div className='qwerty-shop-cart-title'>Cart</div>
                <div className='qwerty-shop-cart-items-container'>
                    {cart && cart.length > 0 ?
                        (
                            cart.map((cartItem: any) => (
                                <div className='qwerty-shop-cart-item'>
                                    <div className='qwerty-shop-cart-item-image'>{cartItem.image}</div>
                                    <div className='qwerty-shop-cart-item-info-container'>
                                        <NavLink to={`/item/${cartItem.itemId}`} className='qwerty-shop-cart-item-info-name'>{cartItem.name}</NavLink>
                                        <div>Color: <span className='qwerty-shop-cart-item-info-color'>{cartItem.color}</span> </div>
                                        <div>Size: <span className='qwerty-shop-cart-item-info-size'>{cartItem.size}</span>
                                        </div>
                                    </div>
                                    <div className='qwerty-shop-cart-item-quantity'>Qty: {cartItem.quantity}</div>
                                </div>
                            ))
                        ) : <div>Cart is empty!</div>
                    }
                </div>
            </div>
        </motion.div>
    );
}

export default Cart;
