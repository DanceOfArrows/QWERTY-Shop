import { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { motion } from 'framer-motion';
import { NavLink, withRouter } from 'react-router-dom';
import { useToasts } from 'react-toast-notifications'

import { calcTotalPrice } from './Cart';
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
    const addresses = userInfo.addresses && userInfo.addresses.length > 0 ? JSON.parse(JSON.stringify(userInfo.addresses)).sort((a: any, b: any) => {
        const aVal = a.default ? 1 : -1;
        const bVal = b.default ? 1 : -1;

        return bVal - aVal;
    }) : [];
    const cart = JSON.parse(JSON.stringify(userInfo.cart));
    console.log(cart)
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
    const totalPriceDisplay = parseFloat(totalPrice.toString()).toFixed(2);

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
                                    <div style={{ textAlign: 'center' }}>Add an address to complete checkout!</div>
                                )
                            }
                        </div>
                        <div className='qwerty-shop-checkout-total'>Total: ${calcTotalPrice(cart)}</div>
                        <div className='qwerty-shop-cart-buttons-container'>
                            {
                                cart && cart.length > 0 && addresses.length > 0 && Object.keys(addresses[currentAddressIdx]).length > 0 ? (
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
