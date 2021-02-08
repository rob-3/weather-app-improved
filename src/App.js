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
  List,
  ListItem,
  CardMedia,
} from "@material-ui/core";
import { useState, useEffect } from "react";

const proxy = "https://cors-anywhere.herokuapp.com/";
const searchURL = proxy + "https://www.metaweather.com/api/location/search/?query=";
const woeidURL = proxy + "https://www.metaweather.com/api/location/";
const imgURL = "https://www.metaweather.com/static/img/weather/"

const toFarenheit = celcius => Math.round((celcius * 1.8) + 32);

function App() {
  const [query, setQuery] = useState("");
  const [cities, setCities] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [weekWeather, setWeekWeather] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const enterListener = event => {
      if (event.key === "Enter") {
        event.preventDefault();
        fetchCityChoices();
      }
    };
    document.addEventListener("keydown", enterListener);
    return () => document.removeEventListener("keydown", enterListener);
  }, [fetchCityChoices]);

  function typeHandler(event) {
    setQuery(event.target.value);
  }

  function fetchCityChoices() {
    setCities([]);
    setSelectedIndex(-1);
    setLoading(true);
    setFailed(false);
    setWeekWeather(null);
    fetch(searchURL + query)
      .then(blob => blob.json())
      .then(data => {
        setCities(data.map((city, index) => ({ 
          name: city.title,
          woeid: city.woeid,
          callback: () => {
            setSelectedIndex(index);
            fetchWeatherData(city)
          }
        })));
        setLoading(false);
      })
      .catch(error => {
        console.log(error);
        setLoading(false);
        setFailed(true);
      });
  }

  function fetchWeatherData(city) {
    setLoading(true);
    fetch(woeidURL + city.woeid)
      .then(blob => blob.json())
      .then(cityData => {
        const verboseWeekWeather = cityData.consolidated_weather;

        setLoading(false);
        setWeekWeather(
          verboseWeekWeather.map(dayWeather => ({
            high: toFarenheit(dayWeather.max_temp),
            low: toFarenheit(dayWeather.min_temp),
            weather: dayWeather.weather_state_name,
            imgURL: imgURL + dayWeather.weather_state_abbr + ".svg",
            date: dayWeather.applicable_date,
            id: dayWeather.id,
          }))
        );
      })
      .catch(error => {
        console.log(error);
        setLoading(false);
        setFailed(true);
      });
  };

  const output = 
    isLoading ? <CircularProgress /> :
    failed ? <Typography variant="h3">Request failed!</Typography> :
    !weekWeather ? null :
    <WeeklyForcast weekWeather={weekWeather}/>;

  return (
    <Container>
      <Box m={5}>
        <form>
          <TextField label="Type a city!" value={query} onChange={typeHandler}/>
          <Button variant="contained" color="primary" onClick={fetchCityChoices}>
            Get Weather Data
          </Button>
        </form>
      </Box>
      { cities.length > 0 ? <CityPicker cities={cities} selectedIndex={selectedIndex} /> : null }
      <Typography variant="h3">
      </Typography>
      {output}
    </Container>
  );
}

function CityPicker({ cities, selectedIndex }) {
  return (
    <List>
      { cities.map((city, index) => <ListItem key={city.name} selected={index === selectedIndex} button onClick={city.callback}>{city.name}</ListItem>) }
    </List>
  );
}

function WeeklyForcast({ weekWeather }) {
  return weekWeather.map(data => <DailyForcast key={String(data.id)} weatherData={data} />);
}

function DailyForcast({ weatherData }) {
  return (
    <Box display="inline-block" m={1}>
      <Card elevation={3}>
        <CardMedia style={{ height: 140 }} image={weatherData.imgURL}/>
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
