import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import BookOfTheMonth from '../BookOfTheMonth';
import { getBookOfTheMonth } from '../../services/BookService';

// Mock the services
vi.mock('../../services/BookService', () => ({
  getBookOfTheMonth: vi.fn(),
}));

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>,
  },
}));

// Mock heroicons
vi.mock('@heroicons/react/24/outline', () => ({
  StarIcon: ({ className }) => <svg className={className} data-testid="star-icon" />,
  HeartIcon: ({ className }) => <svg className={className} data-testid="heart-icon" />,
  BookOpenIcon: ({ className }) => <svg className={className} data-testid="book-open-icon" />,
  ArrowRightIcon: ({ className }) => <svg className={className} data-testid="arrow-right-icon" />,
}));

vi.mock('@heroicons/react/24/solid', () => ({
  HeartIcon: ({ className }) => <svg className={className} data-testid="heart-icon-solid" />,
}));

const mockBookData = {
  id: 'test-book-id',
  title: 'Test Book Title',
  authorName: 'Test Author',
  rating: 4.5,
  reviews: 250,
  genre: 'Fiction',
  description: 'This is a test book description that should be truncated when it exceeds the maximum length allowed for display.',
  coverUrl: 'https://example.com/cover.jpg',
  alternativeCoverUrl: 'https://example.com/alt-cover.jpg',
  subjects: ['Adventure', 'Drama', 'Classic Literature'],
};

describe('BookOfTheMonth Component', () => {
  const mockNavigate = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getBookOfTheMonth).mockResolvedValue(mockBookData);
    // Mock useNavigate
    vi.doMock('react-router-dom', async () => {
      const actual = await vi.importActual('react-router-dom');
      return {
        ...actual,
        useNavigate: () => mockNavigate,
      };
    });
  });

  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <BookOfTheMonth />
      </BrowserRouter>
    );
  };

  it('renders loading state initially', () => {
    vi.mocked(getBookOfTheMonth).mockImplementation(() => new Promise(() => {}));
    renderComponent();
    
    expect(screen.getByText('Loading Book of the Month...')).toBeInTheDocument();
    expect(document.querySelector('.loading-spinner')).toBeInTheDocument();
  });

  it('renders book information correctly', async () => {
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByText('Book of the Month')).toBeInTheDocument();
      expect(screen.getByText('Test Book Title')).toBeInTheDocument();
      expect(screen.getByText('by Test Author')).toBeInTheDocument();
      expect(screen.getByText('Fiction')).toBeInTheDocument();
      expect(screen.getByText('4.5')).toBeInTheDocument();
      expect(screen.getByText('(250 reviews)')).toBeInTheDocument();
    });
  });

  it('renders book cover image with correct attributes', async () => {
    renderComponent();
    
    await waitFor(() => {
      const bookImage = screen.getByRole('img', { name: /Test Book Title/i });
      expect(bookImage).toBeInTheDocument();
      expect(bookImage).toHaveAttribute('src', 'https://example.com/cover.jpg');
      expect(bookImage).toHaveAttribute('alt', 'Test Book Title');
    });
  });

  it('handles image error by showing fallback', async () => {
    renderComponent();
    
    await waitFor(() => {
      const bookImage = screen.getByRole('img', { name: /Test Book Title/i });
      fireEvent.error(bookImage);
      expect(bookImage).toHaveAttribute('src', 'https://example.com/alt-cover.jpg');
    });
  });

  it('renders star rating correctly', async () => {
    renderComponent();
    
    await waitFor(() => {
      const stars = screen.getAllByTestId('star-icon');
      expect(stars).toHaveLength(5); // Should render 5 stars total
    });
  });

  it('renders book tags/subjects', async () => {
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByText('Adventure')).toBeInTheDocument();
      expect(screen.getByText('Drama')).toBeInTheDocument();
      expect(screen.getByText('Classic Literature')).toBeInTheDocument();
    });
  });

  it('truncates description when too long', async () => {
    renderComponent();
    
    await waitFor(() => {
      const description = screen.getByText(/This is a test book description/);
      expect(description.textContent).toContain('...');
    });
  });

  it('navigates to book detail page when Read More is clicked', async () => {
    renderComponent();
    
    await waitFor(() => {
      const readMoreButton = screen.getByText('Read More');
      fireEvent.click(readMoreButton);
      expect(mockNavigate).toHaveBeenCalledWith('/book-of-the-month/test-book-id');
    });
  });

  it('navigates to book detail page when Quick View is clicked', async () => {
    renderComponent();
    
    await waitFor(() => {
      const quickViewButton = screen.getByText('Quick View');
      fireEvent.click(quickViewButton);
      expect(mockNavigate).toHaveBeenCalledWith('/book-of-the-month/test-book-id');
    });
  });

  it('toggles wishlist state when wishlist button is clicked', async () => {
    renderComponent();
    
    await waitFor(() => {
      const wishlistButton = screen.getByText('Add to Wishlist');
      fireEvent.click(wishlistButton);
      expect(screen.getByText('Wishlisted')).toBeInTheDocument();
      expect(screen.getByTestId('heart-icon-solid')).toBeInTheDocument();
    });
  });

  it('handles API error gracefully', async () => {
    vi.mocked(getBookOfTheMonth).mockRejectedValue(new Error('API Error'));
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByText('Unable to load Book of the Month')).toBeInTheDocument();
      expect(screen.getByText('Failed to load book of the month')).toBeInTheDocument();
    });
  });

  it('handles null book data gracefully', async () => {
    vi.mocked(getBookOfTheMonth).mockResolvedValue(null);
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByText('Unable to load Book of the Month')).toBeInTheDocument();
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });
  });

  it('renders featured pick ribbon', async () => {
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByText('📚 Featured Pick')).toBeInTheDocument();
    });
  });

  it('renders section subtitle', async () => {
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByText('Our carefully curated monthly selection that\'s capturing readers\' hearts')).toBeInTheDocument();
    });
  });
});