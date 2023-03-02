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
}

const EditorContext = createContext<EditorContextProps>({
    position: { x: 0, y: 0 },
    setPosition: () => null,
    overlayRef: { current: null },
});

export function useEditor() {
    return useContext(EditorContext);
}

export const Editor = forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<'div'>>(
    ({ children, className, ...rest }, ref) => {
        const [position, setPosition] = useState({ x: 0, y: 0 });
        const overlayRef = useRef<HTMLDivElement | null>(null);

        const value = useMemo(
            () => ({ position, setPosition, overlayRef }),
            [position, setPosition]
        );

        return (
            <div ref={ref} {...rest} className={`editor ${className}`}>
                <EditorContext.Provider value={value}>{children}</EditorContext.Provider>
            </div>
        );
    }
);
