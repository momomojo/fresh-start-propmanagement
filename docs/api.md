# Property Management API Documentation

## Authentication

### User Management
```typescript
// Sign up a new user
POST /auth/signup
{
  email: string;
  password: string;
  role: 'admin' | 'property_manager' | 'tenant';
}

// Sign in existing user
POST /auth/signin
{
  email: string;
  password: string;
}
```

## Properties

### Property Management
```typescript
// Create property
POST /properties
{
  name: string;
  address: string;
  units: number;
  amenities: string[];
}

// Get all properties
GET /properties

// Get single property
GET /properties/:id

// Update property
PUT /properties/:id
{
  name?: string;
  address?: string;
  units?: number;
  amenities?: string[];
}

// Delete property
DELETE /properties/:id
```

### Unit Management
```typescript
// Create unit
POST /properties/:propertyId/units
{
  number: string;
  type: string;
  size: number;
  rent: number;
  status: 'available' | 'occupied' | 'maintenance';
}

// Get all units for property
GET /properties/:propertyId/units

// Get single unit
GET /properties/:propertyId/units/:unitId

// Update unit
PUT /properties/:propertyId/units/:unitId
{
  number?: string;
  type?: string;
  size?: number;
  rent?: number;
  status?: 'available' | 'occupied' | 'maintenance';
}

// Delete unit
DELETE /properties/:propertyId/units/:unitId
```

## Tenants

### Tenant Management
```typescript
// Create tenant
POST /tenants
{
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  documents: string[];
}

// Get all tenants
GET /tenants

// Get single tenant
GET /tenants/:id

// Update tenant
PUT /tenants/:id
{
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  documents?: string[];
}

// Delete tenant
DELETE /tenants/:id
```

## Leases

### Lease Management
```typescript
// Create lease
POST /leases
{
  tenantId: string;
  unitId: string;
  startDate: string;
  endDate: string;
  rent: number;
  deposit: number;
}

// Get all leases
GET /leases

// Get single lease
GET /leases/:id

// Update lease
PUT /leases/:id
{
  startDate?: string;
  endDate?: string;
  rent?: number;
  deposit?: number;
}

// Delete lease
DELETE /leases/:id
```

## Maintenance

### Maintenance Requests
```typescript
// Create maintenance request
POST /maintenance
{
  unitId: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed';
}

// Get all maintenance requests
GET /maintenance

// Get single maintenance request
GET /maintenance/:id

// Update maintenance request
PUT /maintenance/:id
{
  title?: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  status?: 'pending' | 'in_progress' | 'completed';
}

// Delete maintenance request
DELETE /maintenance/:id
```

## Payments

### Payment Management
```typescript
// Create payment
POST /payments
{
  leaseId: string;
  amount: number;
  type: 'rent' | 'deposit' | 'fee';
  status: 'pending' | 'completed' | 'failed';
}

// Get all payments
GET /payments

// Get single payment
GET /payments/:id

// Update payment
PUT /payments/:id
{
  status?: 'pending' | 'completed' | 'failed';
}
```

## Documents

### Document Management
```typescript
// Upload document
POST /documents
FormData {
  file: File;
  type: 'lease' | 'maintenance' | 'payment';
  relatedId: string;
}

// Get all documents
GET /documents

// Get single document
GET /documents/:id

// Delete document
DELETE /documents/:id
```

## Error Responses

All endpoints follow the same error response format:

```typescript
{
  error: {
    code: string;
    message: string;
    details?: any;
  }
}
```

Common error codes:
- `auth/unauthorized`: User is not authenticated
- `auth/forbidden`: User does not have required permissions
- `validation/invalid`: Invalid request data
- `resource/not-found`: Requested resource not found
- `server/error`: Internal server error
