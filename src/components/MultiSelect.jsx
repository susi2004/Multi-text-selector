import { useEffect, useMemo, useState } from "react";

function MultiSelect({ data }) {
  const [searchText, setSearchText] = useState("");
  const [debouncedSearchText, setDebouncedSearchText] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Debounce user input so filtering doesn't run on every key stroke.
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, 500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [searchText]);

  const filteredItems = useMemo(() => {
    const query = debouncedSearchText.trim().toLowerCase();

    if (!query) {
      return [];
    }

    const selectedIds = new Set(selectedItems.map((item) => item.id));

    return data.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(query);
      const alreadySelected = selectedIds.has(item.id);
      return matchesSearch && !alreadySelected;
    });
  }, [data, debouncedSearchText, selectedItems]);

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

  function handleClearAll() {
    setSelectedItems([]);
    setSearchText("");
    setDebouncedSearchText("");
    setIsDropdownOpen(false);
  }

  return (
    <div className="multi-select">
      <div className="selected-tags">
        {selectedItems.map((item) => (
          <span className="tag" key={item.id}>
            {item.name}
            <button
              type="button"
              className="tag-remove"
              onClick={() => handleRemoveItem(item.id)}
            >
              ❌
            </button>
          </span>
        ))}

        {selectedItems.length > 0 && (
          <button type="button" className="clear-all" onClick={handleClearAll}>
            Clear all
          </button>
        )}
      </div>

      <input
        type="text"
        className="search-input"
        placeholder="Type to search..."
        value={searchText}
        onChange={handleInputChange}
      />

      {showDropdown && (
        <ul className="dropdown-list">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  className="dropdown-item"
                  onClick={() => handleSelectItem(item)}
                >
                  {item.name}
                </button>
              </li>
            ))
          ) : (
            <li className="no-results">No results found</li>
          )}
        </ul>
      )}
    </div>
  );
}

export default MultiSelect;
