import { forwardRef, useCallback, useLayoutEffect, useRef } from 'react';
import { useMove } from 'react-aria';
import { MoveMoveEvent } from '@react-types/shared';
import { useMergeRefs } from '../hooks';
import { useEditor } from './Editor';
import { getSize, moveBy } from '../utils';

export const Image = forwardRef<HTMLImageElement, React.ComponentPropsWithoutRef<'img'>>(
    (props, ref) => {
        const imageRef = useRef<HTMLImageElement>(null);
        const mergedRef = useMergeRefs(ref, imageRef);

        const {
            position,
            setPosition,
            overlayRef,
            dimensions,
            setDimensions,
            zoom,
            originalDimensions,
            setOriginalDimensions,
        } = useEditor();

        const handleMove = useCallback(
            (event: MoveMoveEvent) => {
                const imageBounds = imageRef?.current?.getBoundingClientRect();
                const overlayBounds = overlayRef?.current?.getBoundingClientRect();
                if (!imageBounds || !overlayBounds) return;

                setPosition(({ x, y }) => {
                    return moveBy({
                        x,
                        y,
                        imageBounds,
                        overlayBounds,
                        deltaX: event.deltaX,
                        deltaY: event.deltaY,
                    });
                });
            },
            [setPosition]
        );

        const {
            moveProps: { onPointerDown, onKeyDown },
        } = useMove({
            onMove: handleMove,
        });

        useLayoutEffect(() => {
            if (zoom < 1) return;

            const newWidth = originalDimensions.width * zoom;
            const newHeight = originalDimensions.height * zoom;

            setDimensions({
                width: newWidth,
                height: newHeight,
            });

            const imageBounds = imageRef?.current?.getBoundingClientRect();
            const overlayBounds = overlayRef?.current?.getBoundingClientRect();

            if (!imageBounds || !overlayBounds) return;

            const zoomWidthDiff = newWidth - imageBounds.width;
            const zoomHeightDiff = newHeight - imageBounds.height;

            // Zoom and center

            setPosition(({ x, y }) => {
                return moveBy({
                    x,
                    y,
                    imageBounds,
                    overlayBounds,
                    deltaX: -zoomWidthDiff / 2,
                    deltaY: -zoomHeightDiff / 2,
                });
            });
        }, [zoom, originalDimensions.width, originalDimensions.height, setDimensions, setPosition]);

        return (
            <img
                ref={mergedRef}
                {...props}
                className={`image ${props?.className}`}
                draggable={false}
                style={{
                    ...props.style,
                    transform: `translate(${position.x}px, ${position.y}px)`,
                    width: dimensions.width || '100%',
                    height: dimensions.height || '100%',
                }}
                onPointerDown={event => {
                    onPointerDown?.(event);
                    props?.onPointerDown?.(event);
                }}
                onKeyDown={event => {
                    onKeyDown?.(event);
                    props?.onKeyDown?.(event);
                }}
                onLoad={async event => {
                    props?.onLoad?.(event);

                    if (!props.src) return;
                    const { width, height } = await getSize(props?.src);
                    if (width === null || height === null) return;
                    setOriginalDimensions({ width, height });
                    setDimensions({ width, height });
                }}
            />
        );
    }
);
