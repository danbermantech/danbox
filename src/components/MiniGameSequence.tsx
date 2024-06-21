import React, { useEffect,  useState } from "react";

const PreGame = ({title, instructions, img, onComplete}:{title:string, instructions:string, img:string, onComplete:()=>void})=>{
  
  useEffect(()=>{
    const timer = setTimeout(()=>{
      onComplete();
    }, 5000);
    return ()=>clearTimeout(timer);
  })
  
  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      <h1 className="text-4xl text-center text-white">{title}</h1>
      <h1 className="text-4xl text-center text-white">{instructions}</h1>
      <img src={img} alt="game" className="w-1/2 h-1/2"/>
    </div>
  )
}


const PostGame = ({title, results}:{title:string, results:Results})=>{
  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      <h1 className="text-4xl text-center text-white">{title}</h1>
      {results.length ? results.map((result)=>(
        <h1 className="text-4xl text-center text-white">{result.user} {result.reward.qty >= 0 ? "+" : "-"} {Math.abs(result.reward.qty)} {result.reward.resource}</h1>
      )) : null}
    </div>
  )
}

type UserReward = {
  user:string,
  reward:{resource:string, qty:number}
}

type Results = UserReward[]

type GameComponent = React.FC<{onEnd: (results:Results)=>void}>

// class MiniGameSequence {
//   title:string;
//   instructions:string;
//   preGameImage:string;
//   game:GameComponent;
//   results:Results;
//   constructor({title, instructions, preGameImage, game}:{title:string, instructions:string, preGameImage:string, game:GameComponent}){
//     this.title = title;
//     this.instructions = instructions;
//     this.preGameImage = preGameImage;
//     this.game = game;
//     this.results = []
//   }
//   Pre = ()=>{
//     return (<PreGame title={this.title} instructions={this.instructions} img={this.preGameImage}/>)
//   };

//   Main = ()=>{
//     const Game = this.game;
//     return (<Game onEnd={(results:Results)=>this.results = results} />)
//   };

//   Post = ({results}:{results:{user:string, reward:{resource:string, qty:number}}})=>{
//     return (<PostGame title={this.title} results={results}/>)
//   };
// }

enum Stage {
  Pre,
  Main,
  Post
}

const MiniGame = ({
  title, instructions, preGameImage, game
}:{
  title:string,
  instructions:string,
  preGameImage:string,
  game:GameComponent, 
}) =>{
  const [stage, setStage] = useState<Stage>(Stage.Pre);
  const [results, setResults] = useState<Results>([]);
  const Game = game;

  if(stage === Stage.Pre) return (
    <PreGame 
    title={title} 
    instructions={instructions} 
    img={preGameImage} 
    onComplete={()=>{setStage(Stage.Main)}} 
    />
  );

  if(stage === Stage.Main) return (
    <Game onEnd={(results:Results)=>{setResults(results); setStage(Stage.Post)}} />
  );

  if(stage === Stage.Post) return (
    <PostGame title={title} results={results}/>
  );

}

export default MiniGame;