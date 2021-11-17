// Get required libraries.
const axios = require('axios');
const db = require('../models');
const { Op } = require('sequelize');
const record = require('../models/record');

// Create the base controller object.
const userController = {};

// Time-frame in UTC format.
const days1 = 86400;
const days5 = 432000;

// --------------------
// | Route functions. |
// --------------------

// ----------------------------------
// *** POST '/users' - Create user.
// ----------------------------------
userController.createUser = async function (req, res) {
    try {
        const user = await db.user.create({
            username: req.body.username,
            password: req.body.password
        });
        res.send({ message: "User created successfully.", userId: user.id });
    }
    catch (err) {
        res.status(406);
        res.send({ message: "Username already taken." });
    }
}

// --------------------------------------------------
// *** POST '/users/login' - Login an existing user.
// --------------------------------------------------
userController.loginUser = async function (req, res) {
    try {
        const existingUser = await db.user.findOne({
            where: {
                username: req.body.username
            }
        });
        if (existingUser.password === req.body.password) {
            res.send({ message: "Login successful.", userId: existingUser.id });
        }
        else {
            res.status(401);
            res.send({ message: "Invalid username/password combination." });
        }
    }
    catch (err) {
        res.status(401);
        res.send({ message: "Invalid username/password combination." });
    }
}

// -----------------------------------------------------------------------
// *** GET '/users/history' - Retrieve a logged in user's saved packlists.
// -----------------------------------------------------------------------
userController.getUserPacklists = async function (req, res) {
    try {
        let historyReturn = [];
        const existingUser = await db.user.findByPk(req.headers.authorization);
        const userRecords = await existingUser.getRecords();
        for (let i = 0; i < userRecords.length; i++) {
            // Find the weather related to the current user record.
            const weatherReturn = await userRecords[i].getWeather();
            console.log(weatherReturn);

            // Find the packItems related to the current user record.
            console.log(userRecords[i]);
            try {
                const packItems = await userRecords[i].getPackItems();
            }
            catch (err) {
                res.status(400);
                res.send({ message: "Error at packItem retrieval." });
            }

            // Loop through the different packItems and get just their dataValues.
            let packListReturn = [];
            for (let j = 0; j < packLists.length; j++) {
                packListReturn.push(packItems[j].dataValues);
            }
            // Add the cityId, weather, and packItems into one object to be appended to the historyReturn array.
            historyReturn.push({ cityId: userRecords[i].dataValues.cityId, weatherReturn, packListReturn })
        }
        console.log(userRecords);
        res.send({ message: "getUserPacklists test." });
    }
    catch (err) {
        res.status(400);
        res.send({ message: "Unable to retrieve user's Packlist history." });
    }
}

// --------------------------------------------------------------------------------------------------
// *** GET '/users/search' - Retrieve weather information and packlist items for the searched city.
//          Specifically, the following will be returned for use:
//              + City
//              + Country
//              + Past 5 days' weather category
//              + Today's (date search occured) weather category
//              + Next 7 days' weather category
//              + Packlist(list of items to pack)
// -------------------------------------------------------------------------------------------------
userController.getWeatherPackitems = async function (req, res) {
    let cityId;
    let weatherReturn = {};
    let packListReturn = {};

    // Get the weather for the current date at the input city,country. Units are imperial (deg F).
    let todayWeatherResponse;
    try {
        todayWeatherResponse = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${req.body.city},${req.body.country}&units=imperial&appid=89de7727b1752cbeafa3942937797633`);
        console.log(todayWeatherResponse.data);
    }
    catch (err) {
        console.log('Error at todayWeatherResponse', err);
        res.send({ message: "Error at todayWeatherResponse", error: err });
    }

    // Set the cityId.
    cityId = todayWeatherResponse.data.id;

    // Set the weather type to be returned for today.
    weatherReturn.today = determineWeatherType(todayWeatherResponse.data.main.temp);

    // Retrieve the longitude and latitude from the weather api's response to use in the upcoming weather api calls.
    const cityLonLat = todayWeatherResponse.data.coord;

    // Calculate 5 days in the past in UTC format.
    const daysAgo5 = todayWeatherResponse.data.dt - days5;

    // Get the weather for the last 5 days at the input longitude and latitude. Units are imperial (deg F).
    let historicTempAvg;
    try {
        historicTempAvg = await calculateAvg5DayTemp(cityLonLat.lon, cityLonLat.lat, daysAgo5);
        console.log('historic avg temp: ' + historicTempAvg);
    }
    catch (err) {
        console.log('Error at historicTempAvg', err);
        res.send({ message: "Error at historicTempAvg", error: err });
    }

    // Set the weather type to be returned for the historical (last 5 days) weather.
    weatherReturn.past5days = determineWeatherType(historicTempAvg);

    // Get the daily weather for the next 7 days at the input longitude and latitude. Units are imperial (deg F).
    let forecastTempAvg;
    try {
        forecastTempAvg = await calculateAvg7DayTemp(cityLonLat.lon, cityLonLat.lat);
        console.log('forecast avg temp: ' + forecastTempAvg);
    }
    catch (err) {
        console.log('Error at forecastTempAvg', err);
        res.send({ message: "Error at forecastTempAvg", error: err });
    }
    // Set the weather type to be returned for the future (upcoming 7 days) weather.
    weatherReturn.next7days = determineWeatherType(forecastTempAvg);

    // Set the packlist to be returned.
    try {
        packListReturn = await getPackItems(weatherReturn.future7days);
    }
    catch (err) {
        console.log('Error at packListReturn', err);
        res.send({ message: "Error at packListReturn", error: err });
    }
    // Return the weather and packlist as one object.
    res.json({ cityId: cityId, weatherReturn, packListReturn });
}

// --------------------------------------------------------------------
// *** POST '/users/search/save' - Save a searched packlist.
//          Requires: 
//           - userId passed through headers as 'Authorization'
//           - cityId object passed through the body
//           - weatherReturn object passed through the body
//           - packListReturn array of objects passed through the body
// --------------------------------------------------------------------
userController.saveWeatherPacklist = async function (req, res) {
    try {
        const loggedInUser = await db.user.findByPk(req.headers.authorization);
        const newRecord = await loggedInUser.createRecord({
            cityId: req.body.cityId
        });
        await newRecord.createWeather({
            past5days: req.body.weatherReturn.past5days,
            today: req.body.weatherReturn.today,
            next7days: req.body.weatherReturn.future7days
        });
        for (let i = 0; i < req.body.packListReturn.length; i++) {
            const packItemToAdd = await db.packItem.findByPk(req.body.packListReturn[i].id);
            await newRecord.addPackItem(packItemToAdd);
        }
        res.send({ message: "Packlist saved successfully." });
    }
    catch (err) {
        res.status(400);
        res.send({ message: "Unable to save packlist." });
    }
}

// ------------------------------------------------------
// *** DELETE '/users/history' - Delete a saved packlist.
// ------------------------------------------------------
userController.deletePacklist = async function (req, res) {
    const loggedInUser = await db.user.findByPk(req.header.authorization);

}


// Export the userController as an express module for use in the userRouter.
module.exports = userController;



// ---------------------
// | Helper Functions. |
// ---------------------

async function calculateAvg5DayTemp(longitude, latitude, callDate) {
    let daysAvgTemp = 0;
    // Because the weather api's historical weather call returns one day's worth of hourly data, to get 5 days worth of data, the api must be called 5 times.
    for (let i = 0; i < 5; i++) {
        let hoursAvgTemp = 0;
        // Call the weather api to get a day's worth of historic hourly data for the day "callDate," which is in UTC format.
        let historyWeatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/onecall/timemachine?lat=${latitude}&lon=${longitude}&dt=${callDate}&units=imperial&appid=89de7727b1752cbeafa3942937797633`);
        for (let j = 0; j < historyWeatherResponse.data.hourly.length; j++) {
            hoursAvgTemp += historyWeatherResponse.data.hourly[j].temp;
        }
        daysAvgTemp += hoursAvgTemp / historyWeatherResponse.data.hourly.length;
        callDate += days1;
    }
    console.log('5 Day Avg function done.');
    return daysAvgTemp / 5;
}

async function calculateAvg7DayTemp(longitude, latitude) {
    const forecastWeatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=current,minutely,hourly,alerts&units=imperial&appid=89de7727b1752cbeafa3942937797633`);
    let avgTemp = 0;
    for (let i = 0; i < forecastWeatherResponse.data.daily.length; i++) {
        avgTemp += forecastWeatherResponse.data.daily[i].temp.day;
    }
    console.log('7 Day Avg function done.');
    return avgTemp / forecastWeatherResponse.data.daily.length;
}

function determineWeatherType(temp) {
    if (temp < 35) {
        return "frigid";
    }
    else if (temp >= 35 && temp < 65) {
        return "cold";
    }
    else if (temp >= 65 && temp < 78) {
        return "warm";
    }
    else {
        return "hot";
    }
}

async function getPackItems(weatherType) {
    const requiredItems = await db.packItem.findAll({
        where: {
            weatherUse: {
                [Op.substring]: weatherType
            }
        }
    });
    return requiredItems;
}