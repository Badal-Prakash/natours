const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require('./app');
const LOCAL_DB = process.env.LOCAL_DATABASE;

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
mongoose
  .connect(DB, {
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useNewUrlParser: true
  })
  .then(() => console.log('DB connection successful!'))
  .catch(err => console.error('DB connection error:', err));

const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
