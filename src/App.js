import './App.css';
import 'fontsource-roboto';
import { Container, TextField, Box, Button, Card, CardContent } from "@material-ui/core";
import { useState } from "react";

function App() {
  const [query, setQuery] = useState("");

  const typeHandler = event => setQuery(event.target.value);

  const fetchCityData = () => {
    console.log("Fetching data...");
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
          Test content
        </CardContent>
      </Card>
    </Container>
  );
}

export default App;
