const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
const LOCAL_DB =
  process.env.LOCAL_DATABASE || 'mongodb://localhost:27017/natours';

mongoose
  .connect(LOCAL_DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => console.log('DB connection successful!'))
  .catch(err => console.error('DB connection error:', err));

const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
