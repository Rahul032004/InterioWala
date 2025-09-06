/**
 * Global error handling utility for the application
 * Provides standardized error handling, logging, and fallback mechanisms
 */

// Error types for better categorization
export enum ErrorType {
  DATABASE = 'DATABASE_ERROR',
  NETWORK = 'NETWORK_ERROR',
  AUTHENTICATION = 'AUTHENTICATION_ERROR',
  VALIDATION = 'VALIDATION_ERROR',
  NOT_FOUND = 'NOT_FOUND_ERROR',
  PERMISSION = 'PERMISSION_ERROR',
  UNKNOWN = 'UNKNOWN_ERROR'
}

// Error severity levels
export enum ErrorSeverity {
  LOW = 'LOW',       // Non-critical errors that don't affect core functionality
  MEDIUM = 'MEDIUM', // Errors that affect some functionality but not critical paths
  HIGH = 'HIGH',     // Errors that affect critical functionality
  CRITICAL = 'CRITICAL' // System-breaking errors that require immediate attention
}

// Interface for structured error information
export interface ErrorInfo {
  type: ErrorType;
  message: string;
  severity: ErrorSeverity;
  originalError?: any;
  context?: Record<string, any>;
  timestamp: string;
}

/**
 * Creates a standardized error object with all necessary information
 */
export function createErrorInfo(
  type: ErrorType,
  message: string,
  severity: ErrorSeverity = ErrorSeverity.MEDIUM,
  originalError?: any,
  context?: Record<string, any>
): ErrorInfo {
  return {
    type,
    message,
    severity,
    originalError,
    context,
    timestamp: new Date().toISOString()
  };
}

/**
 * Handles errors in a standardized way across the application
 * Logs errors, performs fallback actions, and returns appropriate responses
 */
export function handleError(
  error: any,
  defaultMessage = 'An unexpected error occurred',
  type = ErrorType.UNKNOWN,
  severity = ErrorSeverity.MEDIUM,
  context?: Record<string, any>
): ErrorInfo {
  // Extract error message if available
  const errorMessage = error?.message || defaultMessage;
  
  // Create standardized error info
  const errorInfo = createErrorInfo(
    type,
    errorMessage,
    severity,
    error,
    context
  );
  
  // Log error based on severity
  logError(errorInfo);
  
  return errorInfo;
}

/**
 * Logs errors with appropriate detail based on severity
 */
function logError(errorInfo: ErrorInfo): void {
  const { type, message, severity, originalError, context, timestamp } = errorInfo;
  
  // Basic error information for all logs
  const logData = {
    type,
    message,
    severity,
    timestamp,
    ...(context && { context })
  };
  
  // Log with appropriate level based on severity
  switch (severity) {
    case ErrorSeverity.CRITICAL:
    case ErrorSeverity.HIGH:
      console.error('ERROR:', logData, originalError);
      // In a production app, you might send these to a monitoring service
      break;
    case ErrorSeverity.MEDIUM:
      console.warn('WARNING:', logData, originalError);
      break;
    case ErrorSeverity.LOW:
      console.info('INFO:', logData, originalError);
      break;
  }
}

/**
 * Wraps an async function with standardized error handling
 * @param fn The async function to wrap
 * @param errorType The type of error to use if the function throws
 * @param defaultMessage The default message to use if the function throws
 * @param severity The severity of the error if the function throws
 * @param context Additional context to include in the error
 */
export async function withErrorHandling<T>(
  fn: () => Promise<T>,
  errorType = ErrorType.UNKNOWN,
  defaultMessage = 'An unexpected error occurred',
  severity = ErrorSeverity.MEDIUM,
  context?: Record<string, any>
): Promise<{ data: T | null; error: ErrorInfo | null }> {
  try {
    const result = await fn();
    return { data: result, error: null };
  } catch (error) {
    const errorInfo = handleError(error, defaultMessage, errorType, severity, context);
    return { data: null, error: errorInfo };
  }
}

/**
 * Provides a fallback value if an operation fails
 * @param fn The function that might fail
 * @param fallbackValue The value to return if the function fails
 * @param errorHandler Optional custom error handler
 */
export async function withFallback<T>(
  fn: () => Promise<T>,
  fallbackValue: T,
  errorHandler?: (error: any) => void
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (errorHandler) {
      errorHandler(error);
    } else {
      console.error('Operation failed, using fallback:', error);
    }
    return fallbackValue;
  }
}

/**
 * Retries an async operation with exponential backoff
 * @param fn The function to retry
 * @param maxRetries Maximum number of retry attempts
 * @param initialDelay Initial delay in milliseconds
 * @param maxDelay Maximum delay in milliseconds
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  initialDelay = 300,
  maxDelay = 3000
): Promise<T> {
  let lastError: any;
  let delay = initialDelay;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (attempt === maxRetries) {
        break;
      }
      
      // Wait before retrying with exponential backoff
      await new Promise(resolve => setTimeout(resolve, delay));
      
      // Increase delay for next attempt (exponential backoff)
      delay = Math.min(delay * 2, maxDelay);
    }
  }
  
  throw lastError;
}