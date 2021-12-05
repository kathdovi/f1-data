import logo from "./logo.svg";
import "./App.css";
import { Link } from "react-router-dom";
import Button from '@mui/material/Button';

function App() {
  return (
    <div className="App">
      <h1>Formula 1 Data</h1>
      <h3>Menu</h3>
      <Link to="/quali"><Button variant="contained">Qualifying Deltas By Race Week</Button></Link>
    </div>
  );
}

export default App;
