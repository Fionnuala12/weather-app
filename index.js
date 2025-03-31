import express from "express"; 
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const API_KEY = "06c9d19d30f0be8b128071a6b5e0aeb3";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));





async function fetchWeatherData(cityName) {

    try {

        // Fetch current weather
        const currentWeatherResponse = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`);
        console.log(currentWeatherResponse.data);
        const weatherInfo = currentWeatherResponse.data; 
        
        // Get todays date 
        const fullDate = new Date(); 

        const dayIndex = fullDate.getDay();
        const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]; 
        const dayName = dayNames[dayIndex]; 

        const date = fullDate.getDate();

        const monthIndex = fullDate.getMonth(); 
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const monthName = monthNames[monthIndex];

        const formattedDate = dayName + " " + date + " " + monthName;
        weatherInfo.currentDate = formattedDate;


        // Convert Unix timestamp to milliseconds and adjust for timezone
        const timezoneOffset = weatherInfo.timezone;

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


        //console.log("Weather Info:", weatherInfo);
        //console.log("Forecast Data:", forecast);
        //res.render("index.ejs", { weatherData: weatherInfo, forecastData: forecast });

        return {weatherData: weatherInfo, forecastData: forecast};

    } catch(error) {
        console.error("Error fetching weather data:", error); 
        res.render("index.ejs", { weatherData: null, forecast: null });
    }
}

app.get("/", async (req, res) => {
    const data = await fetchWeatherData("London");
    res.render("index.ejs", data);
}); 

app.post("/city", async (req, res) => {
    const cityName = req.body.cityName; 
    const data = await fetchWeatherData(cityName);
    res.render("index.ejs",  data);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });