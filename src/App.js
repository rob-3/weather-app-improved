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
  const [weekWeather, setWeekWeather] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [cityName, setCityName] = useState("");

  const typeHandler = event => setQuery(event.target.value);

  const fetchCityData = () => {
    setCityName("");
    setLoading(true);
    fetch(searchURL + query)
      .then(blob => blob.json())
      .then(data => {
        const city = data[0];
        setCityName(city.title);
        const woeid = city.woeid;
        fetch(woeidURL + woeid)
          .then(blob => blob.json())
          .then(cityData => {
            const verboseWeekWeather = cityData.consolidated_weather;

            setLoading(false);
            setWeekWeather(
              verboseWeekWeather.map(dayWeather => ({
                high: toFarenheit(dayWeather.max_temp),
                low: toFarenheit(dayWeather.min_temp),
                weather: dayWeather.weather_state_name,
                date: dayWeather.applicable_date,
              }))
            );
          });
      })
      .catch(error => {
        console.log(error)
      });
  };

  const output = 
    isLoading ? <CircularProgress /> :
    !weekWeather ? null :
    <WeeklyForcast weekWeather={weekWeather}/>;

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
      <Typography variant="h3">
        {cityName}
      </Typography>
      {output}
    </Container>
  );
}

function WeeklyForcast({ weekWeather }) {
  return weekWeather.map(data => <DailyForcast key={String(data.id)} weatherData={data} />);
}

function DailyForcast({ weatherData }) {
  return (
    <Box m={1}>
      <Card elevation={3}>
        <CardContent>
          <Typography variant="h5">
            {weatherData.date}
          </Typography>
          <Typography>
            High: {weatherData.high}°F<br />
            Low: {weatherData.low}°F<br />
            Weather: {weatherData.weather}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}

export default App;
