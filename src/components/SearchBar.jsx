// useImperativeHandle(
//     - input field
//   - search button
//   - clear button,

function SearchBar({ searchTerm, setSearchTerm, onSearch, onClear, onKeyDown, disabled }) {
  const inputClassName =
    "h-15 w-full rounded-xl border border-stone-300 px-3 text-white caret-white outline-none placeholder:text-white focus:border-lime-400 disabled:cursor-not-allowed disabled:opacity-50";
  const buttonClassName =
    "h-13 w-full rounded-4xl border text-white shadow-lg transition-all duration-200 ease-out hover:translate-y-1 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 sm:w-auto";

  return (
    <div className="mb-2 flex flex-col gap-2">
      <input
        className={inputClassName}
        type="text"
        placeholder="Enter a name ..."
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
        onKeyDown={onKeyDown}
        disabled={disabled}
      />
      <div className="flex w-full gap-2">
        <button className={`${buttonClassName} border-lime-500 bg-lime-600 px-6 shadow-lime-600`} type="button" onClick={onSearch} disabled={disabled}>
          Search
        </button>
        <button className={`${buttonClassName} border-amber-500 bg-amber-600 px-6 shadow-amber-600`} type="button" onClick={onClear} disabled={disabled}>
          Clear
        </button>
      </div>
    </div>
  );
}

export default SearchBar
