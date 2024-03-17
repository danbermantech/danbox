import Logo from "./Logo"

const DefaultSuspense = ()=>{
  return (
    <div className="w-screen h-screen max-h-full justify-center place-items-center flex flex-col items-center animate-pulse">
      <Logo />
    </div>
  )
}
export default DefaultSuspense;