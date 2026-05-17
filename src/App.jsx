import { useState, useEffect } from "react";
import Pagination from "./components/Pagination";
import SearchBar from "./components/SearchBar";
import UserList from "./components/UserList";

const PER_PAGE = 12;

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
  const [searchTerm, setSearchTerm] = useState("")
  // committedSearch
  const [submittedSearch, setSubmittedSearch] = useState("")
  // users
  const [users, setUsers] = useState([])
  // loading
  const [loading, setLoading] = useState(false)
  // error
  const [error, setError] = useState("")
  // message
  const [message, setMessage] = useState("Search for Github users to get started.")
  // currentPage
  const [currentPage, setCurrentPage] = useState(1)
  // totalCount
  const [totalCount, setTotalCount] = useState(0)

  const totalPages = Math.ceil(totalCount / PER_PAGE)



  useEffect(() => {
    if (!submittedSearch) return;

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
        console.log(data);

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
    <div className="bg-stone-900 flex flex-col min-h-screen">
      <div className="flex flex-row justify-center mt-10">
        <div className="flex flex-col max-w-7xl center bg-stone-950 mb-10 rounded-xl border border-stone-500 shadow-xl shadow-stone-800">
          <h1 className="text-lime-400 text-center text-6xl mt-8 mb-1 font-sans font-bold text-shadow-lg/10">GitHub User Explorer</h1>
          <p className="text-lime-200 text-3xl font-sans font-semibold text-start pl-4">Search GitHub users, browse matching profiles, and move through the results with a clean interview-ready interface.</p>

          <div className="mt-8 px-4">
            <SearchBar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              onSearch={handleSearch}
              onClear={handleClear}
              onKeyDown={onEnterClick}
            />
          </div>
          <div className=" text-white border border-stone-500 rounded-xl mx-4 my-4 px-2 py-4 h-15">
            {loading && <p>Loading ...</p>}
            {!loading && error && <p>{error}</p>}
            {!loading && !error && message && <p>{message}</p>}
          </div>

        </div>
      </div>




      <div>
        {!loading && !error && users.length > 0 && (
          <>
            <UserList users={users} />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPrevious={handlePrevPage}
              onNext={handleNextPage}
            />
          </>
        )}
      </div>

    </div>
  )
}

export default App;