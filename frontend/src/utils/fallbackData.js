/**
 * Fallback data for when API calls fail
 */

// Fallback author data for popular authors
export const popularAuthors = {
  'J.K. Rowling': {
    id: 'OL23919A',
    name: 'J.K. Rowling',
    bio: 'Joanne Rowling CH, OBE, HonFRSE, FRCPE, FRSL, better known by her pen name J. K. Rowling, is a British author and philanthropist. She is best known for writing the Harry Potter fantasy series.',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/J._K._Rowling_2010.jpg/440px-J._K._Rowling_2010.jpg',
    birthDate: '31 July 1965',
    deathDate: null,
    wikipedia: 'https://en.wikipedia.org/wiki/J._K._Rowling',
    topWork: 'Harry Potter and the Philosopher\'s Stone',
    worksCount: 28
  },
  'Stephen King': {
    id: 'OL2162284A',
    name: 'Stephen King',
    bio: 'Stephen Edwin King is an American author of horror, supernatural fiction, suspense, crime, science-fiction, and fantasy novels. His books have sold more than 350 million copies, and many have been adapted into films, television series, miniseries, and comic books.',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/e3/Stephen_King%2C_Comicon.jpg',
    birthDate: 'September 21, 1947',
    deathDate: null,
    wikipedia: 'https://en.wikipedia.org/wiki/Stephen_King',
    topWork: 'The Shining',
    worksCount: 95
  },
  'Agatha Christie': {
    id: 'OL27695A',
    name: 'Agatha Christie',
    bio: 'Dame Agatha Mary Clarissa Christie, Lady Mallowan, DBE was an English writer known for her 66 detective novels and 14 short story collections, particularly those revolving around fictional detectives Hercule Poirot and Miss Marple.',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/cf/Agatha_Christie.png',
    birthDate: '15 September 1890',
    deathDate: '12 January 1976',
    wikipedia: 'https://en.wikipedia.org/wiki/Agatha_Christie',
    topWork: 'Murder on the Orient Express',
    worksCount: 85
  },
  'George R.R. Martin': {
    id: 'OL2668537A',
    name: 'George R.R. Martin',
    bio: 'George Raymond Richard Martin, also known as GRRM, is an American novelist, screenwriter, television producer and short story writer. He is the author of the series of epic fantasy novels A Song of Ice and Fire, which was adapted into the Emmy Award-winning HBO series Game of Thrones.',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/George_R._R._Martin_2023.jpg/440px-George_R._R._Martin_2023.jpg',
    birthDate: 'September 20, 1948',
    deathDate: null,
    wikipedia: 'https://en.wikipedia.org/wiki/George_R._R._Martin',
    topWork: 'A Game of Thrones',
    worksCount: 54
  },
  'Jane Austen': {
    id: 'OL21594A',
    name: 'Jane Austen',
    bio: 'Jane Austen was an English novelist known primarily for her six major novels, which interpret, critique and comment upon the British landed gentry at the end of the 18th century. Austen\'s plots often explore the dependence of women on marriage in the pursuit of favourable social standing and economic security.',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/cc/CassandraAusten-JaneAusten%28c.1810%29_hires.jpg',
    birthDate: '16 December 1775',
    deathDate: '18 July 1817',
    wikipedia: 'https://en.wikipedia.org/wiki/Jane_Austen',
    topWork: 'Pride and Prejudice',
    worksCount: 17
  }
};

// Sample works for popular authors - with local image URLs to avoid API calls
export const sampleWorks = {
  'J.K. Rowling': [
    {
      id: 'OL82563W',
      key: '/works/OL82563W',
      title: 'Harry Potter and the Philosopher\'s Stone',
      coverUrl: 'https://m.media-amazon.com/images/I/81m1s4wIPML._AC_UF1000,1000_QL80_.jpg',
      description: 'Harry Potter has never even heard of Hogwarts when the letters start dropping on the doormat at number four, Privet Drive. Addressed in green ink on yellowish parchment with a purple seal, they are swiftly confiscated by his grisly aunt and uncle. Then, on Harry\'s eleventh birthday, a great beetle-eyed giant of a man called Rubeus Hagrid bursts in with some astonishing news: Harry Potter is a wizard, and he has a place at Hogwarts School of Witchcraft and Wizardry.',
      firstPublishYear: '1997',
      subjects: ['Fantasy', 'Magic', 'Wizards', 'Fiction']
    },
    {
      id: 'OL59859W',
      key: '/works/OL59859W',
      title: 'Harry Potter and the Chamber of Secrets',
      coverUrl: 'https://m.media-amazon.com/images/I/91OINeHnJGL._AC_UF1000,1000_QL80_.jpg',
      description: 'Harry Potter\'s summer has included the worst birthday ever, doomy warnings from a house-elf called Dobby, and rescue from the Dursleys by his friend Ron Weasley in a magical flying car! Back at Hogwarts School of Witchcraft and Wizardry for his second year, Harry hears strange whispers echo through empty corridors - and then the attacks start.',
      firstPublishYear: '1998',
      subjects: ['Fantasy', 'Magic', 'Wizards', 'Fiction']
    },
    {
      id: 'OL59860W',
      key: '/works/OL59860W',
      title: 'Harry Potter and the Prisoner of Azkaban',
      coverUrl: 'https://m.media-amazon.com/images/I/81lAPl9Fl0L._AC_UF1000,1000_QL80_.jpg',
      description: 'When the Knight Bus crashes through the darkness and screeches to a halt in front of him, it\'s the start of another far from ordinary year at Hogwarts for Harry Potter. Sirius Black, escaped mass-murderer and follower of Lord Voldemort, is on the run - and they say he is coming after Harry.',
      firstPublishYear: '1999',
      subjects: ['Fantasy', 'Magic', 'Wizards', 'Fiction']
    }
  ],
  'Stephen King': [
    {
      id: 'OL27303W',
      key: '/works/OL27303W',
      title: 'The Shining',
      coverUrl: 'https://m.media-amazon.com/images/I/91ocU8970hL._AC_UF1000,1000_QL80_.jpg',
      description: 'Jack Torrance\'s new job at the Overlook Hotel is the perfect chance for a fresh start. As the off-season caretaker at the atmospheric old hotel, he\'ll have plenty of time to spend reconnecting with his family and working on his writing. But as the harsh winter weather sets in, the idyllic location feels ever more remote...and more sinister.',
      firstPublishYear: '1977',
      subjects: ['Horror', 'Supernatural', 'Fiction', 'Haunted Hotels']
    },
    {
      id: 'OL81634W',
      key: '/works/OL81634W',
      title: 'It',
      coverUrl: 'https://m.media-amazon.com/images/I/71tFhdcC0XL._AC_UF1000,1000_QL80_.jpg',
      description: 'Welcome to Derry, Maine. It\'s a small city, a place as hauntingly familiar as your own hometown. Only in Derry the haunting is real. They were seven teenagers when they first stumbled upon the horror. Now they are grown-up men and women who have gone out into the big world to gain success and happiness. But the promise they made twenty-eight years ago calls them reunite in the same place where, as teenagers, they battled an evil creature that preyed on the city\'s children.',
      firstPublishYear: '1986',
      subjects: ['Horror', 'Supernatural', 'Fiction', 'Monsters']
    },
    {
      id: 'OL98105W',
      key: '/works/OL98105W',
      title: 'The Stand',
      coverUrl: 'https://m.media-amazon.com/images/I/81c8NoKoEZL._AC_UF1000,1000_QL80_.jpg',
      description: 'This is the way the world ends: with a nanosecond of computer error in a Defense Department laboratory and a million casual contacts that form the links in a chain letter of death. And here is the bleak new world of the day after: a world stripped of its institutions and emptied of 99 percent of its people.',
      firstPublishYear: '1978',
      subjects: ['Horror', 'Post-apocalyptic', 'Fiction', 'Pandemic']
    }
  ],
  'Agatha Christie': [
    {
      id: 'OL45883W',
      key: '/works/OL45883W',
      title: 'Murder on the Orient Express',
      coverUrl: 'https://covers.openlibrary.org/b/id/12860069-M.jpg',
      description: 'Just after midnight, the famous Orient Express is stopped in its tracks by a snowdrift. By morning, the millionaire Samuel Edward Ratchett lies dead in his compartment, stabbed a dozen times, his door locked from the inside. Without a shred of doubt, one of his fellow passengers is the murderer.',
      firstPublishYear: '1934',
      subjects: ['Mystery', 'Detective', 'Fiction', 'Hercule Poirot']
    },
    {
      id: 'OL103123W',
      key: '/works/OL103123W',
      title: 'And Then There Were None',
      coverUrl: 'https://covers.openlibrary.org/b/isbn/9780062073488-L.jpg',
      description: 'Ten strangers, apparently with little in common, are lured to an island mansion off the coast of Devon by the mysterious U.N.Owen. Over dinner, a record begins to play, and the voice of an unseen host accuses each person of hiding a guilty secret. That evening, former reckless driver Tony Marston is found murdered by a deadly dose of cyanide.',
      firstPublishYear: '1939',
      subjects: ['Mystery', 'Detective', 'Fiction', 'Psychological Thriller']
    },
    {
      id: 'OL102614W',
      key: '/works/OL102614W',
      title: 'Death on the Nile',
      coverUrl: 'https://m.media-amazon.com/images/I/91ioUXyMpOL._AC_UF1000,1000_QL80_.jpg',
      description: 'The tranquillity of a cruise along the Nile is shattered by the discovery that Linnet Ridgeway has been shot through the head. She was young, stylish and beautiful, a girl who had everything - until she lost her life.',
      firstPublishYear: '1937',
      subjects: ['Mystery', 'Detective', 'Fiction', 'Hercule Poirot']
    }
  ],
  'George R.R. Martin': [
    {
      id: 'OL27448W',
      key: '/works/OL27448W',
      title: 'A Game of Thrones',
      coverUrl: 'https://m.media-amazon.com/images/I/91dSMhdIzTL._AC_UF1000,1000_QL80_.jpg',
      description: 'Long ago, in a time forgotten, a preternatural event threw the seasons out of balance. In a land where summers can last decades and winters a lifetime, trouble is brewing. The cold is returning, and in the frozen wastes to the north of Winterfell, sinister forces are massing beyond the kingdom\'s protective Wall.',
      firstPublishYear: '1996',
      subjects: ['Fantasy', 'Epic', 'Fiction', 'Medieval']
    },
    {
      id: 'OL40037W',
      key: '/works/OL40037W',
      title: 'A Clash of Kings',
      coverUrl: 'https://m.media-amazon.com/images/I/91Nl4RUsGpL._AC_UF1000,1000_QL80_.jpg',
      description: 'A comet the color of blood and flame cuts across the sky. Two great leaders - Lord Eddard Stark and Robert Baratheon - who hold sway over an age of enforced peace are dead, victims of royal treachery. Now, from the ancient citadel of Dragonstone to the forbidding shores of Winterfell, chaos reigns.',
      firstPublishYear: '1998',
      subjects: ['Fantasy', 'Epic', 'Fiction', 'Medieval']
    },
    {
      id: 'OL40038W',
      key: '/works/OL40038W',
      title: 'A Storm of Swords',
      coverUrl: 'https://m.media-amazon.com/images/I/91d6bhxWVzL._AC_UF1000,1000_QL80_.jpg',
      description: 'Of the five contenders for power, one is dead, another in disfavor, and still the wars rage as violently as ever, as alliances are made and broken. Joffrey, of House Lannister, sits on the Iron Throne, the uneasy ruler of the land of the Seven Kingdoms.',
      firstPublishYear: '2000',
      subjects: ['Fantasy', 'Epic', 'Fiction', 'Medieval']
    }
  ],
  'Jane Austen': [
    {
      id: 'OL44925W',
      key: '/works/OL44925W',
      title: 'Pride and Prejudice',
      coverUrl: 'https://m.media-amazon.com/images/I/71Q1tPupKjL._AC_UF1000,1000_QL80_.jpg',
      description: 'Since its immediate success in 1813, Pride and Prejudice has remained one of the most popular novels in the English language. Jane Austen called this brilliant work \"her own darling child\" and its vivacious heroine, Elizabeth Bennet, \"as delightful a creature as ever appeared in print.\"',
      firstPublishYear: '1813',
      subjects: ['Romance', 'Classic', 'Fiction', 'Social Satire']
    },
    {
      id: 'OL53287W',
      key: '/works/OL53287W',
      title: 'Sense and Sensibility',
      coverUrl: 'https://m.media-amazon.com/images/I/91lZYQ3l5cL._AC_UF1000,1000_QL80_.jpg',
      description: 'Marianne Dashwood wears her heart on her sleeve, and when she falls in love with the dashing but unsuitable John Willoughby she ignores her sister Elinor\'s warning that her impulsive behaviour leaves her open to gossip and innuendo.',
      firstPublishYear: '1811',
      subjects: ['Romance', 'Classic', 'Fiction', 'Social Commentary']
    },
    {
      id: 'OL66592W',
      key: '/works/OL66592W',
      title: 'Emma',
      coverUrl: 'https://m.media-amazon.com/images/I/71kmLq2pFdL._AC_UF1000,1000_QL80_.jpg',
      description: 'Emma Woodhouse, handsome, clever, and rich, with a comfortable home and happy disposition, seemed to unite some of the best blessings of existence; and had lived nearly twenty-one years in the world with very little to distress or vex her.',
      firstPublishYear: '1815',
      subjects: ['Romance', 'Classic', 'Fiction', 'Comedy of Manners']
    }
  ]
};

// Get fallback author data
export const getFallbackAuthor = (authorName) => {
  // Try exact match first
  if (popularAuthors[authorName]) {
    return popularAuthors[authorName];
  }
  
  // Try case-insensitive match
  const lowerName = authorName.toLowerCase();
  for (const [key, author] of Object.entries(popularAuthors)) {
    if (key.toLowerCase() === lowerName) {
      return author;
    }
  }
  
  // Try partial match
  for (const [key, author] of Object.entries(popularAuthors)) {
    if (key.toLowerCase().includes(lowerName) || lowerName.includes(key.toLowerCase())) {
      return author;
    }
  }
  
  // Return null if no match found
  return null;
};

// Fallback mood-based book recommendations with actual OpenLibrary covers
export const getMoodBasedBooks = (mood) => {
  const moodBooks = {
    happy: [
      {
        title: 'The Hitchhiker\'s Guide to the Galaxy',
        author: 'Douglas Adams',
        coverUrl: 'https://covers.openlibrary.org/b/id/7371944-L.jpg',
        largeCoverUrl: 'https://covers.openlibrary.org/b/id/7371944-L.jpg',
        coverOptions: [
          'https://covers.openlibrary.org/b/id/7371944-L.jpg',
          'https://covers.openlibrary.org/b/id/7371944-M.jpg',
          'https://covers.openlibrary.org/b/isbn/0345391802-L.jpg',
          'https://covers.openlibrary.org/b/isbn/0345391802-M.jpg'
        ],
        key: '/works/OL2080981W',
        firstPublishYear: '1979',
        isbn: '0345391802',
        hasOpenLibraryCover: true
      },
      {
        title: 'Good Omens',
        author: 'Terry Pratchett & Neil Gaiman',
        coverUrl: 'https://covers.openlibrary.org/b/id/8406786-L.jpg',
        largeCoverUrl: 'https://covers.openlibrary.org/b/id/8406786-L.jpg',
        coverOptions: [
          'https://covers.openlibrary.org/b/id/8406786-L.jpg',
          'https://covers.openlibrary.org/b/id/8406786-M.jpg',
          'https://covers.openlibrary.org/b/isbn/0060853980-L.jpg',
          'https://covers.openlibrary.org/b/isbn/0060853980-M.jpg'
        ],
        key: '/works/OL15933W',
        firstPublishYear: '1990',
        isbn: '0060853980',
        hasOpenLibraryCover: true
      },
      {
        title: 'The Princess Bride',
        author: 'William Goldman',
        coverUrl: 'https://covers.openlibrary.org/b/id/8739161-L.jpg',
        largeCoverUrl: 'https://covers.openlibrary.org/b/id/8739161-L.jpg',
        coverOptions: [
          'https://covers.openlibrary.org/b/id/8739161-L.jpg',
          'https://covers.openlibrary.org/b/id/8739161-M.jpg',
          'https://covers.openlibrary.org/b/isbn/0156035219-L.jpg',
          'https://covers.openlibrary.org/b/isbn/0156035219-M.jpg'
        ],
        key: '/works/OL45883W',
        firstPublishYear: '1973',
        isbn: '0156035219',
        hasOpenLibraryCover: true
      },
      {
        title: 'Bridget Jones\'s Diary',
        author: 'Helen Fielding',
        coverUrl: 'https://covers.openlibrary.org/b/id/8477139-L.jpg',
        largeCoverUrl: 'https://covers.openlibrary.org/b/id/8477139-L.jpg',
        coverOptions: [
          'https://covers.openlibrary.org/b/id/8477139-L.jpg',
          'https://covers.openlibrary.org/b/id/8477139-M.jpg',
          'https://covers.openlibrary.org/b/isbn/0140298495-L.jpg',
          'https://covers.openlibrary.org/b/isbn/0140298495-M.jpg'
        ],
        key: '/works/OL15933W',
        firstPublishYear: '1996',
        isbn: '0140298495',
        hasOpenLibraryCover: true
      }
    ],
    relaxed: [
      {
        title: 'Walden',
        author: 'Henry David Thoreau',
        coverUrl: 'https://covers.openlibrary.org/b/id/8091016-L.jpg',
        largeCoverUrl: 'https://covers.openlibrary.org/b/id/8091016-L.jpg',
        coverOptions: [
          'https://covers.openlibrary.org/b/id/8091016-L.jpg',
          'https://covers.openlibrary.org/b/id/8091016-M.jpg',
          'https://covers.openlibrary.org/b/isbn/0486284956-L.jpg'
        ],
        key: '/works/OL1097236W',
        firstPublishYear: '1854',
        isbn: '0486284956',
        hasOpenLibraryCover: true
      },
      {
        title: 'The Poetry of Robert Frost',
        author: 'Robert Frost',
        coverUrl: 'https://covers.openlibrary.org/b/id/393853-L.jpg',
        largeCoverUrl: 'https://covers.openlibrary.org/b/id/393853-L.jpg',
        coverOptions: [
          'https://covers.openlibrary.org/b/id/393853-L.jpg',
          'https://covers.openlibrary.org/b/id/393853-M.jpg',
          'https://covers.openlibrary.org/b/isbn/0805005021-L.jpg'
        ],
        key: '/works/OL2163649W',
        firstPublishYear: '1969',
        isbn: '0805005021',
        hasOpenLibraryCover: true
      },
      {
        title: 'The Secret Garden',
        author: 'Frances Hodgson Burnett',
        coverUrl: 'https://covers.openlibrary.org/b/id/8514426-L.jpg',
        largeCoverUrl: 'https://covers.openlibrary.org/b/id/8514426-L.jpg',
        coverOptions: [
          'https://covers.openlibrary.org/b/id/8514426-L.jpg',
          'https://covers.openlibrary.org/b/id/8514426-M.jpg',
          'https://covers.openlibrary.org/b/isbn/0486284956-L.jpg'
        ],
        key: '/works/OL45883W',
        firstPublishYear: '1911',
        isbn: '0486284956',
        hasOpenLibraryCover: true
      },
      {
        title: 'Under the Tuscan Sun',
        author: 'Frances Mayes',
        coverUrl: 'https://covers.openlibrary.org/b/id/8477139-L.jpg',
        largeCoverUrl: 'https://covers.openlibrary.org/b/id/8477139-L.jpg',
        coverOptions: [
          'https://covers.openlibrary.org/b/id/8477139-L.jpg',
          'https://covers.openlibrary.org/b/id/8477139-M.jpg',
          'https://covers.openlibrary.org/b/isbn/0767900383-L.jpg'
        ],
        key: '/works/OL15933W',
        firstPublishYear: '1996',
        isbn: '0767900383',
        hasOpenLibraryCover: true
      }
    ],
    adventurous: [
      {
        title: 'The Hobbit',
        author: 'J.R.R. Tolkien',
        coverUrl: 'https://covers.openlibrary.org/b/id/6979861-M.jpg',
        key: '/works/OL262758W',
        firstPublishYear: '1937'
      },
      {
        title: 'Treasure Island',
        author: 'Robert Louis Stevenson',
        coverUrl: 'https://covers.openlibrary.org/b/id/6992031-M.jpg',
        key: '/works/OL66534W',
        firstPublishYear: '1883'
      },
      {
        title: 'The Call of the Wild',
        author: 'Jack London',
        coverUrl: 'https://covers.openlibrary.org/b/id/8514426-M.jpg',
        key: '/works/OL45883W',
        firstPublishYear: '1903'
      },
      {
        title: 'Into the Wild',
        author: 'Jon Krakauer',
        coverUrl: 'https://covers.openlibrary.org/b/id/8477139-M.jpg',
        key: '/works/OL15933W',
        firstPublishYear: '1996'
      }
    ],
    romantic: [
      {
        title: 'Pride and Prejudice',
        author: 'Jane Austen',
        coverUrl: 'https://covers.openlibrary.org/b/id/8409593-M.jpg',
        key: '/works/OL6037022W',
        firstPublishYear: '1813'
      },
      {
        title: 'The Notebook',
        author: 'Nicholas Sparks',
        coverUrl: 'https://covers.openlibrary.org/b/id/8117395-M.jpg',
        key: '/works/OL15933W',
        firstPublishYear: '1996'
      },
      {
        title: 'Outlander',
        author: 'Diana Gabaldon',
        coverUrl: 'https://covers.openlibrary.org/b/id/8514426-M.jpg',
        key: '/works/OL45883W',
        firstPublishYear: '1991'
      },
      {
        title: 'Me Before You',
        author: 'Jojo Moyes',
        coverUrl: 'https://covers.openlibrary.org/b/id/8477139-M.jpg',
        key: '/works/OL15933W',
        firstPublishYear: '2012'
      }
    ],
    mysterious: [
      {
        title: 'The Girl with the Dragon Tattoo',
        author: 'Stieg Larsson',
        coverUrl: 'https://covers.openlibrary.org/b/id/8869350-M.jpg',
        key: '/works/OL5854416W',
        firstPublishYear: '2005'
      },
      {
        title: 'Gone Girl',
        author: 'Gillian Flynn',
        coverUrl: 'https://covers.openlibrary.org/b/id/7895298-M.jpg',
        key: '/works/OL16809501W',
        firstPublishYear: '2012'
      },
      {
        title: 'The Da Vinci Code',
        author: 'Dan Brown',
        coverUrl: 'https://covers.openlibrary.org/b/id/8514426-M.jpg',
        key: '/works/OL45883W',
        firstPublishYear: '2003'
      },
      {
        title: 'The Silent Patient',
        author: 'Alex Michaelides',
        coverUrl: 'https://covers.openlibrary.org/b/id/8477139-M.jpg',
        key: '/works/OL15933W',
        firstPublishYear: '2019'
      }
    ],
    thoughtful: [
      {
        title: 'Thinking, Fast and Slow',
        author: 'Daniel Kahneman',
        coverUrl: 'https://covers.openlibrary.org/b/id/7089298-M.jpg',
        key: '/works/OL16193932W',
        firstPublishYear: '2011'
      },
      {
        title: 'Sapiens',
        author: 'Yuval Noah Harari',
        coverUrl: 'https://covers.openlibrary.org/b/id/8233625-M.jpg',
        key: '/works/OL17323443W',
        firstPublishYear: '2011'
      },
      {
        title: 'Man\'s Search for Meaning',
        author: 'Viktor E. Frankl',
        coverUrl: 'https://covers.openlibrary.org/b/id/8514426-M.jpg',
        key: '/works/OL45883W',
        firstPublishYear: '1946'
      },
      {
        title: 'Quiet: The Power of Introverts',
        author: 'Susan Cain',
        coverUrl: 'https://covers.openlibrary.org/b/id/8477139-M.jpg',
        key: '/works/OL15933W',
        firstPublishYear: '2012'
      }
    ],
    fantasy: [
      {
        title: 'Harry Potter and the Sorcerer\'s Stone',
        author: 'J.K. Rowling',
        coverUrl: 'https://covers.openlibrary.org/b/id/8267857-M.jpg',
        key: '/works/OL82563W',
        firstPublishYear: '1997'
      },
      {
        title: 'A Game of Thrones',
        author: 'George R.R. Martin',
        coverUrl: 'https://covers.openlibrary.org/b/id/8758846-M.jpg',
        key: '/works/OL2163649W',
        firstPublishYear: '1996'
      },
      {
        title: 'The Name of the Wind',
        author: 'Patrick Rothfuss',
        coverUrl: 'https://covers.openlibrary.org/b/id/8514426-M.jpg',
        key: '/works/OL45883W',
        firstPublishYear: '2007'
      },
      {
        title: 'Mistborn: The Final Empire',
        author: 'Brandon Sanderson',
        coverUrl: 'https://covers.openlibrary.org/b/id/8477139-M.jpg',
        key: '/works/OL15933W',
        firstPublishYear: '2006'
      }
    ],
    motivated: [
      {
        title: 'Atomic Habits',
        author: 'James Clear',
        coverUrl: 'https://covers.openlibrary.org/b/id/8302489-M.jpg',
        key: '/works/OL19968973W',
        firstPublishYear: '2018'
      },
      {
        title: 'The 7 Habits of Highly Effective People',
        author: 'Stephen R. Covey',
        coverUrl: 'https://covers.openlibrary.org/b/id/8759896-M.jpg',
        key: '/works/OL2163649W',
        firstPublishYear: '1989'
      },
      {
        title: 'Mindset: The New Psychology of Success',
        author: 'Carol S. Dweck',
        coverUrl: 'https://covers.openlibrary.org/b/id/8514426-M.jpg',
        key: '/works/OL45883W',
        firstPublishYear: '2006'
      },
      {
        title: 'Grit: The Power of Passion and Perseverance',
        author: 'Angela Duckworth',
        coverUrl: 'https://covers.openlibrary.org/b/id/8477139-M.jpg',
        key: '/works/OL15933W',
        firstPublishYear: '2016'
      }
    ]
  };

  // Return books for the specified mood or a default set
  return moodBooks[mood] || [
    {
      title: 'To Kill a Mockingbird',
      author: 'Harper Lee',
      coverUrl: 'https://covers.openlibrary.org/b/id/8759597-M.jpg',
      key: '/works/OL45883W',
      firstPublishYear: '1960'
    },
    {
      title: '1984',
      author: 'George Orwell',
      coverUrl: 'https://covers.openlibrary.org/b/id/8575741-M.jpg',
      key: '/works/OL15933W',
      firstPublishYear: '1949'
    }
  ];
};

// Get fallback works for an author
export const getFallbackWorks = (authorName) => {
  // Try exact match first
  if (sampleWorks[authorName]) {
    return sampleWorks[authorName];
  }
  
  // Try case-insensitive match
  const lowerName = authorName.toLowerCase();
  for (const [key, works] of Object.entries(sampleWorks)) {
    if (key.toLowerCase() === lowerName) {
      return works;
    }
  }
  
  // Try partial match
  for (const [key, works] of Object.entries(sampleWorks)) {
    if (key.toLowerCase().includes(lowerName) || lowerName.includes(key.toLowerCase())) {
      return works;
    }
  }
  
  // Return empty array if no match found
  return [];
};

export default {
  popularAuthors,
  sampleWorks,
  getFallbackAuthor,
  getFallbackWorks
};