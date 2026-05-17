// previous and next buttons
function Pagination({ onPrevious, onNext, currentPage, totalPages }) {

    return (
        <div className="flex flex-row justify-center">
            <div className="flex justify-between w-7xl gap-2 my-4 py-3 border border-stone-500 bg-stone-800 rounded-xl">
                <button className="text-stone-900 bg-stone-300 cursor-pointer px-4 py-1 rounded-xl ml-3" onClick={onPrevious}>Prev</button>
                <p className="text-white font-semibold py-1">{`Page ${currentPage} of ${totalPages}`}</p>
                <button className="text-stone-900 bg-stone-300 cursor-pointer px-4 py-1 rounded-xl mr-3" onClick={onNext}>Next</button>
            </div>
        </div>
    )
}

export default Pagination;