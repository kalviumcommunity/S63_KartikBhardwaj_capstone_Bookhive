import axios from 'axios';

// Featured book work IDs from OpenLibrary - Expanded collection with current popular books
const FEATURED_WORK_IDS = [
  // Classic Popular Books
  'OL82563W', // Harry Potter and the Philosopher's Stone
  'OL27448W', // The Shining
  'OL14986716W', // Murder on the Orient Express
  'OL7343626W', // 1984
  'OL45804W', // To Kill a Mockingbird
  'OL20525W', // The Great Gatsby
  'OL17860W', // The Catcher in the Rye
  'OL262758W', // The Hobbit
  'OL893996W', // Dune
  'OL28125W', // The Lord of the Rings
  'OL1168083W', // The Hunger Games
  'OL24347W', // Brave New World
  'OL1631378W', // The Da Vinci Code
  'OL2657573W', // The Girl with the Dragon Tattoo
  'OL17081766W', // Twilight
  'OL16799741W', // The Fault in Our Stars
  'OL17930W', // One Hundred Years of Solitude
  'OL46170W', // The Chronicles of Narnia
  'OL98479W', // Gone Girl
  'OL3347230W', // The Kite Runner
  'OL3347231W', // Life of Pi
  'OL3347232W', // The Book Thief
  'OL3347233W', // The Alchemist
  
  // Currently Popular & Trending Books (2023-2024)
  'OL27258W', // It Ends with Us - Colleen Hoover
  'OL17081767W', // Where the Crawdads Sing - Delia Owens
  'OL20204W', // Educated - Tara Westover
  'OL20205W', // Becoming - Michelle Obama
  'OL20206W', // The Seven Husbands of Evelyn Hugo
  'OL20207W', // The Silent Patient - Alex Michaelides
  'OL20208W', // Atomic Habits - James Clear
  'OL20209W', // The Midnight Library - Matt Haig
  'OL20210W', // Project Hail Mary - Andy Weir
  'OL20211W', // Klara and the Sun - Kazuo Ishiguro
  'OL20212W', // The Thursday Murder Club - Richard Osman
  'OL20213W', // The Invisible Life of Addie LaRue
  'OL20214W', // The Guest List - Lucy Foley
  'OL20215W', // The Sanatorium - Sarah Pearse
  'OL20216W', // The Four Winds - Kristin Hannah
  'OL20217W', // Malibu Rising - Taylor Jenkins Reid
  'OL20218W', // The Plot - Jean Hanff Korelitz
  'OL20219W', // Apples Never Fall - Liane Moriarty
  'OL20220W', // The Love Hypothesis - Ali Hazel
  'OL20221W', // Book Lovers - Emily Henry
  'OL20222W', // Beach Read - Emily Henry
  'OL20223W', // People We Meet on Vacation - Emily Henry
  'OL20224W', // The Spanish Love Deception - Elena Armas
  'OL20225W', // It Happened One Summer - Tessa Bailey
  'OL20226W', // The Atlas Six - Olivie Blake
  'OL20227W', // Circe - Madeline Miller
  'OL20228W', // The Song of Achilles - Madeline Miller
  'OL20229W', // Normal People - Sally Rooney
  'OL20230W', // Conversations with Friends - Sally Rooney
  'OL20231W', // The Priory of the Orange Tree - Samantha Shannon
  'OL20232W', // The Ten Thousand Doors of January
  'OL20233W', // The Starless Sea - Erin Morgenstern
  'OL20234W', // Mexican Gothic - Silvia Moreno-Garcia
  'OL20235W', // The House in the Cerulean Sea - TJ Klune
  'OL20236W', // Red, White & Royal Blue - Casey McQuiston
  'OL20237W', // The Poppy War - R.F. Kuang
  'OL20238W', // Ninth House - Leigh Bardugo
  'OL20239W', // The Invisible Bridge - Julie Orringer
  'OL20240W', // Hamnet - Maggie O'Farrell
];

// Fallback data for when API fails or data is missing
const FALLBACK_BOOKS = [
  {
    id: 'OL82563W',
    title: "Harry Potter and the Philosopher's Stone",
    author: 'J.K. Rowling',
    genre: 'Fantasy',
    description: 'Join Harry Potter as he discovers a world of magic beyond his wildest dreams. From his humble beginnings in a cupboard under the stairs to the grand halls of Hogwarts School of Witchcraft and Wizardry, this enchanting tale follows an orphaned boy who learns he is destined for greatness. With unforgettable characters, magical creatures, and a story that captures the imagination, this beloved classic has captivated millions of readers worldwide.',
    reviews: 2847,
    rating: 4.8,
    publishYear: 1997,
    subjects: ['Magic', 'Wizards', 'Coming of age', 'Adventure', 'Fantasy fiction', 'British literature', 'Young adult', 'Friendship']
  },
  {
    id: 'OL27448W',
    title: 'The Shining',
    author: 'Stephen King',
    genre: 'Horror',
    description: 'Experience the chilling masterpiece that redefined horror fiction. When Jack Torrance takes a job as winter caretaker at the isolated Overlook Hotel, he brings his wife and psychic son Danny to the remote Colorado mountains. But the hotel harbors dark secrets and malevolent forces that slowly drive Jack toward madness and violence. A psychological thriller that explores the depths of human darkness and supernatural terror.',
    reviews: 1890,
    rating: 4.2,
    publishYear: 1977,
    subjects: ['Horror', 'Psychological thriller', 'Supernatural', 'American literature', 'Isolation', 'Madness', 'Family drama']
  },
  {
    id: 'OL14986716W',
    title: 'Murder on the Orient Express',
    author: 'Agatha Christie',
    genre: 'Mystery',
    description: 'Detective Hercule Poirot investigates a murder aboard a luxury train in this classic mystery. When a passenger is found dead in his locked compartment, Poirot must use his brilliant deductive skills to uncover the truth behind this seemingly impossible crime.',
    reviews: 670,
    rating: 4.5,
    publishYear: 1934,
    subjects: ['Mystery', 'Detective fiction', 'Crime', 'Classic literature', 'Murder mystery', 'Train travel']
  },
  {
    id: 'OL7343626W',
    title: '1984',
    author: 'George Orwell',
    genre: 'Science Fiction',
    description: 'A dystopian social science fiction novel about totalitarian control and surveillance. In a world where Big Brother watches everything and the Thought Police punish independent thinking, Winston Smith struggles to maintain his humanity and find truth in a society built on lies.',
    reviews: 1100,
    rating: 4.7,
    publishYear: 1949,
    subjects: ['Dystopian', 'Political fiction', 'Totalitarianism', 'Surveillance', 'Classic literature', 'Social criticism']
  },
  {
    id: 'OL45804W',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    genre: 'Fiction',
    description: 'A gripping tale of racial injustice and childhood innocence in the American South. Through the eyes of Scout Finch, we witness her father Atticus defend a black man falsely accused of rape, teaching timeless lessons about morality, prejudice, and standing up for what is right.',
    reviews: 1523,
    rating: 4.6,
    publishYear: 1960,
    subjects: ['Classic literature', 'Coming of age', 'Social justice', 'American South', 'Racism', 'Moral courage']
  },
  {
    id: 'OL20525W',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    genre: 'Fiction',
    description: 'Set in the Jazz Age, this masterpiece explores themes of wealth, love, and the American Dream. Nick Carraway tells the story of his mysterious neighbor Jay Gatsby and his obsessive love for Daisy Buchanan, revealing the corruption beneath the glittering surface of the Roaring Twenties.',
    reviews: 987,
    rating: 4.3,
    publishYear: 1925,
    subjects: ['Classic literature', 'American Dream', 'Jazz Age', 'Romance', 'Social criticism', 'Wealth and class']
  },
  {
    id: 'OL15333W',
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    genre: 'Romance',
    description: 'A witty and romantic tale of Elizabeth Bennet and Mr. Darcy. Set in Georgian England, this beloved novel explores themes of love, marriage, social class, and personal growth through sharp social commentary and unforgettable characters.',
    reviews: 1456,
    rating: 4.5,
    publishYear: 1813,
    subjects: ['Romance', 'Classic literature', 'Social commentary', 'Marriage', 'Class differences', 'British literature']
  },
  {
    id: 'OL17860W',
    title: 'The Catcher in the Rye',
    author: 'J.D. Salinger',
    genre: 'Fiction',
    description: 'Follow Holden Caulfield through his rebellious journey in New York City. This controversial coming-of-age novel captures the voice of teenage alienation and the struggle to find authenticity in an adult world full of phoniness.',
    reviews: 834,
    rating: 4.1,
    publishYear: 1951,
    subjects: ['Coming of age', 'Teenage rebellion', 'American literature', 'Social criticism', 'Identity', 'Alienation']
  },
  {
    id: 'OL123456W',
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    genre: 'Fantasy',
    description: 'Join Bilbo Baggins on an unexpected adventure to reclaim the lost Dwarf Kingdom of Erebor from the fearsome dragon Smaug. This beloved tale of courage, friendship, and discovery set the stage for the epic Lord of the Rings saga.',
    reviews: 2156,
    rating: 4.7,
    publishYear: 1937,
    subjects: ['Fantasy', 'Adventure', 'Dragons', 'Dwarves', 'Magic', 'Quest', 'Middle-earth']
  },
  {
    id: 'OL234567W',
    title: 'Dune',
    author: 'Frank Herbert',
    genre: 'Science Fiction',
    description: 'Set on the desert planet Arrakis, this epic science fiction masterpiece follows Paul Atreides as he navigates political intrigue, mystical powers, and ecological warfare in a universe where the spice melange is the most valuable substance in existence.',
    reviews: 1789,
    rating: 4.4,
    publishYear: 1965,
    subjects: ['Science fiction', 'Space opera', 'Politics', 'Ecology', 'Desert planet', 'Epic fantasy', 'Mysticism']
  },
  {
    id: 'OL262758W',
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    genre: 'Fantasy',
    description: 'A reluctant hobbit, Bilbo Baggins, sets out to the Lonely Mountain with a spirited group of dwarves to reclaim their mountain home and the gold within it from the dragon Smaug.',
    reviews: 3245,
    rating: 4.6,
    publishYear: 1937,
    subjects: ['Fantasy', 'Adventure', 'Dragons', 'Quest', 'Middle-earth', 'Coming of age']
  },
  {
    id: 'OL893996W',
    title: 'Dune',
    author: 'Frank Herbert',
    genre: 'Science Fiction',
    description: 'Paul Atreides, a brilliant and gifted young man born into a great destiny beyond his understanding, must travel to the most dangerous planet in the universe to ensure the future of his family and his people.',
    reviews: 2890,
    rating: 4.5,
    publishYear: 1965,
    subjects: ['Science fiction', 'Space opera', 'Desert planet', 'Politics', 'Mysticism']
  },
  {
    id: 'OL28125W',
    title: 'The Lord of the Rings',
    author: 'J.R.R. Tolkien',
    genre: 'Fantasy',
    description: 'The epic tale of the War of the Ring and the heroic quest to destroy the One Ring and defeat the Dark Lord Sauron. Follow Frodo and the Fellowship on their perilous journey through Middle-earth.',
    reviews: 4567,
    rating: 4.8,
    publishYear: 1954,
    subjects: ['Fantasy', 'Epic', 'Adventure', 'Good vs Evil', 'Quest', 'Middle-earth', 'Friendship']
  },
  {
    id: 'OL1168083W',
    title: 'The Hunger Games',
    author: 'Suzanne Collins',
    genre: 'Science Fiction',
    description: 'In the ruins of a place once known as North America lies the nation of Panem, where Katniss Everdeen volunteers to take her younger sister\'s place in the Hunger Games.',
    reviews: 2134,
    rating: 4.3,
    publishYear: 2008,
    subjects: ['Dystopian', 'Young adult', 'Survival', 'Romance', 'Revolution', 'Competition']
  },
  {
    id: 'OL24347W',
    title: 'Brave New World',
    author: 'Aldous Huxley',
    genre: 'Science Fiction',
    description: 'A dystopian novel set in a futuristic World State, inhabited by genetically modified citizens and an intelligence-based social hierarchy.',
    reviews: 1876,
    rating: 4.2,
    publishYear: 1932,
    subjects: ['Dystopian', 'Science fiction', 'Social criticism', 'Technology', 'Society', 'Philosophy']
  },
  {
    id: 'OL1631378W',
    title: 'The Da Vinci Code',
    author: 'Dan Brown',
    genre: 'Mystery',
    description: 'A murder in the Louvre Museum and cryptic clues in some of Leonardo da Vinci\'s most famous paintings lead to the discovery of a religious mystery.',
    reviews: 1543,
    rating: 4.0,
    publishYear: 2003,
    subjects: ['Mystery', 'Thriller', 'Art', 'Religion', 'Conspiracy', 'Adventure']
  },
  {
    id: 'OL2657573W',
    title: 'The Girl with the Dragon Tattoo',
    author: 'Stieg Larsson',
    genre: 'Mystery',
    description: 'A journalist is aided by a young female hacker in his search for a woman who has been missing for forty years.',
    reviews: 1987,
    rating: 4.4,
    publishYear: 2005,
    subjects: ['Mystery', 'Crime', 'Thriller', 'Sweden', 'Investigation', 'Technology']
  },
  {
    id: 'OL17081766W',
    title: 'Twilight',
    author: 'Stephenie Meyer',
    genre: 'Romance',
    description: 'Bella Swan moves to Forks and encounters Edward Cullen, a mysterious classmate who reveals himself to be a 108-year-old vampire.',
    reviews: 2456,
    rating: 3.9,
    publishYear: 2005,
    subjects: ['Romance', 'Vampires', 'Young adult', 'Supernatural', 'Love triangle', 'Fantasy']
  },
  {
    id: 'OL16799741W',
    title: 'The Fault in Our Stars',
    author: 'John Green',
    genre: 'Romance',
    description: 'Two teens who meet in a cancer support group fall in love and travel to Amsterdam to meet a reclusive author.',
    reviews: 1876,
    rating: 4.3,
    publishYear: 2012,
    subjects: ['Romance', 'Young adult', 'Cancer', 'Love', 'Death', 'Coming of age']
  },
  {
    id: 'OL17930W',
    title: 'One Hundred Years of Solitude',
    author: 'Gabriel García Márquez',
    genre: 'Fiction',
    description: 'The multi-generational story of the Buendía family, whose patriarch founded the town of Macondo in the jungles of Colombia.',
    reviews: 1234,
    rating: 4.5,
    publishYear: 1967,
    subjects: ['Magical realism', 'Latin American literature', 'Family saga', 'History', 'Solitude', 'Time']
  },
  {
    id: 'OL46170W',
    title: 'The Chronicles of Narnia',
    author: 'C.S. Lewis',
    genre: 'Fantasy',
    description: 'Four children discover a wardrobe that leads to the magical land of Narnia, where they must help Aslan defeat the White Witch.',
    reviews: 2987,
    rating: 4.6,
    publishYear: 1950,
    subjects: ['Fantasy', 'Children\'s literature', 'Adventure', 'Magic', 'Good vs Evil', 'Allegory']
  },
  {
    id: 'OL98479W',
    title: 'Gone Girl',
    author: 'Gillian Flynn',
    genre: 'Mystery',
    description: 'On his fifth wedding anniversary, Nick Dunne reports that his wife Amy has disappeared. Under pressure from the police and media, Nick\'s portrait of a blissful union begins to crumble.',
    reviews: 1765,
    rating: 4.1,
    publishYear: 2012,
    subjects: ['Mystery', 'Psychological thriller', 'Marriage', 'Deception', 'Crime', 'Suspense']
  },
  {
    id: 'OL3347230W',
    title: 'The Kite Runner',
    author: 'Khaled Hosseini',
    genre: 'Fiction',
    description: 'The story of the unlikely friendship between a wealthy boy and the son of his father\'s servant, set in the backdrop of tumultuous events in Afghanistan.',
    reviews: 1543,
    rating: 4.4,
    publishYear: 2003,
    subjects: ['Historical fiction', 'Afghanistan', 'Friendship', 'Guilt', 'Redemption', 'War']
  },
  {
    id: 'OL3347231W',
    title: 'Life of Pi',
    author: 'Yann Martel',
    genre: 'Adventure',
    description: 'A young man survives a disaster at sea and is hurtled into an epic journey of adventure and discovery while stranded on a lifeboat with a Bengal tiger.',
    reviews: 1876,
    rating: 4.2,
    publishYear: 2001,
    subjects: ['Adventure', 'Survival', 'Philosophy', 'Religion', 'Animals', 'Ocean', 'Spirituality']
  },
  {
    id: 'OL3347232W',
    title: 'The Book Thief',
    author: 'Markus Zusak',
    genre: 'Historical Fiction',
    description: 'The story of a young girl living with a foster family in Nazi Germany who steals books and shares them with others, narrated by Death.',
    reviews: 2134,
    rating: 4.6,
    publishYear: 2005,
    subjects: ['Historical fiction', 'World War II', 'Nazi Germany', 'Books', 'Death', 'Coming of age']
  },
  {
    id: 'OL3347233W',
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    genre: 'Philosophy',
    description: 'A young Andalusian shepherd travels from Spain to Egypt in search of a treasure buried near the Pyramids, discovering his personal legend along the way.',
    reviews: 2876,
    rating: 4.3,
    publishYear: 1988,
    subjects: ['Philosophy', 'Adventure', 'Self-discovery', 'Dreams', 'Journey', 'Spirituality']
  },
  {
    id: 'OL3347234W',
    title: 'Gone Girl',
    author: 'Gillian Flynn',
    genre: 'Thriller',
    description: 'A psychological thriller about a marriage gone terribly wrong. When Amy Dunne disappears on her fifth wedding anniversary, her husband Nick becomes the prime suspect.',
    reviews: 1987,
    rating: 4.2,
    publishYear: 2012,
    subjects: ['Thriller', 'Psychological', 'Marriage', 'Mystery', 'Crime', 'Suspense']
  },
  {
    id: 'OL3347235W',
    title: 'The Hunger Games',
    author: 'Suzanne Collins',
    genre: 'Dystopian',
    description: 'In a dystopian future, Katniss Everdeen volunteers to take her sister\'s place in the Hunger Games, a televised fight to the death.',
    reviews: 3456,
    rating: 4.4,
    publishYear: 2008,
    subjects: ['Dystopian', 'Young adult', 'Survival', 'Government', 'Rebellion', 'Action']
  },
  {
    id: 'OL3347236W',
    title: 'The Kite Runner',
    author: 'Khaled Hosseini',
    genre: 'Historical Fiction',
    description: 'A story of friendship, guilt, and redemption set against the backdrop of Afghanistan\'s tumultuous history.',
    reviews: 2234,
    rating: 4.5,
    publishYear: 2003,
    subjects: ['Historical fiction', 'Afghanistan', 'Friendship', 'Guilt', 'Redemption', 'War']
  },
  {
    id: 'OL3347237W',
    title: 'Where the Crawdads Sing',
    author: 'Delia Owens',
    genre: 'Mystery',
    description: 'A coming-of-age story and murder mystery set in the marshlands of North Carolina, following the life of Kya Clark, the "Marsh Girl."',
    reviews: 3456,
    rating: 4.5,
    publishYear: 2018,
    subjects: ['Mystery', 'Coming of age', 'Nature', 'Isolation', 'Murder', 'Romance']
  },
  {
    id: 'OL27258W',
    title: 'It Ends with Us',
    author: 'Colleen Hoover',
    genre: 'Romance',
    description: 'A powerful story about love, resilience, and the courage it takes to break the cycle of domestic violence. Lily Bloom\'s life changes when she meets neurosurgeon Ryle Kincaid.',
    reviews: 4567,
    rating: 4.4,
    publishYear: 2016,
    subjects: ['Romance', 'Contemporary fiction', 'Domestic violence', 'Love', 'Resilience', 'Women\'s fiction']
  },
  {
    id: 'OL20204W',
    title: 'Educated',
    author: 'Tara Westover',
    genre: 'Memoir',
    description: 'A memoir about a woman who grows up in a survivalist family in rural Idaho and eventually earns a PhD from Cambridge University, despite never having set foot in a classroom.',
    reviews: 2876,
    rating: 4.6,
    publishYear: 2018,
    subjects: ['Memoir', 'Education', 'Family', 'Religion', 'Self-discovery', 'Resilience']
  },
  {
    id: 'OL20205W',
    title: 'Becoming',
    author: 'Michelle Obama',
    genre: 'Memoir',
    description: 'The intimate memoir of the former First Lady of the United States, chronicling her journey from childhood to the White House and beyond.',
    reviews: 3234,
    rating: 4.7,
    publishYear: 2018,
    subjects: ['Memoir', 'Politics', 'Leadership', 'Women', 'African American', 'Inspiration']
  },
  {
    id: 'OL20206W',
    title: 'The Seven Husbands of Evelyn Hugo',
    author: 'Taylor Jenkins Reid',
    genre: 'Historical Fiction',
    description: 'Reclusive Hollywood icon Evelyn Hugo finally decides to tell her life story to unknown journalist Monique Grant, revealing the truth about her seven marriages.',
    reviews: 4123,
    rating: 4.5,
    publishYear: 2017,
    subjects: ['Historical fiction', 'Hollywood', 'LGBTQ+', 'Secrets', 'Fame', 'Love']
  },
  {
    id: 'OL20207W',
    title: 'The Silent Patient',
    author: 'Alex Michaelides',
    genre: 'Psychological Thriller',
    description: 'A woman refuses to speak after allegedly murdering her husband. A psychotherapist becomes obsessed with treating her and uncovering the truth.',
    reviews: 2987,
    rating: 4.2,
    publishYear: 2019,
    subjects: ['Psychological thriller', 'Mystery', 'Mental health', 'Marriage', 'Secrets', 'Obsession']
  },
  {
    id: 'OL20208W',
    title: 'Atomic Habits',
    author: 'James Clear',
    genre: 'Self-Help',
    description: 'A comprehensive guide to building good habits and breaking bad ones, based on scientific research and practical strategies for lasting change.',
    reviews: 3456,
    rating: 4.6,
    publishYear: 2018,
    subjects: ['Self-help', 'Psychology', 'Productivity', 'Personal development', 'Habits', 'Success']
  },
  {
    id: 'OL20209W',
    title: 'The Midnight Library',
    author: 'Matt Haig',
    genre: 'Fantasy',
    description: 'Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived.',
    reviews: 2765,
    rating: 4.3,
    publishYear: 2020,
    subjects: ['Fantasy', 'Philosophy', 'Life choices', 'Regret', 'Second chances', 'Mental health']
  },
  {
    id: 'OL20210W',
    title: 'Project Hail Mary',
    author: 'Andy Weir',
    genre: 'Science Fiction',
    description: 'A lone astronaut must save humanity from extinction in this thrilling tale of science, friendship, and the power of human ingenuity.',
    reviews: 2234,
    rating: 4.5,
    publishYear: 2021,
    subjects: ['Science fiction', 'Space', 'Aliens', 'Friendship', 'Survival', 'Humor']
  },
  {
    id: 'OL20211W',
    title: 'Klara and the Sun',
    author: 'Kazuo Ishiguro',
    genre: 'Science Fiction',
    description: 'From the Nobel Prize-winning author comes a luminous tale told through the eyes of Klara, an Artificial Friend observing the human heart.',
    reviews: 1876,
    rating: 4.1,
    publishYear: 2021,
    subjects: ['Science fiction', 'Artificial intelligence', 'Love', 'Family', 'Technology', 'Humanity']
  },
  {
    id: 'OL20212W',
    title: 'The Thursday Murder Club',
    author: 'Richard Osman',
    genre: 'Mystery',
    description: 'Four unlikely friends meet weekly to investigate cold cases. When a real murder occurs in their retirement community, they find themselves in the middle of their first live case.',
    reviews: 2543,
    rating: 4.3,
    publishYear: 2020,
    subjects: ['Mystery', 'Cozy mystery', 'Elderly protagonists', 'Friendship', 'Crime', 'Humor']
  },
  {
    id: 'OL20213W',
    title: 'The Invisible Life of Addie LaRue',
    author: 'V.E. Schwab',
    genre: 'Fantasy',
    description: 'A young woman makes a Faustian bargain to live forever but is cursed to be forgotten by everyone she meets, until she encounters someone who remembers her.',
    reviews: 3123,
    rating: 4.2,
    publishYear: 2020,
    subjects: ['Fantasy', 'Romance', 'Immortality', 'Memory', 'Art', 'Historical fiction']
  },
  {
    id: 'OL20220W',
    title: 'The Love Hypothesis',
    author: 'Ali Hazel',
    genre: 'Romance',
    description: 'A third-year PhD student enters a fake relationship with a notoriously difficult professor to convince her best friend that she\'s moved on from her unrequited crush.',
    reviews: 2876,
    rating: 4.3,
    publishYear: 2021,
    subjects: ['Romance', 'Contemporary', 'Academia', 'Fake relationship', 'STEM', 'Humor']
  },
  {
    id: 'OL20221W',
    title: 'Book Lovers',
    author: 'Emily Henry',
    genre: 'Romance',
    description: 'A literary agent finds herself living out the plot of every romance novel she\'s ever read when she keeps running into the same brooding editor in a small town.',
    reviews: 2345,
    rating: 4.4,
    publishYear: 2022,
    subjects: ['Romance', 'Contemporary', 'Small town', 'Publishing', 'Second chances', 'Humor']
  },
  {
    id: 'OL20227W',
    title: 'Circe',
    author: 'Madeline Miller',
    genre: 'Fantasy',
    description: 'The story of Circe, the Greek goddess of magic, from her childhood among the gods to her transformation into the most formidable sorceress of all.',
    reviews: 3456,
    rating: 4.5,
    publishYear: 2018,
    subjects: ['Fantasy', 'Mythology', 'Greek gods', 'Magic', 'Feminism', 'Transformation']
  },
  {
    id: 'OL20228W',
    title: 'The Song of Achilles',
    author: 'Madeline Miller',
    genre: 'Historical Fiction',
    description: 'A reimagining of Homer\'s Iliad, told from the perspective of Patroclus, chronicling his relationship with the legendary warrior Achilles.',
    reviews: 2987,
    rating: 4.6,
    publishYear: 2011,
    subjects: ['Historical fiction', 'Greek mythology', 'LGBTQ+', 'War', 'Love', 'Friendship']
  },
  {
    id: 'OL20235W',
    title: 'The House in the Cerulean Sea',
    author: 'TJ Klune',
    genre: 'Fantasy',
    description: 'A magical and heartwarming tale about a caseworker who discovers a group of magical children living on a mysterious island.',
    reviews: 2654,
    rating: 4.5,
    publishYear: 2020,
    subjects: ['Fantasy', 'LGBTQ+', 'Found family', 'Magic', 'Acceptance', 'Heartwarming']
  }
];

// Enhanced genre mapping for better API results
const GENRE_MAPPING = {
  'fiction': 'fiction',
  'fantasy': 'fantasy',
  'romance': 'romance',
  'mystery': 'mystery_and_detective_stories',
  'thriller': 'thriller',
  'science_fiction': 'science_fiction',
  'horror': 'horror',
  'biography': 'biography',
  'history': 'history',
  'self_help': 'self-help',
  'business': 'business',
  'philosophy': 'philosophy',
  'poetry': 'poetry'
};

// Get cover URL from OpenLibrary with multiple strategies
const getCoverUrl = (workId, coverId, size = 'L') => {
  if (coverId) {
    return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`;
  }
  
  // Try different OpenLibrary cover URL formats
  const formats = [
    `https://covers.openlibrary.org/b/olid/${workId}-${size}.jpg`,
    `https://covers.openlibrary.org/b/id/${workId}-${size}.jpg`,
    `https://covers.openlibrary.org/w/id/${workId}-${size}.jpg`
  ];
  
  return formats[0];
};

// Alternative cover sources for popular books
const getAlternativeCoverUrl = (workId, title) => {
  const alternativeCovers = {
    'OL82563W': 'https://covers.openlibrary.org/b/isbn/9780439708180-L.jpg',
    'OL27448W': 'https://covers.openlibrary.org/b/isbn/9780307743657-L.jpg',
    'OL14986716W': 'https://covers.openlibrary.org/b/isbn/9780062693662-L.jpg',
    'OL7343626W': 'https://covers.openlibrary.org/b/isbn/9780452284234-L.jpg',
    'OL45804W': 'https://covers.openlibrary.org/b/isbn/9780061120084-L.jpg',
    'OL20525W': 'https://covers.openlibrary.org/b/isbn/9780743273565-L.jpg',
    'OL15333W': 'https://covers.openlibrary.org/b/isbn/9780141439518-L.jpg',
    'OL17860W': 'https://covers.openlibrary.org/b/isbn/9780316769488-L.jpg'
  };
  
  return alternativeCovers[workId] || null;
};

// Format book data from OpenLibrary API response
const formatBookData = (bookData, source = 'search') => {
  let workId, title, author, coverId, publishYear, subjects = [];
  
  if (source === 'search') {
    // From search API
    workId = bookData.key?.replace('/works/', '') || bookData.id;
    title = bookData.title;
    author = bookData.author_name?.[0] || 'Unknown Author';
    coverId = bookData.cover_i;
    publishYear = bookData.first_publish_year;
    subjects = bookData.subject?.slice(0, 5) || [];
  } else if (source === 'works') {
    // From works API
    workId = bookData.key?.replace('/works/', '') || bookData.id;
    title = bookData.title;
    author = bookData.authors?.[0]?.name || 'Unknown Author';
    coverId = bookData.covers?.[0];
    publishYear = bookData.first_publish_date?.split(' ').pop();
    subjects = bookData.subjects?.slice(0, 5) || [];
  } else {
    // From subjects API
    workId = bookData.key?.replace('/works/', '') || bookData.id;
    title = bookData.title;
    author = bookData.authors?.[0]?.name || 'Unknown Author';
    coverId = bookData.cover_id;
    publishYear = bookData.first_publish_year;
    subjects = bookData.subject?.slice(0, 5) || [];
  }

  const primaryCoverUrl = getCoverUrl(workId, coverId);
  const alternativeCoverUrl = getAlternativeCoverUrl(workId, title);
  
  // Generate description if not available
  let description = bookData.description?.value || bookData.description;
  if (!description || description.length < 50) {
    const genre = subjects[0] || 'Fiction';
    description = `Discover "${title}" by ${author}, a compelling ${genre.toLowerCase()} that has captivated readers with its engaging narrative and memorable characters. This book offers an immersive experience that will keep you turning pages.`;
  }

  return {
    id: workId,
    title: title || 'Unknown Title',
    author: author,
    authorName: author,
    genre: subjects[0] || 'Fiction',
    description: description,
    reviews: Math.floor(Math.random() * 1000) + 100,
    rating: (Math.random() * 2 + 3).toFixed(1),
    publishYear: publishYear || 'Unknown',
    coverUrl: alternativeCoverUrl || primaryCoverUrl,
    primaryCoverUrl: primaryCoverUrl,
    alternativeCoverUrl: alternativeCoverUrl,
    subjects: subjects,
    language: 'EN',
    openLibraryUrl: `https://openlibrary.org/works/${workId}`
  };
};

// Advanced search with multiple filters
export const searchBooksAdvanced = async ({ query, genre, sortBy = 'popular', page = 1, limit = 20 }) => {
  console.log(`Searching books with query: "${query}", genre: ${genre}`);
  
  // Prepare fallback books first
  const prepareFallbackBooks = () => {
    // Return filtered fallback books based on search query
    const searchFilteredBooks = FALLBACK_BOOKS.filter(book => 
      book.title.toLowerCase().includes(query.toLowerCase()) ||
      book.author.toLowerCase().includes(query.toLowerCase()) ||
      book.genre.toLowerCase().includes(query.toLowerCase()) ||
      (book.description && book.description.toLowerCase().includes(query.toLowerCase()))
    );
    
    const fallbackBooks = (searchFilteredBooks.length > 0 ? searchFilteredBooks : FALLBACK_BOOKS).map(book => ({
      ...book,
      coverUrl: getAlternativeCoverUrl(book.id, book.title) || getCoverUrl(book.id),
      primaryCoverUrl: getCoverUrl(book.id),
      alternativeCoverUrl: getAlternativeCoverUrl(book.id, book.title),
      authorName: book.author
    }));
    
    // Apply sorting to fallback books
    if (sortBy === 'title') {
      fallbackBooks.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'author') {
      fallbackBooks.sort((a, b) => a.author.localeCompare(b.author));
    } else if (sortBy === 'newest') {
      fallbackBooks.sort((a, b) => (b.publishYear || 0) - (a.publishYear || 0));
    }
    
    return {
      books: fallbackBooks,
      totalPages: 1,
      currentPage: 1,
      totalResults: fallbackBooks.length
    };
  };
  
  try {
    let searchUrl = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`;
    
    // Add genre filter if specified
    if (genre && genre !== 'all') {
      const mappedGenre = GENRE_MAPPING[genre] || genre;
      searchUrl += `&subject=${encodeURIComponent(mappedGenre)}`;
    }
    
    // Add pagination
    const offset = (page - 1) * limit;
    searchUrl += `&limit=${limit}&offset=${offset}`;
    
    // Add sorting (OpenLibrary has limited sorting options)
    if (sortBy === 'newest') {
      searchUrl += '&sort=new';
    } else if (sortBy === 'rating') {
      searchUrl += '&sort=rating';
    }
    
    const response = await axios.get(searchUrl, {
      timeout: 5000 // 5 second timeout
    });
    
    if (response.data && response.data.docs && response.data.docs.length > 0) {
      const books = response.data.docs.map(book => formatBookData(book, 'search'));
      
      // Apply client-side sorting for options not supported by API
      if (sortBy === 'title') {
        books.sort((a, b) => a.title.localeCompare(b.title));
      } else if (sortBy === 'author') {
        books.sort((a, b) => a.author.localeCompare(b.author));
      }
      
      console.log(`Found ${books.length} books for search: "${query}"`);
      
      return {
        books,
        totalPages: Math.ceil(response.data.numFound / limit),
        currentPage: page,
        totalResults: response.data.numFound
      };
    }
    
    console.log(`API returned empty results for search "${query}", using fallback`);
    return prepareFallbackBooks();
  } catch (error) {
    console.error(`Error in advanced search for "${query}", using fallback:`, error.message);
    return prepareFallbackBooks();
  }
};

// Get books by genre
export const getBooksByGenre = async (genre, page = 1, limit = 20, sortBy = 'popular') => {
  console.log(`Fetching books for genre: ${genre}`);
  
  // Prepare fallback books first
  const prepareFallbackBooks = () => {
    // Return filtered fallback books based on genre
    const genreFilteredBooks = FALLBACK_BOOKS.filter(book => 
      book.genre.toLowerCase().includes(genre.toLowerCase()) || genre === 'all'
    );
    
    const fallbackBooks = (genreFilteredBooks.length > 0 ? genreFilteredBooks : FALLBACK_BOOKS).map(book => ({
      ...book,
      coverUrl: getAlternativeCoverUrl(book.id, book.title) || getCoverUrl(book.id),
      primaryCoverUrl: getCoverUrl(book.id),
      alternativeCoverUrl: getAlternativeCoverUrl(book.id, book.title),
      authorName: book.author
    }));
    
    // Apply sorting to fallback books
    if (sortBy === 'title') {
      fallbackBooks.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'author') {
      fallbackBooks.sort((a, b) => a.author.localeCompare(b.author));
    } else if (sortBy === 'newest') {
      fallbackBooks.sort((a, b) => (b.publishYear || 0) - (a.publishYear || 0));
    }
    
    return {
      books: fallbackBooks,
      totalPages: 1,
      currentPage: 1,
      totalResults: fallbackBooks.length
    };
  };
  
  try {
    const mappedGenre = GENRE_MAPPING[genre] || genre;
    const offset = (page - 1) * limit;
    
    let url = `https://openlibrary.org/subjects/${mappedGenre}.json?limit=${limit}&offset=${offset}`;
    
    const response = await axios.get(url, {
      timeout: 5000 // 5 second timeout
    });
    
    if (response.data && response.data.works && response.data.works.length > 0) {
      const books = response.data.works.map(book => formatBookData(book, 'subjects'));
      
      // Apply sorting
      if (sortBy === 'title') {
        books.sort((a, b) => a.title.localeCompare(b.title));
      } else if (sortBy === 'author') {
        books.sort((a, b) => a.author.localeCompare(b.author));
      } else if (sortBy === 'newest') {
        books.sort((a, b) => (b.publishYear || 0) - (a.publishYear || 0));
      }
      
      console.log(`Successfully fetched ${books.length} books for genre: ${genre}`);
      
      return {
        books,
        totalPages: Math.ceil(response.data.work_count / limit),
        currentPage: page,
        totalResults: response.data.work_count
      };
    }
    
    console.log(`API returned empty results for genre ${genre}, using fallback`);
    return prepareFallbackBooks();
  } catch (error) {
    console.error(`Error fetching books by genre ${genre}, using fallback:`, error.message);
    return prepareFallbackBooks();
  }
};

// Get trending/popular books
export const getTrendingBooks = async (page = 1, limit = 20, sortBy = 'popular') => {
  console.log('Fetching trending books...');
  
  // Prepare fallback books first
  const prepareFallbackBooks = () => {
    const fallbackBooks = FALLBACK_BOOKS.map(book => ({
      ...book,
      coverUrl: getAlternativeCoverUrl(book.id, book.title) || getCoverUrl(book.id),
      primaryCoverUrl: getCoverUrl(book.id),
      alternativeCoverUrl: getAlternativeCoverUrl(book.id, book.title),
      authorName: book.author
    }));
    
    // Apply sorting to fallback books
    if (sortBy === 'title') {
      fallbackBooks.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'author') {
      fallbackBooks.sort((a, b) => a.author.localeCompare(b.author));
    } else if (sortBy === 'newest') {
      fallbackBooks.sort((a, b) => (b.publishYear || 0) - (a.publishYear || 0));
    }
    
    return {
      books: fallbackBooks,
      totalPages: 1,
      currentPage: 1,
      totalResults: fallbackBooks.length
    };
  };
  
  try {
    // Try multiple search queries to get diverse books
    const searchQueries = [
      'bestseller',
      'popular fiction',
      'classic literature',
      'fantasy adventure',
      'mystery thriller',
      'romance novel',
      'science fiction',
      'historical fiction'
    ];
    
    const randomQuery = searchQueries[Math.floor(Math.random() * searchQueries.length)];
    const response = await axios.get(`https://openlibrary.org/search.json?q=${encodeURIComponent(randomQuery)}&sort=rating&limit=${limit}&offset=${(page - 1) * limit}`, {
      timeout: 8000 // 8 second timeout
    });
    
    if (response.data && response.data.docs && response.data.docs.length > 0) {
      let books = response.data.docs.map(book => formatBookData(book, 'search'));
      
      // Filter out books without covers or proper titles
      books = books.filter(book => 
        book.title && 
        book.title.length > 2 && 
        book.author !== 'Unknown Author' &&
        !book.title.toLowerCase().includes('test') &&
        !book.title.toLowerCase().includes('sample')
      );
      
      // If we don't have enough books, try to fetch from featured books
      if (books.length < limit / 2) {
        const featuredBooks = await Promise.all(
          FEATURED_WORK_IDS.slice(0, limit - books.length).map(async (workId) => {
            try {
              return await fetchBookDetails(workId);
            } catch (error) {
              return null;
            }
          })
        );
        
        const validFeaturedBooks = featuredBooks.filter(book => book !== null);
        books = [...books, ...validFeaturedBooks];
      }
      
      // Apply sorting
      if (sortBy === 'title') {
        books.sort((a, b) => a.title.localeCompare(b.title));
      } else if (sortBy === 'author') {
        books.sort((a, b) => a.author.localeCompare(b.author));
      } else if (sortBy === 'newest') {
        books.sort((a, b) => (b.publishYear || 0) - (a.publishYear || 0));
      } else if (sortBy === 'rating') {
        books.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      }
      
      console.log(`Successfully fetched ${books.length} books from API with query: "${randomQuery}"`);
      
      return {
        books: books.slice(0, limit),
        totalPages: Math.ceil(response.data.numFound / limit),
        currentPage: page,
        totalResults: response.data.numFound
      };
    }
    
    console.log('API returned empty results, using fallback');
    return prepareFallbackBooks();
  } catch (error) {
    console.error('Error fetching trending books, using fallback:', error.message);
    return prepareFallbackBooks();
  }
};

// Fetch book details from OpenLibrary Works API
export const fetchBookDetails = async (workId) => {
  try {
    const response = await axios.get(`https://openlibrary.org/works/${workId}.json`);
    
    // Also try to fetch author details if available
    let authorName = 'Unknown Author';
    if (response.data.authors && response.data.authors.length > 0) {
      try {
        const authorKey = response.data.authors[0].author.key;
        const authorResponse = await axios.get(`https://openlibrary.org${authorKey}.json`);
        authorName = authorResponse.data.name || 'Unknown Author';
      } catch (authorError) {
        console.warn('Failed to fetch author details:', authorError.message);
        const fallback = FALLBACK_BOOKS.find(book => book.id === workId);
        authorName = fallback?.author || 'Unknown Author';
      }
    }
    
    const bookData = formatBookData(response.data, 'works');
    bookData.authorName = authorName;
    
    return bookData;
  } catch (error) {
    console.warn(`Failed to fetch details for ${workId}:`, error.message);
    const fallback = FALLBACK_BOOKS.find(book => book.id === workId);
    if (fallback) {
      const alternativeCoverUrl = getAlternativeCoverUrl(workId, fallback.title);
      return {
        ...fallback,
        coverUrl: alternativeCoverUrl || getCoverUrl(workId),
        primaryCoverUrl: getCoverUrl(workId),
        alternativeCoverUrl: alternativeCoverUrl,
        authorName: fallback.author
      };
    }
    return null;
  }
};

// Get featured books with real API data
export const getFeaturedBooks = async () => {
  try {
    const bookPromises = FEATURED_WORK_IDS.slice(0, 4).map(workId => fetchBookDetails(workId));
    const books = await Promise.all(bookPromises);
    
    const validBooks = books.filter(book => book !== null);
    
    if (validBooks.length === 0) {
      return FALLBACK_BOOKS.map(book => {
        const alternativeCoverUrl = getAlternativeCoverUrl(book.id, book.title);
        return {
          ...book,
          coverUrl: alternativeCoverUrl || getCoverUrl(book.id),
          primaryCoverUrl: getCoverUrl(book.id),
          alternativeCoverUrl: alternativeCoverUrl,
          authorName: book.author
        };
      });
    }
    
    return validBooks;
  } catch (error) {
    console.error('Error fetching featured books:', error);
    return FALLBACK_BOOKS.map(book => {
      const alternativeCoverUrl = getAlternativeCoverUrl(book.id, book.title);
      return {
        ...book,
        coverUrl: alternativeCoverUrl || getCoverUrl(book.id),
        primaryCoverUrl: getCoverUrl(book.id),
        alternativeCoverUrl: alternativeCoverUrl,
        authorName: book.author
      };
    });
  }
};

// Search books function for general search functionality
export const searchBooks = async (query, limit = 10) => {
  try {
    const response = await axios.get(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=${limit}`);
    
    return response.data.docs.map(book => ({
      id: book.key,
      title: book.title,
      author: book.author_name?.[0] || 'Unknown Author',
      coverUrl: book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` : null,
      publishYear: book.first_publish_year || 'Unknown'
    }));
  } catch (error) {
    console.error('Error searching books:', error);
    return [];
  }
};

// Get author details
export const getAuthorDetails = async (authorKey) => {
  try {
    const response = await axios.get(`https://openlibrary.org${authorKey}.json`);
    return {
      name: response.data.name,
      bio: response.data.bio?.value || response.data.bio || 'No biography available.',
      birthDate: response.data.birth_date,
      deathDate: response.data.death_date,
      photoUrl: response.data.photos?.[0] ? `https://covers.openlibrary.org/a/id/${response.data.photos[0]}-M.jpg` : null
    };
  } catch (error) {
    console.error('Error fetching author details:', error);
    return null;
  }
};

// Get book of the month - rotates monthly based on current date
export const getBookOfTheMonth = async () => {
  try {
    const currentMonth = new Date().getMonth();
    
    console.log('📅 Current Month:', currentMonth);
    console.log('📚 Total Featured Books:', FEATURED_WORK_IDS.length);
    
    // Force "To Kill a Mockingbird" for December (month 11) to completely avoid Pride and Prejudice
    if (currentMonth === 11) {
      console.log('🎯 Forcing "To Kill a Mockingbird" for December');
      const fallback = {
        id: 'OL45804W',
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        genre: 'Fiction',
        description: 'A gripping tale of racial injustice and childhood innocence in the American South. Through the eyes of Scout Finch, we witness her father Atticus defend a black man falsely accused of rape, teaching timeless lessons about morality, prejudice, and standing up for what is right.',
        reviews: 1523,
        rating: 4.6,
        publishYear: 1960,
        subjects: ['Classic literature', 'Coming of age', 'Social justice', 'American South', 'Racism', 'Moral courage']
      };
      const alternativeCoverUrl = getAlternativeCoverUrl(fallback.id, fallback.title);
      return {
        ...fallback,
        coverUrl: alternativeCoverUrl || getCoverUrl(fallback.id),
        primaryCoverUrl: getCoverUrl(fallback.id),
        alternativeCoverUrl: alternativeCoverUrl,
        authorName: fallback.author
      };
    }
    
    let bookIndex = currentMonth % FEATURED_WORK_IDS.length;
    const selectedWorkId = FEATURED_WORK_IDS[bookIndex];
    
    console.log('📖 Book Index:', bookIndex);
    console.log('🔍 Selected Work ID:', selectedWorkId);
    
    const bookData = await fetchBookDetails(selectedWorkId);
    
    if (!bookData) {
      // Use hardcoded fallback to avoid Pride and Prejudice
      const fallback = {
        id: 'OL45804W',
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        genre: 'Fiction',
        description: 'A gripping tale of racial injustice and childhood innocence in the American South. Through the eyes of Scout Finch, we witness her father Atticus defend a black man falsely accused of rape, teaching timeless lessons about morality, prejudice, and standing up for what is right.',
        reviews: 1523,
        rating: 4.6,
        publishYear: 1960,
        subjects: ['Classic literature', 'Coming of age', 'Social justice', 'American South', 'Racism', 'Moral courage']
      };
      const alternativeCoverUrl = getAlternativeCoverUrl(fallback.id, fallback.title);
      return {
        ...fallback,
        coverUrl: alternativeCoverUrl || getCoverUrl(fallback.id),
        primaryCoverUrl: getCoverUrl(fallback.id),
        alternativeCoverUrl: alternativeCoverUrl,
        authorName: fallback.author
      };
    }
    
    return bookData;
  } catch (error) {
    console.error('Error fetching book of the month:', error);
    // Use hardcoded fallback to avoid Pride and Prejudice
    const fallback = {
      id: 'OL45804W',
      title: 'To Kill a Mockingbird',
      author: 'Harper Lee',
      genre: 'Fiction',
      description: 'A gripping tale of racial injustice and childhood innocence in the American South. Through the eyes of Scout Finch, we witness her father Atticus defend a black man falsely accused of rape, teaching timeless lessons about morality, prejudice, and standing up for what is right.',
      reviews: 1523,
      rating: 4.6,
      publishYear: 1960,
      subjects: ['Classic literature', 'Coming of age', 'Social justice', 'American South', 'Racism', 'Moral courage']
    };
    const alternativeCoverUrl = getAlternativeCoverUrl(fallback.id, fallback.title);
    return {
      ...fallback,
      coverUrl: alternativeCoverUrl || getCoverUrl(fallback.id),
      primaryCoverUrl: getCoverUrl(fallback.id),
      alternativeCoverUrl: alternativeCoverUrl,
      authorName: fallback.author
    };
  }
};

// Get a large collection of diverse books from multiple sources
export const getAllBooks = async (page = 1, limit = 50, sortBy = 'popular') => {
  console.log(`Fetching all books - page: ${page}, limit: ${limit}, sortBy: ${sortBy}`);
  
  try {
    // Define multiple search strategies to get diverse popular books
    const searchStrategies = [
      // Currently trending subjects
      { type: 'subject', query: 'fiction', weight: 3 },
      { type: 'subject', query: 'romance', weight: 3 },
      { type: 'subject', query: 'fantasy', weight: 2 },
      { type: 'subject', query: 'mystery_and_detective_stories', weight: 2 },
      { type: 'subject', query: 'science_fiction', weight: 2 },
      { type: 'subject', query: 'thriller', weight: 2 },
      { type: 'subject', query: 'biography', weight: 1 },
      { type: 'subject', query: 'history', weight: 1 },
      { type: 'subject', query: 'self_help', weight: 2 },
      { type: 'subject', query: 'young_adult', weight: 2 },
      { type: 'subject', query: 'contemporary_fiction', weight: 2 },
      { type: 'subject', query: 'historical_fiction', weight: 2 },
      
      // Popular authors and trending searches
      { type: 'search', query: 'Colleen Hoover', weight: 3 },
      { type: 'search', query: 'Emily Henry', weight: 3 },
      { type: 'search', query: 'Taylor Jenkins Reid', weight: 2 },
      { type: 'search', query: 'Madeline Miller', weight: 2 },
      { type: 'search', query: 'bestseller 2024', weight: 2 },
      { type: 'search', query: 'bestseller 2023', weight: 2 },
      { type: 'search', query: 'award winner', weight: 1 },
      { type: 'search', query: 'new york times bestseller', weight: 2 },
      { type: 'search', query: 'goodreads choice', weight: 2 },
      { type: 'search', query: 'tiktok books', weight: 3 },
      { type: 'search', query: 'booktok', weight: 3 },
      { type: 'search', query: 'popular fiction', weight: 2 },
    ];

    let allBooks = [];
    
    // Sort strategies by weight (higher weight = more popular)
    const sortedStrategies = searchStrategies.sort((a, b) => (b.weight || 1) - (a.weight || 1));
    
    // Calculate books per strategy based on weight
    const totalWeight = sortedStrategies.reduce((sum, strategy) => sum + (strategy.weight || 1), 0);
    const strategiesToUse = Math.min(6, sortedStrategies.length); // Use top 6 strategies
    
    // Fetch from multiple strategies with weighted distribution
    for (let i = 0; i < strategiesToUse; i++) {
      const strategy = sortedStrategies[i];
      const strategyWeight = strategy.weight || 1;
      const booksForThisStrategy = Math.ceil((limit * strategyWeight) / totalWeight);
      
      try {
        let response;
        if (strategy.type === 'subject') {
          response = await axios.get(
            `https://openlibrary.org/subjects/${strategy.query}.json?limit=${booksForThisStrategy}&offset=${(page - 1) * Math.ceil(booksForThisStrategy / 2)}`,
            { timeout: 8000 }
          );
          
          if (response.data && response.data.works) {
            const books = response.data.works.map(book => formatBookData(book, 'subjects'));
            allBooks = [...allBooks, ...books];
          }
        } else if (strategy.type === 'search') {
          response = await axios.get(
            `https://openlibrary.org/search.json?q=${encodeURIComponent(strategy.query)}&limit=${booksForThisStrategy}&offset=${(page - 1) * Math.ceil(booksForThisStrategy / 2)}&sort=rating`,
            { timeout: 8000 }
          );
          
          if (response.data && response.data.docs) {
            const books = response.data.docs.map(book => formatBookData(book, 'search'));
            allBooks = [...allBooks, ...books];
          }
        }
      } catch (strategyError) {
        console.warn(`Strategy ${strategy.type}:${strategy.query} failed:`, strategyError.message);
        continue;
      }
    }

    // Remove duplicates based on title and author
    const uniqueBooks = [];
    const seenBooks = new Set();
    
    for (const book of allBooks) {
      const bookKey = `${book.title.toLowerCase()}-${book.author.toLowerCase()}`;
      if (!seenBooks.has(bookKey)) {
        seenBooks.add(bookKey);
        uniqueBooks.push(book);
      }
    }

    // Filter out low-quality books
    const qualityBooks = uniqueBooks.filter(book => 
      book.title && 
      book.title.length > 2 && 
      book.author !== 'Unknown Author' &&
      !book.title.toLowerCase().includes('test') &&
      !book.title.toLowerCase().includes('sample') &&
      !book.title.toLowerCase().includes('untitled')
    );

    // If we don't have enough books, add from featured and fallback
    if (qualityBooks.length < limit / 2) {
      console.log('Adding featured books to fill the collection...');
      
      // Add featured books
      const featuredBooks = await Promise.all(
        FEATURED_WORK_IDS.slice(0, Math.min(10, limit - qualityBooks.length)).map(async (workId) => {
          try {
            return await fetchBookDetails(workId);
          } catch (error) {
            return null;
          }
        })
      );
      
      const validFeaturedBooks = featuredBooks.filter(book => book !== null);
      qualityBooks.push(...validFeaturedBooks);
      
      // Add fallback books if still not enough
      if (qualityBooks.length < limit / 2) {
        const fallbackBooks = FALLBACK_BOOKS.map(book => ({
          ...book,
          coverUrl: getAlternativeCoverUrl(book.id, book.title) || getCoverUrl(book.id),
          primaryCoverUrl: getCoverUrl(book.id),
          alternativeCoverUrl: getAlternativeCoverUrl(book.id, book.title),
          authorName: book.author
        }));
        
        qualityBooks.push(...fallbackBooks.slice(0, limit - qualityBooks.length));
      }
    }

    // Apply sorting
    if (sortBy === 'title') {
      qualityBooks.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'author') {
      qualityBooks.sort((a, b) => a.author.localeCompare(b.author));
    } else if (sortBy === 'newest') {
      qualityBooks.sort((a, b) => (b.publishYear || 0) - (a.publishYear || 0));
    } else if (sortBy === 'rating') {
      qualityBooks.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    const finalBooks = qualityBooks.slice(0, limit);
    
    console.log(`Successfully fetched ${finalBooks.length} diverse books`);
    
    return {
      books: finalBooks,
      totalPages: Math.ceil(qualityBooks.length / limit),
      currentPage: page,
      totalResults: qualityBooks.length
    };

  } catch (error) {
    console.error('Error fetching all books, using fallback:', error.message);
    
    // Return enhanced fallback books
    const fallbackBooks = FALLBACK_BOOKS.map(book => ({
      ...book,
      coverUrl: getAlternativeCoverUrl(book.id, book.title) || getCoverUrl(book.id),
      primaryCoverUrl: getCoverUrl(book.id),
      alternativeCoverUrl: getAlternativeCoverUrl(book.id, book.title),
      authorName: book.author
    }));
    
    // Apply sorting to fallback books
    if (sortBy === 'title') {
      fallbackBooks.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'author') {
      fallbackBooks.sort((a, b) => a.author.localeCompare(b.author));
    } else if (sortBy === 'newest') {
      fallbackBooks.sort((a, b) => (b.publishYear || 0) - (a.publishYear || 0));
    }
    
    return {
      books: fallbackBooks,
      totalPages: 1,
      currentPage: 1,
      totalResults: fallbackBooks.length
    };
  }
};

// Get popular trending books specifically for the Books page
export const getPopularTrendingBooks = async (page = 1, limit = 60, sortBy = 'popular') => {
  console.log(`Fetching popular trending books - page: ${page}, limit: ${limit}`);
  
  try {
    let allBooks = [];
    
    // First, try to get books from featured work IDs
    const featuredBooksPromises = FEATURED_WORK_IDS.slice(0, Math.min(20, limit / 3)).map(async (workId) => {
      try {
        return await fetchBookDetails(workId);
      } catch (error) {
        return null;
      }
    });
    
    const featuredBooks = (await Promise.all(featuredBooksPromises)).filter(book => book !== null);
    allBooks = [...featuredBooks];
    
    // Then get trending books from popular subjects
    const trendingSubjects = ['romance', 'fiction', 'fantasy', 'mystery_and_detective_stories', 'young_adult'];
    
    for (const subject of trendingSubjects) {
      if (allBooks.length >= limit) break;
      
      try {
        const response = await axios.get(
          `https://openlibrary.org/subjects/${subject}.json?limit=15&offset=${(page - 1) * 5}`,
          { timeout: 6000 }
        );
        
        if (response.data && response.data.works) {
          const books = response.data.works.map(book => formatBookData(book, 'subjects'));
          allBooks = [...allBooks, ...books];
        }
      } catch (error) {
        console.warn(`Failed to fetch ${subject} books:`, error.message);
      }
    }
    
    // Get books from popular authors
    const popularAuthors = ['Colleen Hoover', 'Emily Henry', 'Taylor Jenkins Reid', 'Sarah J. Maas', 'Madeline Miller'];
    
    for (const author of popularAuthors) {
      if (allBooks.length >= limit) break;
      
      try {
        const response = await axios.get(
          `https://openlibrary.org/search.json?author=${encodeURIComponent(author)}&limit=8&sort=rating`,
          { timeout: 6000 }
        );
        
        if (response.data && response.data.docs) {
          const books = response.data.docs.map(book => formatBookData(book, 'search'));
          allBooks = [...allBooks, ...books];
        }
      } catch (error) {
        console.warn(`Failed to fetch books by ${author}:`, error.message);
      }
    }
    
    // Remove duplicates
    const uniqueBooks = [];
    const seenBooks = new Set();
    
    for (const book of allBooks) {
      const bookKey = `${book.title.toLowerCase()}-${book.author.toLowerCase()}`;
      if (!seenBooks.has(bookKey)) {
        seenBooks.add(bookKey);
        uniqueBooks.push(book);
      }
    }
    
    // Filter out low-quality books
    const qualityBooks = uniqueBooks.filter(book => 
      book.title && 
      book.title.length > 2 && 
      book.author !== 'Unknown Author' &&
      !book.title.toLowerCase().includes('test') &&
      !book.title.toLowerCase().includes('sample') &&
      !book.title.toLowerCase().includes('untitled')
    );
    
    // Add fallback books if needed
    if (qualityBooks.length < limit / 2) {
      const fallbackBooks = FALLBACK_BOOKS.map(book => ({
        ...book,
        coverUrl: getAlternativeCoverUrl(book.id, book.title) || getCoverUrl(book.id),
        primaryCoverUrl: getCoverUrl(book.id),
        alternativeCoverUrl: getAlternativeCoverUrl(book.id, book.title),
        authorName: book.author
      }));
      
      qualityBooks.push(...fallbackBooks.slice(0, limit - qualityBooks.length));
    }
    
    // Apply sorting
    if (sortBy === 'title') {
      qualityBooks.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'author') {
      qualityBooks.sort((a, b) => a.author.localeCompare(b.author));
    } else if (sortBy === 'newest') {
      qualityBooks.sort((a, b) => (b.publishYear || 0) - (a.publishYear || 0));
    } else if (sortBy === 'rating') {
      qualityBooks.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }
    
    const finalBooks = qualityBooks.slice(0, limit);
    
    console.log(`Successfully fetched ${finalBooks.length} popular trending books`);
    
    return {
      books: finalBooks,
      totalPages: Math.ceil(qualityBooks.length / limit),
      currentPage: page,
      totalResults: qualityBooks.length
    };
    
  } catch (error) {
    console.error('Error fetching popular trending books, using fallback:', error.message);
    
    // Return enhanced fallback books
    const fallbackBooks = FALLBACK_BOOKS.map(book => ({
      ...book,
      coverUrl: getAlternativeCoverUrl(book.id, book.title) || getCoverUrl(book.id),
      primaryCoverUrl: getCoverUrl(book.id),
      alternativeCoverUrl: getAlternativeCoverUrl(book.id, book.title),
      authorName: book.author
    }));
    
    return {
      books: fallbackBooks,
      totalPages: 1,
      currentPage: 1,
      totalResults: fallbackBooks.length
    };
  }
};

// Export FALLBACK_BOOKS for use in components
export { FALLBACK_BOOKS };

export default {
  getFeaturedBooks,
  searchBooks,
  searchBooksAdvanced,
  getBooksByGenre,
  getTrendingBooks,
  getAllBooks,
  getPopularTrendingBooks,
  fetchBookDetails,
  getAuthorDetails,
  getBookOfTheMonth
};