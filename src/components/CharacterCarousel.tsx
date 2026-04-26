import { characters } from "$assets/images";

const CharacterCarousel = ({onChange, selected}:{onChange:(sprite:string)=>void, selected:string|undefined})=>{
  return (
    <div className="animate-fade p-2 gap-2 h-56 items-center overflow-x-auto snap-x select-none max-w-full drop-shadow-xl grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6">
      {Object.entries(characters).map(([key, value])=>{
        return <img 
          key={key}
          src={value} 
          data-selected={value == selected} 
          className=" data-[selected=true]:ring-blue-500 cursor-pointer data-[selected=true]:ring-4 h-16 w-16 aspect-square rounded-full border-4 border-black snap-center select-none" 
          width={256} 
          height={256} 
          onClick={()=>{
            onChange(value);
          }} 
        />
      })}
    </div>
    )
};

export default CharacterCarousel;