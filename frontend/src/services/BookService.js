const BASE_URL = 'https://openlibrary.org';

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
    const response = await fetch(`${BASE_URL}/subjects/fiction.json?limit=4`);
    const data = await response.json();
    return data.works.map(book => ({
      id: book.key,
      title: book.title,
      author: book.authors ? book.authors[0]?.name : 'Unknown Author',
      coverUrl: book.cover_id ? `https://covers.openlibrary.org/b/id/${book.cover_id}-M.jpg` : null,
    }));
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