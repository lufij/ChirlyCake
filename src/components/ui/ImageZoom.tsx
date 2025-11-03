import { useState, useRef, useEffect } from 'react';

interface ImageZoomProps {
  src: string;
  alt: string;
  className?: string;
}

export function ImageZoom({ src, alt, className = '' }: ImageZoomProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastTouchDistance, setLastTouchDistance] = useState(0);
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });
  const modalImageRef = useRef<HTMLImageElement>(null);

  const MIN_SCALE = 1;
  const MAX_SCALE = 5;

  // Open modal
  const openModal = () => {
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  // Close modal and reset everything
  const closeModal = () => {
    setIsModalOpen(false);
    setScale(1);
    setPosition({ x: 0, y: 0 });
    setIsDragging(false);
    document.body.style.overflow = 'auto';
  };

  // Calculate touch distance for pinch zoom
  const getTouchDistance = (touches: React.TouchList): number => {
    if (touches.length < 2) return 0;
    const touch1 = touches[0];
    const touch2 = touches[1];
    return Math.sqrt(
      Math.pow(touch2.clientX - touch1.clientX, 2) +
      Math.pow(touch2.clientY - touch1.clientY, 2)
    );
  };

  // Handle double tap/click to reset zoom
  const handleDoubleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  // Handle double tap for touch devices
  const [lastTapTime, setLastTapTime] = useState(0);
  const handleDoubleTap = (e: React.TouchEvent) => {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTapTime;
    
    if (tapLength < 500 && tapLength > 0) {
      // Double tap detected
      e.preventDefault();
      e.stopPropagation();
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
    setLastTapTime(currentTime);
  };

  // Touch start handler for modal
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      // Two fingers - prepare for pinch zoom
      e.preventDefault();
      const distance = getTouchDistance(e.touches);
      setLastTouchDistance(distance);
      setIsDragging(false);
    } else if (e.touches.length === 1) {
      // One finger - prepare for pan (only prevent default if we're already zoomed)
      if (scale > 1) {
        e.preventDefault();
      }
      const touch = e.touches[0];
      setLastPosition({ x: touch.clientX, y: touch.clientY });
      setIsDragging(scale > 1); // Only enable dragging if zoomed
    }
  };

  // Touch move handler for modal
  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      // Pinch zoom
      e.preventDefault();
      const distance = getTouchDistance(e.touches);
      if (lastTouchDistance > 0) {
        const scaleChange = distance / lastTouchDistance;
        const newScale = Math.min(Math.max(scale * scaleChange, MIN_SCALE), MAX_SCALE);
        setScale(newScale);
      }
      setLastTouchDistance(distance);
    } else if (e.touches.length === 1 && isDragging && scale > 1) {
      // Pan/drag when zoomed
      e.preventDefault();
      const touch = e.touches[0];
      const deltaX = touch.clientX - lastPosition.x;
      const deltaY = touch.clientY - lastPosition.y;
      
      setPosition(prev => ({
        x: prev.x + deltaX / scale,
        y: prev.y + deltaY / scale
      }));
      
      setLastPosition({ x: touch.clientX, y: touch.clientY });
    }
  };

  // Touch end handler
  const handleTouchEnd = () => {
    setIsDragging(false);
    setLastTouchDistance(0);
  };

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * -0.01;
    const newScale = Math.min(Math.max(scale + delta, MIN_SCALE), MAX_SCALE);
    setScale(newScale);
  };

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true);
      setLastPosition({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      const deltaX = e.clientX - lastPosition.x;
      const deltaY = e.clientY - lastPosition.y;
      
      setPosition(prev => ({
        x: prev.x + deltaX / scale,
        y: prev.y + deltaY / scale
      }));
      
      setLastPosition({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isModalOpen && e.key === 'Escape') {
        closeModal();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isModalOpen]);

  return (
    <>
      {/* Thumbnail image - click to open modal */}
      <div 
        className={`relative cursor-pointer group ${className}`}
        onClick={openModal}
      >
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover transition-opacity duration-200 group-hover:opacity-80"
          draggable={false}
        />
        {/* Zoom indicator overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center">
          <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Fullscreen Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 bg-black z-50"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
            backgroundColor: 'rgba(0, 0, 0, 0.9)'
          }}
        >
          {/* BOTÓN CERRAR X - Pequeño y discreto */}
          <button
            onClick={closeModal}
            onTouchEnd={closeModal}
            style={{
              position: 'fixed',
              top: '15px',
              right: '15px',
              width: '40px',
              height: '40px',
              backgroundColor: '#ff0000',
              color: 'white',
              border: '2px solid white',
              borderRadius: '50%',
              fontSize: '16px',
              fontWeight: 'bold',
              zIndex: 10000,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 10px rgba(0,0,0,0.5)',
              touchAction: 'manipulation'
            }}
          >
            ✕
          </button>

          {/* Área de la imagen */}
          <div 
            style={{
              position: 'absolute',
              top: '100px',
              left: '20px',
              right: '20px',
              bottom: '100px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                closeModal();
              }
            }}
          >
            {/* Image container */}
            <div 
              className="relative max-w-full max-h-full"
              onClick={(e) => e.stopPropagation()}
              onTouchStart={(e) => {
                handleTouchStart(e);
                handleDoubleTap(e);
              }}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onWheel={handleWheel}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onDoubleClick={handleDoubleClick}
              style={{
                cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'pointer',
                touchAction: 'none'
              }}
            >
              <img
                ref={modalImageRef}
                src={src}
                alt={alt}
                className="max-w-full max-h-full object-contain transition-transform duration-200 ease-out select-none"
                style={{
                  transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
                  transformOrigin: 'center center',
                }}
                draggable={false}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}