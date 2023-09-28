document.addEventListener('DOMContentLoaded', () => {

    // Login Form Submission
    const loginForm = document.querySelector('#login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.querySelector('#login-email').value;
        const password = document.querySelector('#login-pwd').value;
        
        try {
          const response = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'same-origin', // Ensure cookies are sent with the request
            body: JSON.stringify({ email, password })
          });
          
          if (response.ok) {
            // Redirect to chat page if login is successful
            window.location.href = '/chat';
          } else {
            // Display error message
            const data = await response.json();
            alert(data.error);
          }
        } catch (error) {
          console.error('Error:', error);
        }
      });
    }
    
    // Signup Form Submission
    const signupForm = document.querySelector('#signup-form');
    if (signupForm) {
      signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const firstName = document.querySelector('#signup-fname').value;
        const lastName = document.querySelector('#signup-lname').value;
        const email = document.querySelector('#signup-email').value;
        const password = document.querySelector('#signup-pwd').value;
        
        try {
          const response = await fetch('/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'same-origin', // Ensure cookies are sent with the request
            body: JSON.stringify({ firstName, lastName, email, password })
          });
          
          if (response.ok) {
            // Set a flag in sessionStorage to indicate that the user just registered
            sessionStorage.setItem('userJustRegistered', 'true');
            // Redirect to chat page if registration is successful
            window.location.href = '/chat';
          } else {
            // Display error message
            const data = await response.json();
            alert(data.error);
          }
        } catch (error) {
          console.error('Error:', error);
        }
      });
    }
    
  });
  