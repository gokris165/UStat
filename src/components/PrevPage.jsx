function PrevPage({ action }) {
  return (
    <div style={{ float: "left" }}>
      <div
        onClick={() => {
          if (!action) return;
          action();
        }}
        style={{
          color: "goldenrod",
          border: "1px solid goldenrod",
          fontSize: "25px",
          fontWeight: "bold",
          borderRadius: "15px",
          padding: "5px 10px",
          marginLeft: "20px",
          cursor: "pointer",
          backgroundColor: "#1A1A1A",
        }}
      >
        Prev
      </div>
    </div>
  );
}

export default PrevPage;
