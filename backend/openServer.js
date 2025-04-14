const mongoose = require('mongoose');
const Book = require('./models/Book');
const User = require('./models/User');
const seedBooks = async () => {
  try {
    await Book.deleteMany();
    await User.deleteMany(); 
    const user = await User.create({
      name: 'Demo User',
      email: 'demo@example.com',
      password: 'password123'
    });

    const books = [
      {
        title: "The Alchemist",
        author: "Paulo Coelho",
        publishYear: 1988,
        coverImage: "https://cover.url/alchemist.jpg",
        openLibraryId: "OL123M",
        userId: user._id 
      },
      {
        title: "1984",
        author: "George Orwell",
        publishYear: 1949,
        coverImage: "https://cover.url/1984.jpg",
        openLibraryId: "OL124M",
        userId: user._id
      },
      {
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        publishYear: 1960,
        coverImage: "https://cover.url/mockingbird.jpg",
        openLibraryId: "OL125M",
        userId: user._id
      }
    ];
    await Book.insertMany(books);
    console.log('Sample books inserted successfully with userId!');
  } catch (err) {
    console.error('Error inserting sample books:', err);
  }
};
module.exports = seedBooks;
