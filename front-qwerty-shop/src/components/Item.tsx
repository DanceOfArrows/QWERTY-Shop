import { useState } from 'react';
import {
    NavLink,
    useParams
} from "react-router-dom";
import { gql, useMutation, useQuery } from '@apollo/client';
import { motion } from 'framer-motion';
import { useToasts } from 'react-toast-notifications'

import { pageVariants } from './Home';
import LoadingSpinner from './LoadingSpinner';

const FIND_ITEMS_BY_NAME = gql`
  query findItemById($itemId: String!) {
    findItemById(itemId: $itemId) {
        item {
            CIPQS {
                color,
                image,
                variants {
                    price,
                    quantity,
                    size
                }
            },
            description,
            displayImage,
            name,
            _id,
        },
        type
    }
  }
`;

export const ADD_CART_TO_USER = gql`
  mutation addCartToUser($CartInput: CartInput!) {
    addCartToUser(cart: $CartInput) {
        cart {
            itemId,
            image,
            color,
            size,
            quantity,
            name,
            price
        },
    }
  }
`;

const Item = (props: any) => {
    const { addToast, removeAllToasts } = useToasts();
    const { itemId } = useParams<{ itemId: string }>();
    const token = localStorage.getItem('token');

    const { loading, error, data } = useQuery(FIND_ITEMS_BY_NAME, {
        fetchPolicy: "cache-and-network",
        nextFetchPolicy: "cache-first",
        variables: { itemId }
    });

    const [addCartToUser, cartLoading] = useMutation(ADD_CART_TO_USER, {
        update(_) {
            removeAllToasts();
            addToast('Successfully added item to cart.', {
                appearance: 'success',
                autoDismiss: true,
            });
        }
    });

    const loadingText = 'Getting item details!'.split('');
    const item = data && data.findItemById ? data.findItemById.item : null;
    let CIPQS: any = {};
    let sizes: any = [];
    let images: any = [item.displayImage];

    if (item) {
        item.CIPQS.forEach((itemColor: any) => {
            CIPQS[itemColor.color] = {};
            for (let i = 0; i < itemColor.variants.length; i++) {
                const variantData = itemColor.variants[i];
                const { price, quantity, size } = variantData;

                CIPQS[itemColor.color][size] = { price, quantity };
                CIPQS[itemColor.color]['image'] = itemColor.image;
                images.push(itemColor.image);

                if (!sizes.includes(size)) sizes.push(size);
            };
        });
        document.title = item.name;
    };

    let colors: any = Object.keys(CIPQS);
    const [currentColor, setCurrentColor] = useState(colors[0]);
    const [currentSize, setCurrentSize] = useState(sizes[0]);
    const [currentQuantity, setCurrentQuantity] = useState(1);
    const [currentImageIdx, setCurrentImageIdx] = useState(0);

    if (colors.length > 0 && !currentColor) setCurrentColor(colors[0]);
    if (sizes.length > 0 && !currentSize) setCurrentSize(sizes[0]);

    const categoryName = data && data.findItemById.type ?
        data.findItemById.type.charAt(0).toUpperCase() + data.findItemById.type.slice(1) :
        null;

    const addToCart = () => {
        const { checkCachedUser, client } = props;
        const existingUser = checkCachedUser();

        /* Do all the cart stuff and management */
        let cart = existingUser && existingUser.cart && existingUser.cart.length > 0 ?
            JSON.parse(JSON.stringify(existingUser.cart)) :
            [];

        if (cart && cart.length > 0) {
            let doesItemExist = false;
            /* Loop through cart and check if item exists */
            for (let i = 0; i < cart.length; i++) {
                if (cart[i].itemId === item._id && cart[i].color === currentColor && cart[i].size === currentSize) {
                    if (cart[i].quantity + currentQuantity > CIPQS[currentColor][currentSize].quantity) {
                        removeAllToasts();
                        addToast('Failed to add item to cart.  Total quantity exceeds available amount.', {
                            appearance: 'error',
                            autoDismiss: true,
                        });
                        return;
                    } else {
                        console.log(cart[i])
                        doesItemExist = true;
                        cart[i].quantity += currentQuantity;
                    }
                }
            }

            if (!doesItemExist) cart.push({
                itemId: item._id,
                color: currentColor,
                size: currentSize,
                quantity: currentQuantity,
                image: CIPQS[currentColor]['image'],
                name: item.name,
                price: CIPQS[currentColor][currentSize].price
            });
        } else {
            cart.push({
                itemId: item._id,
                color: currentColor,
                size: currentSize,
                quantity: currentQuantity,
                image: CIPQS[currentColor]['image'],
                name: item.name,
                price: CIPQS[currentColor][currentSize].price
            });
        }

        /* Remove __typename from cart items */
        cart.forEach((cartItem: any) => delete cartItem.__typename);

        /* Write data to user */
        if (existingUser && token) {
            addCartToUser({ variables: { CartInput: { items: cart } } }).catch(e => {
                removeAllToasts();
                addToast(e.message, {
                    appearance: 'error',
                    autoDismiss: true,
                });
            })
        }
    };

    const handleQuantityChange = (e: any, isIncrement?: boolean) => {
        const targetToInt = Number.parseInt(e.target.value, 10);

        if (targetToInt && (
            targetToInt < 1 ||
            targetToInt > CIPQS[currentColor][currentSize].quantity
        ) && e.target.value != ''
        ) return;

        if (isIncrement && isIncrement != undefined) {
            setCurrentQuantity(currentQuantity + 1);
        } else if (!isIncrement && isIncrement != undefined) {
            if (currentQuantity === 1) return;
            setCurrentQuantity(currentQuantity - 1);
        } else {
            setCurrentQuantity(targetToInt);
        }
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
            {loading || !item || Object.keys(CIPQS).length === 0 || !currentColor ? (
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
                    { error ? <p style={{ color: 'red' }}>{error.message}</p> : (
                        <>
                            <div className='qwerty-shop-item-page'>
                                <NavLink to={`/products/${data.findItemById.type}`} className='qwerty-shop-item-back-btn'>{'<'} Back to {categoryName}</NavLink>
                                <div className='qwerty-shop-item-info-container'>
                                    <div className='qwerty-shop-item-info-left'>
                                        <div className='qwerty-shop-item-image-container'>
                                            {
                                                images.map((image: string, idx: number) => (
                                                    <img
                                                        className='qwerty-shop-item-image-main'
                                                        src={image}
                                                        alt='Main Display Image'
                                                        style={idx === currentImageIdx ? { opacity: 1 } : { opacity: 0 }}
                                                    />
                                                ))
                                            }
                                        </div>
                                        <div className='qwerty-shop-item-image-list'>
                                            {
                                                images.map((image: string, idx: number) => (
                                                    <img
                                                        className={
                                                            idx === currentImageIdx ?
                                                                'qwerty-shop-item-image-sub-active' :
                                                                'qwerty-shop-item-image-sub'

                                                        }
                                                        src={image}
                                                        alt='Main Display Image'
                                                    />
                                                ))
                                            }
                                        </div>
                                    </div>
                                    <div className='qwerty-shop-item-info-right'>
                                        <div className='qwerty-shop-item-name'>{item.name}</div>
                                        <div className='qwerty-shop-item-price'>${CIPQS[currentColor][currentSize].price}</div>
                                        <div className='qwerty-shop-item-quantity'>Stock: {CIPQS[currentColor][currentSize].quantity}</div>
                                        <div className='qwerty-shop-item-section-container'>
                                            <div className='qwerty-shop-item-label'>Colors:</div>
                                            <div className='qwerty-shop-item-colors'>
                                                {colors.map((color: any) => {
                                                    if (CIPQS[color][currentSize] && CIPQS[color][currentSize].quantity > 0) {
                                                        const selectedClass = color === currentColor ? 'qwerty-shop-item-variation-selected' : '';
                                                        return (
                                                            <div
                                                                className={`qwerty-shop-item-variation-btn ${selectedClass}`}
                                                                key={`qwerty-shop-${item.name}-${color}`}
                                                                onClick={() => setCurrentColor(color)}
                                                            >
                                                                {color}
                                                            </div>
                                                        )
                                                    } else {
                                                        return (
                                                            <div
                                                                className='qwerty-shop-item-variation-unavailable-btn'
                                                                key={`qwerty-shop-${item.name}-${color}`}
                                                            >
                                                                {color}
                                                            </div>
                                                        )
                                                    }
                                                })}
                                            </div>
                                        </div>
                                        <div className='qwerty-shop-item-section-container'>
                                            <div className='qwerty-shop-item-label'>Sizes:</div>
                                            <div className='qwerty-shop-item-sizes'>
                                                {sizes.map((size: any) => {
                                                    if (CIPQS[currentColor][size] && CIPQS[currentColor][size].quantity > 0) {
                                                        const selectedClass = size === currentSize ? 'qwerty-shop-item-variation-selected' : '';
                                                        return (
                                                            <div
                                                                className={`qwerty-shop-item-variation-btn ${selectedClass}`}
                                                                key={`qwerty-shop-${item.name}-${size}`}
                                                                onClick={() => setCurrentSize(size)}
                                                            >
                                                                {size}
                                                            </div>
                                                        )
                                                    } else {
                                                        return (
                                                            <div
                                                                className='qwerty-shop-item-variation-unavailable-btn'
                                                                key={`qwerty-shop-${item.name}-${size}`}
                                                            >
                                                                {size}
                                                            </div>
                                                        )
                                                    }
                                                })}
                                            </div>
                                        </div>
                                        <div className='qwerty-shop-item-section-container'>
                                            <div className='qwerty-shop-item-label'>Description: </div>
                                            <div className='qwerty-shop-item-description'>{item.description}</div>
                                        </div>
                                        <div className='qwerty-shop-item-section-container qwerty-shop-item-quantity-container'>
                                            <input
                                                type='number'
                                                className='qwerty-shop-item-quantity-input'
                                                min='1'
                                                max={CIPQS[currentColor][currentSize].quantity}
                                                onChange={handleQuantityChange}
                                                step='1'
                                                value={currentQuantity}
                                            />
                                            <div className='qwerty-shop-item-quantity-nav'>
                                                <div
                                                    className='qwerty-shop-item-quantity-button qwerty-shop-item-quantity-up'
                                                    onClick={(e) => handleQuantityChange(e, true)}
                                                >+</div>
                                                <div
                                                    className='qwerty-shop-item-quantity-button qwerty-shop-item-quantity-down'
                                                    onClick={(e) => handleQuantityChange(e, false)}
                                                >-</div>
                                            </div>
                                            {
                                                token ? (
                                                    <div className='qwerty-shop-item-addToCart' onClick={addToCart}>Add to Cart</div>
                                                ) : (
                                                    <div className='qwerty-shop-item-addToCart-noToken'>Sign in to add to cart!</div>
                                                )
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </>
            )}
        </motion.div >
    );
}

export default Item;
