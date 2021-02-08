import './App.css';
import 'fontsource-roboto';
import { Container, TextField, Box } from "@material-ui/core";
import { useState } from "react";

function App() {
  const [query, setQuery] = useState("");

  const typeHandler = event => setQuery(event.target.value);

  return (
    <Container>
      <Box m={5}>
        <form>
          <TextField label="Type a city!" value={query} onChange={typeHandler}/>
        </form>
      </Box>
    </Container>
  );
}

export default App;
