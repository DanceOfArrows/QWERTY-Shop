import { gql, useMutation } from '@apollo/client';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useToasts } from 'react-toast-notifications'

import LoadingSpinner from './LoadingSpinner';

const LOG_IN = gql`
  mutation signIn($SignInInput: SignInInput!) {
    signIn(signInData: $SignInInput) {
        token
    }
  }
`;

const Login = (props: any) => {
    document.title = 'QWERTY Shop - Login'
    let testLoading = false;
    const { setToken } = props;
    const { register, handleSubmit } = useForm();
    const { addToast, removeAllToasts } = useToasts();

    const [login, loading] = useMutation(LOG_IN, {
        update(_, data) {
            localStorage.setItem('token', data.data.signIn.token);
            setToken(data.data.signIn.token)
        },
    });

    const submitLogin = (loginInfo: Object) => {
        removeAllToasts();
        login({ variables: { SignInInput: loginInfo } }).catch(e => {
            addToast(e.message, {
                appearance: 'error',
                autoDismiss: true,
            });
        });
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
        >
            <div className='qwerty-shop-login'>
                <h1>Login</h1>
                <form onSubmit={handleSubmit(submitLogin)}>
                    <label htmlFor='qwerty-shop-login-email'>Email</label>
                    <input
                        type='email'
                        name='email'
                        id='qwerty-shop-login-email'
                        ref={register}
                    />

                    <label htmlFor='qwerty-shop-login-password'>Password</label>
                    <input
                        type='password'
                        name='password'
                        id='qwerty-shop-login-password'
                        ref={register}
                    />
                    {
                        loading &&
                            loading.called &&
                            loading.loading ||
                            testLoading ? (
                            <div className='qwerty-shop-login-loading'>
                                <LoadingSpinner />
                            </div>
                        ) : (
                            <div className='qwerty-shop-form-button-container'>
                                <div className='qwerty-shop-form-button'>
                                    <button type='submit'>Log In</button>
                                </div>
                                <div
                                    onClick={
                                        () => {
                                            removeAllToasts();
                                            login({
                                                variables: {
                                                    SignInInput: {
                                                        email: 'demo@user.com',
                                                        password: 'demouser123'
                                                    }
                                                }
                                            })
                                                .catch(e => addToast(e.message, {
                                                    appearance: 'error',
                                                    autoDismiss: true,
                                                }))
                                        }
                                    }
                                    className='qwerty-shop-form-button'
                                >
                                    <button type='button'>Demo</button>
                                </div>
                            </div>
                        )
                    }
                </form>
            </div>
        </motion.div>
    );
};

export default Login;
