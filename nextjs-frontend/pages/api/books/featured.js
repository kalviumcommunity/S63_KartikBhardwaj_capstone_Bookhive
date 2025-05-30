import axios from 'axios';

export default async function handler(req, res) {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/api/books/featured`
    );
    
    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching featured books:', error);
    res.status(500).json({ 
      error: 'Failed to fetch featured books',
      message: error.message
    });
  }
}