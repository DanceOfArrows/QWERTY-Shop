import { useMutation } from '@apollo/client';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications'

import { ADD_ITEM_TO_CART } from './Item';
import { pageVariants } from './Home';
import LoadingSpinner from './LoadingSpinner';

const Cart = (props: any) => {
    document.title = 'QWERTY Shop - Cart';
    const { addToast, removeAllToasts } = useToasts();
    const userInfo = props.checkCachedUser();
    const cart = userInfo.cart;
    const loadingText = 'Emptying cart!'.split('');

    const [addItemToCart, { loading: cartLoading }] = useMutation(ADD_ITEM_TO_CART, {
        update(_) {
            removeAllToasts();
            addToast('Successfully emptied cart.', {
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

    const handleEmptyCart = () => {
        if (userInfo.cart.length === 0) {
            removeAllToasts();
            addToast('Cart is already empty.', {
                appearance: 'info',
                autoDismiss: true,
            });
            return;
        }
        addItemToCart({ variables: { CartInput: { items: [] } } }).catch(e => {
            removeAllToasts();
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
                                    cart.map((cartItem: any) => (
                                        <div className='qwerty-shop-cart-item' key={`cart ${cartItem.itemId} ${cartItem.color} ${cartItem.size}`}>
                                            <img className='qwerty-shop-cart-item-image' src={cartItem.image} alt='item image' />
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
                        <div className='qwerty-shop-cart-total'>Total: ${totalPrice}</div>
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
