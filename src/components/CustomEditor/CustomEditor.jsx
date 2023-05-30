import JoditEditor from 'jodit-react';
import { forwardRef, useMemo } from 'react';
const CustomEditor = ({ placeholder, initialValue = '' }, ref) => {
    const config = useMemo(
        () => ({
            readonly: false, // all options from https://xdsoft.net/jodit/doc/,
            placeholder: placeholder || 'Start typings...',
        }),
        [placeholder],
    );
    return (
        <>
            <JoditEditor
                value={initialValue}
                ref={ref}
                config={config}
                tabIndex={1} // tabIndex of textarea
                onBlur={(newContent) => {}} // preferred to use only this option to update the content for performance reasons
                onChange={(newContent) => {}}
            />
        </>
    );
};
export default forwardRef(CustomEditor);
