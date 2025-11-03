import { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';

interface ImageZoomProps {
  src: string;
  alt: string;
  className?: string;
}

export function ImageZoom({ src, alt, className = '' }: ImageZoomProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastTouchDistance, setLastTouchDistance] = useState(0);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const MIN_SCALE = 1;
  const MAX_SCALE = 5;

  // Reset zoom
  const resetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
    setIsZoomed(false);
  };

  // Handle single click/tap to zoom
  const handleSingleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isZoomed) {
      setScale(2);
      setIsZoomed(true);
    }
  };

  // Handle double click/tap to reset
  const handleDoubleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    resetZoom();
  };

  // Touch distance calculation
  const getTouchDistance = (touches: React.TouchList) => {
    if (touches.length < 2) return 0;
    const touch1 = touches[0];
    const touch2 = touches[1];
    return Math.sqrt(
      Math.pow(touch2.clientX - touch1.clientX, 2) +
      Math.pow(touch2.clientY - touch1.clientY, 2)
    );
  };

  // Touch start handler
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      // Two fingers - pinch zoom
      const distance = getTouchDistance(e.touches);
      setLastTouchDistance(distance);
      setIsDragging(false);
    } else if (e.touches.length === 1 && isZoomed) {
      // One finger on zoomed image - pan
      setIsDragging(true);
    }
  };

  // Touch move handler
  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    
    if (e.touches.length === 2) {
      // Pinch zoom
      const distance = getTouchDistance(e.touches);
      if (lastTouchDistance > 0) {
        const scaleChange = distance / lastTouchDistance;
        const newScale = Math.min(Math.max(scale * scaleChange, MIN_SCALE), MAX_SCALE);
        setScale(newScale);
        setIsZoomed(newScale > 1);
      }
      setLastTouchDistance(distance);
    } else if (e.touches.length === 1 && isDragging && isZoomed) {
      // Pan image
      const touch = e.touches[0];
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        const x = (touch.clientX - rect.left - rect.width / 2) / scale;
        const y = (touch.clientY - rect.top - rect.height / 2) / scale;
        setPosition({ x: -x, y: -y });
      }
    }
  };

  // Touch end handler
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (e.touches.length === 0) {
      setIsDragging(false);
      setLastTouchDistance(0);
    }
  };

  // Mouse wheel zoom (desktop)
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * -0.01;
    const newScale = Math.min(Math.max(scale + delta, MIN_SCALE), MAX_SCALE);
    setScale(newScale);
    setIsZoomed(newScale > 1);
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isZoomed) {
        if (e.key === 'Escape') {
          resetZoom();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isZoomed]);

  return (
    <>
      <div
        ref={containerRef}
        className={`relative overflow-hidden cursor-pointer ${className}`}
        onClick={handleSingleClick}
        onDoubleClick={handleDoubleClick}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onWheel={handleWheel}
        style={{
          touchAction: isZoomed ? 'none' : 'auto',
        }}
      >
        <img
          ref={imageRef}
          src={src}
          alt={alt}
          className="w-full h-full object-cover transition-transform duration-300 ease-out"
          style={{
            transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
            transformOrigin: 'center center',
          }}
          draggable={false}
        />
        
        {/* Zoom indicator */}
        {isZoomed && (
          <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-mono">
            {scale.toFixed(1)}x
          </div>
        )}
        
        {/* Reset button */}
        {isZoomed && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              resetZoom();
            }}
            className="absolute top-2 right-2 w-8 h-8 bg-black/70 text-white rounded-full flex items-center justify-center hover:bg-black/90 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Fullscreen overlay for better zooming experience */}
      {isZoomed && scale > 2 && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
          onClick={resetZoom}
        >
          <div
            className="relative max-w-[90vw] max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onWheel={handleWheel}
          >
            <img
              src={src}
              alt={alt}
              className="max-w-full max-h-full object-contain transition-transform duration-300 ease-out"
              style={{
                transform: `scale(${scale / 2}) translate(${position.x}px, ${position.y}px)`,
                transformOrigin: 'center center',
              }}
              draggable={false}
            />
            
            {/* Fullscreen controls */}
            <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-2 rounded text-sm font-mono">
              {scale.toFixed(1)}x - Doble tap para resetear
            </div>
            
            <button
              onClick={resetZoom}
              className="absolute top-4 right-4 w-10 h-10 bg-black/70 text-white rounded-full flex items-center justify-center hover:bg-black/90 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}