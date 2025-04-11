const mongoose = require('mongoose');
const Book = require('./models/Book'); 

const seedBooks = async () => {
  try {
    await Book.deleteMany(); 
    const books = [
      {
        title: "The Alchemist",
        author: "Paulo Coelho",
        publishYear: "1988",
        coverImage: "https://cover.url/alchemist.jpg",
        openLibraryId: "OL123M"
      },
      {
        title: "1984",
        author: "George Orwell",
        publishYear: "1949",
        coverImage: "https://cover.url/1984.jpg",
        openLibraryId: "OL124M"
      },
      {
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        publishYear: "1960",
        coverImage: "https://cover.url/mockingbird.jpg",
        openLibraryId: "OL125M"
      }
    ];
    
    await Book.insertMany(books);
    console.log('Sample books inserted successfully!');
  } catch (err) {
    console.error('Error inserting sample books:', err);
  }
};

module.exports = seedBooks;