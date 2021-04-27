import React from 'react';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import Slider from "@farbenmeer/react-spring-slider";
import { ProductCategories } from './exportComponents';

export const pageVariants = {
    enter: { opacity: 0, y: '-100vh' },
    center: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: '-100vh' }
};

const Home = () => {
    document.title = 'QWERTY Shop';
    const images = [
        'https://i.imgur.com/fnkcmQo.png',
        'https://i.imgur.com/5122bah.jpeg',
        'https://i.imgur.com/QlCwVVy.png',
        'https://i.imgur.com/p7b9tyE.png',
        'https://i.imgur.com/4aeX581.png'
    ];

    return (
        <motion.div
            initial='enter'
            animate='center'
            exit='exit'
            transition={{ duration: 0.5 }}
            variants={pageVariants}
            className='qwerty-shop-app-page-transition'
        >
            <div className='qwerty-shop-home-carousel-overlay' />
            <div className='qwerty-shop-home-carousel-image-wrapper'>
                <Slider
                    auto={5000}
                >
                    {images.map(image => (
                        <img
                            className='qwerty-shop-home-carousel-image'
                            src={image}
                            key={`qwerty-shop-home-carousel-image-${image}`}
                        />
                    ))}
                </Slider>
            </div>
            <div className='qwerty-shop-home-hero-text'>
                [Featured] Kat Eternal Keycaps Set
                <NavLink className='qwerty-shop-home-hero-button' to='/item/606fdfa967cf4755546796a2'>
                    Details
                </NavLink>
            </div>
            <ProductCategories />
        </motion.div>
    );
}

export default Home;