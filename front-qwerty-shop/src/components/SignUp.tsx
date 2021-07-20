import React from 'react';
import { gql, useMutation } from '@apollo/client';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useToasts } from 'react-toast-notifications'

import LoadingSpinner from './LoadingSpinner';

const SIGN_UP = gql`
  mutation createUser($NewUserInput: NewUserInput!) {
    register(newUserData: $NewUserInput)
  }
`;

const SignUp = (props: any) => {
    document.title = 'QWERTY Shop - Sign Up';
    let testLoading = false;
    const { register, handleSubmit } = useForm();
    const { addToast, removeAllToasts } = useToasts();

    const submitSignUp = (signUpInfo: any) => {
        removeAllToasts();

        const { email, password, passwordConfirm } = signUpInfo;
        if (password !== passwordConfirm) addToast('Passwords do not match', {
            appearance: 'error',
            autoDismiss: true,
        });
        else signup({ variables: { NewUserInput: { email, password } } }).catch(e => addToast(e.message, {
            appearance: 'error',
            autoDismiss: true,
        }));
    };

    const [signup, loading] = useMutation(SIGN_UP, {
        update(_, data) {
            removeAllToasts();
            addToast(data.data.register, {
                appearance: 'success',
                autoDismiss: true,
            });
            props.history.push('/');
        },
    });

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className='qwerty-shop-sign-up'>
                <h1>Sign Up</h1>
                <form onSubmit={handleSubmit(submitSignUp)}>
                    <label htmlFor='qwerty-shop-sign-up-email'>Email</label>
                    <input {...register('email', {required: true})} type='email' name='email' id='qwerty-shop-sign-up-email' />

                    <label htmlFor='qwerty-shop-sign-up-password'>Password</label>
                    <input {...register('password', {required: true})} type='password' name='password' id='qwerty-shop-sign-up-password'/>

                    <label htmlFor='qwerty-shop-sign-up-password-confirm'>Confirm Password</label>
                    <input {...register('passwordConfirm', {required: true})} type='password' name='passwordConfirm' id='qwerty-shop-sign-up-password-confirm' />

                    {
                        (loading && loading.called && loading.loading) || testLoading ? (
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <LoadingSpinner />
                            </div>

                        ) : (
                            <div className='qwerty-shop-form-button-container'>
                                <div className='qwerty-shop-form-button'>
                                    <button type='submit'>Sign Up</button>
                                </div>
                            </div>
                        )
                    }
                </form>
            </div>
        </motion.div>
    );
}

export default SignUp;
