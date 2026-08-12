import { X, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface ImageViewerProps {
  src: string;
  alt: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ImageViewer({ src, alt, isOpen, onClose }: ImageViewerProps) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const imageRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef({ distance: 0, scale: 1 });
  const lastTapRef = useRef(0);

  // Reset state cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      setScale(1);
      setPosition({ x: 0, y: 0 });
      setRotation(0);
      setIsDragging(false);
    }
  }, [isOpen]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.5, 5));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.5, 1));
    if (scale <= 1.5) {
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
    setRotation(0);
  };

  // Mouse/Touch handlers for dragging
  const handlePointerDown = (e: React.PointerEvent) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  // Touch handlers for pinch-to-zoom
  const getTouchDistance = (touches: React.TouchList) => {
    const touch1 = touches[0];
    const touch2 = touches[1];
    return Math.hypot(
      touch2.clientX - touch1.clientX,
      touch2.clientY - touch1.clientY
    );
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const distance = getTouchDistance(e.touches);
      touchStartRef.current = { distance, scale };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const distance = getTouchDistance(e.touches);
      const scaleChange = distance / touchStartRef.current.distance;
      const newScale = Math.min(
        Math.max(touchStartRef.current.scale * scaleChange, 1),
        5
      );
      setScale(newScale);
      
      if (newScale <= 1) {
        setPosition({ x: 0, y: 0 });
      }
    }
  };

  // Wheel zoom for desktop
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * -0.01;
    const newScale = Math.min(Math.max(scale + delta, 1), 5);
    setScale(newScale);
    
    if (newScale <= 1) {
      setPosition({ x: 0, y: 0 });
    }
  };

  // Double tap to zoom
  const handleDoubleTap = () => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    
    if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      if (scale === 1) {
        setScale(2.5);
      } else {
        handleReset();
      }
    }
    lastTapRef.current = now;
  };

  // Close on background click
  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center"
      onClick={handleBackgroundClick}
    >
      {/* Header con controles */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center justify-between max-w-screen-xl mx-auto">
          <div className="flex items-center gap-2">
            <button
              onClick={handleZoomOut}
              disabled={scale <= 1}
              className="p-3 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
              aria-label="Reducir zoom"
            >
              <ZoomOut className="w-5 h-5" />
            </button>
            
            <div className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm text-white min-w-[80px] text-center">
              {Math.round(scale * 100)}%
            </div>
            
            <button
              onClick={handleZoomIn}
              disabled={scale >= 5}
              className="p-3 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
              aria-label="Aumentar zoom"
            >
              <ZoomIn className="w-5 h-5" />
            </button>
            
            <button
              onClick={handleRotate}
              className="p-3 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-all active:scale-95"
              aria-label="Rotar imagen"
            >
              <RotateCw className="w-5 h-5" />
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-3 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 transition-all active:scale-95"
            aria-label="Cerrar"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Imagen */}
      <div
        ref={imageRef}
        className="w-full h-full flex items-center justify-center overflow-hidden touch-none select-none"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onWheel={handleWheel}
        onClick={handleDoubleTap}
        style={{
          cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default'
        }}
      >
        <img
          src={src}
          alt={alt}
          className="max-w-full max-h-full object-contain transition-transform"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale}) rotate(${rotation}deg)`,
            transformOrigin: 'center',
            pointerEvents: 'none',
            userSelect: 'none',
            WebkitUserSelect: 'none'
          }}
          draggable={false}
        />
      </div>

      {/* Footer con instrucciones (solo en móviles) */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent md:hidden">
        <div className="text-center text-white/70 text-sm space-y-1">
          <p>Pellizca para hacer zoom</p>
          <p>Doble tap para zoom rápido</p>
          {scale > 1 && <p>Arrastra para mover</p>}
        </div>
      </div>
    </div>
  );
}

interface ZoomableImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
}

export function ZoomableImage({ src, alt, className, ...props }: ZoomableImageProps) {
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  return (
    <>
      <div className="relative group cursor-pointer" onClick={() => setIsViewerOpen(true)}>
        <img
          src={src}
          alt={alt}
          className={className}
          {...props}
        />
        {/* Overlay con icono de zoom */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-full p-3 shadow-lg">
            <ZoomIn className="w-6 h-6 text-gray-900" />
          </div>
        </div>
      </div>

      <ImageViewer
        src={src}
        alt={alt}
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
      />
    </>
  );
}
