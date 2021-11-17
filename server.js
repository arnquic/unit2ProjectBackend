// Require statements.
const express = require('express');
const rowdy = require('rowdy-logger');
const userRouter = require('./routers/userRouter');

// App initialization.
const app = express();
const routesReport = rowdy.begin(app);

app.use(express.json());

// Set port for the app to listen on.
const PORT = process.env.port || 3001;

// Set the app to listen.
app.listen(PORT, function () {
    console.log(`Listenting on port ${PORT}`);
    routesReport.print();
})

// Set routes.
app.use('/users', userRouter);