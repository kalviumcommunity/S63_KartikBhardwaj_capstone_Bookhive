/**
 * Utility functions for generating affiliate links
 */

/**
 * Generate an Amazon affiliate link for a book
 * @param {string} title - The book title
 * @param {string} author - The book author
 * @param {string} affiliateTag - Your Amazon affiliate tag (default: bookhive-20)
 * @returns {string} - The Amazon search URL with affiliate tag
 */
export const generateAmazonLink = (title, author, affiliateTag = 'bookhive-20') => {
  // Encode the search query parameters
  const searchQuery = encodeURIComponent(`${title} ${author} book`);
  
  // Construct the Amazon search URL with the affiliate tag
  // This will search for the book on Amazon and include your affiliate tag
  return `https://www.amazon.com/s?k=${searchQuery}&tag=${affiliateTag}`;
};

/**
 * Generate a direct Amazon product link if you have the ASIN (Amazon Standard Identification Number)
 * @param {string} asin - The Amazon ASIN for the book
 * @param {string} affiliateTag - Your Amazon affiliate tag (default: bookhive-20)
 * @returns {string} - The direct Amazon product URL with affiliate tag
 */
export const generateDirectAmazonLink = (asin, affiliateTag = 'bookhive-20') => {
  // If you have the specific Amazon ASIN, you can link directly to the product
  return `https://www.amazon.com/dp/${asin}?tag=${affiliateTag}`;
};