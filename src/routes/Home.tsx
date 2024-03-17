import Logo from "$components/Logo";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-evenly h-[100dvh]">
      <Logo />
      <Link className="text-4xl bg-slate-700 p-8 rounded-xl" to="/play">Join a game</Link>
      <Link className="text-4xl bg-slate-700 p-8 rounded-xl" to="/host">Host your own</Link>
    </div>
  );
}

export default Home;