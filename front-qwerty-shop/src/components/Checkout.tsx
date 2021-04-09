import { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { motion } from 'framer-motion';
import { NavLink, withRouter } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications'

import { pageVariants } from './Home';
import LoadingSpinner from './LoadingSpinner';

export const CHECK_OUT = gql`
  mutation checkoutOrder($CartInput: CartInput!, $AddAddressInput: AddAddressInput!) {
    checkoutOrder(cart: $CartInput, address: $AddAddressInput) {
        address {
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
        items {
            itemId,
            image,
            color,
            size,
            quantity,
            name,
            price
        },
        saleDate,
    }
  }
`;

const Checkout = (props: any) => {
    document.title = 'QWERTY Shop - Checkout';
    const { addToast, removeAllToasts } = useToasts();
    const [currentAddressIdx, setAddressIdx] = useState(0);
    const userInfo = props.checkCachedUser();
    const addresses = JSON.parse(JSON.stringify(userInfo.addresses)).sort((a: any, b: any) => {
        const aVal = a.default ? 1 : -1;
        const bVal = b.default ? 1 : -1;

        return bVal - aVal;
    });
    const cart = JSON.parse(JSON.stringify(userInfo.cart));
    const loadingText = 'Checking out items!'.split('');

    const [checkoutItems, { loading: checkoutLoading }] = useMutation(CHECK_OUT, {
        update(_) {
            removeAllToasts();
            addToast('Order completed.', {
                appearance: 'success',
                autoDismiss: true,
            });

            props.history.push('/profile');
        }
    });

    let totalPrice = 0;
    if (cart && cart.length > 0) {
        cart.forEach((item: any) => {
            const { price, quantity } = item;
            totalPrice += (price * quantity);
        })
    }

    const handleCheckout = () => {
        cart.forEach((cartItem: any) => delete cartItem.__typename);
        delete addresses[currentAddressIdx].__typename;

        checkoutItems({ variables: { CartInput: { items: cart }, AddAddressInput: addresses[currentAddressIdx] } }).catch(e => {
            removeAllToasts();
            addToast(e.message, {
                appearance: 'error',
                autoDismiss: true,
            });
        });
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
                        <div className='qwerty-shop-checkout-addresses-title'>Address to ship to</div>
                        <div className='qwerty-shop-checkout-addresses-container'>
                            {
                                addresses && addresses.length > 0 ? (
                                    <form>
                                        {
                                            addresses.map((address: any, idx: number) => {
                                                const {
                                                    addressLineOne,
                                                    city,
                                                    fullName,
                                                    state,
                                                    zipCode,
                                                } = address;

                                                return (
                                                    <div className='qwerty-shop-checkout-item' key={`checkout address ${address.fullName}`}>
                                                        <input
                                                            type='radio'
                                                            id={`address-${idx}`}
                                                            name='address-idx'

                                                            checked={currentAddressIdx === idx}
                                                            onChange={() => setAddressIdx(idx)}
                                                        />
                                                        <label htmlFor={`address-${idx}`}>
                                                            <span className='qwerty-shop-address-fullName'>{fullName}, </span> {addressLineOne}, {city}, {state} {zipCode}
                                                        </label>
                                                    </div>
                                                )
                                            })
                                        }
                                    </form>
                                ) : (
                                    <div>Add an address to complete checkout!</div>
                                )
                            }
                        </div>
                        <div className='qwerty-shop-checkout-total'>Total: ${totalPrice}</div>
                        <div className='qwerty-shop-cart-buttons-container'>
                            {
                                cart && cart.length > 0 && addresses && Object.keys(addresses[currentAddressIdx]).length > 0 ? (
                                    <div onClick={handleCheckout}>Confirm Checkout</div>
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
