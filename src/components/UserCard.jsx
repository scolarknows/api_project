function UserCard({ user }) {
  return (
    <article className="flex min-h-80 w-full flex-col overflow-hidden rounded-3xl border border-stone-200 bg-[#EEEEEE] shadow-stone-400 transition duration-200 ease-out hover:shadow-lg sm:h-85">
      <img className="mx-auto block h-56 w-full object-cover p-4 sm:h-62" src={user.avatar_url} alt={`${user.login}'s avatar`} />
      <div className="flex flex-1 flex-col px-6 pb-5">
        <h2 className="pb-1 text-xl font-medium text-stone-800">{user.login}</h2>
        <p className="text-sm font-medium text-stone-500">{user.type}</p>
        <a className="mt-2 font-semibold text-amber-800 hover:underline" href={user.html_url} target="_blank" rel="noreferrer">
          View GitHub Profile
        </a>
      </div>
    </article>
  );
}

export default UserCard;
