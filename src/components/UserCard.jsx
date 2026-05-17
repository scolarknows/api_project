// shows avatar, profile, github link
function UserCard({ user }) {
    return (
        <div className=" flex flex-col items-start h-85 w-full bg-orange-50 border border-stone-200 rounded-3xl ">
            <img className="rounded-3xl h-62 w-full block mx-auto my-3 px-4 py-2" src={user.avatar_url} alt={user.login} />
            <div className="flex flex-col justify-items-start pl-6">
                <p className="text-stone-800 text-xl font-semilight pb-1">{user.login}</p>
                <a className="text-amber-800 font-semibold hover:underline" href={user.html_url}>View GitHub Profile</a>
            </div>

        </div>
    )
}

export default UserCard;