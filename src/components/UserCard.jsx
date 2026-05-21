// shows avatar, profile, github link
function UserCard({ user }) {
    return (
        <div className=" flex flex-col items-start min-h-80 sm:h-85 w-full bg-[#EEEEEE] border border-stone-200 rounded-3xl hover:shadow-lg transition ease-out duration-200 shadow-stone-400">
            <img
                className="rounded-3xl h-56 sm:h-62 w-full object-cover block mx-auto my-3 px-4 py-2"
                src={user.avatar_url}
                alt={`${user.login}'s avatar`}
            />
            <div className="flex flex-col pl-6">
                <p className="text-stone-800 text-xl font-medium pb-1">{user.login}</p>
                <a
                    className="text-amber-800 font-semibold hover:underline"
                    href={user.html_url}
                    target="_blank"
                    rel="noreferrer"
                >View GitHub Profile</a>
            </div>

        </div>
    )
}

export default UserCard;