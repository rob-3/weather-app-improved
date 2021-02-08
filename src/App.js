import './App.css';
import 'fontsource-roboto';
import {
  Container, 
  TextField,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Typography,
} from "@material-ui/core";
import { useState } from "react";

const proxy = "https://cors-anywhere.herokuapp.com/";
const searchURL = proxy + "https://www.metaweather.com/api/location/search/?query=";
const woeidURL = proxy + "https://www.metaweather.com/api/location/";

const toFarenheit = celcius => Math.round((celcius * 1.8) + 32);

function App() {
  const [query, setQuery] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [isLoading, setLoading] = useState(false);

  const typeHandler = event => setQuery(event.target.value);

  const fetchCityData = () => {
    setLoading(true);
    fetch(searchURL + query)
      .then(blob => blob.json())
      .then(data => {
        console.log(data);
        const city = data[0];
        const woeid = city.woeid;
        fetch(woeidURL + woeid)
          .then(blob => blob.json())
          .then(cityData => {
            const weatherData = cityData.consolidated_weather[0];

            setLoading(false);
            setWeatherData({
              high: toFarenheit(weatherData.max_temp),
              low: toFarenheit(weatherData.min_temp),
              weather: weatherData.weather_state_name,
            });
          });
      })
      .catch(error => {
        console.log(error)
      });
  };

  const output = 
    isLoading ? <CircularProgress /> :
    !weatherData ? null :
    <WeatherData weatherData={weatherData}/>;

  return (
    <Container>
      <Box m={5}>
        <form>
          <TextField label="Type a city!" value={query} onChange={typeHandler}/>
          <Button variant="contained" color="primary" onClick={fetchCityData}>
            Get Weather Data
          </Button>
        </form>
      </Box>
      {output}
    </Container>
  );
}

function WeatherData({ weatherData }) {
  return (
    <Card elevation={4}>
      <CardContent>
        <Typography>
          High: {weatherData.high}°F<br />
          Low: {weatherData.low}°F<br />
          Weather: {weatherData.weather}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default App;
