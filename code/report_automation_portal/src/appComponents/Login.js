import React, { useState } from 'react'
import './LoginStyle.css'

export const Login = () => {
    const [username, setUsername] = useState("")
    const [passwrd, setPasswrd] = useState("")
    const [showPassword, setShowPassword] = useState(false)

    const checkCred = () => {
        console.log({"username" : username, "password" : passwrd})
    }

    const togglePassword = () => {setShowPassword(!showPassword)}

    return (
    <>
        <h1 style={{textAlign: "center"}}>Report Automation Portal</h1>
        <div id='login-cards'>
            <p>Enter the details login</p>
            <form action="" onSubmit={checkCred}>
                <div>
                    <label htmlFor="username">Username</label>
                    <input type="text" name="username" id="username" value={username} onChange={(e)=>setUsername(e.target.value)} />
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input type={showPassword?"text":"password"} name="passwrd" id="passwrd" value={passwrd} onChange={(e)=>setPasswrd(e.target.value)} />
                </div>
                <div><input type="checkbox" onClick={togglePassword} />Show Password</div>
                <button id="login-button" type="submit">Login</button>
            </form>
        </div>
    </>
  )
}
