import React, { createContext, useEffect, useReducer } from 'react'
import { jwtDecode } from 'jwt-decode';
import axios from 'axios.js'
import { MatxLoading } from 'app/components'
// import { toast } from 'react-toastify';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const initialState = {
    isAuthenticated: false,
    isInitialised: false,
    user: null,
    error: null
}

const isValidToken = (accessToken) => {
    if (!accessToken) {
        return false
    }

    const decodedToken = jwtDecode(accessToken)
    const currentTime = Date.now() / 1000
    return decodedToken.exp > currentTime
}

const setSession = (accessToken, user) => {
    if (accessToken) {
        localStorage.setItem('accessToken', accessToken)
        localStorage.setItem('user', JSON.stringify(user)); // Store user as a string
        axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`
    } else {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('user')
        delete axios.defaults.headers.common.Authorization
    }
}

const reducer = (state, action) => {
    switch (action.type) {
        case 'INIT': {
            const { user } = action.payload;
            console.log("User:" + user);
            // console.log(JSON.parse(user));
            return {
                ...state,
                isAuthenticated: true,
                isInitialised: true,
                user,
            }
        }
        case 'LOGIN': {
            const { user } = action.payload
            // setUser(user);
            return {
                ...state,
                isAuthenticated: true,
                user,
            }
        }
        case 'LOGOUT': {
            return {
                ...state,
                isAuthenticated: false,
                user: null,
            }
        }
        case 'REGISTER': {
            const { user } = action.payload

            return {
                ...state,
                isAuthenticated: true,
                user,
            }
        }
        case 'ERROR': // Handle the 'ERROR' action
            return {
                ...state,
                error: action.payload.error,
            };
        default: {
            return { ...state }
        }
    }
}

const AuthContext = createContext({
    ...initialState,
    method: 'JWT',
    login: () => Promise.resolve(),
    logout: () => { },
    register: () => Promise.resolve(),
    // setUser: () => { },
    // setToken: () => { },
})

export const AuthProvider = ({ children }) => {
    // const [user, setUser] = useState({});
    const [state, dispatch] = useReducer(reducer, initialState)
    // const accessToken = window.localStorage.getItem('accessToken');

    const login = async (email, password, navigate) => {
        try {
            const response = await axios.post('/signin', {
                email,
                password,
            })
            // console.log(response);
            // return;
            if (response) {
                const { accessToken, user } = response.data
                // console.log(token);
                // return;
                setSession(accessToken, user)

                dispatch({
                    type: 'LOGIN',
                    payload: {
                        user,
                    },
                })
                navigate('/');
            }
        } catch (errors) {
            toast.error(errors.message);
            dispatch({
                type: 'ERROR',
                payload: {
                    error: true,
                },
            });

        }

    }



    const register = async (email, name, password, password_confirmation, navigate) => {
        try {
            const response = await axios.post('/signup', {
                email,
                name,
                password,
                password_confirmation,
            });

            const { accessToken, user } = response.data;

            setSession(accessToken);

            dispatch({
                type: 'REGISTER',
                payload: {
                    user,
                },
            });

            navigate('/');
        } catch (errors) {
            toast.error(errors.message);
            dispatch({
                type: 'ERROR',
                payload: {
                    error: true,
                },
            });
            // Display an error toast with the error message
            // toast.error("message");

            // <ToastContainer />

            // toast.error('Registration failed. Please check your information and try again.');
            // console.log(error.message)
        }

    }

    const logout = () => {


        // axios.post('/logout')
        //     .then(() => {

        //         setSession(null)
        //         // setToken(null)
        //         console.log('done');
        //         navigate(/)
        //     })
        //     .catch(err => {
        //         console.log(err);
        //     })


        setSession(null)
        dispatch({ type: 'LOGOUT' })
    }

    useEffect(() => {
        const user = window.localStorage.getItem('user')
        const accessToken = window.localStorage.getItem('accessToken');
        console.log(user);
        console.log(accessToken);
        setSession(accessToken, JSON.parse(user));
        console.log("InitialStates:" + JSON.stringify(state));
        if (accessToken && user) {
            console.log('hello');
            dispatch({
                type: 'INIT',
                payload: {
                    user: JSON.parse(user), // Parse the stored user data
                },
            });
        }
        // if (accessToken) {
        //     // setSession(accessToken)
        //     // const response = await axios.get('/api/auth/profile')
        //     // const { user } = response.data
        //     console.log('hello');
        //     dispatch({
        //         type: 'INIT',
        //         payload: {

        //             user,
        //         },
        //     })
        // }
        // ; (async () => {
        //     try {
        //         const accessToken = window.localStorage.getItem('accessToken')

        //         if (accessToken && isValidToken(accessToken)) {
        //             setSession(accessToken)
        //             const response = await axios.get('/api/auth/profile')
        //             const { user } = response.data

        //             dispatch({
        //                 type: 'INIT',
        //                 payload: {
        //                     isAuthenticated: true,
        //                     user,
        //                 },
        //             })
        //         } else {
        //             dispatch({
        //                 type: 'INIT',
        //                 payload: {
        //                     isAuthenticated: false,
        //                     user: null,
        //                 },
        //             })
        //         }
        //     } catch (err) {
        //         console.error(err)
        //         dispatch({
        //             type: 'INIT',
        //             payload: {
        //                 isAuthenticated: false,
        //                 user: null,
        //             },
        //         })
        //     }
        // })()
    }, [])

    // if (!state.isInitialised) {
    //     return <MatxLoading />
    // }

    return (
        <AuthContext.Provider
            value={{
                ...state,
                method: 'JWT',
                login,
                logout,
                register,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext
