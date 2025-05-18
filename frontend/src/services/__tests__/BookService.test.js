import { describe, it, expect, vi, beforeEach } from 'vitest';
import { searchBooks, getFeaturedBooks } from '../BookService';

// Mock fetch
global.fetch = vi.fn();

describe('BookService', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
  });

  describe('searchBooks', () => {
    it('returns formatted book data when API call is successful', async () => {
      // Mock successful response
      const mockResponse = {
        docs: [
          {
            key: '/works/OL123M',
            title: 'Test Book',
            author_name: ['Test Author'],
            cover_i: 12345,
            first_publish_year: 2020
          }
        ]
      };

      // Setup fetch mock
      global.fetch.mockResolvedValueOnce({
        json: async () => mockResponse
      });

      // Call the function
      const result = await searchBooks('test query');

      // Assertions
      expect(global.fetch).toHaveBeenCalledWith(
        'https://openlibrary.org/search.json?q=test%20query&limit=10'
      );
      expect(result).toEqual([
        {
          id: '/works/OL123M',
          title: 'Test Book',
          author: 'Test Author',
          coverUrl: 'https://covers.openlibrary.org/b/id/12345-M.jpg',
          publishYear: 2020
        }
      ]);
    });

    it('returns empty array when API call fails', async () => {
      // Mock failed response
      global.fetch.mockRejectedValueOnce(new Error('API error'));

      // Call the function
      const result = await searchBooks('test query');

      // Assertions
      expect(global.fetch).toHaveBeenCalledWith(
        'https://openlibrary.org/search.json?q=test%20query&limit=10'
      );
      expect(result).toEqual([]);
    });
  });

  describe('getFeaturedBooks', () => {
    it('returns featured books array', async () => {
      // Call the function
      const result = await getFeaturedBooks();

      // Assertions
      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBeGreaterThan(0);
      
      // Check structure of first book
      const firstBook = result[0];
      expect(firstBook).toHaveProperty('id');
      expect(firstBook).toHaveProperty('title');
      expect(firstBook).toHaveProperty('author');
      expect(firstBook).toHaveProperty('coverUrl');
      expect(firstBook).toHaveProperty('rating');
      expect(firstBook).toHaveProperty('description');
    });
  });
});