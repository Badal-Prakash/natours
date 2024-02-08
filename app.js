const express = require('express');

const morgan = require('morgan');
const { get } = require('http');
const tourRouter = require('./routes/tourRoutes.js');
const userRouter = require('./routes/userRoutes.js');
const app = express();
app.use(express.json());

app.use(morgan('dev'));
app.use((req, res, next) => {
  console.log('hello ffrom the middlware');
  next();
});
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});
// const getAllTours = (req, res) => {
//   res.status(200).send({
//     status: 'success',
//     results: tours.length,
//     data: {
//       tours,
//     },
//   });
// };

// const gettour = (req, res) => {
//   const id = req.params.id * 1;
//   if (id > tours.length) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'Invalid id',
//     });
//   }
//   const tour = tours.find((el) => el.id === id);
//   res.status(200).send({
//     status: 'success',
//     data: {
//       tour,
//     },
//   });
// };

// const createTour = (req, res) => {
//   const newId = tours[tours.length - 1].id + 1;
//   const newTour = Object.assign({ id: newId }, req.body);
//   tours.push(newTour);
//   fs.writeFile(
//     './dev-data/data/tours-simple.json',
//     JSON.stringify(tours),
//     (err) => {
//       res.status(201).json({
//         status: 'success',
//         data: {
//           tours: newTour,
//         },
//       });
//     }
//   );
// };

// const patchTour = (req, res) => {
//   const id = req.params.id * 1;
//   if (id > tours.length) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'Invalid id',
//     });
//   }
//   res.status(200).json({
//     status: 'success',
//     data: {
//       tour: '<upadted tour here...>',
//     },
//   });
// };
// const deleteTour = (req, res) => {
//   const id = req.params.id * 1;
//   if (id > tours.length) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'Invalid id',
//     });
//   }
//   res.status(204).json({
//     status: 'success',
//     data: null,
//   });
// };
// const getallusers = (req, res) => {
//   res.status(500).json({
//     status: 'failed',
//     message: 'this route is not yet defined',
//   });
// };

// const createUser = (req, res) => {
//   res.status(500).json({
//     status: 'failed',
//     message: 'this route is not yet defined',
//   });
// };
// const deleteUser = (req, res) => {
//   res.status(500).json({
//     status: 'failed',
//     message: 'this route is not yet defined',
//   });
// };
// const user = (req, res) => {
//   res.status(500).json({
//     status: 'failed',
//     message: 'this route is not yet defined',
//   });
// };
// const patchUser = (req, res) => {
//   res.status(500).json({
//     status: 'failed',
//     message: 'this route is not yet defined',
//   });
// };

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;
