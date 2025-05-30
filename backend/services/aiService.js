// Mock AI service for BookHive
console.log("Using mock AI service for BookHive");
require('dotenv').config();

// Fallback recommendations when AI service fails
const getFallbackRecommendations = (mood) => {
  console.log("Using fallback recommendations for mood:", mood);
  
  // Default fallback books for any mood
  const defaultBooks = [
    {
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      description: "A classic novel about racial injustice in the American South.",
      reason: "This timeless classic offers perspective and emotional depth.",
      genre: "Fiction"
    },
    {
      title: "The Alchemist",
      author: "Paulo Coelho",
      description: "A philosophical novel about following your dreams.",
      reason: "An inspiring story that resonates with readers of all moods.",
      genre: "Fiction"
    },
    {
      title: "Pride and Prejudice",
      author: "Jane Austen",
      description: "A romantic novel about relationships and social standing.",
      reason: "A beautifully written classic that stands the test of time.",
      genre: "Romance"
    },
    {
      title: "The Hobbit",
      author: "J.R.R. Tolkien",
      description: "A fantasy adventure about a hobbit who joins a quest.",
      reason: "An engaging adventure that can transport you to another world.",
      genre: "Fantasy"
    },
    {
      title: "Thinking, Fast and Slow",
      author: "Daniel Kahneman",
      description: "A book about how we think and make decisions.",
      reason: "Offers fascinating insights into human psychology.",
      genre: "Non-fiction"
    }
  ];
  
  // Mood-specific recommendations could be added here
  if (mood.toLowerCase().includes("happy") || mood.toLowerCase().includes("uplifting")) {
    return [
      {
        title: "The House in the Cerulean Sea",
        author: "TJ Klune",
        description: "A magical story about finding family in unexpected places.",
        reason: "A heartwarming tale that will leave you feeling joyful.",
        genre: "Fantasy"
      },
      ...defaultBooks.slice(0, 4)
    ];
  }
  
  if (mood.toLowerCase().includes("sad") || mood.toLowerCase().includes("melancholy")) {
    return [
      {
        title: "When Breath Becomes Air",
        author: "Paul Kalanithi",
        description: "A memoir about facing mortality and finding meaning.",
        reason: "A profound book that helps process difficult emotions.",
        genre: "Memoir"
      },
      ...defaultBooks.slice(0, 4)
    ];
  }
  
  // Return default recommendations for any other mood
  return defaultBooks;
};

module.exports = {
  // Get book recommendations based on mood
  getMoodBasedRecommendations: async (mood) => {
    try {
      console.log("Getting recommendations for mood:", mood);
      
      // Generate mood-specific recommendations
      const moodLower = mood.toLowerCase();
      
      if (moodLower.includes("happy") || moodLower.includes("uplifting")) {
        return [
          {
            title: "The House in the Cerulean Sea",
            author: "TJ Klune",
            description: "A magical story about finding family in unexpected places.",
            reason: "This heartwarming tale will enhance your happy mood with its joyful characters and uplifting message.",
            genre: "Fantasy"
          },
          {
            title: "A Man Called Ove",
            author: "Fredrik Backman",
            description: "A grumpy yet loveable man finds his solitary world turned on its head when a boisterous young family moves in next door.",
            reason: "This book starts with grumpiness but transforms into a heartwarming story that will make you smile.",
            genre: "Fiction"
          },
          {
            title: "The Midnight Library",
            author: "Matt Haig",
            description: "A library between life and death where each book represents a different life you could have lived.",
            reason: "An uplifting story about appreciating life and finding happiness in unexpected places.",
            genre: "Fiction"
          },
          {
            title: "Project Hail Mary",
            author: "Andy Weir",
            description: "A lone astronaut must save humanity from extinction through an unexpected friendship.",
            reason: "An exciting adventure with humor, friendship, and optimism that matches your happy mood.",
            genre: "Science Fiction"
          },
          {
            title: "The Hitchhiker's Guide to the Galaxy",
            author: "Douglas Adams",
            description: "An ordinary man is whisked away on an extraordinary adventure across the galaxy.",
            reason: "This hilarious sci-fi adventure will keep your spirits high with its absurd humor.",
            genre: "Science Fiction"
          }
        ];
      } 
      else if (moodLower.includes("calm") || moodLower.includes("relaxed")) {
        return [
          {
            title: "The Overstory",
            author: "Richard Powers",
            description: "An epic novel about the interconnectedness of trees and humans.",
            reason: "The beautiful prose and nature themes create a peaceful reading experience perfect for your calm mood.",
            genre: "Literary Fiction"
          },
          {
            title: "Where the Crawdads Sing",
            author: "Delia Owens",
            description: "A coming-of-age story about a girl growing up alone in the marshes of North Carolina.",
            reason: "The lyrical descriptions of nature and slow-paced storytelling complement your relaxed state.",
            genre: "Fiction"
          },
          {
            title: "The Night Circus",
            author: "Erin Morgenstern",
            description: "A mysterious circus that only appears at night, featuring a competition between two magicians.",
            reason: "The dreamlike quality and enchanting atmosphere make this perfect for a calm, contemplative mood.",
            genre: "Fantasy"
          },
          {
            title: "Circe",
            author: "Madeline Miller",
            description: "A retelling of the story of Circe, the witch from Homer's Odyssey.",
            reason: "The beautiful writing and island setting create a tranquil reading experience.",
            genre: "Mythology"
          },
          {
            title: "The Alchemist",
            author: "Paulo Coelho",
            description: "A philosophical novel about a shepherd boy who dreams of finding treasure.",
            reason: "This meditative story about following your dreams pairs well with your relaxed mood.",
            genre: "Fiction"
          }
        ];
      }
      else if (moodLower.includes("adventurous") || moodLower.includes("excited")) {
        return [
          {
            title: "The Lost City of Z",
            author: "David Grann",
            description: "A true story about the search for a legendary lost city in the Amazon.",
            reason: "This real-life adventure story will fuel your adventurous spirit with tales of exploration.",
            genre: "Non-fiction"
          },
          {
            title: "Six of Crows",
            author: "Leigh Bardugo",
            description: "A group of criminals attempt a heist that could make them rich beyond their wildest dreams.",
            reason: "This fast-paced heist story with memorable characters matches your adventurous mood.",
            genre: "Fantasy"
          },
          {
            title: "Into Thin Air",
            author: "Jon Krakauer",
            description: "A firsthand account of a disastrous expedition to climb Mount Everest.",
            reason: "This thrilling true story of survival will satisfy your craving for adventure.",
            genre: "Non-fiction"
          },
          {
            title: "The Three-Body Problem",
            author: "Cixin Liu",
            description: "A science fiction novel about humanity's first contact with an alien civilization.",
            reason: "This mind-bending sci-fi adventure will take you on an intellectual journey across space and time.",
            genre: "Science Fiction"
          },
          {
            title: "Ready Player One",
            author: "Ernest Cline",
            description: "A treasure hunt in a virtual reality world filled with 1980s pop culture references.",
            reason: "This action-packed adventure in a virtual world is perfect for your adventurous mood.",
            genre: "Science Fiction"
          }
        ];
      }
      else if (moodLower.includes("romantic")) {
        return [
          {
            title: "The Time Traveler's Wife",
            author: "Audrey Niffenegger",
            description: "A love story about a man with a genetic disorder that causes him to time travel unpredictably.",
            reason: "This unique love story transcends time and will satisfy your romantic mood.",
            genre: "Romance"
          },
          {
            title: "Red, White & Royal Blue",
            author: "Casey McQuiston",
            description: "A romance between the First Son of the United States and a British prince.",
            reason: "This charming and witty romance will make your heart flutter.",
            genre: "Romance"
          },
          {
            title: "The Night Circus",
            author: "Erin Morgenstern",
            description: "A competition between two magicians becomes complicated when they fall in love.",
            reason: "The magical atmosphere and forbidden romance create a captivating love story.",
            genre: "Fantasy Romance"
          },
          {
            title: "Pride and Prejudice",
            author: "Jane Austen",
            description: "The classic tale of Elizabeth Bennet and Mr. Darcy overcoming their pride and prejudice.",
            reason: "This timeless romance remains one of the most beloved love stories ever written.",
            genre: "Classic Romance"
          },
          {
            title: "The Seven Husbands of Evelyn Hugo",
            author: "Taylor Jenkins Reid",
            description: "A reclusive Hollywood legend reveals the truth about her life and loves to a young journalist.",
            reason: "This glamorous yet emotional story explores the many facets of love and will match your romantic mood.",
            genre: "Historical Fiction"
          }
        ];
      }
      else {
        // Default recommendations for any other mood
        return getFallbackRecommendations(mood);
      }
    } catch (error) {
      console.error("Error getting mood-based recommendations:", error);
      return getFallbackRecommendations(mood);
    }
  },
  
  // Chat about books
  chatAboutBooks: async (question) => {
    try {
      console.log("Processing chat question:", question);
      
      // Generate a response based on the question
      let response = "";
      const questionLower = question.toLowerCase();
      
      // Check for general recommendation requests
      if (questionLower.includes("recommend") || questionLower.includes("suggestion")) {
        // If no specific genre is mentioned, provide general recommendations
        if (!questionLower.includes("mystery") && 
            !questionLower.includes("thriller") && 
            !questionLower.includes("fantasy") && 
            !questionLower.includes("magic") && 
            !questionLower.includes("romance") && 
            !questionLower.includes("motivational") && 
            !questionLower.includes("self-help") && 
            !questionLower.includes("sci-fi") && 
            !questionLower.includes("science fiction") && 
            !questionLower.includes("historical") && 
            !questionLower.includes("non-fiction")) {
          
          response = "Based on your interest, I'd recommend these diverse books:\n\n" +
                    "1. \"The Night Circus\" by Erin Morgenstern - A magical competition between two illusionists set in a mysterious circus.\n\n" +
                    "2. \"Project Hail Mary\" by Andy Weir - An exciting sci-fi adventure about a lone astronaut who must save humanity.\n\n" +
                    "3. \"The Seven Husbands of Evelyn Hugo\" by Taylor Jenkins Reid - A fascinating story about a Hollywood icon and her secret life.\n\n" +
                    "4. \"Educated\" by Tara Westover - A memoir about a woman who grew up in a survivalist family and her journey to education.\n\n" +
                    "5. \"The House in the Cerulean Sea\" by TJ Klune - A heartwarming fantasy about finding family in unexpected places.";
        }
      }
      
      // Check for specific genres or themes
      if (questionLower.includes("mystery") || questionLower.includes("thriller")) {
        response = "For mystery and thriller lovers, I recommend:\n\n" +
                  "1. \"The Silent Patient\" by Alex Michaelides - A psychological thriller about a woman who shoots her husband and then stops speaking.\n\n" +
                  "2. \"Gone Girl\" by Gillian Flynn - A twisted thriller about a marriage gone very wrong.\n\n" +
                  "3. \"The Thursday Murder Club\" by Richard Osman - A charming mystery featuring a group of retirement home residents who solve cold cases.\n\n" +
                  "4. \"The Girl with the Dragon Tattoo\" by Stieg Larsson - A gripping thriller featuring a brilliant but troubled investigator.\n\n" +
                  "5. \"And Then There Were None\" by Agatha Christie - A classic mystery where ten strangers are trapped on an island and begin to die one by one.";
      }
      else if (questionLower.includes("fantasy") || questionLower.includes("magic")) {
        response = "If you enjoy fantasy and magical stories, you might like:\n\n" +
                  "1. \"The Name of the Wind\" by Patrick Rothfuss - An epic fantasy about a legendary wizard recounting his life story.\n\n" +
                  "2. \"Circe\" by Madeline Miller - A beautiful retelling of the story of the goddess Circe from Greek mythology.\n\n" +
                  "3. \"The House in the Cerulean Sea\" by TJ Klune - A heartwarming fantasy about a case worker assigned to a magical orphanage.\n\n" +
                  "4. \"The Fifth Season\" by N.K. Jemisin - A groundbreaking fantasy about a world where apocalyptic events regularly reshape civilization.\n\n" +
                  "5. \"Piranesi\" by Susanna Clarke - A mysterious tale about a man who lives in a vast, labyrinthine house with oceanic tides.";
      }
      else if (questionLower.includes("romance")) {
        response = "For romance readers, I suggest:\n\n" +
                  "1. \"Red, White & Royal Blue\" by Casey McQuiston - A romance between the First Son of the United States and a British prince.\n\n" +
                  "2. \"The Hating Game\" by Sally Thorne - A workplace enemies-to-lovers romance with witty banter.\n\n" +
                  "3. \"Beach Read\" by Emily Henry - Two writers with opposite styles swap genres for a summer, finding inspiration and romance.\n\n" +
                  "4. \"The Kiss Quotient\" by Helen Hoang - A heartwarming contemporary romance featuring a woman with autism who hires a male escort to teach her about relationships.\n\n" +
                  "5. \"Pride and Prejudice\" by Jane Austen - The classic tale of Elizabeth Bennet and Mr. Darcy overcoming their pride and prejudice.";
      }
      else if (questionLower.includes("sci-fi") || questionLower.includes("science fiction")) {
        response = "For science fiction enthusiasts, I recommend:\n\n" +
                  "1. \"Project Hail Mary\" by Andy Weir - An exciting adventure about a lone astronaut who must save humanity from extinction.\n\n" +
                  "2. \"The Three-Body Problem\" by Cixin Liu - A mind-bending story about humanity's first contact with an alien civilization.\n\n" +
                  "3. \"Dune\" by Frank Herbert - A sweeping epic about politics, religion, and ecology on a desert planet.\n\n" +
                  "4. \"The Long Way to a Small, Angry Planet\" by Becky Chambers - A character-driven space opera about a diverse crew on a tunneling ship.\n\n" +
                  "5. \"Klara and the Sun\" by Kazuo Ishiguro - A thought-provoking tale about an artificial friend observing human behavior.";
      }
      else if (questionLower.includes("historical")) {
        response = "For historical fiction fans, I suggest:\n\n" +
                  "1. \"The Book Thief\" by Markus Zusak - A powerful story set in Nazi Germany, narrated by Death.\n\n" +
                  "2. \"All the Light We Cannot See\" by Anthony Doerr - A beautiful novel about a blind French girl and a German boy during WWII.\n\n" +
                  "3. \"Pachinko\" by Min Jin Lee - An epic saga following four generations of a Korean family in Japan.\n\n" +
                  "4. \"The Seven Husbands of Evelyn Hugo\" by Taylor Jenkins Reid - A Hollywood legend recounts her life story and seven marriages.\n\n" +
                  "5. \"Hamnet\" by Maggie O'Farrell - A fictional account of Shakespeare's family life and the death of his son.";
      }
      else if (questionLower.includes("motivational") || questionLower.includes("self-help") || questionLower.includes("inspiration")) {
        response = "Here are some excellent motivational and self-improvement books:\n\n" +
                  "1. \"Atomic Habits\" by James Clear - A practical guide to building good habits and breaking bad ones through small changes.\n\n" +
                  "2. \"Man's Search for Meaning\" by Viktor E. Frankl - A powerful memoir about finding purpose and meaning even in the most difficult circumstances.\n\n" +
                  "3. \"Mindset: The New Psychology of Success\" by Carol S. Dweck - Explores how our beliefs about our abilities affect our success and happiness.\n\n" +
                  "4. \"The Power of Now\" by Eckhart Tolle - A spiritual guide to living in the present moment and finding peace within yourself.\n\n" +
                  "5. \"Daring Greatly\" by Brené Brown - Explores vulnerability, courage, and how to embrace imperfection to live a more fulfilling life.";
      }
      else if (questionLower.includes("non-fiction") || questionLower.includes("true story")) {
        response = "For non-fiction readers, I recommend:\n\n" +
                  "1. \"Educated\" by Tara Westover - A memoir about growing up in a survivalist family and the pursuit of education.\n\n" +
                  "2. \"Sapiens: A Brief History of Humankind\" by Yuval Noah Harari - A fascinating exploration of human history and evolution.\n\n" +
                  "3. \"The Immortal Life of Henrietta Lacks\" by Rebecca Skloot - The story of a woman whose cells were used for medical research without her knowledge.\n\n" +
                  "4. \"Born a Crime\" by Trevor Noah - A memoir about growing up in South Africa during apartheid.\n\n" +
                  "5. \"Hidden Figures\" by Margot Lee Shetterly - The true story of the Black female mathematicians who worked at NASA during the Space Race.";
      }
      // If no specific category was matched but we have a question
      else if (response === "") {
        // Try to extract potential interests from the question
        const potentialInterests = [];
        
        // Check for common book-related terms
        if (questionLower.includes("book")) potentialInterests.push("books");
        if (questionLower.includes("read")) potentialInterests.push("reading");
        if (questionLower.includes("author")) potentialInterests.push("authors");
        if (questionLower.includes("novel")) potentialInterests.push("novels");
        if (questionLower.includes("story")) potentialInterests.push("stories");
        
        // Check for emotional states or preferences
        if (questionLower.includes("happy") || questionLower.includes("joy")) potentialInterests.push("uplifting books");
        if (questionLower.includes("sad") || questionLower.includes("depress")) potentialInterests.push("comforting books");
        if (questionLower.includes("learn") || questionLower.includes("education")) potentialInterests.push("educational books");
        if (questionLower.includes("adventure") || questionLower.includes("exciting")) potentialInterests.push("adventure books");
        
        // Provide a more personalized response based on detected interests
        if (potentialInterests.length > 0) {
          const interestString = potentialInterests.join(", ");
          response = `Based on your interest in ${interestString}, here are some recommendations:\n\n` +
                    "1. \"The Midnight Library\" by Matt Haig - A thought-provoking novel about the infinite possibilities of life.\n\n" +
                    "2. \"Educated\" by Tara Westover - A powerful memoir about self-invention and the pursuit of knowledge.\n\n" +
                    "3. \"The House in the Cerulean Sea\" by TJ Klune - A heartwarming fantasy about finding family in unexpected places.\n\n" +
                    "4. \"Klara and the Sun\" by Kazuo Ishiguro - A moving exploration of what it means to love and be human.\n\n" +
                    "5. \"Project Hail Mary\" by Andy Weir - An exciting sci-fi adventure with humor, friendship, and scientific problem-solving.";
        } else {
          // Default response if we couldn't identify specific interests
          response = "I'd be happy to help you discover great books! You can ask me for recommendations based on genres like mystery, fantasy, romance, science fiction, historical fiction, or non-fiction. I can also suggest motivational books, adventure stories, or books for specific moods. What kind of books are you interested in?";
        }
      }
      
      console.log("Chat response generated successfully");
      return response;
    } catch (error) {
      console.error("Error in book chat:", error);
      return "I'd be happy to help you discover great books! You can ask me for recommendations based on genres like mystery, fantasy, romance, science fiction, or motivational books. If you have a specific interest, feel free to let me know!";
    }
  }
};