import { useContext, useRef, useState } from 'react';

import NotificationContext from '../../store/notificationContext';
import styles from './NewsletterRegistration.module.css';

function NewsletterRegistration() {
  const [isInvalid, setIsInvalid] = useState(false);
  const emailInputRef = useRef();
  const notificationCtx = useContext(NotificationContext);

  function registrationHandler(event) {
    event.preventDefault();

    const enteredEmail = emailInputRef.current.value;

    notificationCtx.showNotification({
      title: 'Signing up...', 
      message: 'Registering for newsletter.', 
      status: 'pending'
    });

    if (
      !enteredEmail ||
      enteredEmail.trim() === '' ||
      !enteredEmail.includes('@')
    ) {
      setIsInvalid(true);
      return;
    }

    fetch('/api/newsletter', {
      method: 'POST',
      body: JSON.stringify({ email: enteredEmail }), 
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        if (response.ok || response.acknowledged) {
          return response.json();
        }

        // Here is catching the case of error-http statuses as 400 or 500, which will not 
        // causes promises to fail, so to intercept by catch block need to throw new error 
        // in returning nested promise-chain
        return response.json().then(data => {
          throw new Error(data.message || 'Something went wrong!');
        })
      })
      .then(data => {
        notificationCtx.showNotification({
          title: 'Success!', 
          message: 'Successfully registered for newsletter!', 
          status: 'success'
        });
      })
      .catch(error => {
        notificationCtx.showNotification({
          title: 'Error!', 
          message: error.message || 'Something went wrong!', 
          status: 'error'
        });
      });
  }

  return (
    <section className={styles.newsletter}>
      <h2>Sign up to stay updated!</h2>
      <form onSubmit={registrationHandler}>
        <div className={styles.control}>
          <input 
            type="email"
            id="email"
            placeholder="Your email"
            aria-label="Your email" 
            ref={emailInputRef} 
          />
          <button>Register</button>
        </div>
        {isInvalid && <p className='error'>Please enter a valid email address!</p>}
      </form>
    </section>
  );
}

export default NewsletterRegistration;
