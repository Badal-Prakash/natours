const express = require('express');
const router = express.Router();
const tourController = require('./../controller/tourController.js');
router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour);
router
  .route('/:id')
  .get(tourController.gettour)
  .patch(tourController.patchTour)
  .delete(tourController.deleteTour);

module.exports = router;
