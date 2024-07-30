/* eslint-disable */
// import { showAlert } from './alerts';

const login = async (email, password) => {
  try {
    const res = await axios({
      method: 'POST',
      url: 'http://127.0.0.1:3000/api/v1/users/login',
      data: {
        email,
        password
      }
    });
    console.log(res);
    if (res.data.status === 'success') {
      alert('success', 'Logged in successfully!');
      // window.setTimeout(() => {
      //   location.assign('/');
      // }, 1500);
    }
  } catch (err) {
    alert('error', err.response.data.message);
  }
};

// const logout = async () => {
//   try {
//     const response = await fetch('http://127.0.0.1:3000/api/v1/users/logout', {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json'
//       }
//     });

//     const data = await response.json();

//     if (data.status === 'success') {
//       location.reload(true); // Force reload from the server
//     } else {
//       // showAlert('error', 'Error logging out! Try again.');
//     }
//   } catch (err) {
//     console.log(err);
//     // showAlert('error', 'Error logging out! Try again.');
//   }
// };

document.querySelector('.form').addEventListener('submit', e => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  login(email, password); // Pass email and password as separate arguments
});
