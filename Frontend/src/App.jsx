import MultiSelect from "./components/MultiSelect";
import "./styles.css";

function App() {
  const inputControlStyle = {
    display: "flex",
    flexWrap: "wrap",
    gap: "6px",
    padding: "8px 12px",
    border: "2px solid #2563eb",
    borderRadius: "8px",
    background: "hsl(0, 4%, 74%)",
    alignItems: "center",
    position: "relative",
  };
  return (
    <div className="app">
      <h1>Multi Select</h1>
      <p className="subtitle">Name the countries you have visited:</p>
      <MultiSelect inputStyle={inputControlStyle} />
    </div>
  );
}

export default App;
