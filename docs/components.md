# Component Documentation

## Component Structure

The project follows a structured approach to component organization:

```
src/components/
├── auth/              # Authentication components
│   └── ProtectedRoute.tsx
├── layout/           # Layout components
│   ├── Layout.tsx
│   ├── Navbar.tsx
│   └── Sidebar.tsx
├── properties/       # Property management components
│   ├── AddPropertyModal.tsx
│   └── UnitList.tsx
├── settings/        # Settings components
│   ├── AdminSettings.tsx
│   └── UserProfile.tsx
├── tenants/         # Tenant management components
│   ├── AddTenantModal.tsx
│   └── TenantDetailsModal.tsx
└── ui/              # Reusable UI components
    ├── Card.tsx
    ├── LoadingSpinner.tsx
    ├── Table.tsx
    ├── Form/
    │   ├── FormField.tsx
    │   ├── Input.tsx
    │   └── Select.tsx
    └── Table/
        ├── Table.tsx
        └── TablePagination.tsx
```

## Component Guidelines

### Design Principles

1. **Generic Design**
   - Components should be generic and reusable
   - Accept props for customization
   - Follow single responsibility principle
   - Use TypeScript interfaces for props

2. **Accessibility**
   - Follow ARIA guidelines
   - Include proper aria labels
   - Support keyboard navigation
   - Maintain focus management

3. **Performance**
   - Optimize re-renders
   - Use React.memo when beneficial
   - Implement proper dependency arrays
   - Avoid unnecessary state updates

4. **Testing**
   - Write comprehensive unit tests
   - Include integration tests
   - Test accessibility features
   - Test edge cases

### Shadcn UI Integration

All Shadcn UI components are integrated in the `src/components/ui` directory. Current integrations include:

- Button (`button.tsx`)
- Card (`card.tsx`)
- Avatar (`avatar.tsx`)
- Label (`label.tsx`)
- Input (`input.tsx`)

#### Usage Example:
```tsx
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export function Example() {
  return (
    <Card>
      <Button variant="primary">Click Me</Button>
    </Card>
  )
}
```

### Component Development Standards

1. **TypeScript Usage**
```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant,
  size = 'md',
  children,
  onClick,
  disabled
}) => {
  // Implementation
};
```

2. **Styling**
```typescript
const styles = {
  base: 'rounded-md font-medium transition-colors',
  variants: {
    primary: 'bg-primary text-white hover:bg-primary-dark',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300'
  },
  sizes: {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  }
};
```

3. **Testing**
```typescript
describe('Button', () => {
  it('renders correctly', () => {
    render(<Button variant="primary">Click Me</Button>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('handles click events', () => {
    const onClick = jest.fn();
    render(<Button variant="primary" onClick={onClick}>Click Me</Button>);
    fireEvent.click(screen.getByText('Click Me'));
    expect(onClick).toHaveBeenCalled();
  });
});
```

### Component Documentation Template

Each component should include the following documentation:

```typescript
/**
 * @component ComponentName
 * @description Brief description of the component's purpose
 *
 * @example
 * ```tsx
 * <ComponentName
 *   prop1="value"
 *   prop2={123}
 * />
 * ```
 *
 * @props
 * @prop {string} prop1 - Description of prop1
 * @prop {number} prop2 - Description of prop2
 *
 * @accessibility
 * - List of accessibility features
 * - ARIA roles used
 * - Keyboard interactions
 *
 * @performance
 * - Performance considerations
 * - Optimization techniques used
 *
 * @dependencies
 * - List of dependencies
 * - Required context providers
 */
```

### Best Practices

1. **Component Composition**
```typescript
// Prefer composition
const Card = ({ header, content, footer }) => (
  <div className="card">
    {header && <CardHeader>{header}</CardHeader>}
    <CardContent>{content}</CardContent>
    {footer && <CardFooter>{footer}</CardFooter>}
  </div>
);

// Over inheritance
class Card extends BaseCard {
  render() {
    return <div>{this.props.children}</div>;
  }
}
```

2. **State Management**
```typescript
// Local state
const [isOpen, setIsOpen] = useState(false);

// Redux state
const dispatch = useDispatch();
const data = useSelector(selectData);

// Context
const { theme } = useTheme();
```

3. **Error Handling**
```typescript
const Component = () => {
  const [error, setError] = useState<Error | null>(null);

  if (error) {
    return <ErrorBoundary error={error} />;
  }

  return <div>Content</div>;
};
```

### Component Review Checklist

Before considering a component complete, ensure:

- [ ] TypeScript types are properly defined
- [ ] Props are documented
- [ ] Component is tested
- [ ] Accessibility features are implemented
- [ ] Performance is optimized
- [ ] Error handling is in place
- [ ] Documentation is complete
- [ ] Styling follows project conventions
- [ ] Component is properly exported
- [ ] Examples are provided

### Future Considerations

1. **Storybook Integration**
   - Component showcase
   - Interactive documentation
   - Visual testing
   - Props documentation

2. **Performance Monitoring**
   - Component render tracking
   - Bundle size analysis
   - Performance regression testing

3. **Accessibility Testing**
   - Automated a11y tests
   - Screen reader testing
   - Keyboard navigation testing
