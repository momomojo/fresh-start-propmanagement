# Development Guidelines

## Project Structure

```
src/
├── components/           # React components
│   ├── auth/            # Authentication components
│   ├── layout/          # Layout components
│   ├── properties/      # Property management components
│   ├── settings/        # Settings components
│   ├── tenants/         # Tenant management components
│   └── ui/              # Reusable UI components
├── lib/
│   ├── db/             # Database configuration and models
│   ├── firebase/       # Firebase configuration and services
│   ├── monitoring/     # Error tracking and monitoring
│   ├── services/       # Business logic services
│   ├── store/          # Redux store configuration
│   └── utils/          # Utility functions
├── pages/              # Page components
└── types/              # TypeScript type definitions
```

## Code Style

### TypeScript
- Use TypeScript for all new code
- Define interfaces for all props and state
- Use type inference where possible
- Avoid using `any` type
- Use union types instead of enums

```typescript
// Good
type Status = 'pending' | 'active' | 'completed';

// Bad
enum Status {
  Pending,
  Active,
  Completed
}
```

### React Components
- Use functional components with hooks
- Use TypeScript interfaces for props
- Keep components focused and small
- Use composition over inheritance

```typescript
// Good
interface ButtonProps {
  variant: 'primary' | 'secondary';
  children: React.ReactNode;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ variant, children, onClick }) => {
  return (
    <button 
      className={`btn btn-${variant}`} 
      onClick={onClick}
    >
      {children}
    </button>
  );
};

// Bad
class Button extends React.Component {
  render() {
    return <button>{this.props.children}</button>;
  }
}
```

### State Management
- Use Redux Toolkit for global state
- Use local state for component-specific state
- Keep Redux actions and reducers type-safe
- Use Redux Toolkit's createSlice for reducers

```typescript
// Good
const slice = createSlice({
  name: 'properties',
  initialState,
  reducers: {
    addProperty: (state, action: PayloadAction<Property>) => {
      state.properties.push(action.payload);
    }
  }
});

// Bad
const reducer = (state, action) => {
  switch (action.type) {
    case 'ADD_PROPERTY':
      return { ...state, properties: [...state.properties, action.payload] };
    default:
      return state;
  }
};
```

### Testing
- Write tests for all new components and functions
- Use React Testing Library for component tests
- Use Jest for unit tests
- Aim for 95% test coverage

```typescript
// Good
describe('PropertyCard', () => {
  it('renders property details correctly', () => {
    const property = {
      id: '1',
      name: 'Test Property',
      address: '123 Test St'
    };
    
    render(<PropertyCard property={property} />);
    
    expect(screen.getByText('Test Property')).toBeInTheDocument();
    expect(screen.getByText('123 Test St')).toBeInTheDocument();
  });
});
```

### Error Handling
- Use the monitoring system for error tracking
- Add context to errors when capturing
- Use error boundaries for component errors
- Log meaningful error messages

```typescript
// Good
try {
  await saveProperty(property);
} catch (error) {
  captureError(error, {
    context: 'PropertyForm',
    propertyData: property
  });
}

// Bad
try {
  await saveProperty(property);
} catch (error) {
  console.error(error);
}
```

## Git Workflow

### Branches
- `main`: Production-ready code
- `develop`: Development branch
- Feature branches: `feature/feature-name`
- Bug fixes: `fix/bug-name`

### Commits
- Use conventional commits format
- Include ticket number if applicable
- Keep commits focused and atomic

```
feat(properties): add unit management functionality
fix(auth): resolve login redirect issue
docs(api): update authentication documentation
```

### Pull Requests
- Create PR from feature branch to develop
- Include description of changes
- Link related issues
- Add tests for new functionality
- Update documentation if needed

## Deployment

### Environment Variables
- Use `.env` files for environment variables
- Never commit sensitive values
- Use different values for development/production

```
VITE_FIREBASE_API_KEY=xxx
VITE_FIREBASE_AUTH_DOMAIN=xxx
VITE_FIREBASE_PROJECT_ID=xxx
VITE_SENTRY_DSN=xxx
```

### Build Process
- Run tests before building
- Check for TypeScript errors
- Optimize bundle size
- Update version number

```bash
npm run test
npm run build
```

### Monitoring
- Check Sentry for errors after deployment
- Monitor performance metrics
- Review usage analytics
- Check for security alerts

## Security

### Authentication
- Use Firebase Authentication
- Implement role-based access control
- Secure all API endpoints
- Use HTTPS for all requests

### Data Protection
- Validate all user input
- Sanitize data before display
- Use Firebase Security Rules
- Regular security audits

## Performance

### Optimization
- Use code splitting
- Implement lazy loading
- Optimize images
- Use caching strategies

### Monitoring
- Track page load times
- Monitor API response times
- Check bundle sizes
- Review performance metrics

## Documentation

### Code Documentation
- Document complex functions
- Add JSDoc comments
- Keep README up to date
- Document API endpoints

### Component Documentation
- Document props and types
- Add usage examples
- Document side effects
- Include accessibility notes
