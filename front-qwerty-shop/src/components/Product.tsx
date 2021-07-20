import {
    NavLink,
    useParams
} from "react-router-dom";
import { gql, useQuery } from '@apollo/client';
import { motion } from 'framer-motion';

import { pageVariants } from './Home';
import LoadingSpinner from './LoadingSpinner';

const FIND_ITEMS_BY_TYPE = gql`
  query getItemsByType($type: String!) {
    getItemsByType(type: $type) {
        item {
            id,
            name,
            image,
            description,
            type,
        },
        variations {
            option,
            variant,
            quantity,
            price,
            image,
        }
    }
  }
`;

const Product = () => {
    const { productType } = useParams<{ productType: string }>();
    const testLoading = false;
    document.title = `QWERTY Shop - ${productType.charAt(0).toUpperCase() + productType.slice(1)}`;
    const { loading, error, data } = useQuery(FIND_ITEMS_BY_TYPE, {
        fetchPolicy: "cache-and-network",
        nextFetchPolicy: "cache-first",
        variables: { type: productType }
    });
    const loadingText = 'Finding wonderful items!'.split('');

    return (
        <motion.div
            initial='enter'
            animate='center'
            exit='exit'
            transition={{ duration: 0.5 }}
            variants={pageVariants}
            className='qwerty-shop-app-page-transition'
        >
            {loading || testLoading ? (
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
                            <NavLink to={'/products'} className='qwerty-shop-item-back-btn'>{'<'} Back to Products</NavLink>
                            <div className='qwerty-shop-item-list'>
                                {data && data.getItemsByType ? (
                                    data.getItemsByType.map((itemRes: any) => {
                                        const itemVariations = itemRes.variations;
                                        const item = itemRes.item;
                                        let itemPricesToSort: any = [];

                                        for (let i = 0; i < itemVariations.length; i++) {
                                            const price = parseFloat(itemVariations[i].price).toFixed(2);
                                            itemPricesToSort.push(price)
                                        }

                                        itemPricesToSort.sort();

                                        return (
                                            <NavLink to={`/item/${item.id}`} className='qwerty-shop-item-container a-reset' key={`qwerty-shop-item-${item.name}`}>
                                                <img className='qwerty-shop-item-image' src={item.image} alt='item-img' />
                                                <div className='qwerty-shop-item-name'>{item.name}</div>
                                                <div className='qwerty-shop-item-price'>${itemPricesToSort[0]} - ${itemPricesToSort[itemPricesToSort.length - 1]}</div>
                                            </NavLink>
                                        )
                                    })
                                ) : null}
                            </div>
                        </>
                    )}
                </>
            )
            }
        </motion.div >
    );
}

export default Product;
