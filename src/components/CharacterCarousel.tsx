import { characters } from "$assets/images";

const CharacterCarousel = ({onChange, selected}:{onChange:(sprite:string)=>void, selected:string|undefined})=>{
  
  return (
    <div className="flex animate-fade p-2 gap-2 h-56 items-center overflow-x-scroll snap-x select-none max-w-full drop-shadow-xl ">
      {Object.entries(characters).map(([key, value])=>{
        return <img 
          key={key}
          src={value} 
          data-selected={value== selected} 
          className=" data-[selected=true]:ring-blue-500 cursor-pointer data-[selected=true]:ring-4 h-48 w-48 aspect-square rounded-full border-4 border-black snap-center select-none" 
          width={256} 
          height={256} 
          onClick={()=>{
            // console.log(value)
            onChange(value);
          }} 
        />
      })}
    </div>
    )
};

export default CharacterCarousel;