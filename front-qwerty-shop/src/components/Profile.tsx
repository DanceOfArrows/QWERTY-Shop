import React, { useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import { pageVariants } from './Home';
import LoadingSpinner from './LoadingSpinner';

const Profile = (props: any) => {
    document.title = 'QWERTY Shop - Profile';
    const tabToSet = props.location.state ? props.location.state.tab : null;
    const userInfo = props.checkCachedUser();
    const addressesCopy = userInfo.addresses.slice();
    const [currentProfileTab, setCurrentProfileTab] = useState(tabToSet ? tabToSet : 'orders')

    const renderTab = (currentProfileTab: any) => {
        switch (currentProfileTab) {
            case 'orders':
                return (
                    <>
                        <div className='qwerty-shop-profile-label-left'>Orders</div>
                        <div className='qwerty-shop-profile-orders-container'></div>
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
