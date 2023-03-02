/**
 * Prevent the image from moving outside of the overlay.
 */
export function moveBy({
    x,
    y,
    imageBounds,
    overlayBounds,
    deltaX,
    deltaY,
}: {
    x: number;
    y: number;
    imageBounds: DOMRect;
    overlayBounds: DOMRect;
    deltaX: number;
    deltaY: number;
}) {
    const newX =
        // Top left corner guard
        imageBounds.x + deltaX > overlayBounds.x ||
        // Bottom right corner guard
        imageBounds.x + imageBounds.width + deltaX < overlayBounds.x + overlayBounds.width
            ? deltaX > 0
                ? x + overlayBounds.x - imageBounds.x
                : x + overlayBounds.x + overlayBounds.width - (imageBounds.x + imageBounds.width)
            : x + deltaX;

    const newY =
        // Top left corner guard
        imageBounds.y + deltaY > overlayBounds.y ||
        // Bottom right corner guard
        imageBounds.y + imageBounds.height + deltaY < overlayBounds.y + overlayBounds.height
            ? deltaY > 0
                ? y + overlayBounds.y - imageBounds.y
                : y + overlayBounds.y + overlayBounds.height - (imageBounds.y + imageBounds.height)
            : y + deltaY;

    return { x: newX, y: newY };
}
