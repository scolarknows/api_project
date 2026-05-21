// handles-// maps over the user
import UserCard from "./UserCard";

function UserList({ users }) {
    return (
        <div className="flex flex-row justify-center border border-stone-500 p-6 bg-[#2FA084] rounded-xl w-full max-w-7xl">
            <div className="h-full w-full">
                <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-between gap-6 w-full">
                    {users.map((user) => (
                        <li key={user.id}>
                            <UserCard user={user} />
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default UserList;