import { gql, useMutation } from '@apollo/client';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useToasts } from 'react-toast-notifications';

import LoadingSpinner from './LoadingSpinner';

const LOG_IN = gql`
  mutation login($LoginInput: LoginInput!) {
    login(loginData: $LoginInput) {
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
            localStorage.setItem('token', data.data.login.token);
            setToken(data.data.login.token);
        },
    });

    const submitLogin = (loginInfo: Object) => {
        removeAllToasts();
        login({ variables: { LoginInput: loginInfo } }).catch(e => {
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
                        {...register('email', {required: true})}
                        type='email'
                        name='email'
                        id='qwerty-shop-login-email'
                    />

                    <label htmlFor='qwerty-shop-login-password'>Password</label>
                    <input
                    {...register('password', {required: true})}
                        type='password'
                        name='password'
                        id='qwerty-shop-login-password'
                    />
                    {
                        (loading &&
                            loading.called &&
                            loading.loading) ||
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
                                                    LoginInput: {
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
