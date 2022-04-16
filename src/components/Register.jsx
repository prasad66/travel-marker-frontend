import './Register.css'
import MapIcon from '@mui/icons-material/Map';
import { useRef, useState } from 'react';
import CancelIcon from '@mui/icons-material/Cancel';
import axios from 'axios';

const Register = ({ show }) => {

    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);

    const nameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newUser = {
            username: nameRef.current.value,
            email: emailRef.current.value,
            password: passwordRef.current.value
        }

        try {

            await axios.post('https://trvl-mrkr.herokuapp.com/api/users/register', newUser);
            setError(false);
            setSuccess(true);

        } catch (error) {
            setError(true);
        }

    }

    return (
        <div className="registerContainer">
            <div className="logo">
                <MapIcon />Travel Marker
            </div>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Username" required ref={nameRef} />
                <input type="email" placeholder="Email" required ref={emailRef} />
                <input type="password" placeholder="Password" required ref={passwordRef} />
                <button className="registerButton">Register</button>
                {
                    success && <span className="success">Successful. You can login now!</span>

                }
                {
                    error && <span className="failure">Somethingwent wrong...</span>

                }
                <CancelIcon className="registerCancel" onClick={(e => show(false))} />
            </form>
        </div>
    )
}

export default Register