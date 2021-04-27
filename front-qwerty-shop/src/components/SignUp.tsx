import React from 'react';
import { gql, useMutation } from '@apollo/client';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';

import LoadingSpinner from './LoadingSpinner';

const SIGN_UP = gql`
  mutation createUser($CreateUserInput: CreateUserInput!) {
    createUser(createUserData: $CreateUserInput)
  }
`;

const SignUp = (props: any) => {
    document.title = 'QWERTY Shop - Sign Up';
    let testLoading = false;
    const { register, handleSubmit } = useForm();
    let [error, setError] = React.useState('');
    const submitSignUp = (signUpInfo: any) => {
        const { email, password, passwordConfirm } = signUpInfo;
        if (password != passwordConfirm) setError('Passwords do not match.')
        else signup({ variables: { CreateUserInput: { email, password } } }).catch(e => setError(e.message));
    };

    const [signup, loading] = useMutation(SIGN_UP, {
        update() {
            setError('');
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
            <div className='qwerty-shop-sign-up'
                style={error.length > 0 ? { height: '470px', transform: 'translate(-15rem, calc(-235px))' } : {}}
            >
                <h1>Sign Up</h1>
                <form onSubmit={handleSubmit(submitSignUp)}>
                    <label htmlFor='qwerty-shop-sign-up-email'>Email</label>
                    <input type='email' name='email' id='qwerty-shop-sign-up-email' ref={register} />

                    <label htmlFor='qwerty-shop-sign-up-password'>Password</label>
                    <input type='password' name='password' id='qwerty-shop-sign-up-password' ref={register} />

                    <label htmlFor='qwerty-shop-sign-up-password-confirm'>Confirm Password</label>
                    <input type='password' name='passwordConfirm' id='qwerty-shop-sign-up-password-confirm' ref={register} />

                    {
                        loading && loading.called && loading.loading || testLoading ? (
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

                {
                    error.length > 0 ?
                        <p className='qwerty-shop-sign-up-error' style={{ color: 'red' }}>{error}</p>
                        : null
                }
            </div>
        </motion.div>
    );
}

export default SignUp;
