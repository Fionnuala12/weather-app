import express from "express"; 
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const API_KEY = "06c9d19d30f0be8b128071a6b5e0aeb3";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));


app.get("/", (req, res) => {
    res.render("index.ejs");
});

app.get("/geolocation", async (req, res) => {
    try {
        const { latitude, longitude } = req.query; 

        if( !latitude || !longitude ) {
            return res.status(400).json({error: "Latitude and longitude are required"});
        }

        const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`;
        console.log("Fetching weather from:", weatherURL);

        const response = await axios.get(weatherURL);
        console.log("Weather data:", response.data); 

        res.render("index.ejs", { weatherData: response.data });

    } catch(error) {
        console.error("Error fetching weather data:", error); 
        res.status(500).json({ error: "Failed to fetch weather data"});
    }
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });