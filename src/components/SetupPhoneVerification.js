import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber, PhoneAuthProvider, multiFactor, PhoneMultiFactorGenerator } from 'firebase/auth';

function SetupPhoneVerification() {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [verificationId, setVerificationId] = useState(null);
    const navigate = useNavigate();
    const auth = getAuth();

    function recaptchaVerify() {
        const recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-container",
    
        // Optional reCAPTCHA parameters.
        {
          size: "normal",
          callback: function(response) {
            // reCAPTCHA solved, you can proceed with
            // phoneAuthProvider.verifyPhoneNumber(...).
            handleSendCode(recaptchaVerifier);
          },
          "expired-callback": function() {
            // Response expired. Ask user to solve reCAPTCHA again.
            // ...
          } 
            }, auth
        );
    }

    function handleSendCode(recaptchaVerifier) {

        const phoneInfoOptions = {
            phoneNumber: phoneNumber,
            session: multiFactor(auth.currentUser).getSession()
        };

        const phoneAuthProvider = new PhoneAuthProvider(auth);
        
        phoneAuthProvider.verifyPhoneNumber(phoneInfoOptions, recaptchaVerifier)
            .then((verificationId) => {
                setVerificationId(verificationId);
                console.log('SMS verification code sent.');
            })
            .catch((error) => {
                console.error('Failed to send verification code', error);
                window.recaptchaVerifier.reset();
            });
    };

    const handleVerifyCode = () => {
        const cred = PhoneAuthProvider.credential(verificationId, verificationCode);
        const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(cred);
        multiFactor(auth.currentUser).enroll(multiFactorAssertion, "My personal phone number")
            .then(() => {
                alert('Phone number added and verified as a second factor!');
                navigate('/dashboard');
            })
            .catch((error) => {
                console.error('Error during 2FA enrollment:', error);
                alert('Failed to verify phone number. Please try again.');
            });
    };

    return (
        <div>
            <h2>Setup Phone Verification</h2>
            <div id="recaptcha-container"></div>
            {verificationId ? (
                <>
                    <input type="text" value={verificationCode} onChange={e => setVerificationCode(e.target.value)} placeholder="Enter verification code" />
                    <button onClick={handleVerifyCode}>Verify Code</button>
                </>
            ) : (
                <>
                    <input type="text" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} placeholder="Enter phone number" />
                    <button onClick={recaptchaVerify}>Send Verification Code</button>
                </>
            )}
        </div>
    );
}

export default SetupPhoneVerification;
