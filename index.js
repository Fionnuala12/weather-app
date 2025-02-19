import express from "express"; 
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const API_KEY = "06c9d19d30f0be8b128071a6b5e0aeb3";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));


app.get("/", (req, res) => {
    res.render("index.ejs", {weatherData: null});
}); 


app.post("/city", async (req, res) => {

    let cityName = req.body.cityName; 
    try {

        // Fetch current weather
        const currentWeatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`);
        console.log(currentWeatherResponse.data);

        const weatherInfo = currentWeatherResponse.data; 
        const timezoneOffset = weatherInfo.timezone;

        // Get todays date 
        const fullDate = new Date(); 

        //Day of the week 
        const dayIndex = fullDate.getDay();
        const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]; 
        const dayName = dayNames[dayIndex]; 

        // Get the date
        const date = fullDate.getDate();

        //Get the Month 
        const monthIndex = fullDate.getMonth(); 
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const monthName = monthNames[monthIndex];

        const formattedDate = dayName + " " + date + " " + monthName;

        weatherInfo.currentDate = formattedDate;


        // Convert Unix timestamp to milliseconds and adjust for timezone
        function convertUnixToTime(unixTime) {
            let date = new Date((unixTime + timezoneOffset) * 1000); 
            let hours = date.getUTCHours(); 
            let minuets = date.getUTCMinutes();
            return `${hours < 10 ? "0" + hours : hours}:${minuets < 10 ? "0" + minuets : minuets}`;
        }

        weatherInfo.sunrise = convertUnixToTime(weatherInfo.sys.sunrise);
        weatherInfo.sunset = convertUnixToTime(weatherInfo.sys.sunset);
        console.log("Sunrise time:", weatherInfo.sunrise);

        // Forecast three hour intervals
        const forecastResponse = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}&units=metric`);
        const forecastData = forecastResponse.data;
        
        const forecast = [];
        for( let i = 0; i < 7; i++) {
            forecast.push(forecastData.list[i]);
        } 
        
        forecast.forEach((entry) => {
            entry.time = convertUnixToTime(entry.dt);
        });
        console.log(forecast);

        res.render("index.ejs", { weatherData: weatherInfo, forecastData: forecast });

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