import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import PrevPage from "../components/PrevPage";
import { useState, useEffect } from "react";

function ViewStats() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [players, setPlayers] = useState(null);
  useEffect(() => {
    const stats = JSON.parse(localStorage.getItem("stats"));
    const players = JSON.parse(localStorage.getItem("playerNames"));
    setStats(stats);
    setPlayers(players);
  }, []);
  return (
    <div>
      <Header text={"View"} />
      <div className="content">
        <table style={{ fontSize: "20px", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid grey" }}>
              <th style={{ paddingRight: "60px" }}>Name</th>
              <th style={{ paddingRight: "30px" }}>T</th>
              <th style={{ paddingRight: "30px" }}>A</th>
              <th style={{ paddingRight: "30px" }}>G</th>
              <th style={{ paddingRight: "30px" }}>W</th>
              <th>L</th>
            </tr>
          </thead>
          <tbody>
            {players &&
              stats &&
              players.map((player) => {
                if (!stats[player]) return;
                return (
                  <tr key={player} style={{ borderBottom: "1px solid grey" }}>
                    <td>{player}</td>
                    <td>{stats[player].turns}</td>
                    <td>{stats[player].assists}</td>
                    <td>{stats[player].goals}</td>
                    <td>{stats[player].wins}</td>
                    <td>{stats[player].losses}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
      <PrevPage action={() => navigate("/")} />
    </div>
  );
}

export default ViewStats;
