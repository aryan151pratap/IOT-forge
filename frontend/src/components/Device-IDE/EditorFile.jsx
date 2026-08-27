import Editor from "@monaco-editor/react";
import { useRef, useEffect } from "react";

export default function EditorFile({ file, onChange, fontsize = 15, lineHeight = 25}) {
    const editorRef = useRef(null);
    const currentFileId = useRef(file.id);

    const handleEditorDidMount = (editor) => {
        editorRef.current = editor;
    };

    const handleEditorChange = (value) => {
        onChange(value);
    };

    useEffect(() => {
        if (!editorRef.current) return;
        if (file.id !== currentFileId.current) {
            currentFileId.current = file.id;
            return;
        }
        const editor = editorRef.current;
        if (editor.getValue() !== file.content) {
            const model = editor.getModel();
            const position = editor.getPosition();
            model.pushEditOperations(
                [],
                [{ range: model.getFullModelRange(), text: file.content }],
                () => null
            );
            editor.setPosition(position);
        }
    }, [file.content, file.id]);

    return (
        <div className="min-h-0 min-w-0 h-full flex-1">
            <Editor
                height="100%"
                theme="vs-dark"
                language={file.language}
                path={file.id}
                defaultValue={file.content}
                onMount={handleEditorDidMount}
                onChange={handleEditorChange}
                options={{
                    fontFamily: "Cascadia Code",
                    fontSize: fontsize,
                    lineHeight: lineHeight,
                    tabSize: 4,
                    indentSize: 4,
                    insertSpaces: true,
                    detectIndentation: false,
                    autoIndent: "full",
                    formatOnPaste: true,
                    formatOnType: true,
                    automaticLayout: true,
                    minimap: { enabled: true },
                    lineNumbers: "on",
                    folding: true,
                    wordWrap: "off",
                    scrollBeyondLastLine: false,
                    cursorBlinking: "smooth",
                    smoothScrolling: true,
                    bracketPairColorization: { enabled: true },
                    guides: {
                        indentation: true,
                        bracketPairs: true,
                    },
                    padding: {
                        top: 16,
                        bottom: 16,
                    },
                    scrollbar: {
                        verticalScrollbarSize: 10,
                        horizontalScrollbarSize: 10,
                    },
                }}
            />
        </div>
    );
}