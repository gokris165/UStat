import { Route, Routes } from "react-router-dom";
import Home from "./routes/Home";
import SelectPlayers from "./routes/SelectPlayers";
import Stats from "./routes/Stats";
import GameEnd from "./routes/GameEnd";
import ViewStats from "./routes/ViewStats";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/selectPlayers" element={<SelectPlayers />} />
      <Route path="/stats" element={<Stats />} />
      <Route path="/gameEnd" element={<GameEnd />} />
      <Route path="/viewStats" element={<ViewStats />} />
    </Routes>
  );
}

export default App;
