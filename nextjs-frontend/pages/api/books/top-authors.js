import axios from 'axios';

export default async function handler(req, res) {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/books/top-authors`
    );
    
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching top authors:', error);
    res.status(500).json({ 
      error: 'Failed to fetch top authors',
      message: error.message
    });
  }
}