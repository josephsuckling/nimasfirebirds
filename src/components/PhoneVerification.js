import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, signInWithPhoneNumber, RecaptchaVerifier } from 'firebase/auth';

function PhoneVerification() {
    const [code, setCode] = useState('');
    const navigate = useNavigate();
    const auth = getAuth();

    // Assuming the setup for RecaptchaVerifier and signInWithPhoneNumber has been done elsewhere
    // and the application verifier is stored globally or passed somehow
    const verifyCode = () => {
        const confirmationResult = window.confirmationResult; // Stored globally from the login flow
        confirmationResult.confirm(code)
            .then((result) => {
                alert('Phone verification successful!');
                navigate('/dashboard');
            })
            .catch((error) => {
                alert('Invalid code entered. Please try again. Error: ' + error.message);
            });
    };

    return (
        <div>
            <h2>Enter Verification Code</h2>
            <input type="text" value={code} onChange={e => setCode(e.target.value)} placeholder="Verification code" />
            <button onClick={verifyCode}>Verify Code</button>
        </div>
    );
}

export default PhoneVerification;
