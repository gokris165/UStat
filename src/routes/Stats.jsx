import { useEffect, useState } from "react";
import Header from "../components/Header";
import PrevPage from "../components/PrevPage";
import NextPage from "../components/NextPage";
import StatCounter from "../components/StatCounter";
import { useNavigate } from "react-router-dom";

function Stats() {
  const navigate = useNavigate();
  const [team1, setTeam1] = useState(null);
  const [team2, setTeam2] = useState(null);
  const [turns, setTurns] = useState(null);
  const [assists, setAssists] = useState(null);
  const [goals, setGoals] = useState(null);
  const [gameEnd, setGameEnd] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState(null);

  useEffect(() => {
    try {
      // load info from localstorage
      let storedTeam1 = JSON.parse(localStorage.getItem("team1"));
      let storedTeam2 = JSON.parse(localStorage.getItem("team2"));

      let storedProgress = JSON.parse(localStorage.getItem("inProgress"));
      if (storedProgress) {
        setTurns(storedProgress.turns);
        setAssists(storedProgress.assists);
        setGoals(storedProgress.goals);
      } else {
        // initialize turns
        let turnsObj = {};
        let assistsObj = {};
        let goalsObj = {};
        for (let player of [...storedTeam1, ...storedTeam2]) {
          turnsObj[player] = 0;
          assistsObj[player] = 0;
          goalsObj[player] = 0;
        }

        setTurns(turnsObj);
        setAssists(assistsObj);
        setGoals(goalsObj);
      }

      storedTeam1.sort();
      storedTeam2.sort();
      setTeam1(storedTeam1);
      setTeam2(storedTeam2);
    } catch (error) {
      // console.log(error);
      navigate("/selectPlayers");
    }
  }, []);

  useEffect(() => {
    if (team1) document.getElementById(`player-${team1[0]}`).click();
  }, [team1]);

  useEffect(() => {
    if (!turns || !assists || !goals) return;
    let progress = { turns: turns, assists: assists, goals: goals };
    localStorage.setItem("inProgress", JSON.stringify(progress));
  }, [turns, assists, goals]);

  function onPlayerClick(e) {
    let playerName = e.target.dataset["player"];
    if (currentPlayer == playerName) return;

    if (currentPlayer)
      document
        .getElementById(`player-${currentPlayer}`)
        .classList.remove("active-button");
    setCurrentPlayer(playerName);
    e.target.classList.add("active-button");
  }

  function inc(setAttr, player) {
    setAttr((prev) => {
      let newobj = { ...prev };
      newobj[player] += 1;
      return newobj;
    });
  }

  function dec(setAttr, player) {
    setAttr((prev) => {
      let newobj = { ...prev };
      newobj[player] -= 1;
      return newobj;
    });
  }

  function onGameEndClicked(e) {
    setGameEnd((prev) => !prev);
    if (!gameEnd) e.target.classList.add("game-end-true");
    else e.target.classList.remove("game-end-true");
  }

  function onPrev() {
    navigate("/selectPlayers");
  }

  function onNext() {
    if (!gameEnd) {
      alert("Click on End Game button!");
      return;
    }
    navigate("/gameEnd");
  }

  return (
    <div>
      <Header text={"Collect Stats"} />
      <div className="content">
        {/* display player names */}
        <div style={{ display: "inline-block", width: "50%" }}>
          <h2 style={{ marginBottom: "5px" }}>Team 1</h2>
          {team1 &&
            team1.map((name) => {
              return (
                <div
                  id={`player-${name}`}
                  key={name}
                  className="player-card"
                  data-player={name}
                  style={{ width: "100px", marginBottom: "10px" }}
                  onClick={(e) => onPlayerClick(e)}
                >
                  {name}
                </div>
              );
            })}

          <h2 style={{ marginBottom: "5px" }}>Team 2</h2>
          {team2 &&
            team2.map((name) => {
              return (
                <div
                  id={`player-${name}`}
                  key={name}
                  className="player-card"
                  data-player={name}
                  style={{ width: "100px", marginBottom: "10px" }}
                  onClick={(e) => onPlayerClick(e)}
                >
                  {name}
                </div>
              );
            })}
        </div>
        {/* stat counter */}
        <div
          style={{
            display: "inline-block",
            width: "50%",
            verticalAlign: "top",
          }}
        >
          {/* Turns */}
          <StatCounter
            title={"Turns"}
            inc={() => inc(setTurns, currentPlayer)}
            dec={() => dec(setTurns, currentPlayer)}
            counter={turns && turns[currentPlayer] ? turns[currentPlayer] : 0}
          />
          {/* Assists */}
          <StatCounter
            title={"Assists"}
            inc={() => inc(setAssists, currentPlayer)}
            dec={() => dec(setAssists, currentPlayer)}
            counter={
              assists && assists[currentPlayer] ? assists[currentPlayer] : 0
            }
          />
          {/* Goals */}
          <StatCounter
            title={"Goals"}
            inc={() => inc(setGoals, currentPlayer)}
            dec={() => dec(setGoals, currentPlayer)}
            counter={goals && goals[currentPlayer] ? goals[currentPlayer] : 0}
          />
          {/* game end */}
          <br />
          <div
            style={{
              fontSize: "20px",
              fontWeight: "bold",
              padding: "10px 20px",
              border: "1px solid green",
              backgroundColor: "#1A1A1A",
              width: "fit-content",
              borderRadius: "15px",
              cursor: "pointer",
            }}
            onClick={(e) => onGameEndClicked(e)}
          >
            End Game? {gameEnd ? "Yes" : "No"}
          </div>
        </div>
      </div>
      <PrevPage action={onPrev} />
      <NextPage action={onNext} />
    </div>
  );
}

export default Stats;
