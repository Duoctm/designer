"use client";

import { useEffect, useRef, useState } from "react";
import { Stage, Layer, Image as KonvaImage, Text } from "react-konva";

interface DesignElement {
  id: string;
  type: "image" | "text";
  src?: string;
  text?: string;
  alignment?:
    | "center"
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right";
}

interface DesignZone {
  width: number;
  height: number;
  offsetX: number;
  offsetY: number;
}

interface ProductCanvasProps {
  productImage: string;
  designZone: DesignZone;
  designs: DesignElement[];
  textColor?: string;
  containerSize?: number;
}

// Custom hook to load image (with CORS fallback)
function useImage(src: string | undefined): [HTMLImageElement | null, boolean] {
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!src) {
      setImage(null);
      setLoaded(true);
      return;
    }

    setLoaded(false);

    // Try with crossOrigin first, fallback without if fails
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.src = src;

    img.onload = () => {
      setImage(img);
      setLoaded(true);
    };

    img.onerror = () => {
      // Retry without crossOrigin for CORS-restricted images
      const imgNoCors = new window.Image();
      imgNoCors.src = src;
      imgNoCors.onload = () => {
        setImage(imgNoCors);
        setLoaded(true);
      };
      imgNoCors.onerror = () => {
        console.warn("Failed to load image:", src);
        setImage(null);
        setLoaded(true);
      };
    };

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  return [image, loaded];
}

export function ProductCanvas({
  productImage,
  designZone,
  designs,
  textColor = "#333333",
  containerSize = 500,
}: ProductCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [stageSize, setStageSize] = useState({
    width: containerSize,
    height: containerSize,
  });
  const [productImg, productLoaded] = useImage(productImage);

  // Responsive sizing
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const size = Math.min(rect.width, rect.height, containerSize);
        setStageSize({ width: size, height: size });
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, [containerSize]);

  // Calculate design zone in pixels
  const zoneWidth = (stageSize.width * designZone.width) / 100;
  const zoneHeight = (stageSize.height * designZone.height) / 100;
  const zoneCenterX =
    stageSize.width / 2 + (stageSize.width * designZone.offsetX) / 100;
  const zoneCenterY =
    stageSize.height / 2 + (stageSize.height * designZone.offsetY) / 100;

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex items-center justify-center"
    >
      <Stage width={stageSize.width} height={stageSize.height}>
        {/* Product Layer */}
        <Layer>
          {productLoaded && productImg && (
            <KonvaImage
              image={productImg}
              width={stageSize.width}
              height={stageSize.height}
              x={0}
              y={0}
            />
          )}
        </Layer>

        {/* Design Layer */}
        <Layer>
          {designs.map((design) => (
            <DesignElementRenderer
              key={design.id}
              design={design}
              zoneWidth={zoneWidth}
              zoneHeight={zoneHeight}
              zoneCenterX={zoneCenterX}
              zoneCenterY={zoneCenterY}
              textColor={textColor}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
}

// Individual design element renderer
interface DesignElementRendererProps {
  design: DesignElement;
  zoneWidth: number;
  zoneHeight: number;
  zoneCenterX: number;
  zoneCenterY: number;
  textColor: string;
}

function DesignElementRenderer({
  design,
  zoneWidth,
  zoneHeight,
  zoneCenterX,
  zoneCenterY,
  textColor,
}: DesignElementRendererProps) {
  const [img, loaded] = useImage(
    design.type === "image" ? design.src : undefined
  );

  // Calculate position based on alignment
  const getPosition = () => {
    const alignment = design.alignment ?? "center";
    const elementWidth = design.type === "image" ? zoneWidth * 0.8 : zoneWidth;
    const elementHeight = design.type === "image" ? zoneHeight * 0.6 : 30;

    switch (alignment) {
      case "top-left":
        return {
          x: zoneCenterX - zoneWidth / 2 + 10,
          y: zoneCenterY - zoneHeight / 2 + 10,
          width: elementWidth * 0.4,
          height: elementHeight * 0.4,
        };
      case "top-right":
        return {
          x: zoneCenterX + zoneWidth / 2 - elementWidth * 0.4 - 10,
          y: zoneCenterY - zoneHeight / 2 + 10,
          width: elementWidth * 0.4,
          height: elementHeight * 0.4,
        };
      case "bottom-left":
        return {
          x: zoneCenterX - zoneWidth / 2 + 10,
          y: zoneCenterY + zoneHeight / 2 - elementHeight * 0.4 - 10,
          width: elementWidth * 0.4,
          height: elementHeight * 0.4,
        };
      case "bottom-right":
        return {
          x: zoneCenterX + zoneWidth / 2 - elementWidth * 0.4 - 10,
          y: zoneCenterY + zoneHeight / 2 - elementHeight * 0.4 - 10,
          width: elementWidth * 0.4,
          height: elementHeight * 0.4,
        };
      case "center":
      default:
        return {
          x: zoneCenterX - elementWidth / 2,
          y: zoneCenterY - elementHeight / 2,
          width: elementWidth,
          height: elementHeight,
        };
    }
  };

  const pos = getPosition();

  if (design.type === "image" && loaded && img) {
    // Maintain aspect ratio
    const aspectRatio = img.width / img.height;
    let renderWidth = pos.width;
    let renderHeight = pos.width / aspectRatio;

    if (renderHeight > pos.height) {
      renderHeight = pos.height;
      renderWidth = pos.height * aspectRatio;
    }

    return (
      <KonvaImage
        image={img}
        x={pos.x}
        y={pos.y}
        width={renderWidth}
        height={renderHeight}
      />
    );
  }

  if (design.type === "text" && design.text) {
    return (
      <Text
        text={design.text}
        x={pos.x}
        y={pos.y}
        width={pos.width}
        fontSize={20}
        fontStyle="bold"
        fill={textColor}
        align="center"
      />
    );
  }

  return null;
}
