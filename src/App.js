import './App.css';
import 'fontsource-roboto';
import { Container, TextField, Box, Button, Card, CardContent } from "@material-ui/core";
import { useState } from "react";

const proxy = "https://cors-anywhere.herokuapp.com/";
const searchURL = proxy + "https://www.metaweather.com/api/location/search/?query=";
const woeidURL = proxy + "https://www.metaweather.com/api/location/";

const toFarenheit = celcius => Math.round((celcius * 1.8) + 32);

function App() {
  const [query, setQuery] = useState("");
  const [highTemp, setHighTemp] = useState(null);

  const typeHandler = event => setQuery(event.target.value);

  const fetchCityData = () => {
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

            setHighTemp(toFarenheit(weatherData.max_temp));
          });
      })
      .catch(error => {
        console.log(error)
      });
  };

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
      <Card elevation={4}>
        <CardContent>
          {highTemp}
        </CardContent>
      </Card>
    </Container>
  );
}

export default App;
