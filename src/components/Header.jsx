function Header({ text }) {
  return (
    <div style={{ margin: "0px 20px" }}>
      <h1 style={{ color: "goldenrod", marginBottom: "0px" }}>{text}</h1>
      <hr style={{ borderColor: "goldenrod", backgroundColor: "goldenrod" }} />
    </div>
  );
}

export default Header;
