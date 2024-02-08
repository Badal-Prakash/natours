const express = require('express');
const router = express.Router();
const userController = require('./../controller/userController');

router
  .route('/')
  .get(userController.getallusers)
  .post(userController.createUser);
router
  .route('/:id')
  .get(userController.user)
  .patch(userController.patchUser)
  .delete(userController.deleteUser);
module.exports = router;
