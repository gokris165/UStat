import { useEffect, useRef, useState } from "react";
import Header from "../components/Header";
import NextPage from "../components/NextPage";
import PrevPage from "../components/PrevPage";
import { useNavigate } from "react-router-dom";

function SelectPlayers() {
  const navigate = useNavigate();
  const [count, setCount] = useState(0);
  const [playerNames, setPlayerNames] = useState(null);
  const [playerCount, setPlayerCount] = useState(null);
  const [mode, setMode] = useState(null);
  const [choosingTeam2, setChoosingTeam2] = useState(false);

  const availablePlayers = useRef(new Set());
  const team1 = useRef(new Set());
  const team2 = useRef(new Set());

  useEffect(() => {
    try {
      localStorage.removeItem("inProgress");
      localStorage.removeItem("team1");
      localStorage.removeItem("team2");
      let storedMode = localStorage.getItem("mode");
      let storedPlayerNames = JSON.parse(localStorage.getItem("playerNames"));
      let storedPlayerCount = localStorage.getItem("playerCount");
      setMode(storedMode);
      setPlayerNames(storedPlayerNames);
      setPlayerCount(storedPlayerCount);
      availablePlayers.current = new Set([...storedPlayerNames]);
    } catch (error) {
      // console.log(error);
      navigate("/");
    }
  }, []);

  function onPlayerClicked(e) {
    let targetName = e.target.dataset["player"];

    if (availablePlayers.current.has(targetName)) {
      // add selected player to a team
      if (count >= playerCount) return;
      availablePlayers.current.delete(targetName);
      if (choosingTeam2) {
        team2.current.add(targetName);
        e.target.classList.add("team2-player");
      } else {
        team1.current.add(targetName);
        e.target.classList.add("team1-player");
      }
      setCount((count) => count + 1);
    } else {
      // remove player from a team
      if (choosingTeam2) {
        if (team2.current.has(targetName)) {
          team2.current.delete(targetName);
          availablePlayers.current.add(targetName);
          e.target.classList.remove("team2-player");
          setCount((count) => count - 1);
        }
      } else {
        if (team1.current.has(targetName)) {
          team1.current.delete(targetName);
          availablePlayers.current.add(targetName);
          e.target.classList.remove("team1-player");
          setCount((count) => count - 1);
        }
      }
    }
  }

  function onNextTeamClicked(e) {
    console.log(e);
    if (e.target.dataset["active"] === "0") {
      e.target.classList.add("next-team-active");
      e.target.dataset["active"] = "1";
      setCount(team2.current.size);
      setChoosingTeam2(true);
    } else {
      e.target.classList.remove("next-team-active");
      e.target.dataset["active"] = "0";
      setCount(team1.current.size);
      setChoosingTeam2(false);
    }
  }

  function onNext() {
    if (team1.current.size < playerCount || team2.current.size < playerCount)
      return;
    let team1arr = [...team1.current];
    let team2arr = [...team2.current];
    localStorage.setItem("team1", JSON.stringify(team1arr));
    localStorage.setItem("team2", JSON.stringify(team2arr));
    navigate("/stats");
  }

  return (
    <div>
      <Header text={"Select Players"} />
      <div className="content">
        <div
          style={{
            display: "inline-block",
            verticalAlign: "top",
            width: "80%",
          }}
        >
          <div>
            <h2>Names</h2>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                flexDirection: "column",
                height: "340px",
                gap: "10px",
              }}
            >
              {playerNames &&
                playerNames.map((name) => {
                  return (
                    <div
                      key={name}
                      className="player-card"
                      data-player={name}
                      onClick={(e) => onPlayerClicked(e)}
                    >
                      {name}
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
        <div
          style={{
            display: "inline-block",
            width: "20%",
            textAlign: "center",
          }}
        >
          <div>
            <h3 style={{ marginBottom: "0px" }}>Game</h3>
            <span style={{ fontSize: "20px" }}>{mode}</span>
          </div>
          <div>
            <h3 style={{ marginBottom: "0px" }}>Total</h3>
            <span style={{ fontSize: "20px" }}>{count}</span>
          </div>
          <br />
          <br />
          <br />
          <div
            style={{
              display: "inline-block",
              color: "green",
              border: "1px solid green",
              borderRadius: "15px",
              marginLeft: "10px",
              backgroundColor: "#1A1A1A",
              padding: "15px 10px",
              fontWeight: "bold",
              cursor: "pointer",
              fontSize: "20px",
            }}
            data-active={0}
            onClick={onNextTeamClicked}
          >
            Next Team
          </div>
        </div>
      </div>
      <PrevPage action={() => navigate("/")} />
      <NextPage action={() => onNext()} />
    </div>
  );
}

export default SelectPlayers;
