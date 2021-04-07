import { useMutation } from '@apollo/client';
import { motion } from 'framer-motion';
import { NavLink, withRouter } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications'

import { ADD_CART_TO_USER } from './Item';
import { pageVariants } from './Home';
import LoadingSpinner from './LoadingSpinner';

const Checkout = (props: any) => {
    document.title = 'QWERTY Shop - Checkout';
    const { addToast, removeAllToasts } = useToasts();
    const userInfo = props.checkCachedUser();
    const addresses = userInfo.addresses;
    const cart = userInfo.cart;
    const loadingText = 'Checking out items!'.split('');

    const [checkoutItems, { loading: checkoutLoading }] = useMutation(ADD_CART_TO_USER, {
        update(_) {
            removeAllToasts();
            addToast('Order completed.', {
                appearance: 'success',
                autoDismiss: true,
            });
        }
    });

    let totalPrice = 0;
    if (cart && cart.length > 0) {
        cart.forEach((item: any) => {
            const { price, quantity } = item;
            totalPrice += (price * quantity);
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
                checkoutLoading ? (
                    <div className='qwerty-shop-loading-full'>
                        <LoadingSpinner />
                        <div className='qwerty-shop-loading-text-container'>
                            {
                                loadingText.map((char, idx) => (
                                    <div
                                        className={`qwerty-shop-loading-text-${idx}`}
                                        key={`qwerty-shop-checkout-loading-text-${idx}`}
                                    >
                                        {char}
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                ) : (
                    <div className='qwerty-shop-cart'>
                        <div className='qwerty-shop-cart-title'>Checkout</div>
                        <div className='qwerty-shop-checkout-items-container'>
                            {cart && cart.length > 0 ?
                                (
                                    cart.map((cartItem: any) => (
                                        <div className='qwerty-shop-cart-item' key={`checkout ${cartItem.itemId} ${cartItem.color} ${cartItem.size}`}>
                                            <div className='qwerty-shop-cart-item-image'>{cartItem.image}</div>
                                            <div className='qwerty-shop-cart-item-info-container'>
                                                <NavLink to={`/item/${cartItem.itemId}`} className='qwerty-shop-cart-item-info-name'>{cartItem.name}</NavLink>
                                                <div>Color: <span className='qwerty-shop-cart-item-info-color'>{cartItem.color}</span> </div>
                                                <div>Size: <span className='qwerty-shop-cart-item-info-size'>{cartItem.size}</span>
                                                </div>
                                            </div>
                                            <div>
                                                <div className='qwerty-shop-cart-item-price'>Price per: ${cartItem.price}</div>
                                                <div className='qwerty-shop-cart-item-quantity'>Qty: {cartItem.quantity}</div>
                                            </div>
                                        </div>
                                    ))
                                ) : <div style={{ textAlign: 'center' }}>Cart is empty!</div>
                            }
                        </div>
                        <div className='qwerty-shop-checkout-addresses-container'>
                            {
                                addresses && addresses.length > 0 ? (
                                    <>
                                        {
                                            addresses.map((address: any) => (
                                                <div key={`checkout address ${address.fullName}`}>

                                                </div>
                                            ))
                                        }
                                    </>
                                ) : (
                                    <div>Add an address to complete checkout!</div>
                                )
                            }
                        </div>
                        <div className='qwerty-shop-cart-total'>Total: ${totalPrice}</div>
                        <div className='qwerty-shop-cart-buttons-container'>
                            {
                                cart && cart.length > 0 ? (
                                    <div>Confirm Checkout</div>
                                ) : <div className='qwerty-shop-cart-checkoutCrossed'>Confirm Checkout</div>
                            }

                            <button onClick={() => props.history.push('/cart')}>Cancel</button>
                        </div>
                    </div>
                )
            }
        </motion.div>
    );
}

export default withRouter(Checkout);
