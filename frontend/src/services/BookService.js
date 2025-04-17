const BASE_URL = 'https://openlibrary.org';

// Sample featured book IDs from Open Library
const FEATURED_BOOK_IDS = [
  'OL24236961M', // The Great Gatsby
  'OL7358913M',  // To Kill a Mockingbird
  'OL26515564M', // 1984
  'OL24721971M', // Pride and Prejudice
  'OL25887411M', // The Hobbit
  'OL6990157M',  // The Lord of the Rings
  'OL24347578M', // Harry Potter and the Sorcerer's Stone
  'OL24347578M', // Harry Potter and the Sorcerer's Stone
  'OL7603982M',  // Jane Eyre
];

export const searchBooks = async (query) => {
  try {
    const response = await fetch(`${BASE_URL}/search.json?q=${encodeURIComponent(query)}&limit=10`);
    const data = await response.json();
    return data.docs.map(book => ({
      id: book.key,
      title: book.title,
      author: book.author_name ? book.author_name[0] : 'Unknown Author',
      coverUrl: book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` : null,
      publishYear: book.first_publish_year || 'Unknown',
    }));
  } catch (error) {
    console.error('Error fetching books:', error);
    return [];
  }
};

export const getFeaturedBooks = async () => {
  try {
    // For demo purposes, we're creating the book objects without making real API calls
    // In a real app, you would fetch these from the Open Library API
    return [
      {
        id: 'OL24236961M',
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        coverUrl: 'https://covers.openlibrary.org/b/id/8432047-L.jpg',
        rating: 4.3,
        reviewCount: 3728,
        publishYear: 1925,
        description: 'Set in the Jazz Age on Long Island, the novel depicts narrator Nick Carraway\'s interactions with mysterious millionaire Jay Gatsby and Gatsby\'s obsession to reunite with his former lover, Daisy Buchanan.',
        category: 'Classic Fiction'
      },
      {
        id: 'OL7358913M',
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        coverUrl: 'https://covers.openlibrary.org/b/id/8231286-L.jpg',
        rating: 4.5,
        reviewCount: 4890,
        publishYear: 1960,
        description: 'The unforgettable novel of a childhood in a sleepy Southern town and the crisis of conscience that rocked it. Through the young eyes of Scout and Jem Finch, Harper Lee explores with exuberant humor the irrationality of adult attitudes to race and class in the Deep South of the 1930s.',
        category: 'Classic Fiction'
      },
      {
        id: 'OL26515564M',
        title: '1984',
        author: 'George Orwell',
        coverUrl: 'https://covers.openlibrary.org/b/id/8575741-L.jpg',
        rating: 4.2,
        reviewCount: 4192,
        publishYear: 1949,
        description: 'Among the seminal texts of the 20th century, 1984 paints the bleak picture of a society in which all information is controlled by the government and independent thought is labeled "thoughtcrime."',
        category: 'Science Fiction'
      },
      {
        id: 'OL24721971M',
        title: 'Pride and Prejudice',
        author: 'Jane Austen',
        coverUrl: 'https://covers.openlibrary.org/b/id/8409593-L.jpg',
        rating: 4.4,
        reviewCount: 3523,
        publishYear: 1813,
        description: 'Since its publication in 1813, Pride and Prejudice has become one of the world\'s best-loved books. The story of Elizabeth Bennet and her complicated relationship with the proud Mr. Darcy has delighted readers for generations.',
        category: 'Romance'
      },
      {
        id: 'OL25887411M',
        title: 'The Hobbit',
        author: 'J.R.R. Tolkien',
        coverUrl: 'https://covers.openlibrary.org/b/id/12003830-L.jpg',
        rating: 4.6,
        reviewCount: 3867,
        publishYear: 1937,
        description: 'Bilbo Baggins is a hobbit who enjoys a comfortable, unambitious life, rarely traveling any farther than his pantry or cellar. But his contentment is disturbed when the wizard Gandalf and a company of dwarves arrive on his doorstep one day to whisk him away on an adventure.',
        category: 'Fantasy'
      },
      {
        id: 'OL6990157M',
        title: 'The Lord of the Rings',
        author: 'J.R.R. Tolkien',
        coverUrl: 'https://covers.openlibrary.org/b/id/8127388-L.jpg',
        rating: 4.7,
        reviewCount: 5109,
        publishYear: 1954,
        description: 'The Lord of the Rings is an epic high-fantasy novel written by English author J. R. R. Tolkien. The story began as a sequel to Tolkien\'s 1937 fantasy novel The Hobbit, but eventually developed into a much larger work.',
        category: 'Fantasy'
      }
    ];
  } catch (error) {
    console.error('Error fetching featured books:', error);
    return [];
  }
};

export const getBookDetails = async (bookId) => {
  try {
    const response = await fetch(`${BASE_URL}${bookId}.json`);
    const book = await response.json();
    
    // For description
    let description = 'No description available';
    if (book.description) {
      description = typeof book.description === 'object' ? book.description.value : book.description;
    }
    
    return {
      id: book.key,
      title: book.title,
      description,
      coverUrl: book.covers ? `https://covers.openlibrary.org/b/id/${book.covers[0]}-L.jpg` : null,
      publishDate: book.first_publish_date || 'Unknown',
    };
  } catch (error) {
    console.error('Error fetching book details:', error);
    return null;
  }
};

// Function to fetch a book from Open Library by ID
export const getBookById = async (bookId) => {
  try {
    const response = await fetch(`https://openlibrary.org/api/books?bibkeys=OLID:${bookId}&format=json&jscmd=data`);
    const data = await response.json();
    const bookData = data[`OLID:${bookId}`];
    
    if (!bookData) {
      throw new Error('Book not found');
    }
    
    return {
      id: bookId,
      title: bookData.title,
      author: bookData.authors?.[0]?.name || 'Unknown Author',
      coverUrl: bookData.cover?.large || null,
      publishYear: bookData.publish_date ? parseInt(bookData.publish_date.slice(-4)) : null,
      description: bookData.excerpts?.[0]?.text || bookData.description?.value || 'No description available',
      category: bookData.subjects?.[0] || null,
    };
  } catch (error) {
    console.error(`Error fetching book ${bookId}:`, error);
    return null;
  }
}; 