import { useEffect, useState } from "react";
import Header from "../components/Header";
import NextPage from "../components/NextPage";
import PrevPage from "../components/PrevPage";
import { useNavigate } from "react-router-dom";

function GameEnd() {
  const navigate = useNavigate();
  const [team1, setTeam1] = useState([]);
  const [team2, setTeam2] = useState([]);
  const [inProgress, setInProgress] = useState([]);
  const [winner, setWinner] = useState([]);

  useEffect(() => {
    try {
      let team1 = JSON.parse(localStorage.getItem("team1"));
      let team2 = JSON.parse(localStorage.getItem("team2"));
      let inProgress = JSON.parse(localStorage.getItem("inProgress"));
      setTeam1(team1);
      setTeam2(team2);
      setInProgress(inProgress);
    } catch (error) {
      console.log("error");
      navigate("/stats");
    }
  }, []);

  function onNext() {
    if (!winner) return;
    console.log(winner);
    // if a 'stats' object already exists, read it
    let statsObj = localStorage.getItem("stats");
    statsObj = statsObj ? JSON.parse(statsObj) : {};
    console.log(statsObj);

    // add entries or update entries in stats object
    updateStats(team1, "team1", statsObj);
    updateStats(team2, "team2", statsObj);
    console.log(statsObj);
    localStorage.setItem("stats", JSON.stringify(statsObj));

    // delete all other localstorage items
    localStorage.removeItem("inProgress");
    localStorage.removeItem("mode");
    localStorage.removeItem("playerCount");
    localStorage.removeItem("team1");
    localStorage.removeItem("team2");

    // return back to home page
    navigate("/");
  }

  function updateStats(teamArr, teamName, statsObj) {
    for (let i = 0; i < teamArr.length; i++) {
      let playerData = statsObj[teamArr[i]];
      if (!playerData) {
        statsObj[teamArr[i]] = {
          turns: 0,
          assists: 0,
          goals: 0,
          wins: 0,
          losses: 0,
        };
        playerData = statsObj[teamArr[i]];
      }
      playerData["turns"] += inProgress["turns"][teamArr[i]];
      playerData["assists"] += inProgress["assists"][teamArr[i]];
      playerData["goals"] += inProgress["goals"][teamArr[i]];
      if (winner == teamName) playerData["wins"] += 1;
      else playerData["losses"] += 1;
    }
  }

  function onTeamWinSelected(e) {
    let id = e.target.closest("table").id;
    if (id === "team1-table") {
      document
        .getElementById("team2-table-container")
        .classList.remove("active-button");
      document
        .getElementById("team1-table-container")
        .classList.add("active-button");
      setWinner("team1");
    } else if (id === "team2-table") {
      document
        .getElementById("team1-table-container")
        .classList.remove("active-button");
      document
        .getElementById("team2-table-container")
        .classList.add("active-button");
      setWinner("team2");
    }
  }
  return (
    <div>
      <Header text={"Which team won?"} />
      <div className="content" style={{ marginTop: "20px" }}>
        <div
          id="team1-table-container"
          style={{
            display: "inline-block",
            width: "fit-content",
            border: "1px solid white",
            borderRadius: "20px",
            textAlign: "center",
            marginLeft: "10px",
          }}
        >
          {/* team 1 */}
          <table
            id="team1-table"
            style={{ padding: "10px 30px" }}
            onClick={onTeamWinSelected}
          >
            <thead>
              <tr>
                <th>Team 1</th>
              </tr>
            </thead>
            <tbody>
              {team1 &&
                team1.map((player) => {
                  return (
                    <tr key={player}>
                      <td>{player}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
        <div
          id="team2-table-container"
          style={{
            display: "inline-block",
            width: "fit-content",
            border: "1px solid white",
            borderRadius: "20px",
            textAlign: "center",
            marginLeft: "20px",
          }}
        >
          {/* team 2 */}
          <table
            id="team2-table"
            style={{ padding: "10px 30px" }}
            onClick={onTeamWinSelected}
          >
            <thead>
              <tr>
                <th>Team 2</th>
              </tr>
            </thead>
            <tbody>
              {team2 &&
                team2.map((player) => {
                  return (
                    <tr key={player}>
                      <td>{player}</td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
      <PrevPage action={() => navigate("/stats")} />
      <NextPage action={onNext} />
    </div>
  );
}

export default GameEnd;
