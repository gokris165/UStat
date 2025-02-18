import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { useEffect, useState } from "react";
import NextPage from "../components/NextPage";

function Home() {
  const navigate = useNavigate();
  const [mode, setMode] = useState();
  const [activeId, setActiveId] = useState(null);
  const [playerNames, setPlayerNames] = useState(null);
  const [playerCount, setPlayerCount] = useState(null);

  useEffect(() => {
    localStorage.removeItem("inProgress");
    localStorage.removeItem("mode");
    localStorage.removeItem("playerCount");
    localStorage.removeItem("team1");
    localStorage.removeItem("team2");
    let stored = localStorage.getItem("playerNames");
    if (stored != null) setPlayerNames(JSON.parse(stored));

    // change this later
    setPlayerNames([
      "Caleb",
      "Charles",
      "Chris",
      "Dan",
      "Isaac",
      "Jake",
      "Joe",
      "Kevin",
      "Krone",
      "Lail",
      "Linares",
      "Mark",
      "Novinsky",
      "Raf",
      "Roman",
      "Ryan-Ph",
      "Sakhin",
      "Tanner",
      "Ted",
      "Vincent",
      "X",
    ]);
  }, []);

  function selectMode(e) {
    if (activeId) {
      document.getElementById(activeId).classList.remove("active-button");
    }
    document.getElementById(e.target.id).classList.add("active-button");
    setActiveId(e.target.id);
    setMode(e.target.dataset["mode"]);
    setPlayerCount(e.target.dataset["playercount"]);
  }

  function onNext() {
    if (!mode) {
      alert("Select a gamemode!");
      return;
    }
    if (!playerNames) {
      alert("Missing player names!");
      return;
    }
    localStorage.setItem("mode", mode);
    localStorage.setItem("playerNames", JSON.stringify(playerNames));
    localStorage.setItem("playerCount", playerCount);

    navigate("/selectPlayers");
  }

  return (
    <div>
      <Header text={"Game mode?"} />
      <div className="content">
        <div className="button-container">
          <div
            id="button-3"
            onClick={(e) => selectMode(e)}
            data-mode="3v3"
            data-playercount="3"
            className="button"
          >
            3v3
          </div>
          <div
            id="button-4"
            onClick={(e) => selectMode(e)}
            data-mode="4v4"
            data-playercount="4"
            className="button"
          >
            4v4
          </div>
          <div
            id="button-5"
            onClick={(e) => selectMode(e)}
            data-mode="5v5"
            data-playercount="5"
            className="button"
          >
            5v5
          </div>
          <div
            id="button-6"
            onClick={(e) => selectMode(e)}
            data-mode="6v6"
            data-playercount="6"
            className="button"
          >
            6v6
          </div>
          <div
            id="button-7"
            onClick={(e) => selectMode(e)}
            data-mode="7v7"
            data-playercount="7"
            className="button"
          >
            7v7
          </div>
          {/* <div
            id="button-tournament"
            onClick={(e) => selectMode(e)}
            data-mode="tournament"
            data-playercount="7"
            className="button"
          >
            Tourney
          </div> */}
        </div>
      </div>
      <NextPage action={onNext} />
    </div>
  );
}

export default Home;
