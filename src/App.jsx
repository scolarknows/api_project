import { useState, useEffect, useRef } from "react";
import Pagination from "./components/Pagination";
import SearchBar from "./components/SearchBar";
import UserList from "./components/UserList";

const PER_PAGE = 12;
const STORAGE_KEY = "github-user-explorer-state";
function getSavedState() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}


const savedState = getSavedState();

// what information changes over time-
// searchTerm
// committedSearch
// users
// loading
// error
// message
// currentPage
// totalCount


// the App.jsx handles -
// - owns all state
//   - handles fetch logic
//   - handles debounce
//   - handles page changes

// simple rule-
// App.jsx = logic
// other components = presentation

// the app should control user actions that are -
// type into input
// search for user 
// clear the input
// go to next page
// go to previous page

function App() {



  // searchTerm
  const [searchTerm, setSearchTerm] = useState(savedState.searchTerm || "")
  // committedSearch
  const [submittedSearch, setSubmittedSearch] = useState(savedState.submittedSearch || "")
  // users
  const [users, setUsers] = useState(savedState.users || [])
  // loading
  const [loading, setLoading] = useState(false)
  // error
  const [error, setError] = useState("")
  // message
  const [message, setMessage] = useState(savedState.message || "Search for Github users to get started.")
  // currentPage
  const [currentPage, setCurrentPage] = useState(savedState.currentPage || 1)
  // totalCount
  const [totalCount, setTotalCount] = useState(savedState.totalCount || 0)

  const totalPages = Math.ceil(totalCount / PER_PAGE)
  const shouldSkipInitialFetch = useRef(
    Boolean(savedState.submittedSearch && savedState.users?.length)
  )

  useEffect(() => {
    const stateToSave = {
      searchTerm,
      submittedSearch,
      users,
      currentPage,
      totalCount,
      message,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
  }, [searchTerm, submittedSearch, users, currentPage, totalCount, message]);

  useEffect(() => {
    if (!submittedSearch) return;

    if (shouldSkipInitialFetch.current) {
      shouldSkipInitialFetch = false;
      return;
    }

    const fetchUSers = async () => {
      setLoading(true);
      setError("");
      setMessage("");

      try {
        const response = await fetch(
          `https://api.github.com/search/users?q=${submittedSearch}&page=${currentPage}&per_page=${PER_PAGE}`
        );

        if (!response.ok) {
          throw new Error("Something went wrong");
        }

        const data = await response.json();

        setUsers(data.items || []);
        setTotalCount(data.total_count || 0);



        if (!data.items || data.items.length === 0) {
          setMessage("No Users found.");
        }
      } catch (err) {
        setUsers([]);
        setTotalCount(0);
        setError("Something went wrong !");
      } finally {
        setLoading(false);
      }
    }
    fetchUSers();
  }, [submittedSearch, currentPage])



  function handleSearch() {
    const trimmedSearch = searchTerm.trim();

    if (!trimmedSearch) {
      setUsers([]);
      setSubmittedSearch("")
      setCurrentPage(1)
      setTotalCount(0)
      setError("");
      setMessage("Please enter a search term.")
      return;
    }
    setSubmittedSearch(trimmedSearch)
    setCurrentPage(1)
  }

  function handleClear() {
    localStorage.removeItem(STORAGE_KEY);

    setSearchTerm("");
    setSubmittedSearch("");
    setUsers([]);
    setCurrentPage(1);
    setTotalCount(0);
    setError("");
    setMessage("Search for Github users to get started.");
  }

  function handlePrevPage() {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1)
    }
  }

  function handleNextPage() {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1)
    }
  }

  function onEnterClick(e) {
    if (e.key === "Enter") {
      handleSearch();
    }
  }

  return (
    <div className="bg-[#202940] flex flex-col min-h-screen px-3 sm:px-6">
      <div className="flex flex-row justify-center mt-4 sm:mt-8 lg:mt-10">

        <div className="flex flex-col w-full max-w-7xl bg-[#1F6F5F] mb-6 sm:mb-10 rounded-xl border border-stone-500 shadow-xl shadow-stone-800">
          <h1 className="text-lime-400 text-center text-3xl sm:text-4xl lg:text-6xl mt-6 sm:mt-8 mb-2 font-sans font-bold text-shadow-lg/10 px-3">GitHub User Explorer</h1>
          <p className="text-lime-200 text-base sm:text-xl lg:text-3xl text-center sm:text-start font-sans font-semibold px-4">Search GitHub users, browse matching profiles, and move through the results with a clean interview-ready interface.</p>

          <div className="mt-8 px-4">
            <SearchBar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              onSearch={handleSearch}
              onClear={handleClear}
              onKeyDown={onEnterClick}
              disabled={loading}
            />
          </div>

          <div className=" text-white border border-stone-300 rounded-xl m-4 px-3 py-4 min-h-15 text-sm sm:text-base">

            {loading && <div className="flex items-center gap-2">
              <span
                className="inline-block w-4 h-4 animate-spin rounded-full border-3 border-stone-600 border-t-lime-400 border-accent-soft border-t-accent"
                aria-hidden="true"
              />
              <p>Loading GitHub Users...</p>
            </div>}
            {!loading && error && <p>{error}</p>}
            {!loading && !error && message && <p>{message}</p>}
            {!loading && !error && !message && totalCount > 0 && (
              <p>Showing {totalCount.toLocaleString()} results for <span className="font-bold text-lime-400">" {submittedSearch} "</span></p>
            )}
          </div>

        </div>
      </div>

      {!loading && !error && users.length > 0 && (
        <div className="flex flex-col justify-center items-center">
          <UserList users={users} />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPrevious={handlePrevPage}
            onNext={handleNextPage}
            disabled={loading}
          />
        </div>
      )}


    </div>
  )
}

export default App;