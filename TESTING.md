# BookHive Testing Documentation

This document outlines the testing strategy and implementation for the BookHive application.

## Frontend Testing (Vitest + React Testing Library)

The frontend uses Vitest as the test runner with React Testing Library for component testing.

### Test Structure

- **Component Tests**: Located in `src/components/__tests__/`
- **Service Tests**: Located in `src/services/__tests__/`
- **Context Tests**: Located in `src/context/__tests__/`

### Running Frontend Tests

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Run tests
npm test

# Run tests with watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

### Frontend Test Types

1. **Component Tests**: Verify that UI components render correctly and respond to user interactions
2. **Service Tests**: Ensure API services correctly handle data fetching and processing
3. **Context Tests**: Validate that context providers manage state correctly

## Backend Testing (Jest + Supertest)

The backend uses Jest as the test runner with Supertest for API testing.

### Test Structure

- **Model Tests**: Located in `models/__tests__/`
- **Route Tests**: Located in `routes/__tests__/`
- **Middleware Tests**: Located in `middleware/__tests__/`

### Running Backend Tests

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Run tests
npm test

# Run tests with watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

### Backend Test Types

1. **Model Tests**: Verify database models, validations, and methods
2. **Route Tests**: Test API endpoints for correct responses and error handling
3. **Middleware Tests**: Ensure middleware functions like authentication work correctly

## Test Coverage

The test coverage reports can be generated using:

```bash
npm run test:coverage
```

This will create a `coverage` directory with detailed reports on test coverage.

## Mocking

- **API Calls**: External API calls are mocked to avoid network dependencies
- **Authentication**: JWT verification and user authentication are mocked for testing protected routes
- **Database**: MongoDB operations are mocked or use an in-memory database for testing

## Continuous Integration

Tests are designed to be run in CI/CD pipelines to ensure code quality before deployment.