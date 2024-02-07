const express = require('express');
const fs = require('fs');
const app = express();
// app.get('/', (req, res) => {
//   // res.status(200).send('hello from the server side');
//   res.json({ message: 'hello from the server side', app: 'Natours' });
// });

// app.post('/', (req, res) => {
//   res.json({ message: 'hello from the server side', app: 'Natours' });
// });

const tours = JSON.parse(fs.readFileSync('./dev-data/data/tours-simple.json'));

app.get('/api/v1/tours', (req, res) => {
  res.status(200).send({
    status: 'success',
    data: {
      tours,
    },
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`listen on port ${port}`);
});
