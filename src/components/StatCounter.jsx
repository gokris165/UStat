function StatCounter({ title, inc, dec, counter }) {
  return (
    <div>
      <h3 style={{ marginBottom: "5px" }}>{title}</h3>

      <div style={{ display: "flex" }}>
        <div
          className="stat-box"
          style={{ backgroundColor: "green" }}
          onClick={() => inc()}
        >
          +
        </div>
        <div
          className="stat-box"
          style={{ backgroundColor: "#bb0000" }}
          onClick={() => dec()}
        >
          -
        </div>
        <div className="stat-box stat-counter">{counter}</div>
      </div>
    </div>
  );
}

export default StatCounter;
