import React from 'react';
import { gql, useMutation } from '@apollo/client';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { NavLink } from "react-router-dom";

import { pageVariants } from './Home';
import LoadingSpinner from './LoadingSpinner';

const ADD_ADDRESS = gql`
  mutation addAddress($AddAddressInput: AddAddressInput!) {
    addAddress(addAddressData: $AddAddressInput) {
        addresses {
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
    }
  }
`;

const AddAddress = (props: any) => {
    document.title = 'QWERTY Shop - Login'
    let testLoading = false;
    const { register, handleSubmit } = useForm();
    const { error, setError } = props;

    const [addAddress, loading] = useMutation(ADD_ADDRESS, {
        update(_, data) {
            props.client.writeFragment({
                id: 'userInfo',
                fragment:
                    gql`
                    fragment UserInfo on UserNoPW {
                        _id,
                        addresses {
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
                        email,
                        cart {
                            itemId,
                            color,
                            size,
                            quantity
                        }
                  }
                `,
                data: {
                    addresses: data.data.addAddress.addresses,
                }
            });

            props.history.push({
                pathname: '/profile',
                state: { tab: 'addresses' }
            });
        },
    });
    const submitNewAddress = (addressInfo: Object) => {
        setError('');
        addAddress({ variables: { AddAddressInput: addressInfo } }).catch(e => setError(e.message));
    };

    return (
        <motion.div
            initial='enter'
            animate='center'
            exit='exit'
            transition={{ duration: 0.5 }}
            variants={pageVariants}
            className='qwerty-shop-app-page-transition'
        >
            <div style={{ height: '1054px' }}>
                <NavLink
                    to={{
                        pathname: '/profile',
                        state: { tab: 'addresses' }
                    }}
                    className='qwerty-shop-item-back-btn'
                >
                    {'<'} Back to Profile
            </NavLink>
                <div className='qwerty-shop-address' style={error ? { height: '960px' } : {}}>
                    <h1>Add Address</h1>
                    <form onSubmit={handleSubmit(submitNewAddress)}>
                        <label htmlFor='qwerty-shop-address-country'>Country</label>
                        <input type='text' name='country' id='qwerty-shop-login-country' ref={register} />

                        <label htmlFor='qwerty-shop-address-fullName'>Full Name</label>
                        <input type='text' name='fullName' id='qwerty-shop-address-fullName' ref={register} />

                        <label htmlFor='qwerty-shop-address-phoneNumber'>Phone Number</label>
                        <input type='text' name='phoneNumber' id='qwerty-shop-address-phoneNumber' ref={register} />

                        <label htmlFor='qwerty-shop-address-addressLineOne'>Address Line One</label>
                        <input type='text' name='addressLineOne' id='qwerty-shop-address-addressLineOne' ref={register} />

                        <label htmlFor='qwerty-shop-address-addressLineTwo'>Address Line Two</label>
                        <input type='text' name='addressLineTwo' id='qwerty-shop-address-addressLineTwo' ref={register} />

                        <label htmlFor='qwerty-shop-address-city'>City</label>
                        <input type='text' name='city' id='qwerty-shop-address-city' ref={register} />

                        <label htmlFor='qwerty-shop-address-state'>State</label>
                        <input type='text' name='state' id='qwerty-shop-address-state' ref={register} />

                        <label htmlFor='qwerty-shop-address-zipCode'>Zip Code</label>
                        <input type='text' name='zipCode' id='qwerty-shop-address-zipCode' ref={register} />

                        <label htmlFor='qwerty-shop-address-default' style={{ alignSelf: 'center' }}>Make Default</label>
                        <input type='checkbox' name='default' id='qwerty-shop-address-default' ref={register} />

                        {
                            loading && loading.called && loading.loading || testLoading ? (
                                <div className='qwerty-shop-login-loading'>
                                    <LoadingSpinner />
                                </div>
                            ) : (
                                <div className='qwerty-shop-form-button-container'>
                                    <div className='qwerty-shop-form-button'>
                                        <button type='submit'>Add Address</button>
                                    </div>
                                </div>
                            )
                        }
                    </form>
                    {
                        error.length > 0 ?
                            <p className='qwerty-shop-login-error'>{error}</p>
                            : null
                    }
                </div>
            </div >
        </motion.div >
    );
}

export default AddAddress;
