// useImperativeHandle(
//     - input field
//   - search button
//   - clear button,

function SearchBar({ searchTerm, setSearchTerm, onSearch, onClear, onKeyDown, disabled }) {

    return (
        <div className="flex flex-col items-start justify-center gap-2 mb-2">
            <input
                className="caret-white text-white placeholder-white px-2 h-15 w-full border border-stone-300 rounded-xl outline-none focus:border-lime-400 disabled:opacity-50 disabled:cursor-not-allowed"
                type="text"
                placeholder="Enter a name ..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={onKeyDown}
                disabled={disabled}
            />
            <div className="flex flex-row w-full">
                <button
                    className="bg-lime-600 h-13 w-full sm:w-23 text-white mt-2 mr-2 border border-lime-500 rounded-4xl shadow-lg shadow-lime-600 transition-all duration-200 ease-out hover:translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                    onClick={onSearch}
                    disabled={disabled}
                >
                    Search
                </button>
                <button
                    className="bg-amber-600 h-13 w-full sm:w-20 text-white mt-2 border border-amber-500 shadow-lg shadow-amber-600 rounded-4xl transition-all duration-200 ease-out hover:translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                    onClick={onClear}
                    disabled={disabled}
                >
                    Clear
                </button>
            </div>

        </div>


    )
}

export default SearchBar