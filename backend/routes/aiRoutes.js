const express = require('express');
const router = express.Router();
const aiService = require('../services/aiService');
const auth = require('../middleware/auth');

// Get AI-powered book recommendations based on mood
router.post('/mood-recommendations', async (req, res) => {
  try {
    const { mood } = req.body;
    if (!mood) {
      return res.status(400).json({ message: 'Mood is required' });
    }
    
    console.log(`Generating recommendations for mood: ${mood}`);
    const recommendations = await aiService.getMoodBasedRecommendations(mood);
    
    // Check if there was an error parsing the response
    if (recommendations && recommendations.error) {
      console.log('Error in AI response:', recommendations.error);
      return res.status(500).json({ 
        message: 'Error processing AI response',
        error: recommendations.error,
        rawResponse: recommendations.rawResponse
      });
    }
    
    // Check if these are fallback recommendations
    const isFallback = recommendations.some(book => 
      book.title === "To Kill a Mockingbird" && 
      book.author === "Harper Lee"
    );
    
    if (isFallback) {
      console.log("Returning fallback recommendations");
      return res.json({ 
        recommendations,
        isFallback: true
      });
    }
    
    res.json({ recommendations });
  } catch (error) {
    console.error('Error getting mood recommendations:', error);
    res.status(500).json({ message: 'Error processing your request' });
  }
});

// Chat about books
router.post('/book-chat', async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) {
      return res.status(400).json({ message: 'Question is required' });
    }
    
    console.log(`Processing book chat question: ${question}`);
    const response = await aiService.chatAboutBooks(question);
    
    // Check if the response is the fallback message
    if (response.includes("I'm having trouble connecting to my knowledge base")) {
      console.log("Returning fallback response from AI service");
      // Still return 200 status but with a flag indicating it's a fallback
      return res.json({ 
        response,
        isFallback: true
      });
    }
    
    res.json({ response });
  } catch (error) {
    console.error('Error in book chat:', error);
    res.status(500).json({ 
      message: 'Error processing your request',
      fallbackResponse: "I'm sorry, I'm having trouble connecting to my knowledge base right now. Please try asking a different question or try again later."
    });
  }
});

module.exports = router;