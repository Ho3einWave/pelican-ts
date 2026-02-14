# Error Handling

The Pterodactyl API uses conventional HTTP response codes to indicate the success or failure of an API request. Understanding these error codes and how to handle them is crucial for building robust integrations.

## HTTP Status Codes

| Status Code | Description |
|-------------|-------------|
| `200` | OK - Request succeeded |
| `201` | Created - Resource created successfully |
| `204` | No Content - Request succeeded, no content to return |
| `400` | Bad Request - Invalid request parameters |
| `401` | Unauthorized - Invalid or missing authentication |
| `403` | Forbidden - Insufficient permissions |
| `404` | Not Found - Resource doesn't exist |
| `422` | Unprocessable Entity - Validation errors |
| `429` | Too Many Requests - Rate limit exceeded |
| `500` | Internal Server Error - Something went wrong on the server |
| `502` | Bad Gateway - Server is down or unreachable |

## Error Response Format

All API errors return a consistent JSON structure:

```json
{
  "errors": [
    {
      "code": "ErrorCode",
      "status": "400",
      "detail": "Human-readable error message",
      "source": {
        "field": "field_name"
      }
    }
  ]
}
```

### Error Object Fields

| Field | Description |
|-------|-------------|
| `code` | Machine-readable error identifier |
| `status` | HTTP status code |
| `detail` | Human-readable error description |
| `source` | *(Optional)* Points to the specific field causing the error |

## Common Error Types

### Authentication Errors

#### 401 - Invalid Credentials
```json
{
  "errors": [
    {
      "code": "InvalidCredentialsException",
      "status": "401",
      "detail": "The credentials provided were invalid."
    }
  ]
}
```

#### 403 - Insufficient Permissions
```json
{
  "errors": [
    {
      "code": "InsufficientPermissionsException", 
      "status": "403",
      "detail": "This action requires additional permissions."
    }
  ]
}
```

### Validation Errors

#### 422 - Field Validation
```json
{
  "errors": [
    {
      "code": "required",
      "status": "422",
      "detail": "The name field is required.",
      "source": {
        "field": "name"
      }
    },
    {
      "code": "email",
      "status": "422", 
      "detail": "The email must be a valid email address.",
      "source": {
        "field": "email"
      }
    }
  ]
}
```

### Resource Errors

#### 404 - Not Found
```json
{
  "errors": [
    {
      "code": "NotFoundHttpException",
      "status": "404", 
      "detail": "The requested resource could not be found."
    }
  ]
}
```

### Server Errors

#### 502 - Server Offline
```json
{
  "errors": [
    {
      "code": "HttpException",
      "status": "502",
      "detail": "An error was encountered while processing this request."
    }
  ]
}
```

## Error Handling Best Practices

### 1. Always Check Status Codes
```javascript
async function apiRequest(url, options) {
  const response = await fetch(url, options);
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`API Error ${response.status}: ${errorData.errors[0].detail}`);
  }
  
  return response.json();
}
```

### 2. Handle Specific Error Types
```javascript
async function handleApiError(error, response) {
  const errorData = await response.json();
  const firstError = errorData.errors[0];
  
  switch (response.status) {
    case 401:
      // Redirect to login or refresh token
      window.location.href = '/login';
      break;
      
    case 403:
      // Show permission denied message
      showNotification('You do not have permission for this action');
      break;
      
    case 422:
      // Handle validation errors
      errorData.errors.forEach(error => {
        if (error.source?.field) {
          showFieldError(error.source.field, error.detail);
        }
      });
      break;
      
    case 429:
      // Implement retry with backoff
      setTimeout(() => retryRequest(), 60000);
      break;
      
    case 502:
      // Server is down
      showNotification('Service temporarily unavailable');
      break;
      
    default:
      // Generic error handling
      showNotification(`An error occurred: ${firstError.detail}`);
  }
}
```

### 3. Implement Retry Logic
```javascript
async function apiRequestWithRetry(url, options, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);
      
      if (response.ok) {
        return response.json();
      }
      
      // Don't retry client errors (4xx), only server errors (5xx)
      if (response.status >= 400 && response.status < 500) {
        throw new Error(`Client error: ${response.status}`);
      }
      
      if (attempt === maxRetries) {
        throw new Error(`Server error after ${maxRetries} attempts: ${response.status}`);
      }
      
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      
    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
    }
  }
}
```

### 4. Log Errors for Debugging
```javascript
function logApiError(error, request) {
  console.error('API Error:', {
    url: request.url,
    method: request.method,
    status: error.status,
    message: error.message,
    timestamp: new Date().toISOString()
  });
  
  // Send to error tracking service
  // errorTracker.captureException(error, { extra: request });
}
```

## Specific Error Scenarios

### Server Power Actions
When a server is offline, power actions may return 502:
```json
{
  "errors": [
    {
      "code": "HttpException",
      "status": "502",
      "detail": "An error was encountered while processing this request."
    }
  ]
}
```

### File Operations
File operations may fail if the file doesn't exist:
```json
{
  "errors": [
    {
      "code": "NotFoundHttpException", 
      "status": "404",
      "detail": "The requested file could not be found."
    }
  ]
}
```

### Database Operations
Database creation may fail due to limits:
```json
{
  "errors": [
    {
      "code": "DisplayException",
      "status": "400", 
      "detail": "This server has reached its database creation limit."
    }
  ]
}
```

## Error Recovery Strategies

1. **Graceful Degradation** - Provide fallback functionality when APIs fail
2. **User-Friendly Messages** - Transform technical errors into user-friendly language
3. **Retry Mechanisms** - Automatically retry transient failures
4. **Circuit Breakers** - Stop making requests when services are consistently failing
5. **Monitoring & Alerting** - Track error rates and patterns

## Next Steps

- Review [Rate Limiting](./rate-limiting) to avoid 429 errors
- Explore the [Client API](./api/client) documentation
- Check [Authentication](./authentication) to prevent 401/403 errors 