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

const FIND_ITEMS_BY_ID = gql`
  query getItemById($itemId: Float!) {
    getItemById(itemId: $itemId) {
        item {
            id,
            name,
            image,
            description,
            type
        },
        variations {
            id,
            option,
            variant,
            quantity,
            price,
            image,
        }
    }
  }
`;

export const ADD_ITEM_TO_CART = gql`
  mutation addToCart($itemInfo: AddItemToCartInput!) {
    addToCart(itemInfo: $itemInfo)
  }
`;

const Item = (props: any) => {
    const { addToast, removeAllToasts } = useToasts();
    const { itemId } = useParams<{ itemId: string }>();
    const token = localStorage.getItem('token');
    const itemIdNum = Number.parseInt(itemId, 10);

    const { loading, error, data } = useQuery(FIND_ITEMS_BY_ID, {
        fetchPolicy: "cache-and-network",
        nextFetchPolicy: "cache-first",
        variables: { itemId: itemIdNum }
    });

    const [addItemToCart] = useMutation(ADD_ITEM_TO_CART, {
        update(_) {
            removeAllToasts();
            addToast('Successfully added item to cart.', {
                appearance: 'success',
                autoDismiss: true,
            });
        }
    });

    const loadingText = 'Getting item details!'.split('');
    const getItemRes = data && data.getItemById ? data.getItemById : null;
    let options: any = [];
    let variants: any = [];
    let images: any = getItemRes ? [getItemRes.item.image] : [];
    let CIPQS: any = {};

    if (getItemRes) {
        for (let i = 0; i < getItemRes.variations.length; i++) {
            const { id: variantId, option, variant, image, price, quantity } = getItemRes.variations[i];

            options.push(option);
            if (!variants.includes(variant)) variants.push(variant);
            images.push(image);

            CIPQS[option] = {
                image,
                [variant]: {
                    variantId,
                    price: parseFloat(getItemRes.variations[i].price).toFixed(2),
                    quantity
                }
            };
        }

        document.title = getItemRes.item.name;
    };

    const [currentOption, setcurrentOption] = useState(options[0]);
    const [currentVariant, setcurrentVariant] = useState(variants[0]);
    const [currentQuantity, setCurrentQuantity] = useState(1);
    const [currentImageIdx, setCurrentImageIdx] = useState(0);

    if (options.length > 0 && !currentOption) setcurrentOption(options[0]);
    if (variants.length > 0 && !currentVariant) setcurrentVariant(variants[0]);

    const categoryName = data && data.getItemById.item ?
        data.getItemById.item.type :
        null;

    const addToCart = () => {
        const variantId = (CIPQS[currentOption][currentVariant].variantId);

        addItemToCart({
            variables: {
                itemInfo: { variantId, quantity: currentQuantity }
            }
        }).catch(e => addToast(e.message, {
            appearance: 'error',
            autoDismiss: true,
        }));
    };

    const handleQuantityChange = (e: any, isIncrement?: boolean) => {
        const targetToInt = Number.parseInt(e.target.value, 10);

        if (targetToInt && (
            targetToInt < 1 ||
            targetToInt > CIPQS[currentOption][currentVariant].quantity
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
            { !error && (loading || !getItemRes || Object.keys(CIPQS).length === 0 || !currentOption) ? (
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
                                <NavLink to={`/products/${categoryName}`} className='qwerty-shop-item-back-btn'>{'<'} Back to {categoryName}</NavLink>
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
                                                        key={`main-image-${image}`}
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
                                                        onClick={() => {
                                                            setCurrentImageIdx(idx)
                                                        }}
                                                        key={`sub-image-${image}`}
                                                    />
                                                ))
                                            }
                                        </div>
                                    </div>
                                    <div className='qwerty-shop-item-info-right'>
                                        <div className='qwerty-shop-item-name'>{getItemRes.item.name}</div>
                                        <div className='qwerty-shop-item-price'>${CIPQS[currentOption][currentVariant].price}</div>
                                        <div className='qwerty-shop-item-quantity'>Stock: {CIPQS[currentOption][currentVariant].quantity}</div>
                                        <div className='qwerty-shop-item-section-container'>
                                            <div className='qwerty-shop-item-label'>Options:</div>
                                            <div className='qwerty-shop-item-options'>
                                                {options.map((option: any) => {
                                                    const selectedClass = option === currentOption ? 'qwerty-shop-item-variation-selected' : '';
                                                    return (
                                                        <div
                                                            className={`qwerty-shop-item-variation-btn ${selectedClass}`}
                                                            key={`qwerty-shop-${getItemRes.item.name}-${option}`}
                                                            onClick={
                                                                () => {
                                                                    setcurrentOption(option);
                                                                    for (let i = 0; i < images.length; i++) {
                                                                        if (images[i] === CIPQS[option]['image']) setCurrentImageIdx(i);
                                                                    }
                                                                    if (!CIPQS[option][currentVariant]) setcurrentVariant(Object.keys(CIPQS[option])[1])
                                                                    setCurrentQuantity(1);
                                                                }
                                                            }
                                                        >
                                                            {option}
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                        <div className='qwerty-shop-item-section-container'>
                                            <div className='qwerty-shop-item-label'>Variants:</div>
                                            <div className='qwerty-shop-item-variants'>
                                                {variants.map((variant: any) => {
                                                    if (CIPQS[currentOption][variant] && CIPQS[currentOption][variant].quantity > 0) {
                                                        const selectedClass = variant === currentVariant ? 'qwerty-shop-item-variation-selected' : '';
                                                        return (
                                                            <div
                                                                className={`qwerty-shop-item-variation-btn ${selectedClass}`}
                                                                key={`qwerty-shop-${getItemRes.item.name}-${variant}`}
                                                                onClick={() => {
                                                                    setcurrentVariant(variant)
                                                                    setCurrentQuantity(1);
                                                                }}
                                                            >
                                                                {variant}
                                                            </div>
                                                        )
                                                    } else {
                                                        return (
                                                            <div
                                                                className='qwerty-shop-item-variation-unavailable-btn'
                                                                key={`qwerty-shop-${getItemRes.item.name}-${variant}`}
                                                            >
                                                                {variant}
                                                            </div>
                                                        )
                                                    }
                                                })}
                                            </div>
                                        </div>
                                        <div className='qwerty-shop-item-section-container'>
                                            <div className='qwerty-shop-item-label'>Description: </div>
                                            <div className='qwerty-shop-item-description'>{getItemRes.item.description}</div>
                                        </div>
                                        <div className='qwerty-shop-item-section-container qwerty-shop-item-quantity-container'>
                                            <input
                                                type='number'
                                                className='qwerty-shop-item-quantity-input'
                                                min='1'
                                                max={CIPQS[currentOption][currentVariant].quantity}
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
