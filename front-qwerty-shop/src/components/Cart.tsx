import { useEffect } from 'react';
import { gql, useMutation } from '@apollo/client';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications'

import { pageVariants } from './Home';
import LoadingSpinner from './LoadingSpinner';

export const calcTotalPrice = (cart: any) => {
    let totalPrice = 0;
    if (cart && cart.length > 0) {
        cart.forEach((item: any) => {
            const price = item.item_variation.price;
            const quantity = item.quantity;
            totalPrice += (price * quantity);
        })
    };
    return parseFloat(totalPrice.toString()).toFixed(2);
};

const EMPTY_CART = gql`
  mutation emptyCart {
    emptyCart
  }
`;

const Cart = (props: any) => {
    document.title = 'QWERTY Shop - Cart';
    const { addToast, removeAllToasts } = useToasts();
    const userInfo = props.checkCachedUser();
    const cart = userInfo.cart;
    const loadingText = 'Emptying cart!'.split('');

    const [emptyCart, { loading: cartLoading }] = useMutation(EMPTY_CART, {
        update(_) {
            props.getUserInfo();
            removeAllToasts();
            addToast('Successfully emptied cart.', {
                appearance: 'success',
                autoDismiss: true,
            });
        }
    });

    const handleEmptyCart = () => {
        if (userInfo.cart.length === 0) {
            removeAllToasts();
            addToast('Cart is already empty.', {
                appearance: 'info',
                autoDismiss: true,
            });
            return;
        }
        emptyCart({ variables: { CartInput: { items: [] } } }).catch(e => {
            removeAllToasts();
            console.log(e)
            addToast(e.message, {
                appearance: 'error',
                autoDismiss: true,
            });
        })
    }

    return (
        <motion.div
            initial='enter'
            animate='center'
            exit='exit'
            transition={{ duration: 0.5 }}
            variants={pageVariants}
            className='qwerty-shop-app-page-transition'
        >
            {
                cartLoading ? (
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
                    <div className='qwerty-shop-cart'>
                        <div className='qwerty-shop-cart-title'>Cart</div>
                        <div className='qwerty-shop-cart-items-container'>
                            {cart && cart.length > 0 ?
                                (
                                    cart.map((cartItem: any) => {
                                        const { item, item_variation, quantity } = cartItem;
                                        const { id: itemId, name } = item;
                                        const {
                                            id: itemVariationId,
                                            image,
                                            option,
                                            variant,
                                            price
                                        } = item_variation;
                                        const displayPrice = parseFloat(price).toFixed(2);

                                        return (
                                            <div className='qwerty-shop-cart-item' key={`cart ${itemVariationId}`}>
                                                <img className='qwerty-shop-cart-item-image' src={image} alt='item image' />
                                                <div className='qwerty-shop-cart-item-info-container'>
                                                    <NavLink to={`/item/${itemId}`} className='qwerty-shop-cart-item-info-name'>{name}</NavLink>
                                                    <div>Option: <span className='qwerty-shop-cart-item-info-color'>{option}</span> </div>
                                                    <div>Variant: <span className='qwerty-shop-cart-item-info-size'>{variant}</span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className='qwerty-shop-cart-item-price'>Price per: ${displayPrice}</div>
                                                    <div className='qwerty-shop-cart-item-quantity'>Qty: {quantity}</div>
                                                </div>
                                            </div>
                                        )
                                    })
                                ) : <div style={{ textAlign: 'center' }}>Cart is empty!</div>
                            }
                        </div>
                        <div className='qwerty-shop-cart-total'>Total: ${calcTotalPrice(cart)}</div>
                        <div className='qwerty-shop-cart-buttons-container'>
                            {
                                cart && cart.length > 0 ? (
                                    <NavLink to='/checkout'>Checkout</NavLink>
                                ) : <div className='qwerty-shop-cart-checkoutCrossed'>Checkout</div>
                            }

                            <button onClick={handleEmptyCart}>Empty Cart</button>
                        </div>
                    </div>
                )
            }
        </motion.div>
    );
}

export default Cart;
