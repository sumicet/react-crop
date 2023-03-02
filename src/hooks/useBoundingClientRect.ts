import { useState, useCallback, useLayoutEffect } from 'react';
import useResizeObserver from 'use-resize-observer';

let isBorderBoxSupported = true;

const observer = new ResizeObserver(entries => {
    if (!entries[0].borderBoxSize) isBorderBoxSupported = false;
    observer.disconnect();
});
observer.observe(document.body, {
    box: 'border-box',
});

export function useBoundingClientRect(options?: {
    skip?: boolean;
    onChange?: (rect: DOMRect) => void;
}) {
    const [node, setNode] = useState<HTMLElement | null>(null);
    const [rect, setRect] = useState<DOMRect>();

    const { ref: observerRef } = useResizeObserver({
        box: isBorderBoxSupported ? 'border-box' : undefined,
    });

    const ref = useCallback(
        (x: HTMLElement | null) => {
            if (options?.skip || x === null) return;

            setNode(x);
        },
        [options?.skip]
    );

    useLayoutEffect(() => {
        if (!node || options?.skip) return () => null;

        const getPosition = () => {
            if (!node) return;

            const newRect = node.getBoundingClientRect();
            setRect(newRect);
            options?.onChange?.(newRect);
        };

        getPosition();
        observerRef(node);

        window.addEventListener('resize', getPosition);
        return () => {
            window.removeEventListener('resize', getPosition);
        };
    }, [node, observerRef, options?.skip, options?.onChange]);

    return { ref, rect };
}
