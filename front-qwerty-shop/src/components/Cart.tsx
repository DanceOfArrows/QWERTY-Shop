import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';

import { pageVariants } from './Home';
import LoadingSpinner from './LoadingSpinner';

const Cart = (props: any) => {
    document.title = 'QWERTY Shop - Cart';
    const userInfo = props.checkCachedUser();

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
            </div>
        </motion.div>
    );
}

export default Cart;
