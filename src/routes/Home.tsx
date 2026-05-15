import Logo from "$components/Logo";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-evenly h-[100dvh]">
      <Logo />
      <div className="flex flex-col gap-2 items-stretch jutify-evenly ">
        <Link className="text-4xl text-center bg-slate-700 p-8 rounded-xl" to="/play">Join a game</Link>
        <Link className="text-4xl text-center bg-slate-700 p-8 rounded-xl hidden md:block" to="/host">Host your own</Link>
        <Link className="text-4xl text-center bg-slate-700 p-8 rounded-xl hidden md:block" to="/designer">Board Designer</Link>
      </div>
    </div>
  );
}

export default Home;