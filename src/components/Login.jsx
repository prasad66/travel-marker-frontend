import React from 'react'
import MapIcon from '@mui/icons-material/Map';
import { useRef, useState } from 'react';
import CancelIcon from '@mui/icons-material/Cancel';
import axios from 'axios';
import './Login.css'

const Login = ({ show, myStorage,setCurrentUser }) => {

  const [error, setError] = useState(false);
  const nameRef = useRef();
  const passwordRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = {
      username: nameRef.current.value,
      password: passwordRef.current.value
    }

    try {

      const response = await axios.post('/users/login', user);
      myStorage.setItem("user", response.data.username);
      setCurrentUser(response.data.username);
      show(false);
      setError(false);
    } catch (error) {
      setError(true);
    }

  }

  return (
    <div className="loginContainer">
      <div className="logo">
        <MapIcon />Travel Marker
      </div>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Username" required ref={nameRef} />
        <input type="password" placeholder="Password" required ref={passwordRef} />
        <button className="loginButton">Login</button>

        <CancelIcon className="loginCancel" onClick={(e => show(false))} />

        {
          error && <span className="failure">Somethingwent wrong...</span>

        }
      </form>
    </div>
  )


}

export default Login