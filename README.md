# QWERTY Shop
*By Seamus Le - [Visit QWERTY Shop](https://qwerty-shop-app.herokuapp.com/)*

**Table of Contents**
* [QWERTY Shop Overview](#qwerty-shop-overview)
* [App Structure](#app-structure)
* [Technologies Used](#technologies-used)
    * [Frontend](##frontend)
    * [Backend](##backend)  
* [Conclusion and Plans]()

# QWERTY Shop Overview
QWERTY Shop is a full stack app utilizing a [React](https://reactjs.org/) and [Apollo](https://www.apollographql.com/) frontend and a [GraphQL](https://graphql.org/) server built with [NestJS](https://nestjs.com/) and [MongoDB](https://www.mongodb.com/).  QWERTY Shop acts as an eCommerce website allowing users to view and purchase goods (which in this case are keyboards and related items). 

The main languages used in this app are:
 1. [TypeScript](https://www.typescriptlang.org/) - Used in the majority of the app (both frontend and backend)
 2. [SASS](https://sass-lang.com/) - Used for styling (frontend)

# App Structure
As mentioned previously, QWERTY Shop is a full stack app.  In other words, there are two major components of the app: frontend and backend.  

The frontend is the interface that users interact with.  It makes requests to the backend and stores the data it gets back in the Apollo cache (frontend).  

The backend is in charge of the logic that occurs behind the scenes.  This includes making [CRUD](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete) opertaions to the database and handling any data that the user does not need to see.  

Here is a flowchart for referrence:
![Here is a flowchart for referrence:](/readme-assets/qwerty-shop-structure.png)

# Technologies Used  
QWERTY Shop was pretty balanced between the frontend and backend. Both sides were equally important for the app to truly shine. An important note to keep in mind is that these technologies were chosen with the idea of expanding my knowledge (I wanted to pick up TypeScript and GraphQL), so it was a bit out of my comfort zone. Below are the technologies used in this project along with some notes / thoughts.

## Frontend
### [React](https://reactjs.org/)
The heart of QWERTY Shop is the React library.  The ability to pass props, use hooks, include libraries built on top of React, and perform conditional rendering has made QWERTY Shop much easier to build.  These abilities have also helped in making the site more dynamic and interactive.  
### [Apollo](https://www.apollographql.com/)
By utilizing the Apollo Client, managing data via GraphQL was made a lot easier.  This is a very powerful tool that allowed me to not only make GraphQL requests, but also cache data while providing the means to automatically update the UI.  

A key component that demonstrates the usefulness of both React and Apollo is the Login component.  By using Apollo, hooks, and props, managing the application state is made easy.

#### Login component utilizing React hooks and libraries + Apollo

```ts
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
```
## Backend
### [NestJS](https://nestjs.com/)
There are three main reasons for my choice in using NestJS over other Node JS frameworks:
 1. Built with and fully supports TypeScript
 2. Includes a built-in GraphQL module
 3. Is an opinionated framework

The first two reasons on the list are solely in my own interests and pursuit of knowledge.  The third reason was to help keep myself "more organized".  Having an opinionated framework forces me to build in a specific structure that allows others that are familiar with the framework to pick up my code more easily.  In short, this allows for easier / faster development for those familiar with NestJS.  Of course this is just a portfolio project, but I wanted to keep this as a note to myself if anything.  
### [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
I would like to start this section off by saying that I do regret not using a SQL database like PostreSQL.  Although MongoDB does allow me to be flexible with how I store data, I do not think it was really necessary in this app.  It would have been more beneficial to use a relational database to relate users with orders, orders to items, etc.  Other than that, MongoDB Atlas was a great cloud database service for the data used in this app.  
I will probably be going back to this at a later time to swap to PostgreSQL.  

### [GraphQL](https://graphql.org/)
GraphQL was very interesting to work with.  It allowed me to be flexible with the ways I was retrieving data from the backend versus having to make calls to an endpoint when using REST APIs.  My main reasons for going with GraphQL were:
 1. Learn GraphQL and compare to REST
 2. Freedom in fetched data
 3. GraphQL is strongly-typed (since I decided to use TypeScript as well)

# Conclusion and Plans  
Bringing this to a close, QWERTY Shop was an extremely fun app to build.  Being able to learn new technologies and using that knowledge to create an app based on my keyboard hobby was quite exhilarating.  

My original goals for this app were as follows:  
 1. Replace my old portfolio projects
 2. Create a simple e-commerce app while learning TypeScript + GraphQL
 3. Demonstrate to myself (and possibly others) that I have improved and will continue to do so

These goals have been met and I am very excited to continue working on future projects.  As of current time, the only plan for QWERTY Shop is to switch the database from MongoDB to PostgreSQL.  

Thank you for checking out my project and reading through this!