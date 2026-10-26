import { useEffect, useRef, useState } from "react";
import Pagination from "./components/Pagination";
import SearchBar from "./components/SearchBar";
import UserList from "./components/UserList";

const PER_PAGE = 12;
const STORAGE_KEY = "github-user-explorer-state";
const INITIAL_MESSAGE = "Search for Github users to get started.";

async function readJsonResponse(response) {
  const body = await response.text();
  if (!body) {
    throw new Error(
      response.status === 404
        ? "AI search endpoint was not found. Run the app with `vercel dev` locally or deploy the latest version to Vercel."
        : `AI search returned an empty response (HTTP ${response.status}). Check that the API server is running.`
    );
  }

  try {
    return JSON.parse(body);
  } catch {
    const isHtml = /<html|<!doctype/i.test(body);
    throw new Error(
      isHtml
        ? "AI search endpoint is unavailable. Use `vercel dev` locally or deploy the latest version to Vercel."
        : `AI search returned an invalid response (HTTP ${response.status}). Please try again.`
    );
  }
}

function getSavedState() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

function AppCleaner() {
  const savedState = getSavedState();
  const hasCachedResults = Boolean(
    savedState.submittedSearch && savedState.users?.length
  );

  const [searchTerm, setSearchTerm] = useState(savedState.searchTerm || "");
  const [submittedSearch, setSubmittedSearch] = useState(
    savedState.submittedSearch || ""
  );
  const [users, setUsers] = useState(savedState.users || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState(savedState.message || INITIAL_MESSAGE);
  const [currentPage, setCurrentPage] = useState(savedState.currentPage || 1);
  const [totalCount, setTotalCount] = useState(savedState.totalCount || 0);
  const [aiSearch, setAiSearch] = useState(false);
  const [interpreting, setInterpreting] = useState(false);
  const [searchExplanation, setSearchExplanation] = useState("");

  const totalPages = Math.ceil(totalCount / PER_PAGE);
  const isShowingCachedResults = useRef(hasCachedResults);
  const hasUserRequestedFetch = useRef(false);

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

    if (isShowingCachedResults.current && !hasUserRequestedFetch.current) {
      return;
    }

    async function fetchUsers() {
      setLoading(true);
      setError("");
      setMessage("");

      try {
        const query = encodeURIComponent(submittedSearch);
        const response = await fetch(
          `https://api.github.com/search/users?q=${query}&page=${currentPage}&per_page=${PER_PAGE}`
        );

        if (response.status === 403) {
          throw new Error("GitHub rate limit reached. Please try again later.");
        }

        if (!response.ok) {
          throw new Error("Something went wrong.");
        }

        const data = await response.json();
        const nextUsers = data.items || [];

        setUsers(nextUsers);
        setTotalCount(data.total_count || 0);
        setMessage(nextUsers.length === 0 ? "No users found." : "");
      } catch (err) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, [submittedSearch, currentPage]);

  async function handleSearch() {
    hasUserRequestedFetch.current = true;
    isShowingCachedResults.current = false;

    const trimmedSearch = searchTerm.trim();

    if (!trimmedSearch) {
      setUsers([]);
      setSubmittedSearch("");
      setCurrentPage(1);
      setTotalCount(0);
      setError("");
      setMessage("Please enter a search term.");
      return;
    }

    let githubQuery = trimmedSearch;
    setSearchExplanation("");

    if (aiSearch) {
      setInterpreting(true);
      setError("");
      setMessage("Understanding your search...");
      try {
        const response = await fetch("/api/interpret-search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: trimmedSearch }),
        });
        const data = await readJsonResponse(response);
        if (!response.ok) throw new Error(data.error || "Could not interpret this search.");
        githubQuery = data.query;
        setSearchExplanation(data.explanation || "");
      } catch (err) {
        setError(err.message || "Could not interpret this search.");
        setMessage("");
        setInterpreting(false);
        return;
      }
      setInterpreting(false);
    }

    setSubmittedSearch(githubQuery);
    setCurrentPage(1);
  }

  function handleClear() {
    localStorage.removeItem(STORAGE_KEY);
    hasUserRequestedFetch.current = false;
    isShowingCachedResults.current = false;

    setSearchTerm("");
    setSubmittedSearch("");
    setUsers([]);
    setCurrentPage(1);
    setTotalCount(0);
    setError("");
    setMessage(INITIAL_MESSAGE);
  }

  function handlePrevPage() {
    if (currentPage <= 1) return;

    hasUserRequestedFetch.current = true;
    isShowingCachedResults.current = false;
    setCurrentPage((page) => page - 1);
  }

  function handleNextPage() {
    if (currentPage >= totalPages) return;

    hasUserRequestedFetch.current = true;
    isShowingCachedResults.current = false;
    setCurrentPage((page) => page + 1);
  }

  function handleSearchKeyDown(e) {
    if (e.key === "Enter") {
      handleSearch();
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#202940] px-3 sm:px-6">
      <div className="mt-4 flex justify-center sm:mt-8 lg:mt-10">
        <div className="mb-6 flex w-full max-w-7xl flex-col rounded-xl border border-stone-500 bg-[#1F6F5F] shadow-xl shadow-stone-800 sm:mb-10">
          <h1 className="mt-6 mb-2 px-3 text-center font-sans text-3xl font-bold text-lime-400 text-shadow-lg/10 sm:mt-8 sm:text-4xl lg:text-6xl">
            GitHub User Explorer
          </h1>

          <p className="px-4 text-center font-sans text-base font-semibold text-lime-200 sm:text-start sm:text-xl lg:text-3xl">
            Search GitHub users, browse matching profiles, and move through the
            results with a clean interview-ready interface.
          </p>

          <div className="mt-8 px-4">
            <SearchBar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              onSearch={handleSearch}
              onClear={handleClear}
              onKeyDown={handleSearchKeyDown}
              disabled={loading || interpreting}
            />
            <label className="mt-3 flex cursor-pointer items-center gap-2 text-sm text-lime-100">
              <input type="checkbox" checked={aiSearch} onChange={(event) => setAiSearch(event.target.checked)} disabled={loading || interpreting} />
              <span>AI search: describe the people you want in plain English</span>
            </label>
          </div>

          <div className="m-4 min-h-15 rounded-xl border border-stone-300 px-3 py-4 text-sm text-white sm:text-base">
            {(loading || interpreting) && (
              <div className="flex items-center gap-2">
                <span
                  className="inline-block h-4 w-4 animate-spin rounded-full border-3 border-stone-600 border-t-lime-400"
                  aria-hidden="true"
                />
                <p>{interpreting ? "Understanding your search..." : "Loading GitHub users..."}</p>
              </div>
            )}

            {!loading && error && <p>{error}</p>}
            {!loading && !error && message && <p>{message}</p>}
            {!loading && !interpreting && !error && !message && totalCount > 0 && (
              <p>
                Showing {totalCount.toLocaleString()} results for{" "}
                <span className="font-bold text-lime-400">
                  "{submittedSearch}"
                </span>
              </p>
            )}
            {!loading && !interpreting && !error && searchExplanation && <p className="mt-2 text-lime-100">AI interpreted this as: {searchExplanation} <span className="text-white/80">({submittedSearch})</span></p>}
          </div>
        </div>
      </div>

      {!loading && !error && users.length > 0 && (
        <div className="flex flex-col items-center justify-center">
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
  );
}

export default AppCleaner;

