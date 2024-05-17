import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, PhoneAuthProvider, multiFactor, PhoneMultiFactorGenerator } from 'firebase/auth';
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../FirebaseConfig";
import OtpInput from 'react-otp-input';
import ReCAPTCHA from 'react-google-recaptcha';

function SetupPhoneVerification() {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [otp, setOtp] = useState('');
    const [verificationId, setVerificationId] = useState('');
    const navigate = useNavigate();
    const auth = getAuth();
    const user = auth.currentUser;
    const recaptchaRef = useRef(null);

    useEffect(() => {
        const fetchPhoneNumber = async () => {
            const userDoc = doc(firestore, "users", user.uid);
            const userDocSnap = await getDoc(userDoc);
            if (userDocSnap.exists()) {
                setPhoneNumber(userDocSnap.data().primaryContact);
            } else {
                console.log("No such document!");
            }
        };
        fetchPhoneNumber();
    }, [user.uid]);

    const onReCAPTCHASuccess = (token) => {
        console.log("ReCAPTCHA success, token:", token);
        multiFactor(user).getSession()
            .then((multiFactorSession) => {
                const phoneInfoOptions = {
                    phoneNumber: phoneNumber,
                    session: multiFactorSession
                };
                const phoneAuthProvider = new PhoneAuthProvider(auth);
                return phoneAuthProvider.verifyPhoneNumber(phoneInfoOptions, recaptchaRef.current.getValue);
            })
            .then((verificationIdReceived) => {
                setVerificationId(verificationIdReceived);
                setShowOtpInput(true);
                console.log("Verification code sent to " + phoneNumber);
            }).catch((error) => {
                console.error("Failed to send verification code", error);
            });
    };

    const handleSendCode = () => {
        
            if (recaptchaRef.current && recaptchaRef.current.getValue()) {
                console.log("ReCAPTCHA verified successfully");
                // If reCAPTCHA is verified, proceed with phone verification
                multiFactor(user).getSession()
                    .then((multiFactorSession) => {
                        const phoneInfoOptions = {
                            phoneNumber: phoneNumber,
                            session: multiFactorSession
                        };
                        const phoneAuthProvider = new PhoneAuthProvider(auth);
                        return phoneAuthProvider.verifyPhoneNumber(phoneInfoOptions,recaptchaRef);
                    })
                    .then((verificationIdReceived) => {
                        setVerificationId(verificationIdReceived);
                        setShowOtpInput(true);
                        console.log("Verification code sent to " + phoneNumber);
                    }).catch((error) => {
                        console.error("Failed to send verification code", error);
                    });
            } else {
                console.log("ReCAPTCHA not verified");
                alert("Please verify that you are not a robot.");
            }
    };

    const verifyCode = () => {
        const cred = PhoneAuthProvider.credential(verificationId, otp);
        const multiFactorAssertion = PhoneMultiFactorGenerator.assertion(cred);
        multiFactor(user).enroll(multiFactorAssertion, phoneNumber)
            .then(() => {
                alert('Phone verification successful and 2FA setup complete!');
                navigate('/dashboard');
            })
            .catch((error) => {
                alert('Failed to verify code: ' + error.message);
            });
    };

    return (
        <div>
            <h2>Setup Phone Verification</h2>
            {!showOtpInput ? (
                <button onClick={handleSendCode} disabled={!recaptchaRef.current || recaptchaRef.current.getValue() === null}>
                    Send Verification to Primary Contact
                </button>
            ) : (
                <div>
                    <p>Enter OTP sent to {phoneNumber}</p>
                    <OtpInput
                        value={otp}
                        onChange={setOtp}
                        numInputs={6}
                        separator={<span>-</span>}
                    />
                    <button onClick={verifyCode}>Verify Code</button>
                </div>
            )}
            <ReCAPTCHA
                ref={recaptchaRef}
                sitekey={process.env.REACT_APP_SITE_KEY}
                onChange={onReCAPTCHASuccess}
            />
        </div>
    );
}

export default SetupPhoneVerification;

//+61 466 894 864