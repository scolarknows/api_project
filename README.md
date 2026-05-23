# GitHub User Explorer

A responsive React app for searching GitHub users, browsing matching profiles, and moving through paginated results.

The app uses the public GitHub Search API and includes loading, error, empty-state, pagination, mobile-first styling, and localStorage support for restoring the last search after refresh.

## Features

- Search GitHub users by username or keyword
- View user avatars, usernames, and GitHub profile links
- Navigate results with previous and next pagination
- Loading spinner while requests are in progress
- Helpful messages for empty input and no results
- Error handling for failed API requests
- Mobile-first responsive layout
- Saves the last search results in localStorage
- Restores cached results after page refresh

## Tech Stack

- React
- Vite
- Tailwind CSS
- GitHub Search Users API
- localStorage

## Project Structure

```txt
src/
  App.jsx
  App_Cleaner.jsx
  main.jsx
  index.css
  components/
    SearchBar.jsx
    UserList.jsx
    UserCard.jsx
    Pagination.jsx
    SearchBar_Cleaner.jsx
    UserList_Cleaner.jsx
    UserCard_Cleaner.jsx
    Pagination_Cleaner.jsx
```

## Getting Started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## How It Works

The main app state lives in `App.jsx`:

- `searchTerm`: the current input value
- `submittedSearch`: the search term used for the API request
- `users`: the users returned by GitHub
- `loading`: request loading state
- `error`: request error message
- `message`: helper/status message
- `currentPage`: active results page
- `totalCount`: total result count returned by GitHub

When a search is submitted, the app calls:

```txt
https://api.github.com/search/users?q={searchTerm}&page={page}&per_page=12
```

Search results and pagination data are saved to localStorage so the last result view can be restored after a refresh.

## Deployment

This app is ready to deploy on Vercel.

Recommended Vercel settings:

```txt
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

## Notes

The app uses GitHub's public API without authentication. This keeps setup simple, but public requests can be rate-limited. If you need higher request limits, add a backend or serverless function and keep any GitHub token out of the browser.
