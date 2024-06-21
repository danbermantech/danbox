// import TriviaQuestions from "../triviaQuestions";
type Challenge = {
  category: string,
  name: string,
  difficulty: string,
  description: string,
  audienceDescription: string,
  audienceDelay?: number,
  nsfw?: boolean,
}

const challenges:Challenge[] = [
  {
    category: 'Megalomania',
    name: 'Tell a lie',
    difficulty: 'easy',
    description: 'Tell a lie. The player with the best lie wins.',  
    audienceDescription: 'Vote for the best lie.',
    audienceDelay: 30000,
    nsfw: true,
  },
  {
    category: 'Task',
    name:'Touch a doorknob',
    difficulty: 'easy',
    description: 'Touch a doorknob. The first player to touch a doorknob wins. I kinda ran out of ideas, sorry.',
    audienceDescription: 'Who touched a doorknob first',
  },
  {
    category:'Friendship',
    name: 'Compliment someone',
    difficulty: 'medium',
    description: 'Compliment someone. The player who gives the most sincere compliment wins.',
    audienceDescription: 'Whose compliment was better?',
    audienceDelay: 30000,
  },
  {
    category: 'Party',
    name: 'Take a shot',
    difficulty: 'easy',
    description: 'Take a shot of whatever you want. Whoever takes their shot first wins.',
    audienceDescription: 'Who took their shot first?',
    nsfw: true,
  },
  {
    category: 'Ego',
    name: 'Namedrop',
    difficulty: 'medium',
    description: 'Tell a story about meeting someone famous. The player with the most famous namedrop wins.',
    audienceDescription: 'Whose story was the most interesting?',
    audienceDelay: 30000,
  },
  {
    category: 'Ego',
    name: 'Namedrop',
    difficulty: 'medium',
    description: 'Tell a story about meeting someone famous. The player with the most famous namedrop wins.',
    audienceDescription: 'Whose story happened most recently?',
    audienceDelay: 30000,
  },
  {
    category: 'Party',
    name: 'Take off a piece of clothing',
    difficulty: 'medium',
    description: 'Take off a piece of clothing. The first person to remove an article of clothing wins.',
    audienceDescription: 'Whose piece of clothing was lighter?',
    audienceDelay: 20000,
    nsfw: true,
  },
  {
    category: 'Party',
    name: 'Take off a piece of clothing',
    difficulty: 'medium',
    description: 'Take off a piece of clothing. The first person to remove an article of clothing wins.',
    audienceDescription: 'Whose piece of clothing was darker?',
    audienceDelay: 20000,
    nsfw: true,
  },
  {
    category: 'Ego',
    name: 'Kiss an animal',
    difficulty: 'medium',
    description: 'Kiss an animal. The first player to kiss an animal wins.',
    audienceDescription: 'Who kissed an animal first?',
    nsfw: true,
  },
  {
    category: 'Ego',
    name: 'Kiss an animal',
    difficulty: 'medium',
    description: 'Kiss an animal. The first player to kiss an animal wins.',
    audienceDescription: 'Whose animal was tallest?',
    nsfw: true,
  },
  {
    category: 'Party',
    name: 'Dance',
    difficulty: 'medium',
    description: 'Dance. The player who does the most interesting dance wins.',
    audienceDescription: 'Whose dance was the most out of character?',
    audienceDelay: 30000,
  },
  {
    category: 'Party',
    name: 'Dance',
    difficulty: 'medium',
    description: 'Dance. The player who does the most interesting dance wins.',
    audienceDescription: 'Whose dance was the most old school?',
    audienceDelay: 30000,
  },
  {
    category: 'Party',
    name: 'Dance',
    difficulty: 'medium',
    description: 'Dance. The player who does the most interesting dance wins.',
    audienceDescription: 'Whose dance was the most athletic?',
    audienceDelay: 30000,
  },
  {
    category: 'Party',
    name: 'Dance',
    difficulty: 'medium',
    description: 'Dance. The player who does the most interesting dance wins.',
    audienceDescription: 'Whose dance was longer?',
    audienceDelay: 30000,
  },
  {
    category: 'Ego',
    name: 'Tell a joke',
    difficulty: 'medium',
    description: 'Tell a joke. The player with the funniest joke wins.',
    audienceDescription: 'Who do you feel more pity for right now?',
    audienceDelay: 30000,
  },
  {
    category: 'Task',
    name: 'Touch something blue',
    difficulty: 'medium',
    description: 'Touch something blue. The first player to touch something blue wins.',
    audienceDescription: 'Whose blue was the bluest blue?',
    audienceDelay: 20000,
  },
];

export function GET(request: Request) {
  const url = new URL(request.url);
  const params = Object.fromEntries(url.searchParams.entries());
  let questions = challenges;
  if(!(params.nsfw === 'true')) questions = questions.filter((question)=>(!question?.nsfw));
  if(params.category) questions = questions.filter((question)=>question.category === params.category);
  if(params.difficulty) questions = questions.filter((question)=>question.difficulty === params.difficulty);
  questions.sort(()=>Math.random() - 0.5);
  questions = questions.slice(0, 3);
  return new Response(JSON.stringify([questions, params]), {status: 200, statusText: 'OK', headers: new Headers({'Content-Type': 'application/json'})});
}