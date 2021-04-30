
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';

import { pageVariants } from './Home';
import * as BackgroundImages from '../images/exportImages';

const ProductCategories = () => {
    return (
        <>
            <div className='qwerty-shop-home-product-container'>
                <div
                    className='qwerty-shop-home-product-category'
                    style={{ backgroundImage: `url(${BackgroundImages.Accessories})` }}
                >
                    <div className='qwerty-shop-home-product-category-cover' />
                    <NavLink to='/products/Accessories'>Accessories</NavLink>
                </div>
                <div
                    className='qwerty-shop-home-product-category'
                    style={{ backgroundImage: `url(${BackgroundImages.Cases})` }}
                >
                    <div className='qwerty-shop-home-product-category-cover' />
                    <NavLink to='/products/Cases'>
                        Cases
                    </NavLink>
                </div>
                <div
                    className='qwerty-shop-home-product-category'
                    style={{ backgroundImage: `url(${BackgroundImages.DIYKits})` }}
                >
                    <div className='qwerty-shop-home-product-category-cover' />
                    <NavLink to='/products/DIY Kits'>
                        DIY Kits
                    </NavLink>
                </div>
                <div
                    className='qwerty-shop-home-product-category'
                    style={{ backgroundImage: `url(${BackgroundImages.Keycaps})` }}
                >
                    <div className='qwerty-shop-home-product-category-cover' />
                    <NavLink to='/products/Keycaps'>
                        Keycaps
                    </NavLink>
                </div>
                <div
                    className='qwerty-shop-home-product-category'
                    style={{ backgroundImage: `url(${BackgroundImages.NewArrivals})` }}
                >
                    <div className='qwerty-shop-home-product-category-cover' />
                    <NavLink to='/products/New Arrivals'>
                        New Arrivals
                    </NavLink>
                </div>
                <div
                    className='qwerty-shop-home-product-category'
                    style={{ backgroundImage: `url(${BackgroundImages.Switches})` }}
                >
                    <div className='qwerty-shop-home-product-category-cover' />
                    <NavLink to='/products/Switches'>
                        Switches
                    </NavLink>
                </div>
            </div>
        </>
    );
}

export default ProductCategories;
