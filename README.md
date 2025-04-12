# Drug Indication Service

A NestJS-based microservice for managing drug indications and their mappings to standardized medical vocabulary (ICD-10 codes). This service implements a clean architecture approach with domain-driven design principles, ensuring separation of concerns and maintainability.

## Table of Contents
- [Setup Instructions](#setup-instructions)
- [API Documentation](#api-documentation)
- [Sample Output](#sample-output)
- [Current Implementation](#current-implementation)
- [Future Improvements](#future-improvements)
- [Production Considerations](#production-considerations)
- [Unimplemented Core Features](#unimplemented-core-features)
- [Implementation Roadmap](#implementation-roadmap)

## Setup Instructions

### Prerequisites
- Node.js >= 20.19.0 (LTS version recommended for production)
- Docker >= 24.0.0 and Docker Compose >= 2.20.0
- MongoDB >= 7.0 (included in Docker setup)
- Git for version control

### Local Development Setup

1. Clone the repository:
```bash
git clone https://github.com/douglasyokoyama/drug-indication-service.git
cd drug-indication-service
```

2. Install dependencies:
```bash
# Install production dependencies
npm install --production=false

# Install development dependencies
npm install --only=dev
```

3. Create a `.env` file in the root directory with the following configuration:
```env
# Application Configuration
PORT=3000                       # Default port
NODE_ENV=development           # Environment mode

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/drug-indication-service
MONGODB_USER=admin              # Optional: for production
MONGODB_PASSWORD=password       # Optional: for production

# JWT Configuration
JWT_SECRET=your-secret-key-here  # Use a strong, random key in production
JWT_EXPIRATION_TIME=1h          # Token expiration time
```

4. Start the development server:
```bash
# Start in development mode with hot-reload
npm run start:dev

# Start in production mode
npm run start:prod
```

### Docker Deployment

1. Build and start the containers:
```bash
# Build and start all services
docker-compose up -d

# Build specific service
docker-compose up -d --build app
```

2. View logs:
```bash
# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f app
```

3. Stop the containers:
```bash
# Stop and remove containers
docker-compose down

# Stop and remove containers with volumes
docker-compose down -v
```

## API Documentation

The API documentation is available through Swagger UI at:
```
http://localhost:3000/api-docs
```

### Authentication
- All endpoints (except login/signup) require JWT authentication
- Include the token in the Authorization header: `Bearer <token>`
- Token expiration is configurable via `JWT_EXPIRATION_TIME`
- Tokens are signed using HS256 algorithm

### Available Endpoints

#### Authentication
- `POST /auth/login` 
  - Request body: `{ email: string, password: string }`
  - Response: JWT token and user details

- `POST /auth/sign-in`
  - Request body: `{ name: string, email: string, password: string }`
  - Response: Created user details

#### Drug Indications
- `GET /drug-indications`
  - Query params: 
    - `drugName`: string (optional)
    - `icd10Code`: string (optional)
  - Response: List of drug indications

- `POST /drug-indications`
  - Request body: 
    ```json
    {
      "drugName": "string",
      "indication": "string",
      "icd10Code": "string",
      "description": "string"
    }
    ```
  - Response: Created drug indication

- `GET /drug-indications/:id`
  - Response: Single drug indication

- `PUT /drug-indications/:id`
  - Request body: Same as POST
  - Response: Updated drug indication

- `DELETE /drug-indications/:id`
  - Response: 204 No Content

## Sample Output

### Login Response
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "USER",
    "createdAt": "2024-03-15T10:00:00.000Z",
    "updatedAt": "2024-03-15T10:00:00.000Z"
  }
}
```

### Drug Indication Response
```json
{
  "_id": "67f9fd35973402d95bfbf1cb",
  "drugName": "Dupixent",
  "indication": "Atopic Dermatitis",
  "icd10Code": "L20.89",
  "description": "For moderate-to-severe atopic dermatitis in adults and adolescents aged 12 years and older",
  "createdAt": "2025-04-12T05:42:13.260Z",
  "updatedAt": "2025-04-12T05:42:39.608Z",
  "__v": 0
}
```

## Current Implementation

### Core Features
- **Authentication System**
  - JWT-based authentication
  - Role-based access control
  - Secure password hashing with bcrypt
  - Token expiration management

- **Drug Indication Management**
  - CRUD operations for drug indications
  - Search by drug name and ICD-10 code
  - Input validation and error handling
  - MongoDB integration with indexes

- **Architecture**
  - Clean Architecture implementation
  - Domain-driven design principles
  - Repository pattern for data access
  - Use-case pattern for business logic

### Technical Stack
- **Backend**
  - NestJS framework
  - MongoDB with Mongoose
  - JWT for authentication
  - Class-validator for input validation

- **Development Tools**
  - Docker and Docker Compose
  - Jest for testing
  - Swagger for API documentation
  - ESLint for code quality

## Future Improvements

The following features are identified as potential improvements that require deeper technical consideration and careful implementation:

### Authentication & Security
1. **Rate Limiting**
   - Implementation requires careful consideration of:
     - Distributed rate limiting in a microservices environment
     - Different rate limits for different endpoints
     - Handling of edge cases and error scenarios

2. **Enhanced Password Policies**
   - Implementation requires:
     - Secure password storage strategies
     - Password rotation policies
     - Multi-factor authentication integration

### API Enhancements
1. **Pagination & Sorting**
   - Implementation requires:
     - Efficient database querying
     - Cursor-based pagination for large datasets
     - Consistent sorting across different data types

2. **Caching Strategy**
   - Implementation requires:
     - Cache invalidation strategies
     - Distributed caching in a microservices environment
     - Cache warming mechanisms

### Performance Optimization
1. **Response Compression**
   - Implementation requires:
     - Compression level optimization
     - CPU usage considerations
     - Client compatibility testing

2. **Request Batching**
   - Implementation requires:
     - Transaction management
     - Error handling strategies
     - Performance impact analysis

### Monitoring & Observability
1. **Metrics Collection**
   - Implementation requires:
     - Metric aggregation strategies
     - Storage and retention policies
     - Alert threshold configuration

2. **Distributed Tracing**
   - Implementation requires:
     - Trace context propagation
     - Sampling strategies
     - Storage and analysis tools

## Production Considerations

### Current Production-Ready Features
1. **Security**
   - JWT token management
   - Input validation
   - Error handling
   - Environment configuration

2. **Scalability**
   - Docker containerization
   - MongoDB indexing
   - Clean architecture design

3. **Maintainability**
   - Modular code structure
   - Comprehensive documentation
   - Testing coverage

### Areas Requiring Attention
1. **Data Consistency**
   - MongoDB transactions
   - Error recovery strategies
   - Data validation rules

2. **Performance**
   - Query optimization
   - Connection pool management
   - Memory usage monitoring

3. **Deployment**
   - Zero-downtime deployment
   - Database migration strategies
   - Environment configuration

4. **Monitoring**
   - Log aggregation
   - Error tracking
   - Performance monitoring

## Unimplemented Core Features

The following core features from the original requirements have not been implemented yet. This section outlines their importance and potential implementation strategies.

### 1. Data Extraction from DailyMed

**Current Status**: Not Implemented
**Importance**: Critical for automated data collection and updates

**Implementation Strategy**:
1. **DailyMed API Integration**
   ```typescript
   // src/infrastructure/external/dailymed.service.ts
   @Injectable()
   export class DailyMedService {
     private readonly BASE_URL = 'https://dailymed.nlm.nih.gov/dailymed';
     
     async fetchDrugLabel(drugId: string): Promise<DrugLabel> {
       // Implementation for fetching and parsing drug labels
     }
   }
   ```

2. **Label Parsing Service**
   ```typescript
   // src/application/drug-indications/services/label-parser.service.ts
   @Injectable()
   export class LabelParserService {
     extractIndications(label: DrugLabel): DrugIndication[] {
       // Implementation for extracting indications from labels
     }
   }
   ```

### 2. ICD-10 Code Mapping

**Current Status**: Not Implemented
**Importance**: Essential for standardized medical vocabulary

**Implementation Strategy**:
1. **ICD-10 Service**
   ```typescript
   // src/application/drug-indications/services/icd10-mapper.service.ts
   @Injectable()
   export class Icd10MapperService {
     async mapIndicationToCode(indication: string): Promise<string> {
       // Implementation for mapping indications to ICD-10 codes
     }
   }
   ```

2. **Mapping Rules Engine**
   ```typescript
   // src/domain/drug-indications/rules/mapping.rules.ts
   export class MappingRules {
     static getSynonyms(term: string): string[] {
       // Implementation for handling medical term synonyms
     }
   }
   ```

### 3. Eligibility Processing

**Current Status**: Not Implemented
**Importance**: Required for processing copay card eligibility details

**Implementation Strategy**:
1. **Eligibility Parser**
   ```typescript
   // src/application/eligibility/services/eligibility-parser.service.ts
   @Injectable()
   export class EligibilityParserService {
     async parseEligibilityDetails(text: string): Promise<EligibilityRules> {
       // Implementation for parsing eligibility text
     }
   }
   ```

2. **Rule-Based Transformer**
   ```typescript
   // src/application/eligibility/services/rule-transformer.service.ts
   @Injectable()
   export class RuleTransformerService {
     transformToStructuredData(rules: EligibilityRules): StructuredEligibility {
       // Implementation for converting rules to structured data
     }
   }
   ```

### 4. AI-Powered Extraction

**Current Status**: Not Implemented
**Importance**: Enhances accuracy of data extraction and mapping

**Implementation Strategy**:
1. **AI Service Integration**
   ```typescript
   // src/infrastructure/ai/ai-extraction.service.ts
   @Injectable()
   export class AiExtractionService {
     async extractStructuredData(text: string): Promise<StructuredData> {
       // Implementation for AI-powered data extraction
     }
   }
   ```

2. **Validation Service**
   ```typescript
   // src/application/validation/services/ai-validation.service.ts
   @Injectable()
   export class AiValidationService {
     async validateExtraction(data: StructuredData): Promise<ValidationResult> {
       // Implementation for validating AI-extracted data
     }
   }
   ```
