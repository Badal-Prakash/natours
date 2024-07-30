/* eslint-disable */
// import '@babel/polyfill';
const login = async (email, password) => {
  try {
    const response = await fetch('/api/v1/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      throw new Error(
        'Unable to log in. Please check your credentials and try again.'
      );
    }

    const data = await response.json();
    console.log(data);

    if (data.status === 'success') {
      alert('Logged in successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    } else {
      throw new Error(data.message || 'Login failed. Please try again.');
    }
  } catch (err) {
    alert(err.message);
  }
};

const logout = async () => {
  try {
    const response = await fetch('/api/v1/users/logout', {
      method: 'GET'
    });

    if (!response.ok) {
      throw new Error('Failed to log out');
    }

    const data = await response.json();

    if (data.status === 'success') {
      location.reload(true);
    } else {
      showAlert('error', 'Failed to log out. Please try again.');
    }
  } catch (err) {
    console.log(err.message);
    showAlert('error', 'Error logging out! Try again.');
  }
};

document.querySelector('.login-form').addEventListener('submit', e => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  login(email, password);
});

document.querySelector('.nav__el--logout').addEventListener('click', logout);
