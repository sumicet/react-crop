import { createContext, forwardRef, useContext, useMemo, useRef, useState } from 'react';

interface EditorContextProps {
    position: { x: number; y: number };
    setPosition: React.Dispatch<
        React.SetStateAction<{
            x: number;
            y: number;
        }>
    >;
    overlayRef: React.RefObject<HTMLDivElement>;
    dimensions: { width: number; height: number };
    originalDimensions: { width: number; height: number };
    setDimensions: React.Dispatch<
        React.SetStateAction<{
            width: number;
            height: number;
        }>
    >;
    setOriginalDimensions: React.Dispatch<
        React.SetStateAction<{
            width: number;
            height: number;
        }>
    >;
    zoom: number;
}

const EditorContext = createContext<EditorContextProps>({
    position: { x: 0, y: 0 },
    setPosition: () => null,
    overlayRef: { current: null },
    dimensions: { width: 0, height: 0 },
    setDimensions: () => null,
    originalDimensions: { width: 0, height: 0 },
    setOriginalDimensions: () => null,
    zoom: 1,
});

export function useEditor() {
    return useContext(EditorContext);
}

export interface EditorProps extends React.ComponentPropsWithoutRef<'div'> {
    zoom?: number;
}

export const Editor = forwardRef<HTMLDivElement, EditorProps>(
    ({ children, className, zoom = 1, ...rest }, ref) => {
        const [position, setPosition] = useState({ x: 0, y: 0 });
        const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
        const [originalDimensions, setOriginalDimensions] = useState({ width: 0, height: 0 });
        const overlayRef = useRef<HTMLDivElement | null>(null);

        const value = useMemo(
            () => ({
                position,
                setPosition,
                overlayRef,
                dimensions,
                setDimensions,
                originalDimensions,
                setOriginalDimensions,
                zoom,
            }),
            [
                position,
                setPosition,
                dimensions,
                setDimensions,
                zoom,
                originalDimensions,
                setOriginalDimensions,
            ]
        );

        return (
            <div ref={ref} {...rest} className={`editor ${className}`}>
                <EditorContext.Provider value={value}>{children}</EditorContext.Provider>
            </div>
        );
    }
);
