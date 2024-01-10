const express = require("express")
const app = express()
const userRoutes = require("./routes/users.js")
const authRoutes = require("./routes/auth.js")
const tourRoutes = require("./routes/tours.js")
const locationRoutes = require("./routes/locations.js")
const { authenticateJWT } = require("./middleware/auth");
const { NotFoundError } = require("./expressError");


// parse request bodies as json
app.use(express.json())
app.use(authenticateJWT);
app.use("/users", userRoutes)
app.use("/auth", authRoutes)
app.use("/tours", tourRoutes)
app.use("/locations", locationRoutes)

/** Handle 404 errors -- this matches everything */
app.use(function (req, res, next) {
    return next(new NotFoundError());
  });
  
  /** Generic error handler; anything unhandled goes here. */
app.use(function (err, req, res, next) {
    if (process.env.NODE_ENV !== "test") console.error(err.stack);
    const status = err.status || 500;
    const message = err.message;
  
    return res.status(status).json({
      error: { message, status },
    });
  });
  
module.exports = app;