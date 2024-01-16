export type TriviaQuestion = {
  question: string;
  answer: string;
  category: string;
  difficulty: string;
  type: string;
  incorrect_answers: string[];
};

const TriviaQuestions:TriviaQuestion[] =[
  {
    question: 'Which of the following incantations would you use to summon an ice demon?',
    answer: 'Volo a bellus paulo guy e gelida aqua', // I want a little guy made of frozen water
    category: 'Daemonology',
    difficulty: 'hard',
    type: 'multiple',
    incorrect_answers: [
      'Fac hominem ex gelatina',
      'Potes me ad balneo',
      'Si hoc legere potes dicere, salve, sic possum hoc legere'
    ]
  },
  {
    question: 'Who created Roller Coaster Tycoon?',
    answer: 'Chris Sawyer',
    category: 'Modernity',
    difficulty: 'medium',
    type: 'multiple',
    incorrect_answers: [
      'Sid Meier',
      'Will Wright',
      'John Romero'
    ]
  },
  {
    question: 'Solve the following equation for x: ((8x + 3)^2) / 2 = 4x - 1',
    answer: "I don't know",
    category: 'Math',
    difficulty: 'hard',
    type: 'multiple',
    incorrect_answers: [
      'x = 1',
      'x = 1/2',
      'x = 4'
    ]
  },
  {
    question: 'Which of the following is a standard screw size?',
    answer: 'M8',
    category: 'Modernity',
    difficulty: 'medium',
    type: 'multiple',
    incorrect_answers: [
      'F4',
      '11x15',
      '3/9'
    ]
  },
  {
    question: "What is the name of Candide's love interest?",
    answer: 'Cunegonde',
    category: 'Literature',
    difficulty: 'medium',
    type: 'multiple',
    incorrect_answers: [
      'Felicity',
      'Pangloss',
      'Demerzel'
    ]
  },
  {
    question: 'What is the densest stable element?',
    answer: 'Osmium',
    category: 'Science',
    difficulty: 'medium',
    type: 'multiple',
    incorrect_answers: [
      'Iridium',
      'Tungsten',
      'Gold'
    ]
  },
  {
    question: 'Which of the following is not a Mesopotamian diety?',
    answer: 'Gerinth',
    category: 'Religion',
    difficulty: 'hard',
    type: 'multiple',
    incorrect_answers: [
      'Gibil',
      'Erra',
      'Ninlil'
    ]
  },
  {
    question: 'Which of the following is not a Mesopotamian diety?',
    answer: 'Gerinth',
    category: 'Religion',
    difficulty: 'hard',
    type: 'multiple',
    incorrect_answers: [
      'Gibil',
      'Erra',
      'Ninlil'
    ]
  },
  {
    question: 'Which of the following is not a real business in Eagle Grove, Iowa?',
    answer: "Jerry's Bait Shack",
    category: 'Geography',
    difficulty: 'expert',
    type: 'multiple',
    incorrect_answers: [
      'The Grove Inn and Suites',
      'Rails Bar & Grill',
      "Ray's Auto Repair",
    ]
  },
  {
    question: 'Which of the following is a town in Minnesota?',
    answer: 'Stephen',
    category: 'Geography',
    difficulty: 'expert',
    type: 'multiple',
    incorrect_answers: [
      'Gerald',
      'Allison',
      'Ralph',
      'Dennis'
    ]
  },
  {
    question: 'Which of the following is the name of a bar in Grafton, North Dakota?',
    answer: 'Last Chance',
    category: 'Geography',
    difficulty: 'expert',
    type: 'multiple',
    incorrect_answers: [
      'Welcome Home',
      'New York',
      'Rose Garage',
      'Try Again'
    ]
  },
  {
    question: 'Which of the following is not one of the Street Sharks?',
    answer: 'Chomper',
    category: 'Entertainment',
    difficulty: 'medium',
    type: 'multiple',
    incorrect_answers: [
      'Ripster',
      'Streex',
      'Jab',
      'Big Slammu'
    ]
  },
  {
    question: 'How many pockets are there on a standard bumpter pool table?',
    answer: '2',
    category: 'Sports',
    difficulty: 'medium',
    type: 'multiple',
    incorrect_answers: [
      '4',
      '6',
      '8',
      '16'
    ]
  },
  {
    question: 'Как Дэну нравится их кофе?',
    answer: 'black',
    category: 'Modernity',
    difficulty: 'medium',
    type: 'multiple',
    incorrect_answers: [
      '16kg',
      'deez nuts',
      'To get to the other side'
    ]
  },
  {
    question: 'Which of the following government projects totally controls the weather?',
    answer: 'HAARP',
    category: 'Modernity',
    difficulty: 'medium',
    type: 'multiple',
    incorrect_answers: [
      'Project Blue Beam',
      'MKUltra',
      'Project Cloud9',
      'Operation Paperclip'
    ]
  },
  {
    question: 'Who invented the moon?',
    answer: 'NASA',
    category: 'Modernity',
    difficulty: 'medium',
    type: 'multiple',
    incorrect_answers: [
      'Roscosmos',
      'SpaceX',
      'God',
      'Galileo'
    ]
  },
  {
    question: 'Solve the following equation for y: 2y + x/y = 45x',
    answer: "I don't know",
    category: 'Math',
    difficulty: 'hard',
    type: 'multiple',
    incorrect_answers: [
      'y = 1',
      'y = 1/2',
      'y = 7'
    ]
  },
  {
    question: 'Who created the Caesar salad?',
    answer: 'Caesar Cardini',
    category: 'Modernity',
    difficulty: 'medium',
    type: 'multiple',
    incorrect_answers: [
      'Caesar Romero',
      'Caesar Milan',
      'Caesar Chavez',
      'Caesar Frances'
    ]
  },
  {
    question: 'Which of the following does Shrek shoot with a gun?',
    answer: 'A cloud',
    category: 'Literature',
    difficulty: 'medium',
    type: 'multiple',
    incorrect_answers: [
      'A Dragon',
      'A bird',
      'A solider',
      'A villager'
    ]
  },
]

export default TriviaQuestions;