import { forwardRef } from 'react';
import { useMergeRefs } from '../hooks';
import { useEditor } from './Editor';

export const Overlay = forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<'div'>>(
    ({ className, ...rest }, ref) => {
        const { overlayRef } = useEditor();
        const mergedRef = useMergeRefs(ref, overlayRef);

        return <div ref={mergedRef} {...rest} className={`overlay ${className}`} />;
    }
);
