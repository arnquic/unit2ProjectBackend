// Import database models for use.
const db = require('../models');

// Create the base controller object.
const userController = {};

// --------------------
// | Route functions. |
// --------------------

// POST '/users' - Create user.
userController.createUser = async function (req, res) {

}

// POST '/users/login' - Login an existing user.
userController.loginUser = async function (req, res) {

}

// GET '/users/history' - Retrieve a logged in user's saved packlists.
userController.getUserPacklists = async function (req, res) {

}

// ------------------------------------------------------------------------------------------------
// | GET '/users/search' - Retrieve weather information and packlist items for the searched city.
// | NOTE: This only works if a user is logged in.
// |    - Specifically, the following will be returned for use:
// |        + City
// |        + Country
// |        + Past 5 days' weather category
// |        + Today's (date search occured) weather category
// |        + Next 7 days' weather category
// |        + Packlist(list of items to pack)
// ------------------------------------------------------------------------------------------------
userController.getWeatherPackitems = async function (req, res) {

}

// POST '/users/search/save' - Save a searched packlist.NOTE: This only works immediately after a search has been performed.
userController.saveWeatherPacklist = async function (req, res) {

}

// DELETE '/users/history' - Delete a saved packlist.
userController.deletePacklist = async function (req, res) {

}


// Export the userController as an express module for use in the userRouter.
module.exports = userController;