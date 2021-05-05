import { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { motion } from 'framer-motion';
import postalCodes from 'postal-codes-js';
import PhoneInput, { isPossiblePhoneNumber } from 'react-phone-number-input'
import { Controller, useForm } from 'react-hook-form';
import { NavLink } from "react-router-dom";
import { useToasts } from 'react-toast-notifications'
import Select from 'react-select';

import { pageVariants } from '../Home';
import { countries, states, selectStyles } from './select-vars';
import LoadingSpinner from '../LoadingSpinner';
import 'react-phone-number-input/style.css'

const ADD_ADDRESS = gql`
  mutation addAddress($addressInfo: AddressInfoInput!) {
    addAddress(addressInfo: $addressInfo)
  }
`;

const AddAddress = (props: any) => {
    document.title = 'QWERTY Shop - Login'
    let testLoading = false;
    const { register, handleSubmit, control, formState: { errors } } = useForm({ mode: 'all' });
    const { addToast, removeAllToasts } = useToasts();
    const [country, setCountry] = useState('USA');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [state, setState] = useState('');

    const validateZipCode = (zipCode: string) => {
        return postalCodes.validate(country, zipCode) === true
    };

    const [addAddress, loading] = useMutation(ADD_ADDRESS, {
        update(_, data) {
            removeAllToasts();
            addToast(data.data.addAddress, {
                appearance: 'success',
                autoDismiss: true,
            })

            props.history.push({
                pathname: '/profile',
                state: { tab: 'addresses' }
            });
        },
    });

    const submitNewAddress = (addressInfo: Object) => {
        removeAllToasts();

        const fullAddressInfo = { ...addressInfo, country, phone_number: phoneNumber, state }
        addAddress({ variables: { addressInfo: fullAddressInfo } }).catch(e => addToast(e.message, {
            appearance: 'error',
            autoDismiss: true,
        }));
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
                <div className='qwerty-shop-address'>
                    <h1>Add Address</h1>
                    <form onSubmit={handleSubmit(submitNewAddress)}>
                        <label htmlFor='qwerty-shop-address-country'>Country</label>
                        <Select
                            className='qwerty-shop-select'
                            classNamePrefix="select"
                            id='qwerty-shop-login-country'
                            name='country'
                            onChange={(option) => setCountry(option!.value)}
                            options={countries}
                            ref={register}
                            styles={selectStyles}
                            value={countries.filter(({ value }) => country === value)}
                        />

                        <label htmlFor='qwerty-shop-address-fullName'>Full Name</label>
                        <input
                            type='text'
                            className={errors.full_name ? 'qwerty-shop-address-input-error' : ''}
                            name='full_name'
                            id='qwerty-shop-address-fullName'
                            {...register('full_name', { required: true })}
                            ref={register}
                        />

                        <label htmlFor='qwerty-shop-address-phoneNumber'>Phone Number</label>
                        <PhoneInput
                            className={
                                errors.phone_number ? 'qwerty-shop-address-phone-input-error' :
                                    !isPossiblePhoneNumber(phoneNumber) && phoneNumber.length > 0 ?
                                        'qwerty-shop-address-phone-input-error' : ''
                            }
                            defaultCountry='US'
                            id='qwerty-shop-address-phoneNumber'
                            international={false}
                            name='phone_number'
                            onChange={(phone) => {
                                phone ? setPhoneNumber(phone) : setPhoneNumber('');
                            }}
                            placeholder="Enter phone number"
                            ref={register}
                            {...register('phone_number', { required: true })}
                            value={phoneNumber}
                        />

                        <label htmlFor='qwerty-shop-address-addressLineOne'>Address Line One</label>
                        <input
                            type='text'
                            className={errors.address_line_one ? 'qwerty-shop-address-input-error' : ''}
                            name='address_line_one'
                            id='qwerty-shop-address-addressLineOne'
                            {...register('address_line_one', { required: true })}
                            ref={register}
                        />

                        <label htmlFor='qwerty-shop-address-addressLineTwo'>Address Line Two</label>
                        <input
                            type='text'
                            name='address_line_two'
                            id='qwerty-shop-address-addressLineTwo'
                            ref={register}
                        />

                        <label htmlFor='qwerty-shop-address-city'>City</label>
                        <input
                            type='text'
                            className={errors.city ? 'qwerty-shop-address-input-error' : ''}
                            name='city'
                            id='qwerty-shop-address-city'
                            {...register('city', { required: true })}
                            ref={register}
                        />

                        <label htmlFor='qwerty-shop-address-state'>State</label>
                        {
                            country === 'USA' ? (
                                <Select
                                    className='qwerty-shop-select'
                                    classNamePrefix="select"
                                    id='qwerty-shop-login-country'
                                    name='country'
                                    onChange={(option) => setState(option!.value)}
                                    options={states}
                                    ref={register}
                                    styles={selectStyles}
                                    value={states.filter(({ value }) => state === value)}
                                />
                            ) : (
                                <input type='text' name='state' id='qwerty-shop-address-state' ref={register} />
                            )
                        }

                        <label htmlFor='qwerty-shop-address-zipCode'>Zip Code</label>
                        <input
                            type='text'
                            className={errors.zip_code ? 'qwerty-shop-address-input-error' : ''}
                            name='zip_code'
                            id='qwerty-shop-address-zipCode'
                            {...register('zip_code', { required: true, validate: validateZipCode })}
                            ref={register}
                        />

                        <label htmlFor='qwerty-shop-address-default' style={{ alignSelf: 'center' }}>Make Default?</label>
                        <input type='checkbox' name='default' id='qwerty-shop-address-default' ref={register} />

                        {
                            loading && loading.called && loading.loading || testLoading ? (
                                <div className='qwerty-shop-login-loading'>
                                    <LoadingSpinner />
                                </div>
                            ) : (
                                <div className='qwerty-shop-form-button-container'>
                                    <div className='qwerty-shop-form-button'>
                                        {
                                            Object.keys(errors).length > 0 ? (
                                                <button style={{ textDecoration: 'line-through' }}>Add Address</button>
                                            ) : (
                                                <button type='submit'>Add Address</button>
                                            )
                                        }
                                    </div>
                                </div>
                            )
                        }
                    </form>
                </div>
            </div >
        </motion.div >
    );
}

export default AddAddress;
