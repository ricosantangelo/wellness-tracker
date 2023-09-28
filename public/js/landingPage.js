document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('#loginForm');
    const signupForm = document.querySelector('#signupForm');
    
    // Attach event listener for login form submission
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const email = e.target.email.value;
      const password = e.target.pwd.value;
      
      try {
        const response = await fetch('/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
          // Handle successful login, e.g., redirecting to another page
          window.location.href = '/chat';
        } else {
          // Handle login error, e.g., showing an error message to the user
          console.error(data.error);
        }
      } catch (error) {
        console.error('Error during login:', error);
      }
    });
  
    // Attach event listener for signup form submission
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const firstName = e.target.fname.value;
      const lastName = e.target.lname.value;
      const email = e.target.email.value;
      const password = e.target.pwd.value;
      // Assuming there's a pwdConfirm field in your form for password confirmation
      const passwordConfirm = e.target.pwdConfirm.value;
      
      if (password !== passwordConfirm) {
        console.error('Passwords do not match');
        return;
      }
      
      try {
        const response = await fetch('/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ firstName, lastName, email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
          // Handle successful signup, e.g., redirecting to another page
          window.location.href = '/chat';
        } else {
          // Handle signup error, e.g., showing an error message to the user
          console.error(data.error);
        }
      } catch (error) {
        console.error('Error during signup:', error);
      }
    });
  
    // TODO: Add event listeners for "Forgot Password" and "Reset Password" when implemented
  });
  