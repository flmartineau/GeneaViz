import React, { useEffect, useRef } from 'react';
import classNames from 'classnames';
import './PinchZoomPan.scss'
import { create } from 'pinch-zoom-pan';

interface PinchZoomPanProps {
  min?: number;
  max?: number;
  captureWheel?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

export const PinchZoomPan = React.memo(
  function PinchZoomPan({ min, max, captureWheel, className, style, children }: PinchZoomPanProps) {
    const root = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const element = root.current;
        if (!element) return;
        return create({ element, minZoom: min, maxZoom: max, captureWheel });
    }, [min, max, captureWheel]);

    return (
      <div ref={root} style={style}>
        <div className="point">
          <div>
            {children}
          </div>
        </div>
      </div>
    );
  },
);