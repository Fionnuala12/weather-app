import express from "express"; 
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const API_KEY = "06c9d19d30f0be8b128071a6b5e0aeb3";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));


app.get("/", (req, res) => {
    res.render("index.ejs")
});


app.post("/city", async (req, res) => {

    let cityName = req.body.cityName; 

    try {
        const result = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`);
        console.log(result.data);

        const weatherInfo = result.data; 

        const sunriseUnix = weatherInfo.sys.sunrise;
        const sunsetUnix = weatherInfo.sys.sunset;
        const timezoneOffset = weatherInfo.timezone;

        // Convert Unix timestamp to milliseconds and adjust for timezone
        function convertUnixToTime(unixTime) {
            let date = new Date((unixTime + timezoneOffset) * 1000); 
            let hours = date.getUTCHours(); 
            let minuets = date.getUTCMinutes();
            return `${hours < 10 ? "0" + hours : hours}:${minuets < 10 ? "0" + minuets : minuets}`;
        }

        weatherInfo.sunrise = convertUnixToTime(sunriseUnix);
        weatherInfo.sunset = convertUnixToTime(sunsetUnix);
        console.log("Sunrise time:", weatherInfo.sunrise);


        res.render("index.ejs", { weatherData: weatherInfo });

    } catch(error) {
        console.error("Error fetching weather data:", error); 
        res.render("index.ejs", { weatherData: null });
    }


})

/* app.get("/geolocation", async (req, res) => {
    try {
        const { latitude, longitude } = req.query; 
        console.log("query params:", req.query);

        if( !latitude || !longitude ) {
            return res.status(400).json({error: "Latitude and longitude are required"});
        }

        
        const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`;
        console.log("Fetching weather from:", weatherURL);

        const response = await axios.get(weatherURL);
        console.log("Weather data:", response.data); 

        res.render("index.ejs", {weatherData: JSON.stringify(response.data)});

    } catch(error) {
        console.error("Error fetching weather data:", error); 
        res.render("index.ejs", {weatherData: null});
    }
}); */


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });