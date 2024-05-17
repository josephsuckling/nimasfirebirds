import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber, PhoneAuthProvider, multiFactor, PhoneMultiFactorGenerator } from 'firebase/auth';

function SetupPhoneVerification() {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [verificationId, setVerificationId] = useState(null);
    const navigate = useNavigate();
    const auth = getAuth();
    const user = auth.currentUser;
    
    // function recaptchaVerify() {
    //     const recaptchaVerifier = new RecaptchaVerifier(
    //     "recaptcha-container",
    
    //     // Optional reCAPTCHA parameters.
    //     {
    //       size: "normal",
    //       callback: function(response) {
    //         // reCAPTCHA solved, you can proceed with
    //         // phoneAuthProvider.verifyPhoneNumber(...).
    //         handleSendCode(recaptchaVerifier);
    //       },
    //       "expired-callback": function() {
    //         // Response expired. Ask user to solve reCAPTCHA again.
    //         // ...
    //       } 
    //         }, auth
    //     );
    // }

    function handleSendCode() {

        const recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
            size: 'invisible', // or 'normal'
            callback: (response) => {
              // reCAPTCHA solved - this is where you can enable the button or verify the phone number
              
            },
            'expired-callback': () => {
              // Handle expiration. For example, you might want to reset part of your UI
              onSolvedRecaptcha()
            }
          }, auth);

        function onSolvedRecaptcha() {
            multiFactor(user).getSession()
                .then(function (multiFactorSession) {
                // Specify the phone number and pass the MFA session.
                const phoneInfoOptions = {
                    phoneNumber: phoneNumber,
                    session: multiFactorSession
                };

                const phoneAuthProvider = new PhoneAuthProvider(auth);

                // Send SMS verification code.
                return phoneAuthProvider.verifyPhoneNumber(phoneInfoOptions, recaptchaVerifier);
            }).then(function (verificationId) {
                // Ask user for the verification code. Then:
                const cred = PhoneAuthProvider.credential(verificationId, verificationCode);
                const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(cred);

                // Complete enrollment.
                return multiFactor(user).enroll(multiFactorAssertion, "My Phone Number");
            });
            };

        }
        


    return (
        <div>
            <h2>Setup Phone Verification</h2>
            <div id="recaptcha-container"></div>
                <input type="text" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} placeholder="Enter phone number" />
                <button onClick={handleSendCode}>Send Verification Code</button>
        </div>
    );
}

export default SetupPhoneVerification;
