/* eslint-disable */

const signup = async (name, email, password, confirmPassword) => {
  try {
    const response = await fetch('/api/v1/users/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, email, password, confirmPassword })
    });

    if (!response.ok) {
      throw new Error('Unable to fetch');
    }
    const data = await response.json();

    console.log(data);

    if (data.status === 'success') {
      alert('Signed up successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    alert(err.message);
  }
};

document.querySelector('.signup-form').addEventListener('submit', e => {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  signup(name, email, password, confirmPassword);
});
