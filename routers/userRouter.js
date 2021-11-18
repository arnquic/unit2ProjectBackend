// Get required libraries.
const express = require('express');
const userController = require('../controllers/userController');

// Set the userRouter as an express router.
const userRouter = express.Router();

// ---------------------------------------
// | Set routes (base route is '/users). |
// ---------------------------------------

// POST '/' - Create user.
userRouter.post('/', userController.createUser);

// POST '/login' - Login an existing user.
userRouter.post('/login', userController.loginUser);

// *** GET '/userinfo' - Retrieve a logged in user's username.
userRouter.get('/userinfo', userController.getUserName);

// GET '/history' - Retrieve a logged in user's saved packlists.
userRouter.get('/history', userController.getUserPacklists);

// -----------------------------------------------------------------------------------------
// | GET '/search' - Retrieve weather information and packlist items for the searched city.
// |    - Specifically, the following will be returned for use:
// |        + City
// |        + Country
// |        + Past 5 days' weather category
// |        + Today's (date search occured) weather category
// |        + Next 7 days' weather category
// |        + Packlist(list of items to pack)
// -----------------------------------------------------------------------------------------
userRouter.post('/search', userController.getWeatherPackitems);

// POST '/search/save' - Save a searched packlist.NOTE: This only works immediately after a search has been performed.
userRouter.post('/search/save', userController.saveWeatherPacklist);

// DELETE '/history' - Delete a saved packlist.
userRouter.delete('/history', userController.deletePacklist);



// Export the userRouter as an express module for use in 'server.js'.
module.exports = userRouter;
