import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import BookOfTheMonthDetail from '../BookOfTheMonthDetail';
import { fetchBookDetails } from '../../services/BookService';

// Mock the services
vi.mock('../../services/BookService', () => ({
  fetchBookDetails: vi.fn(),
}));

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useParams: () => ({ bookId: 'test-book-id' }),
  };
});

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>,
    h1: ({ children, ...props }) => <h1 {...props}>{children}</h1>,
    p: ({ children, ...props }) => <p {...props}>{children}</p>,
    section: ({ children, ...props }) => <section {...props}>{children}</section>,
  },
}));

// Mock heroicons
vi.mock('@heroicons/react/24/outline', () => ({
  StarIcon: ({ className }) => <svg className={className} data-testid="star-icon" />,
  HeartIcon: ({ className }) => <svg className={className} data-testid="heart-icon" />,
  BookOpenIcon: ({ className }) => <svg className={className} data-testid="book-open-icon" />,
  ArrowLeftIcon: ({ className }) => <svg className={className} data-testid="arrow-left-icon" />,
  ShareIcon: ({ className }) => <svg className={className} data-testid="share-icon" />,
}));

vi.mock('@heroicons/react/24/solid', () => ({
  HeartIcon: ({ className }) => <svg className={className} data-testid="heart-icon-solid" />,
}));

const mockBookData = {
  id: 'test-book-id',
  title: 'Test Book Title for Detail Page',
  authorName: 'Test Author Name',
  rating: 4.7,
  reviews: 350,
  genre: 'Science Fiction',
  description: 'This is a comprehensive description of the test book that provides detailed information about the plot, characters, and themes that readers can expect to find in this fascinating work of literature.',
  coverUrl: 'https://example.com/cover.jpg',
  alternativeCoverUrl: 'https://example.com/alt-cover.jpg',
  subjects: ['Science Fiction', 'Technology', 'Future', 'Adventure'],
  pageCount: 450,
  publishedDate: '2023-01-15',
  isbn: '978-0123456789',
  publisher: 'Test Publisher',
};

describe('BookOfTheMonthDetail Component', () => {
  const mockNavigate = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(fetchBookDetails).mockResolvedValue(mockBookData);
    // Mock useNavigate
    vi.doMock('react-router-dom', async () => {
      const actual = await vi.importActual('react-router-dom');
      return {
        ...actual,
        useNavigate: () => mockNavigate,
        useParams: () => ({ bookId: 'test-book-id' }),
      };
    });
  });

  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <BookOfTheMonthDetail />
      </BrowserRouter>
    );
  };

  it('renders loading state initially', () => {
    vi.mocked(fetchBookDetails).mockImplementation(() => new Promise(() => {}));
    renderComponent();
    
    expect(screen.getByText('Loading Book of the Month details...')).toBeInTheDocument();
  });

  it('renders book details correctly', async () => {
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByText('Test Book Title for Detail Page')).toBeInTheDocument();
      expect(screen.getByText('Test Author Name')).toBeInTheDocument();
      expect(screen.getByText('Science Fiction')).toBeInTheDocument();
      expect(screen.getByText('4.7')).toBeInTheDocument();
      expect(screen.getByText('(350 reviews)')).toBeInTheDocument();
    });
  });

  it('renders book of the month badge', async () => {
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByText('📚 Book of the Month')).toBeInTheDocument();
    });
  });

  it('renders breadcrumb navigation', async () => {
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByText('Home')).toBeInTheDocument();
      expect(screen.getByText('Book of the Month')).toBeInTheDocument();
    });
  });

  it('renders book cover image', async () => {
    renderComponent();
    
    await waitFor(() => {
      const bookImage = screen.getByRole('img', { name: /Test Book Title for Detail Page/i });
      expect(bookImage).toBeInTheDocument();
      expect(bookImage).toHaveAttribute('src', 'https://example.com/cover.jpg');
    });
  });

  it('handles image error gracefully', async () => {
    renderComponent();
    
    await waitFor(() => {
      const bookImage = screen.getByRole('img', { name: /Test Book Title for Detail Page/i });
      fireEvent.error(bookImage);
      expect(bookImage).toHaveAttribute('src', 'https://example.com/alt-cover.jpg');
    });
  });

  it('renders star rating system', async () => {
    renderComponent();
    
    await waitFor(() => {
      const stars = screen.getAllByTestId('star-icon');
      expect(stars.length).toBeGreaterThan(0);
    });
  });

  it('renders book subjects/tags', async () => {
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByText('Science Fiction')).toBeInTheDocument();
      expect(screen.getByText('Technology')).toBeInTheDocument();
      expect(screen.getByText('Future')).toBeInTheDocument();
    });
  });

  it('renders book description', async () => {
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByText(/This is a comprehensive description/)).toBeInTheDocument();
    });
  });

  it('toggles wishlist functionality', async () => {
    renderComponent();
    
    await waitFor(() => {
      const wishlistButton = screen.getByRole('button', { name: /Add to Wishlist/i });
      fireEvent.click(wishlistButton);
      expect(screen.getByText('Added to Wishlist')).toBeInTheDocument();
    });
  });

  it('handles back navigation', async () => {
    renderComponent();
    
    await waitFor(() => {
      const backButton = screen.getByRole('button', { name: /Back/i });
      fireEvent.click(backButton);
      expect(mockNavigate).toHaveBeenCalledWith(-1);
    });
  });

  it('handles API error gracefully', async () => {
    vi.mocked(fetchBookDetails).mockRejectedValue(new Error('API Error'));
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByText(/Failed to load book details/)).toBeInTheDocument();
    });
  });

  it('handles null book data', async () => {
    vi.mocked(fetchBookDetails).mockResolvedValue(null);
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByText(/Book not found/)).toBeInTheDocument();
    });
  });

  it('renders featured badge', async () => {
    renderComponent();
    
    await waitFor(() => {
      expect(screen.getByText('Book of the Month')).toBeInTheDocument();
    });
  });

  it('renders share functionality', async () => {
    renderComponent();
    
    await waitFor(() => {
      const shareButton = screen.getByRole('button', { name: /Share/i });
      expect(shareButton).toBeInTheDocument();
    });
  });
});