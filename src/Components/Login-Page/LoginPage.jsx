import React, { useState, useContext } from 'react'
import axios from "../../api/axios";
import { Navigate } from "react-router-dom";
import './Styles.css'
import AuthContext from '../../context/AuthProvider';
import { toast } from "react-toastify";
import Loading from '../Loading/Loading';

const LoginPage = () => {
    const [userName, setUserName] = useState('');
    const [passWord, setPassWord] = useState('');
    const [SignIn, setSignIn] = useState(false);
    const [LoginSuccess, setLoginSuccess] = useState(false);
    const [LoginFailed, setLoginFailed] = useState(false);
    const { setAuth } = useContext(AuthContext)
    const [isLoading, setisLoading] = useState(false)

    const toastOption = {
        position: "bottom-right",
        autoClose: 5000,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
    };

    const onLogin = async (event) => {
        event.preventDefault();
        if (userName === '' || passWord === '') {
            setLoginFailed(true)
            return
        }
        setLoginFailed(false)
        try {
            setisLoading(false)
            const { data } = await axios.post('/auth/login', {
                username: userName,
                password: passWord
            })
            if (data.status) {
                setisLoading(false)
            }
            localStorage.setItem('token', data.token)
            localStorage.setItem('_id', data.user._id)
            setAuth({ userName, passWord, token: data.token, _id: data._id })
            setLoginSuccess(true)
        } catch (error) {
            setLoginFailed(true)
            console.log(error);
        }
    }

    const onSignIn = async (event) => {
        event.preventDefault();
        if (userName === '' || passWord === '') {
            toast.error("Incorrect username or password", toastOption);
            return
        }
        try {
            const res = await axios.post('/user', {
                username: userName,
                password: passWord
            })
            console.log(res);
            toast.success("Success!", toastOption)
            setSignIn(false)
            document.getElementById("username").value = ""
            document.getElementById("userpass").value = ""
        } catch (error) {
            // toast.error("Failed!", toastOption)
            toast.error(error.response.data, toastOption)
            console.log(error);
        }
    }

    if (isLoading) {
        return (<Loading />)
    }

    return (
        <>
            {
                LoginSuccess ? <Navigate to="/" replace={true} /> :
                    <div className="login-page" >
                        {!SignIn ?
                            <div className="login-box">
                                <h1> LOGIN </h1>
                                <div className="login-account">
                                    <form >
                                        <div className="login-info">
                                            <input type="text" placeholder="User Name" name="username" id="username" onChange={(e) => {
                                                setUserName(e.target.value)
                                            }} />
                                            <input type="password" placeholder="Password" name="password" id="userpass" autoComplete="on" onChange={(e) => {
                                                setPassWord(e.target.value)
                                            }} />
                                            {LoginFailed ? <p className='login-failed'>Username or Password is wrong! </p> : null}
                                        </div>

                                        <button onClick={(event) => onLogin(event)} className='loginButton' > LOGIN </button>

                                        <h5> Need a new Account? </h5>

                                        <button className='signInButton' onClick={(e) => {
                                            e.preventDefault()
                                            setSignIn(true)
                                        }} > SIGN UP </button>

                                    </form>
                                </div>
                            </div> :
                            <div className="login-box">
                                <h1> SIGN UP </h1>
                                <div className="login-account">
                                    <form >
                                        <div className="login-info">
                                            <input type="text" placeholder="User Name" name="username" id="username" onChange={(e) => {
                                                setUserName(e.target.value)
                                            }} />
                                            <input type="password" placeholder="Password" name="password" autoComplete="on" id="userpass" onChange={(e) => {
                                                setPassWord(e.target.value)
                                            }} />
                                        </div>
                                        <button onClick={(event) => onSignIn(event)} className='loginButton' > SIGN IN </button>
                                        <h5> You have Account? </h5>

                                        <button className='signInButton' onClick={(e) => {
                                            e.preventDefault()
                                            setSignIn(false)
                                        }} > LOGIN </button>
                                    </form>
                                </div>
                            </div>
                        }
                    </div>
            }
        </>
    )
}

export default LoginPage
