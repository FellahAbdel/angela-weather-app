const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function (req, res) {
  res.render("index");
});

app.post("/", function (req, res) {
  var cityName = req.body.cityName;
  // Correcting user input

  var firstLetter = cityName.slice(0, 1);
  var firstLetterCapitalised = firstLetter.toUpperCase();
  var remainingChars = cityName.slice(1, cityName.length);
  var remainingCharsLowered = remainingChars.toLowerCase();

  const query = firstLetterCapitalised + remainingCharsLowered;
  // console.log(query);
  const apiKey = "a910ff54aa3fe8664dd5b229d5251ee0";
  const unit = "metric";
  const url =
    "https://api.openweathermap.org/data/2.5/weather?appid=" +
    apiKey +
    "&units=" +
    unit +
    "&q=" +
    query;

  https.get(url, function (response) {
    response.on("data", function (data) {
      const weatherData = JSON.parse(data);
      const temp = weatherData.main.temp;
      const weatherDescription = weatherData.weather[0].description;
      const iconName = weatherData.weather[0].icon;
      const iconURLPath =
        "https://openweathermap.org/img/wn/" + iconName + "@2x.png";

      // res.write("<p> The weather is currently " + weatherDescription + "</p>");
      // res.write(
      //   "<h1>The temperature in Strasbourg is " +
      //     temp +
      //     " degrees Celcius </h1>"
      // );
      // res.write("<img src=" + iconURLPath + " alt='icon-image' </img>");
      res.render("weather", {
        nameOfCity: cityName,
        kindOfWeather: weatherDescription,
        temperature: temp,
        srcOficon: iconURLPath,
      });
    });
  });
});

app.get("/search", function (req, res) {
  res.redirect("/");
});

app.listen(3000, function () {
  console.log("Started to listen on port 3000");
});
