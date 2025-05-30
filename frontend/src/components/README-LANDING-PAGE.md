# BookHive Landing Page Components

This document provides an overview of the new landing page components added to enhance the user experience.

## New Components

### 1. PopularCategories

A dynamic component that showcases books by genre categories. Users can click on different genre tabs to see books from that category.

**Features:**
- Tab-based navigation between book genres
- Animated transitions between categories
- Book cards with cover images, titles, authors, and publication years
- Data fetched from Open Library API
- GSAP animations for entrance effects
- Responsive design for all screen sizes

**Dependencies:**
- framer-motion: For smooth tab transitions
- gsap: For scroll-triggered animations
- Open Library API: For book data

### 2. RecentReviews

A carousel component that displays recent book reviews from the community.

**Features:**
- Carousel navigation with previous/next buttons
- Automatic rotation of reviews
- Indicator dots for current position
- Book cover images with review text
- Rating stars visualization
- User information and review dates
- Fallback to mock data if no reviews exist

**Dependencies:**
- framer-motion: For carousel animations
- gsap: For entrance animations
- axios: For API requests

### 3. BookOfTheMonth

A featured section highlighting a special book selection with detailed information.

**Features:**
- 3D interactive book cover with hover effects
- Detailed book information (title, author, rating, publication year)
- Genre tags
- Book description
- Notable quotes from the book
- Call-to-action buttons
- GSAP animations for entrance and hover effects

**Dependencies:**
- gsap: For 3D animations and scroll effects
- axios: For API requests

## Implementation Notes

1. **API Integration:**
   - All components fetch data from the Open Library API
   - Fallback mechanisms are in place if API requests fail
   - Mock data is generated when needed

2. **Animation Technologies:**
   - GSAP for scroll-triggered animations and 3D effects
   - Framer Motion for UI transitions and carousels

3. **Responsive Design:**
   - All components are fully responsive
   - Layout adjusts for mobile, tablet, and desktop views

4. **Performance Considerations:**
   - Lazy loading of images
   - Efficient state management
   - Optimized animations for smooth performance

## Required Dependencies

Make sure to install these dependencies:

```bash
npm install framer-motion gsap three
```

## Usage

These components are automatically included in the landing page route in `App.jsx`. The order of components is:

1. Hero (existing component)
2. FeaturedBooks (existing component)
3. BookOfTheMonth (new)
4. PopularCategories (new)
5. RecentReviews (new)

## Customization

Each component has its own CSS file in the `styles` directory. You can modify these files to change the appearance of the components.