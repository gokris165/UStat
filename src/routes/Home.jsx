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
  const authToken = "temporary978234";
  const backendUrl = `http:\\\\${import.meta.env.VITE_BACKEND_HOST}:${
    import.meta.env.VITE_BACKEND_PORT
  }`;

  useEffect(() => {
    localStorage.removeItem("inProgress");
    localStorage.removeItem("mode");
    localStorage.removeItem("playerCount");
    localStorage.removeItem("team1");
    localStorage.removeItem("team2");
    let stored = localStorage.getItem("playerNames");
    if (stored != null) setPlayerNames(JSON.parse(stored));
  }, []);

  async function importNames() {
    return fetch(`${backendUrl}/data/playerNames`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
      .then((payload) => payload.json())
      .then((data) => {
        if (!data || data.error == 1) {
          console.log("Error:", data.message);
          alert("Failed to import player names!");
        } else {
          setPlayerNames(data.message);
          localStorage.setItem("playerNames", JSON.stringify(data.message));
          alert("Successfully imported player names!");
        }
      });
  }

  async function sendStats() {
    let stats = localStorage.getItem("stats");
    if (!stats) {
      alert("No stats available");
      return;
    }

    let name = prompt("Enter name of reporter: ");
    if (!name) {
      alert("No name provided");
      return;
    }

    return fetch(`${backendUrl}/data/sendStats?name=${name}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: stats,
    })
      .then((payload) => payload.json())
      .then((data) => {
        if (!data || data.error == 1) {
          console.log("Error:", data.message);
          alert("Stats upload failed!");
        } else {
          alert("Successfully uploaded stats");
          localStorage.removeItem("stats");
        }
      });
  }

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
        </div>
      </div>
      <div style={{ float: "left" }}>
        <div
          onClick={() => {
            navigate("/viewStats");
          }}
          style={{
            color: "green",
            border: "1px solid green",
            fontSize: "25px",
            fontWeight: "bold",
            borderRadius: "15px",
            padding: "5px 10px",
            marginLeft: "20px",
            cursor: "pointer",
            backgroundColor: "#1A1A1A",
          }}
        >
          View
        </div>
        <br />
        <div
          onClick={() => sendStats()}
          style={{
            color: "green",
            border: "1px solid green",
            fontSize: "25px",
            fontWeight: "bold",
            borderRadius: "15px",
            padding: "5px 10px",
            marginLeft: "20px",
            cursor: "pointer",
            backgroundColor: "#1A1A1A",
          }}
        >
          Send
        </div>
      </div>
      <div style={{ float: "right" }}>
        <div
          onClick={() => importNames()}
          style={{
            color: "green",
            border: "1px solid green",
            fontSize: "25px",
            fontWeight: "bold",
            borderRadius: "15px",
            padding: "5px 10px",
            marginRight: "20px",
            cursor: "pointer",
            backgroundColor: "#1A1A1A",
          }}
        >
          Import Names
        </div>
        <br />
        <NextPage action={onNext} />
      </div>
    </div>
  );
}

export default Home;
