/* eslint-disable */
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
      throw new Error('Unable to fetch');
    }

    const data = await response.json();
    console.log(data);

    if (data.status === 'success') {
      alert('success', 'Logged in successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    alert(err.message);
  }
};

const logout = async () => {
  try {
    const response = await fetch('/api/v1/users/logout', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    console.log(data);

    if (data.status === 'success') {
      location.reload(true);
    } else {
      alert('Error logging out! Try again.');
    }
  } catch (err) {
    console.log(err);
    alert('Error logging out! Try again.');
  }
};

document.querySelector('.login-form').addEventListener('submit', e => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  login(email, password);
  logout();
});

document.querySelector('#logout_btn').addEventListener('click', () => {});
