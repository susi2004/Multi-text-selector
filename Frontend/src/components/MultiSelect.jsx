import { useEffect, useRef, useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const CONTINENTS = [
  { id: null, name: "All" },
  { id: 1, name: "Asia" },
  { id: 2, name: "Europe" },
  { id: 3, name: "Africa" },
  { id: 4, name: "North America" },
  { id: 5, name: "South America" },
  { id: 6, name: "Oceania" }
];

function MultiSelect({ inputStyle }) {
  const [searchText, setSearchText] = useState("");
  const [debouncedSearchText, setDebouncedSearchText] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedContinentId, setSelectedContinentId] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(0);
  const [filteredItems, setFilteredItems] = useState([]);
  
  // Cache for search results to avoid duplicate API calls
  const searchCacheRef = useRef({});

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, 500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [searchText]);

  useEffect(() => {
    if (!debouncedSearchText.trim()) {
      setFilteredItems([]);
      return;
    }
    const params = new URLSearchParams();
    params.append("search", debouncedSearchText);
    if (selectedContinentId !== null) {
      params.append("continentId", selectedContinentId);
    }
    fetch(
      `${API_BASE_URL}/api/countries?${params.toString()}`
    )
      .then((res) => res.json())
      .then((data) => {

        const filtered = data.filter(
          (item) =>
            !selectedItems.some(
              (selected) =>
                selected.id === item.id
            )
        );

        setFilteredItems(filtered);
      })
      .catch((err) => {
        console.error("Failed to fetch countries:", err);
        setFilteredItems([]);
      });

  }, [debouncedSearchText, selectedItems, selectedContinentId]);

  useEffect(() => {
    setHighlightIndex(0);
  }, [debouncedSearchText]);

  const showDropdown = isDropdownOpen && searchText.trim() !== "";

  function handleInputChange(event) {
    const value = event.target.value;
    setSearchText(value);
    setIsDropdownOpen(value.trim() !== "");
  }

  function handleSelectItem(item) {
    const alreadySelected = selectedItems.some((selected) => selected.id === item.id);
    if (alreadySelected) {
      return;
    }
    setSelectedItems((prev) => [...prev, item]);
    setSearchText("");
    setDebouncedSearchText("");
    setIsDropdownOpen(false);
  }

  function handleRemoveItem(itemId) {
    setSelectedItems((prev) => prev.filter((item) => item.id !== itemId));
  }

  function clearAll() {
    setSelectedItems([])
  }

  function highlightText(text, query) {
    if (!query) return text;

    const lowerText = text.toLowerCase();
    const lowerQuery = query.toLowerCase();

    const startIndex = lowerText.indexOf(lowerQuery);

    if (startIndex === -1) {
      return text;
    }

    const endIndex = startIndex + query.length;

    return (
      <>
        {text.slice(0, startIndex)}
        <span className="highlight-match">
          {text.slice(startIndex, endIndex)}
        </span>

        {text.slice(endIndex)}
      </>
    );
  }

  function handleContinentChange(continentId) {
    setSelectedContinentId(continentId);
    setFilteredItems([]);
    setSearchText("");
    setDebouncedSearchText("");
    setIsDropdownOpen(false);
    setHighlightIndex(0);
  }
  function handleKeyDown(e) {
    if (e.key === "Backspace") {
      if(!e.target.value){
        setSelectedItems((p) => p.slice(0, -1))
      }
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((p) => p < filteredItems.length - 1 ? p + 1 : p)
    } 
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex((p) => p > 0 ? p - 1 : p);
    }
    if (e.key === "Enter") {
      const selectedItem = filteredItems[highlightIndex];
      if (selectedItem) {
        handleSelectItem(selectedItem);
        setHighlightIndex(0);
      }
    }
  }

  return (
    <div className="multi-select">
      <div className="continent-filter">
        {CONTINENTS.map((continent) => (
          <button
            key={continent.id}
            className={`continent-chip ${selectedContinentId === continent.id ? "active-continent" : ""}`}
            onClick={() => handleContinentChange(continent.id)}
          >
            {continent.name}
          </button>
        ))}
      </div>

      <div style={inputStyle}>
        {selectedItems.map((item) => (
          <span className="tag" key={item.id}>
            {item.name}
            <button
              type="button"
              className="tag-remove"
              onClick={() => handleRemoveItem(item.id)}
            >
              ×
            </button>
          </span>
        ))}
        <input
          type="text"
          className="search-input"
          placeholder={selectedItems.length === 0 ? "Type to search..." : ""}
          value={searchText}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
        <div className="clear-all">
          {
            selectedItems.length > 0 &&
            (<button onClick={() => clearAll()}>X</button>)
          }
        </div>
      </div>

      {showDropdown && (
        <ul className="dropdown-list">
          {filteredItems.length > 0 ? (
            filteredItems.map((item, index) => (
              <li key={item.id}
                className={
                  index === highlightIndex
                    ? "active-item"
                    : ""
                }>
                <button
                  type="button"
                  className="dropdown-item"
                  onClick={() => handleSelectItem(item)}
                >
                  {highlightText(item.name, searchText.trim())}
                  {item.continentName && (
                    <span className="continent-badge">{item.continentName}</span>
                  )}
                </button>
              </li>
            ))
          ) : (
            <li className="no-results">No countries found</li>
          )}
        </ul>
      )}
    </div>
  );
}

export default MultiSelect;
