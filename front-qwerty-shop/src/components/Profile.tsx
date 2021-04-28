import React, { useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';

import { pageVariants } from './Home';
import LoadingSpinner from './LoadingSpinner';

export const GET_USER_ORDERS = gql`
  query getUserData {
    getOrders {
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
        saleDate
    }
  }
`;

const Profile = (props: any) => {
    document.title = 'QWERTY Shop - Profile';
    const tabToSet = props.location.state ? props.location.state.tab : null;
    const userInfo = props.checkCachedUser();
    const addressesCopy = userInfo.addresses.slice();
    const [currentProfileTab, setCurrentProfileTab] = useState(tabToSet ? tabToSet : 'orders');
    const [displayAddressIdx, setDisplayAddressIdx] = useState<null | number>(null);

    const { loading, error, data } = useQuery(GET_USER_ORDERS, {
        fetchPolicy: "network-only"
    });

    const orders = data && data.getOrders && data.getOrders.length > 0 ? data.getOrders : [];
    console.log(orders)

    const renderTab = (currentProfileTab: any) => {
        switch (currentProfileTab) {
            case 'orders':
                return (
                    <>
                        <div className='qwerty-shop-profile-label-left'>Orders</div>
                        <div className='qwerty-shop-profile-orders-container'>
                            {
                                orders && orders.length > 0 ? (
                                    orders.map((order: any, idx: number) => {
                                        const { address, items, saleDate } = order;
                                        const {
                                            addressLineOne,
                                            addressLineTwo,
                                            city,
                                            country,
                                            fullName,
                                            phoneNumber,
                                            state,
                                            zipCode,
                                        } = address;

                                        const months = [
                                            'January',
                                            'February',
                                            'March',
                                            'April',
                                            'May',
                                            'June',
                                            'July',
                                            'August',
                                            'September',
                                            'October',
                                            'November',
                                            'December'
                                        ];

                                        const dateConverted = new Date(Date.parse(saleDate));
                                        const month = months[dateConverted.getMonth()];
                                        const date = dateConverted.getDate();
                                        const year = dateConverted.getFullYear();

                                        return (
                                            <div key={`qwerty-shop-profile-order-${idx}`} className='qwerty-shop-profile-order-item' style={idx != 0 ? { marginTop: '48px' } : {}}>
                                                <div className='qwerty-shop-profile-order-text'>
                                                    <div>
                                                        <div style={{ fontWeight: 'bold' }}>Order Placed:</div>
                                                        <div>{month}, {date} {year}</div>
                                                    </div>
                                                    <div>
                                                        <div style={{ fontWeight: 'bold' }}>Ship To:</div>
                                                        <div
                                                            className='qwerty-shop-order-address-wrapper'
                                                            style={{
                                                                display: 'flex',
                                                                flexDirection: 'row',
                                                                alignItems: 'flex-end',
                                                            }}>
                                                            <div
                                                                className='qwerty-shop-profile-order-address-name'
                                                                onMouseOver={() => setDisplayAddressIdx(idx)}
                                                                onMouseLeave={() => setDisplayAddressIdx(null)}
                                                            >{fullName}</div>
                                                            <div
                                                                className='qwerty-shop-profile-order-address'
                                                                style={displayAddressIdx != idx ? { opacity: 0 } : { opacity: 1 }}
                                                            >
                                                                <div className='qwerty-shop-address-fullName'>{fullName}</div>
                                                                <div>{addressLineOne}</div>
                                                                {addressLineTwo.length > 0 ? <div>{addressLineTwo}</div> : null}
                                                                <div>{city}, {state} {zipCode}</div>
                                                                <div>{country}</div>
                                                                <div>Phone Number: {phoneNumber}</div>
                                                            </div>
                                                            <div className="fas fa-angle-down" style={{ marginLeft: '6px' }} />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='qwerty-shop-cart-items-container'>
                                                    {items && items.length > 0 ?
                                                        (
                                                            items.map((cartItem: any, itemIdx: number) => (
                                                                <div
                                                                    className='qwerty-shop-cart-item'
                                                                    key={`Order-${idx}-item-${itemIdx}`}
                                                                >
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
                                                        ) : <div style={{ textAlign: 'center' }}>Failed to load items</div>
                                                    }
                                                </div>
                                            </div>
                                        )
                                    })
                                ) : null}
                        </div>
                    </>
                )
                    ;
            case 'addresses':
                return (
                    <>
                        <div className='qwerty-shop-profile-label-left'>Addresses</div>
                        <div className='qwerty-shop-profile-addresses-container'>
                            <NavLink to='/addaddress'>
                                <div
                                    className='qwerty-shop-profile-addresses-add'
                                >
                                    <span>
                                        <i className="fas fa-plus"></i>
                                    </span>
                                    Add Address
                                </div>
                            </NavLink>
                            {
                                addressesCopy.sort((a: any, b: any) => {
                                    const aVal = a.default ? 1 : -1;
                                    const bVal = b.default ? 1 : -1;

                                    return bVal - aVal;
                                }).map((address: any, idx: number) => {
                                    const {
                                        addressLineOne,
                                        addressLineTwo,
                                        city,
                                        country,
                                        fullName,
                                        phoneNumber,
                                        state,
                                        zipCode,
                                    } = address;

                                    if (idx != 0 && idx % 5 === 0) return null;

                                    return (
                                        <div key={`qwerty-shop-address-${idx}`} className='qwerty-shop-address-item'>
                                            <div className='qwerty-shop-address-fullName'>{fullName}</div>
                                            <div>{addressLineOne}</div>
                                            { addressLineTwo.length > 0 ? <div>{addressLineTwo}</div> : null}
                                            <div>{city}, {state} {zipCode}</div>
                                            <div>{country}</div>
                                            <div>Phone Number: {phoneNumber}</div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </>
                )
                    ;
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
            <div className='qwerty-shop-profile'>
                <div className='qwerty-shop-profile-left'>
                    {
                        renderTab(currentProfileTab)
                    }
                </div>
                <div className='qwerty-shop-profile-right'>
                    <div
                        className={
                            currentProfileTab === 'orders' ?
                                'qwerty-shop-profile-nav-label qwerty-shop-profile-nav-label-selected' :
                                'qwerty-shop-profile-nav-label'
                        }
                        onClick={() => { if (currentProfileTab != 'orders') setCurrentProfileTab('orders') }}
                        style={{ borderRadius: '0 12px 0 0', marginTop: '24px' }}
                    >
                        Orders
                        </div>
                    <div
                        className={
                            currentProfileTab === 'addresses' ?
                                'qwerty-shop-profile-nav-label qwerty-shop-profile-nav-label-selected' :
                                'qwerty-shop-profile-nav-label'
                        }
                        onClick={() => { if (currentProfileTab != 'addresses') setCurrentProfileTab('addresses') }}
                    >
                        Adresses
                        </div>
                </div>
            </div>
        </motion.div>
    );
}

export default Profile;
