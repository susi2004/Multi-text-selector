import { useEffect, useState } from "react";
import MultiSelect from "./components/MultiSelect";
import "./styles.css";

function App() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/countries.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to load items");
        }
        return response.json();
      })
      .then((data) => {
        setItems(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Could not fetch data. Please try again.");
        setLoading(false);
      });
  }, []);

  return (
    <div className="app">
      <h1>Multi Select</h1>
      <p className="subtitle">Choose one or more options from the list.</p>

      {loading && <p className="status-message">Loading data...</p>}
      {error && <p className="status-message error">{error}</p>}

      {!loading && !error && <MultiSelect data={items} />}
    </div>
  );
}

export default App;
