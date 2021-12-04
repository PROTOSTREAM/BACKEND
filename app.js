require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const projectRoute = require("./routes/projectRoute");
const hackRoute = require("./routes/hackathon");
const innotechRoute = require("./routes/innotech");
const schemeRoute = require("./routes/scheme");
const resetpass = require("./routes/resetpass");
const startup = require("./routes/startup");
const cors = require("cors");

const app = express();


app.disable('x-powered-by');
app.use(express.static('${__dirname}/public'));
app.use(express.json([]));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());

const client = require('twilio')(process.env.ACCOUNT_SID, process.env.AUTH_TOKEN);
//! Routes..
app.use(authRoute);
app.use(projectRoute);
app.use(hackRoute);
app.use(innotechRoute);
app.use(schemeRoute);
app.use(userRoute);
app.use(resetpass);
app.use(startup);
//! DataBase..
mongoose.connect(process.env.MONGO_ATLAS || process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.set("useCreateIndex", true);



app.listen(process.env.PORT || 3000, function () {
  console.log("Server is running on port " + process.env.PORT);
});
