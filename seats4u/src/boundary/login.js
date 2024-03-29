import React from 'react'
import { useNavigate } from 'react-router-dom'
import { getModel, authAdmin } from '../App'

const Login = () => {

    const navigate = useNavigate();

    console.log(`isAdmin before login: ${getModel().isAdmin}`);

    function checkCredentials() {
        if(document.getElementById("username-input").value !== 'admin' || document.getElementById("password-input").value !== 'admin') {
            alert("INVALID ADMIN USERNAME OR PASSWORD")
        } else {
            // change value in MODEL to show that user is admin
            getModel().authAdmin()
            console.log(`isAdmin after login: ${getModel().isAdmin}`)
            navigate('/venues')
        }
    }

    return (
        <div class="login">
            <div class="form">
                <div class="username">
                    <h1 id="username-label">USERNAME</h1>
                    <input id="username-input"/>
                </div>
                <div class="password">
                    <h1 id="password-label">PASSWORD</h1>
                    <input id="password-input"/>
                </div>
            </div>
            
            <div class="buttons">
                <button id="admin-btn" onClick={checkCredentials}>SIGN IN AS ADMIN</button>
                <p id="txt-or">OR</p>
                <button id="guest-btn" onClick={() => {navigate('/venues')}}>CONTINUE AS CONSUMER</button>
            </div>
        </div>
    )
}

export default Login