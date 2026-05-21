// previous and next buttons
function Pagination({ onPrevious, onNext, currentPage, totalPages, disabled }) {

    const Pagination_button = "text-stone-900 bg-stone-300 cursor-pointer px-5 py-1 rounded-xl disabled:cursor-not-allowed disabled:opacity-50"

    return (
        <div className="flex flex-row justify-center">
            <div className="flex justify-between w-7xl gap-2 my-4 py-3 px-2 border border-stone-500 bg-[#1F6F5F] rounded-xl">
                <button
                    className={Pagination_button}
                    onClick={onPrevious}
                    disabled={disabled || currentPage === 1}
                >
                    Prev
                </button>
                <p className="text-white font-semibold py-1">{`Page ${currentPage} of ${totalPages}`}</p>
                <button
                    className={Pagination_button}
                    onClick={onNext}
                    disabled={disabled || currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    )
}

export default Pagination;