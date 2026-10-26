import UserCard from "./UserCard";

function UserList({ users }) {
  return (
    <section className="w-full max-w-7xl rounded-xl border border-stone-500 bg-[#2FA084] p-4 sm:p-6">
      <ul className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {users.map((user) => (
          <li key={user.id}>
            <UserCard user={user} />
          </li>
        ))}
      </ul>
    </section>
  );
}

export default UserList;
