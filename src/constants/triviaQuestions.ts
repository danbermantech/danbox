export type TriviaQuestion = {
  question: string;
  answer: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
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
    question: 'Which of the following does not make a guest appearance in "Detroiters"?',
    answer: 'James Carvell',
    category: 'Entertainment',
    difficulty: 'medium',
    type: 'multiple',
    incorrect_answers: [
      'Keegan Michael Key',
      'Jason Sudeikis',
      'Tim Meadows',
      'Conner O\'Malley'
    ]
  },
  {
    question: 'Who directed the movie "The Lord of The Rings"?',
    answer: 'Ralph Bakshi',
    category: 'Entertainment',
    difficulty: 'hard',
    type: 'multiple',
    incorrect_answers: [
      'Peter Jackson',
      'George Lucas',
      'Steven Spielberg',
      'James Cameron'
    ]
  },
  {
    question: 'How tall was Leon Trotsky?',
    answer: '5\'9"',
    category: 'History',
    difficulty: 'hard',
    type: 'multiple',
    incorrect_answers: [
      '5\'6"',
      '5\'3"',
      '5\'10"',
      '5\'7"'
    ]
  },
  {
    question: 'What are the geographic coordinates of Philadelphia City Hall?',
    answer: '39.9526° N, 75.1652° W',
    category: 'Geography',
    difficulty: 'expert',
    type: 'multiple',
    incorrect_answers: [
      '51.7118° N, 72.6071° W',
      '40.6428° N, 74.0260° W',
      '42.9321° N, 76.6556° W',
      '31.2528° N, 75.1152° W'
    ]
  },
  {
    question: 'How many pockets are there on a standard bumper pool table?',
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
  {
    question: 'Which of the following represents the character "A" in ASCII?',
    answer: '65',
    category: 'Modernity',
    difficulty: 'medium',
    type: 'multiple',
    incorrect_answers: [
      '00',
      '01',
      '64',
      '127'
    ]
  },
  {
    question: 'Which of the following represents the character "a" in ASCII?',
    answer: '97',
    category: 'Modernity',
    difficulty: 'medium',
    type: 'multiple',
    incorrect_answers: [
      '00',
      '01',
      '64',
      '127'
    ]
  },
  {
    question: 'What is the chemical formula for TNT?',
    answer: 'C7H5N3O6',
    category: 'Science',
    difficulty: 'medium',
    type: 'multiple',
    incorrect_answers: [
      'C6H12O6',
      'C2H5OH',
      'C2H6O2',
      'C4H10'
    ]
  },
  {
    question: 'Why did Steve Jobs name his company Apple?',
    answer: 'To be petty',
    category: 'Modernity',
    difficulty: 'medium',
    type: 'multiple',
    incorrect_answers: [
      'For Isaac newton',
      'For the Beatles',
      'Exposure therapy for his fructophobia',
    ]
  },
  {
    question: 'Which of the following is an ingredient in the creation of quicksilver?',
    answer: 'Cinnabar',
    category: 'Alchemy',
    difficulty: 'hard',
    type: 'multiple',
    incorrect_answers: [
      'Veridian',
      'Obsidian',
      'Pyrite'
    ]
  },
  {
    question: 'Which of the following can be transmuted into gold?',
    answer: 'Platinum',
    category: 'Alchemy',
    difficulty: 'hard',
    type: 'multiple',
    incorrect_answers: [
      'Lead',
      'Carbon',
      'Iron'
    ]
  },
  {
    question: 'Who framed Roger Rabbit?',
    answer: 'Judge Doom',
    category: 'Entertainment',
    difficulty: 'medium',
    type: 'multiple',
    incorrect_answers: [
      'Judge Dredd',
      'Wilbur',
      'The Monstars'
    ],
  },
  {
    question: 'Who shot Mr. Burns?',
    answer: 'Maggie Simpson',
    category: 'Entertainment',
    difficulty: 'easy',
    type: 'multiple',
    incorrect_answers: [
      'Chief Wiggum',
      'Sideshow Bob',
      'Smithers'
    ],
  },
  {
    question: 'Who shot JFK',
    answer: 'George H.W. Bush',
    category: 'History',
    difficulty: 'expert',
    type: 'multiple',
    incorrect_answers: [
      'Lee Harvey Oswald',
      'Jack Ruby',
      'Lyndon B. Johnson',
    ],
  },
  {
    question: 'When was the date of Dan\'s bar mitzvah',
    answer: 'April 9',
    category: 'friendship',
    difficulty: 'expert',
    type: 'multiple',
    incorrect_answers: [
      'March 28',
      'March 22',
      'April 3',
    ],
  },
  {
    question: "What Charles Manson son was covered by Guns n Roses?",
    answer: 'Look at Your Game, Girl',
    category: 'Entertainment',
    difficulty: 'hard',
    type: 'multiple',
    incorrect_answers: [
      'People say I\'m no good',
      'I\'m on fire',
      'Cease to Exist',
    ],
  },
  {
    question: 'Who won the first Grammy for Album of the Year?',
    answer: 'Henry Mancini',
    category: 'Entertainment',
    difficulty: 'hard',
    type: 'multiple',
    incorrect_answers: [
      'Dean Martin',
      'Frank Sinatra',
      'Benny Goodman',
    ]
  },
  {
    question: 'Who said the foolowing quote? "It is possible to make no mistakes and still lose. That is not a weakness; that is life."',
    answer: 'Jean-Luc Picard',
    category: 'history',
    difficulty: 'medium',
    type: 'multiple',
    incorrect_answers: [
      'John Brown',
      'Ben Sisko',
      'Lee Adama',
    ]
  },
  {
    question: 'Who invented the first movable type printing press?',
    answer: 'Bi Sheng',
    category: 'history',
    difficulty: 'hard',
    type: 'multiple',
    incorrect_answers: [
      'Johannes Gutenberg',
      'William Caxton',
      'Laurence Coster',
    ]
  },
  {
    question: 'Which of the following musical acts has music videos directed by Michel Gondry?',
    answer: 'The Chemical Brothers',
    category: 'Entertainment',
    difficulty: 'medium',
    type: 'multiple',
    incorrect_answers: [
      'Fatboy Slim',
      'The Prodigy',
      'The Crystal Method',
    ]
  },
  {
    question: 'Which of the following music videos was directed by Johnathan Glazer?',
    answer: 'Virtual Insanity',
    category: 'Entertainment',
    difficulty: 'medium',
    type: 'multiple',
    incorrect_answers: [
      'Bitter Sweet Symphony',
      'Karma Police',
      'Praise You',
    ]
  },
  {
    question: 'Which of the following songs is based on Dune?',
    answer: 'Weapon of Choice',
    category: 'Entertainment',
    difficulty: 'medium',
    type: 'multiple',
    incorrect_answers: [
      'Spice World',
      'Mind Killer',
      'The Worm',
    ]
  },
  {
    question: 'How long was Moses on the mountain?',
    answer: '40 days and 40 nights',
    category: 'Religion',
    difficulty: 'easy',
    type: 'multiple',
    incorrect_answers: [
      '7 days and 7 nights',
      '12 hours',
      '1 year',
    ]
  },
  {
    question: 'Which of the following bands does not appear in Gilmore Girls?',
    answer: 'Letters to Cleo',
    category: 'Entertainment',
    difficulty: 'medium',
    type: 'multiple',
    incorrect_answers: [
      'Sonic Youth',
      'The Bangles',
      'Yo La Tengo',
    ]
  },
  {
    question: 'Why was Jesus given 39 lashes?',
    answer: 'Because 40 would have killed him',
    category: 'Religion',
    difficulty: 'medium',
    type: 'multiple',
    incorrect_answers: [
      'One lash for each crime he was accused of',
      'Because the whip broke after the 39th',
      '39 was a holy number for the Romans as a multiple of 3 and 13',
    ]
  },
  {
    question: 'Who said the following quote? "Because it it my name. Because I cannot have another in my life. Because I lie and sign myself to lies! Because I am not worth the dust on the feet of them that hang! How may I live without my name? I have given you my soul; leave me my name!"',
    answer: 'John Proctor',
    category: 'Literature',
    difficulty: 'medium',
    type: 'multiple',
    incorrect_answers: [
      'Stanley Kowalski',
      'Willy Loman',
      'Atticus Finch',
    ]
  },
  {
    question: 'Who said the following quote? "All animals are equal, but some animals are more equal than others."',
    answer: 'Napoleon',
    category: 'Literature',
    difficulty: 'medium',
    type: 'multiple',
    incorrect_answers: [
      'Snowball',
      'Khan',
      'Lenin',
    ]
  },
  {
    question: 'Who said the following quote? "You may live to see man-made horrors beyond your comprehension"',
    answer: 'Nikola Tesla',
    category: 'History',
    difficulty: 'medium',
    type: 'multiple',
    incorrect_answers: [
      'Thomas Edison',
      'Albert Einstein',
      'Robert Oppenheimer',
    ]
  },
  {
    question: 'What was the name of L. Ron Hubbard\'s cat?',
    answer: 'DAN stop no don\'t do this',
    category: 'History',
    difficulty: 'hard',
    type: 'multiple',
    incorrect_answers: [
      'Cthulu',
      'Mr. Whiskers',
      'Mittens',
    ]
  },
  {
    question: 'What is the name of the first electronic computer?',
    answer: 'ENIAC',
    category: 'Modernity',
    difficulty: 'medium',
    type: 'multiple',
    incorrect_answers: [
      'UNIVAC',
      'EDVAC',
      'IBM 701',
    ]
  },
  {
    question: 'Which of the following obsolete programming languages still handles over 3 trillion dollars worth of financial transactions each year?',
    answer: 'COBOL',
    category: 'Modernity',
    difficulty: 'medium',
    type: 'multiple',
    incorrect_answers: [
      'FORTRAN',
      'BASIC',
      'Pascal',
    ]
  },
  {
    question: 'How long did the Buddha meditate under the Bodhi tree?',
    answer: '49 days',
    category: 'Religion',
    difficulty: 'medium',
    type: 'multiple',
    incorrect_answers: [
      '7 days',
      '40 days',
      '1 year',
    ]
  },
  {
    question: 'What is the threefold path of Asha?',
    answer: 'Good thoughts, good words, good deeds',
    category: 'Religion',
    difficulty: 'medium',
    type: 'multiple',
    incorrect_answers: [
      'Live, Laugh, Love',
      'Left, Right, Center',
      'Faith, Hope, Charity',
    ]
  },
  {
    question: 'Which new religious movement operates the Epoch Times?',
    answer: 'Falun Gong',
    category: 'Religion',
    difficulty: 'medium',
    type: 'multiple',
    incorrect_answers: [
      'Scientology',
      'Raelism',
      'Anastasia\'s Garden',
    ]
  },
  {
    question: 'Which new religous movement operates the Washington Times?',
    answer: 'Unification Church',
    category: 'Religion',
    difficulty: 'medium',
    type: 'multiple',
    incorrect_answers: [
      'Scientology',
      'Raelism',
      'Falun Gong',
    ]
  },
  {
    question: 'How many mitzvot are there?',
    answer: '613',
    category: 'Religion',
    difficulty: 'medium',
    type: 'multiple',
    incorrect_answers: [
      '10',
      '512',
      '256',
    ]
  },
  {
    question: 'What was Harrison Ford\'s job before he was an actor?',
    answer: 'Carpenter',
    category: 'Entertainment',
    difficulty: 'easy',
    type: 'multiple',
    incorrect_answers: [
      'Plumber',
      'Electrician',
      'Mechanic',
    ]
  },
  {
    question: 'Which channel did Mike Rowe present for?',
    answer: 'QVC',
    category: 'Entertainment',
    difficulty: 'medium',
    type: 'multiple',
    incorrect_answers: [
      'OWN',
      'HSN',
      'TBS',
    ]
  },
  {
    question: 'When was the last peonage slaves freed in the US?',
    answer: '1963',
    category: 'History',
    difficulty: 'medium',
    type: 'multiple',
    incorrect_answers: [
      '1908',
      '1863',
      '1867',
    ]
  },
  {
    question: 'Who was the first American convicted of cannibalism?',
    answer: 'Alfred Packer',
    category: 'History',
    difficulty: 'medium',
    type: 'multiple',
    incorrect_answers: [
      'James Beard',
      'Ed Gein',
      'Albert Fish',
    ]
  },
  {
    question: 'Who wrote the first commercially available album of electronic music?',
    answer: 'Wendy Carlos',
    category: 'Entertainment',
    difficulty: 'medium',
    type: 'multiple',
    incorrect_answers: [
      'Karlheinz Stockhausen',
      'John Cage',
      'Morton Subotnick',
    ]
  },{
    question: 'Which of the following is a member of Kraftwerk?',
    answer: 'Ralf Hütter',
    category: 'Entertainment',
    difficulty: 'medium',
    type: 'multiple',
    incorrect_answers: [
      'Manuel Göttsching',
      'Jaki Liebezeit',
      'Karlheinz Stockhausen',
    ]
  },
  {
    question: 'Who revealed the secrets of chirpractic to D.D. Palmer?',
    answer: 'A ghost',
    category: 'History',
    difficulty: 'medium',
    type: 'multiple',
    incorrect_answers: [
      'Robert Kraft',
      'John Smith',
      'John Kellogg',
    ]
  },
  {
    question: 'Which of the following began their career reading radio ads for chiropractic?',
    answer: 'Ronald Reagan',
    category: 'Entertainment',
    difficulty: 'medium',
    type: 'multiple',
    incorrect_answers: [
      'John Wayne',
      'Chris Pratt',
      'Jesse Ventura',
    ]
  },
  {
    question: 'Dude, where WAS his car?',
    answer: 'In the garage',
    category: 'Entertainment',
    difficulty: 'medium',
    type: 'multiple',
    incorrect_answers: [
      'On a spaceship',
      'In the street',
      'In the lake',
    ]
  },
  {
    question: 'Guy was a name before it was a word',
    answer: 'True',
    category: 'Entertainment',
    difficulty: 'medium',
    type: 'multiple',
    incorrect_answers: [
      'False',
    ]
  },
  {
    question: 'Which of the following legendary synth designers is still alive?',
    answer: 'Dave Smith',
    category: 'Entertainment',
    difficulty: 'medium',
    type: 'multiple',
    incorrect_answers: [
      'Bob Moog',
      'Don Buchla',
      'Alan R. Pearlman',
    ]
  },
  {
    question: 'Which of the following corporations encouraged the US to back a coup in Nicaragua?',
    answer: 'United Fruit',
    category: 'History',
    difficulty: 'medium',
    type: 'multiple',
    incorrect_answers: [
      'Standard Oil',
      'Ford',
      'General Electric',
    ]
  },
  {
    question: 'Which president denounced the CIA?',
    answer: 'Harry Truman',
    category: 'History',
    difficulty: 'medium',
    type: 'multiple',
    incorrect_answers: [
      'Dwight Eisenhower',
      'John F. Kennedy',
      'Lyndon B. Johnson',
    ]
  },
  {
    question: 'Why of the following is the numerological representation of chai?',
    answer: '18',
    category: 'Religion',
    difficulty: 'hard',
    type: 'multiple',
    incorrect_answers: [
      '36',
      '9',
      '72',
    ]  
  },
  {
    question: 'How many notes are there in a chromatic scale?',
    answer: '12',
    category: 'Entertainment',
    difficulty: 'medium',
    type: 'multiple',
    incorrect_answers: [
      '8',
      '5',
      '7',
    ]
  },
  {
    question: 'What region is spanish moss native to?',
    answer: 'South America',
    category: 'Geography',
    difficulty: 'medium',
    type: 'multiple',
    incorrect_answers: [
      'Europe',
      'Asia',
      'Australia',
    ]
  },
  {
    question: 'Who provided funding for the original run of Star Trek?',
    answer: 'Lucille Ball',
    category: 'Entertainment',
    difficulty: 'medium',
    type: 'multiple',
    incorrect_answers: [
      'Rod Serling',
      'Orson Welles',
      'NBC',
    ]
  },
  {
    question: 'What type of droid is C-3PO?',
    answer: 'Protocol',
    category: 'Entertainment',
    difficulty: 'medium',
    type: 'easy',
    incorrect_answers: [
      'Astromech',
      'Gundam',
      'Humaniform',
    ]
  },
  {
    question: 'Which of the following movies features Roddy Piper?',
    answer: 'The Mystical Adventures of Billy Owens',
    category: 'Entertainment',
    difficulty: 'medium',
    type: 'multiple',
    incorrect_answers: [
      'Llamageddon',
      'The Beastmaster',
      'Legend of the Guardians: The Owls of Ga\'hoole',
    ]
  },
]

export default TriviaQuestions;