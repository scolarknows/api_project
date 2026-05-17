# GitHub User Explorer: How To Build It From Scratch

This guide is meant to help you think clearly while building the app yourself.

The main idea is:

1. Set up the project so it runs.
2. Decide the app state before writing too much UI.
3. Build the main logic in `App.jsx`.
4. Split the UI into small components after the logic is clear.
5. Add loading, errors, empty state, debounce, and pagination one at a time.
6. Style only after the app works.

---

## 1. Understand The Product First

Before writing code, reduce the PRD into a few simple goals:

- User can search GitHub users
- Results appear in a clean list or grid
- User can go to next and previous pages
- App shows loading state
- App handles errors
- App handles no results
- App avoids too many API calls by using debounce

If you understand these 7 things, you already know what your code needs to do.

---

## 2. Decide The Main State

When building a React app, ask:

`What information changes over time?`

For this app, the important state is:

- `searchTerm`: what the user is typing
- `committedSearch`: the actual term you want to fetch
- `users`: the list returned from the API
- `loading`: whether the fetch is in progress
- `error`: any error message
- `message`: helper text like "Enter a search term" or "No results found"
- `currentPage`: current page number
- `totalCount`: total number of matches from GitHub

This step matters because once the state is clear, the rest of the app becomes much easier.

---

## 3. Decide The Component Structure

Do not create too many components early. Keep it small and obvious.

Use this structure:

- `App.jsx`
  - owns all state
  - handles fetch logic
  - handles debounce
  - handles page changes
- `SearchBar.jsx`
  - input field
  - search button
  - clear button
- `UserList.jsx`
  - maps over the users
- `UserCard.jsx`
  - shows avatar, username, profile link
- `Pagination.jsx`
  - previous and next buttons

Simple rule:

- `App.jsx` = logic
- other components = presentation

---

## 4. Know What Files To Create First

Build in this order:

1. `package.json`
2. `index.html`
3. `vite.config.mjs`
4. `postcss.config.js`
5. `tailwind.config.js`
6. `src/main.jsx`
7. `src/App.jsx`
8. `src/components/SearchBar.jsx`
9. `src/components/UserList.jsx`
10. `src/components/UserCard.jsx`
11. `src/components/Pagination.jsx`
12. `src/styles.css`

Reason:

- first make the project run
- then make the app logic work
- then split the UI
- then style it

---

## 5. Setup Phase

### Goal

Get Vite + React + Tailwind running before building features.

### What to do

1. Create the Vite React app
2. Install dependencies
3. Connect Tailwind
4. Make sure the app starts without errors

### Mental rule

Do not start building search logic before the base app is running.

---

## 6. Write `main.jsx` First

This file should stay very simple.

Its job is only:

- import React
- import ReactDOM
- import `App`
- import styles
- render `<App />`

Do not put business logic here.

---

## 7. Build `App.jsx` Before The Child Components

This is the most important thinking step.

Before writing `SearchBar`, `UserList`, or `Pagination`, decide:

- what state exists
- when the API should run
- what actions the user can trigger

In this app, the user actions are:

- type into input
- click search
- clear input
- go to next page
- go to previous page

So `App.jsx` should control all of that.

### Start `App.jsx` in this order

1. Create the state
2. Create a simple page layout
3. Add placeholder text
4. Pass props to child components
5. Add fetch logic
6. Add conditional rendering

---

## 8. Build The Search Flow First

Before debounce or pagination, make normal search work.

### What should happen

1. User types a term
2. User clicks search
3. App calls GitHub API
4. App stores the returned users
5. UI updates

### API endpoint

```txt
https://api.github.com/search/users?q={searchTerm}
```

### Better version with pagination

```txt
https://api.github.com/search/users?q={searchTerm}&page={page}&per_page=12
```

### Mental rule

Make one good search work before adding advanced behavior.

---

## 9. Add `SearchBar.jsx`

After `App.jsx` knows what it needs, create the search bar.

This component should receive props like:

- `value`
- `onChange`
- `onSearch`
- `onClear`
- `disabled`

### Why this comes early

The user needs a way to trigger the app's main feature first.

### Keep it simple

It only needs:

- one input
- one search button
- one clear button

---

## 10. Add Fetch Logic With `useEffect`

Now ask:

`When should the API call happen?`

Answer:

- when `committedSearch` changes
- when `currentPage` changes

That means your `useEffect` depends on:

- `committedSearch`
- `currentPage`

Inside the effect:

1. set loading to `true`
2. clear old error
3. call the API
4. save `data.items` into `users`
5. save `data.total_count`
6. handle empty results
7. stop loading

### Important habit

Always handle:

- success
- failure
- no results
- in-progress state

---

## 11. Add `UserList.jsx` And `UserCard.jsx`

Once search works, display the results.

### `UserList.jsx`

Its job is:

- receive `users`
- loop through them with `.map()`
- render one `UserCard` for each user

### `UserCard.jsx`

Each card should show:

- `avatar_url`
- `login`
- `html_url`

### Why these files come after fetch logic

Because there is no point designing result cards before you know what data is being rendered.

---

## 12. Add Empty State, Loading State, And Error State

This is where the app starts to feel real.

### Empty input

If the user tries to search with nothing typed:

- do not call the API
- show a helpful message

### Loading

While waiting for the API:

- show a spinner or loading text

### Error

If the request fails:

- show `"Something went wrong"`

If rate-limited:

- show a clearer message

### No results

If the API returns no users:

- show `"No results found"`

### Mental rule

A good frontend app is not just about happy paths.

---

## 13. Add Pagination After Search Works

Do not add pagination too early.

First make page 1 work.

Then add page movement.

### What pagination means here

GitHub returns results in pages.

So your app should:

- keep track of `currentPage`
- send `page=currentPage` in the API request
- show previous and next buttons

### `Pagination.jsx` should do only UI work

It should receive props like:

- `currentPage`
- `totalPages`
- `onPrevious`
- `onNext`
- `disabled`

### Keep the real logic in `App.jsx`

When a button is clicked:

- update `currentPage`
- `useEffect` fetches the new page automatically

---

## 14. Add Debounce Last

Debounce is important, but do it after regular search already works.

### Why

If you add debounce too early, debugging becomes harder.

### Simple debounce idea

1. User types
2. Wait 400ms
3. If they type again before 400ms, cancel old timer
4. If they stop typing, run search

### Mental model

- `searchTerm` = live typing
- `committedSearch` = actual term used for API

This keeps your logic much cleaner.

---

## 15. Only Style After The Features Work

This is one of the best habits you can learn.

### Wrong order

- design perfect cards
- polish buttons
- add gradients
- app logic still broken

### Better order

1. app works
2. states work
3. pagination works
4. debounce works
5. style it

### Styling goal for this project

Keep it simple:

- clean input
- clean buttons
- clean cards
- readable spacing
- responsive layout

Do not over-design.

---

## 16. Suggested Build Order For The Actual Code

If you are coding this yourself, use this exact order:

1. Setup Vite + React + Tailwind
2. Make `main.jsx` render `App`
3. In `App.jsx`, create all state
4. Add a temporary layout with heading and placeholder text
5. Create `SearchBar.jsx`
6. Wire the input and search button to `App.jsx`
7. Make one API call work
8. Store users in state
9. Create `UserList.jsx`
10. Create `UserCard.jsx`
11. Render results
12. Add loading state
13. Add error state
14. Add no-results state
15. Add `Pagination.jsx`
16. Add page change logic
17. Add debounce
18. Add final styling
19. Test the full flow

---

## 17. Suggested Testing Checklist

After building, manually test these:

### Search flow

- search a valid username
- results should appear

### Empty input

- click search with no text
- app should show a message and not call the API

### No results

- search something random like `zzzzqwertyuserabc`
- app should show "No results found"

### Pagination

- search a common term
- click next
- new users should appear
- click previous
- old page should return

### Error handling

- test with internet off or broken request
- app should show an error message

### Debounce

- type quickly in the input
- app should not call the API on every keystroke

---

## 18. Common Mistakes To Avoid

- putting too much logic inside child components
- styling before the app works
- mixing typing state and fetch state
- forgetting loading and error handling
- adding pagination before basic search works
- not trimming empty input
- not clearing old timeouts for debounce

---

## 19. The Simplest Way To Think About The Whole App

This app is really just this:

1. user types
2. app decides when to search
3. app fetches GitHub users
4. app displays results
5. app lets user move between pages
6. app handles all non-happy-path states

That is the whole project.

If you keep that flow in your head, you will not get lost.

---

## 20. Final Rule While Building

Whenever you feel confused, ask these 3 questions:

1. What state do I need?
2. What user action changes that state?
3. What should the UI show after that change?

If you answer those 3 questions, you can build most React apps clearly.
