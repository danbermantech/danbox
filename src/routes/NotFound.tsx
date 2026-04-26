export default function NotFound() {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden bg-gradient-to-bl from-pink-200 to-fuchsia-400">
      <div className="z-10 flex flex-col items-center gap-8">
        <h1 className="font-titan font-bold text-transparent bg-clip-text bg-gradient-to-br from-pink-400 to-violet-600 text-8xl drop-shadow-lg">404</h1>
        <p className="font-titan text-transparent bg-clip-text bg-gradient-to-br from-pink-600 to-violet-600 text-3xl text-center drop-shadow-lg">Page Not Found</p>
        <a
          href="/"
          className="px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-titan font-bold text-xl transition-all shadow-xl"
        >
          Return to Home
        </a>
      </div>
    </div>
  );
}
