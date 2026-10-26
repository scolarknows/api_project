function Pagination({ onPrevious, onNext, currentPage, totalPages, disabled }) {
  const buttonClassName =
    "rounded-xl bg-stone-300 px-5 py-2 font-medium text-stone-900 transition duration-200 ease-out hover:bg-stone-200 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-stone-300";

  return (
    <nav className="flex w-full justify-center" aria-label="Pagination">
      <div className="my-4 flex w-full max-w-7xl items-center justify-between gap-2 rounded-xl border border-stone-500 bg-[#1F6F5F] px-2 py-3">
        <button className={buttonClassName} type="button" onClick={onPrevious} disabled={disabled || currentPage === 1}>Prev</button>
        <p className="px-3 py-1 text-center text-sm font-semibold text-white sm:text-base">Page {currentPage} of {totalPages}</p>
        <button className={buttonClassName} type="button" onClick={onNext} disabled={disabled || currentPage === totalPages}>Next</button>
      </div>
    </nav>
  );
}

export default Pagination;
