import { ChangeEventHandler, FC, MouseEventHandler, useState } from 'react';
import { Link } from 'react-router-dom';
import validator from 'validator';

import InputGroup from './Form/InputGroup';
import SubmitButton from './Form/SubmitButton';
import ErrorMessage from './Form/ErrorMessage';
import BoldFont from './Layout/BoldFont';

import { useActionCreators } from '../hooks/useActionCreators';
import { useTypedSelector } from '../hooks/useTypedSelector';

import './Register.css';

const Register: FC = () => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password] = useState('password');
  const [formErrorMessage, setFormErrorMessage] = useState('');

  const { createUser } = useActionCreators();
  const { session } = useTypedSelector(state => state.session);
  const { loggedInUser, error: loginError } = useTypedSelector(state => state.auth);
  const { error: userError } = useTypedSelector(state => state.user);

  if (userError && !formErrorMessage) {
    console.error('error creating user account', userError);
    setFormErrorMessage('Error creating account');
  }

  if (loginError && !formErrorMessage) {
    console.error('error logging in', loginError);
    setFormErrorMessage('Error logging in');
  }

  if (!session) return null;

  const handleEmailChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setEmail(e.target.value);
  };

  const handlePhoneChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setPhone(e.target.value);
  };

  const handleSubmit: MouseEventHandler = (e) => {
    e.preventDefault();

    const invalidFields = [];
    if (!validator.isEmail(email)) {
      invalidFields.push('Email');
    }

    if (phone && !validator.isMobilePhone(phone)) {
      invalidFields.push('Phone');
    }

    if (invalidFields.length > 0) {
      setFormErrorMessage(`The following fields are invalid: ${invalidFields.join(', ')}`);
      return;
    }

    createUser({ email, password, phone });
  };

  return (
    <div className='register'>
      <h1>Register</h1>
      <p>You need to (1) create an account and (2) install the ACME app from a link we email you.</p>
      {
        loggedInUser
          ? (
            <>
              <h2>2. Install ACME App</h2>
              <p>
                We sent an installation link to {email}.
                <BoldFont>Click the link to install the app. </BoldFont>
                The app will pre-fill your email and a dummy password so you can log in.
              </p>
              <p>
                The app will ask you for your permission to send push notifications.
                <BoldFont>This is optional, </BoldFont>
                but it will allow you to see how users can authenticate with push notifications.
              </p>
              <p>
                When you&apos;re logged in to the ACME app,
                click the button below to continue the demo.
              </p>
              <Link to='/'><button type='button'>Continue</button></Link>
            </>
          )
          : (
            <>
              <form>
                <h2>1. Create Account</h2>
                <InputGroup
                  required
                  labelText='Email'
                  inputId='email'
                  type='text'
                  onChange={handleEmailChange}
                  value={email}
                  disabled={false}
                  explainerBoldText='Use a real email:'
                  explainerText='This is where we&apos;ll send your installation link'
                />

                <InputGroup
                  required
                  labelText='Password'
                  inputId='password'
                  type='password'
                  // eslint-disable-next-line @typescript-eslint/no-empty-function
                  onChange={() => { }}
                  value={password}
                  disabled
                  explainerBoldText='This password is not checked'
                />

                <InputGroup
                  labelText='Phone'
                  inputId='phone'
                  type='text'
                  onChange={handlePhoneChange}
                  value={phone}
                  explainerBoldText='Optional:'
                  explainerText='Enter this to see how users can authenticate with links sent by SMS.'
                />
                <SubmitButton handleSubmit={handleSubmit} disabled={!email}><BoldFont>Register</BoldFont></SubmitButton>
                <ErrorMessage>{formErrorMessage}</ErrorMessage>
              </form>
              <div>
                By creating an account you agree to our <a href='https://unum.id/terms-of-service.html'>terms of service</a> and <a href='https://unum.id/privacy-policy.html'>privacy policy</a>.
              </div>
              <div className='login-link'>
                Already registered?&nbsp;<Link to='/login'>Log in here.</Link>
              </div>
            </>
          )
      }
    </div>
  );
};

export default Register;
