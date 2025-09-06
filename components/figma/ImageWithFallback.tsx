import React, { useState, useCallback, useEffect } from 'react'
import { ErrorType, ErrorSeverity } from '../../lib/errorHandler'

const ERROR_IMG_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg=='

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  retryCount?: number;
  retryDelay?: number;
  onImageError?: (error: Error) => void;
}

export const ImageWithFallback = React.memo(function ImageWithFallback(props: ImageWithFallbackProps) {
  const [didError, setDidError] = useState(false)
  const [retries, setRetries] = useState(0)
  const { 
    src, 
    alt, 
    style, 
    className, 
    retryCount = 2, 
    retryDelay = 1000,
    onImageError,
    ...rest 
  } = props

  useEffect(() => {
    // Reset error state when src changes
    if (src) {
      setDidError(false)
      setRetries(0)
    }
  }, [src])

  const handleError = useCallback(() => {
    // Try to reload the image a few times before showing fallback
    if (retries < retryCount && src) {
      const timer = setTimeout(() => {
        setRetries(prev => prev + 1)
        // Force reload by appending a cache-busting query parameter
        const imgElement = document.querySelector(`img[src="${src}"]`) as HTMLImageElement
        if (imgElement) {
          const cacheBuster = `?retry=${Date.now()}`
          imgElement.src = src.includes('?') ? `${src}&cb=${Date.now()}` : `${src}${cacheBuster}`
        }
      }, retryDelay)
      
      return () => clearTimeout(timer)
    } else {
      setDidError(true)
      
      // Log the error
      const errorInfo = {
        type: ErrorType.NETWORK,
        message: `Failed to load image: ${src}`,
        severity: ErrorSeverity.LOW,
        context: { src, retries }
      }
      
      console.warn('Image loading error:', errorInfo)
      
      // Call the error handler if provided
      if (onImageError) {
        onImageError(new Error(`Failed to load image: ${src}`))
      }
    }
  }, [retries, retryCount, retryDelay, src, onImageError])

  return didError ? (
    <div
      className={`inline-block bg-gray-100 text-center align-middle ${className ?? ''}`}
      style={style}
      title={`Failed to load image: ${src}`}
    >
      <div className="flex items-center justify-center w-full h-full">
        <img src={ERROR_IMG_SRC} alt="Error loading image" {...rest} data-original-url={src} />
      </div>
    </div>
  ) : (
    <img 
      src={src} 
      alt={alt || 'Image'} 
      className={className} 
      style={style} 
      {...rest} 
      onError={handleError} 
    />
  )
})
