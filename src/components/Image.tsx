import { forwardRef, useCallback, useRef } from 'react';
import { useMove } from 'react-aria';
import { MoveMoveEvent } from '@react-types/shared';
import { useMergeRefs } from '../hooks';
import { useEditor } from './Editor';

export const Image = forwardRef<HTMLImageElement, React.ComponentPropsWithoutRef<'img'>>(
    (props, ref) => {
        const imageRef = useRef<HTMLImageElement>(null);
        const mergedRef = useMergeRefs(ref, imageRef);

        const { position, setPosition, overlayRef } = useEditor();

        const handleMove = useCallback(
            (event: MoveMoveEvent) => {
                const imageBounds = imageRef?.current?.getBoundingClientRect();
                const overlayBounds = overlayRef?.current?.getBoundingClientRect();
                if (!imageBounds || !overlayBounds) return;

                setPosition(({ x, y }) => {
                    // Prevent image from moving outside of overlay

                    const newX =
                        // Top left corner
                        imageBounds.x + event.deltaX > overlayBounds.x ||
                        // Bottom right corner
                        imageBounds.x + imageBounds.width + event.deltaX <
                            overlayBounds.x + overlayBounds.width
                            ? event.deltaX > 0
                                ? x + overlayBounds.x - imageBounds.x
                                : x +
                                  overlayBounds.x +
                                  overlayBounds.width -
                                  (imageBounds.x + imageBounds.width)
                            : x + event.deltaX;

                    const newY =
                        // Top left corner
                        imageBounds.y + event.deltaY > overlayBounds.y ||
                        // Bottom right corner
                        imageBounds.y + imageBounds.height + event.deltaY <
                            overlayBounds.y + overlayBounds.height
                            ? event.deltaY > 0
                                ? y + overlayBounds.y - imageBounds.y
                                : y +
                                  overlayBounds.y +
                                  overlayBounds.height -
                                  (imageBounds.y + imageBounds.height)
                            : y + event.deltaY;

                    return {
                        x: newX,
                        y: newY,
                    };
                });
            },
            [setPosition]
        );

        const {
            moveProps: { onPointerDown, onKeyDown },
        } = useMove({
            onMove: handleMove,
        });

        return (
            <img
                ref={mergedRef}
                {...props}
                className={`image ${props?.className}`}
                draggable={false}
                style={{
                    ...props.style,
                    transform: `translate(${position.x}px, ${position.y}px)`,
                }}
                onPointerDown={event => {
                    onPointerDown?.(event);
                    props?.onPointerDown?.(event);
                }}
                onKeyDown={event => {
                    onKeyDown?.(event);
                    props?.onKeyDown?.(event);
                }}
            />
        );
    }
);
