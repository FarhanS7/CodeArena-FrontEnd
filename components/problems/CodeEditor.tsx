"use client";

import Editor from "@monaco-editor/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface CodeEditorProps {
  value: string;
  onChange: (value: string | undefined) => void;
  language: string;
  defaultValue?: string;
}

export function CodeEditor({ value, onChange, language, defaultValue }: CodeEditorProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid Hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-full w-full bg-slate-950 flex items-center justify-center border border-slate-800 rounded-lg">
        <p className="text-slate-400 text-sm">Loading Editor...</p>
      </div>
    );
  }

  const editorTheme = theme === "dark" ? "vs-dark" : "light";

  // Map our language IDs to Monaco language identifiers
  const monacoLanguage = language === "python" ? "python" : 
                        language === "cpp" ? "cpp" :
                        language === "java" ? "java" :
                        language === "javascript" ? "javascript" :
                        language === "typescript" ? "typescript" : "javascript";

  return (
    <div className="h-full w-full border border-slate-800 rounded-lg overflow-hidden bg-slate-950 shadow-xl">
      <Editor
        height="100%"
        width="100%"
        language={monacoLanguage}
        value={value}
        onChange={onChange}
        theme={editorTheme}
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          automaticLayout: true,
          scrollBeyondLastLine: false,
          padding: { top: 16, bottom: 16 },
          fontFamily: "'Fira Code', 'JetBrains Mono', monospace",
          fontLigatures: true,
          cursorSmoothCaretAnimation: "on",
          smoothScrolling: true,
          lineNumbers: "on",
          renderLineHighlight: "all",
          scrollbar: {
            vertical: "visible",
            horizontal: "visible",
            useShadows: false,
            verticalScrollbarSize: 10,
            horizontalScrollbarSize: 10,
          },
        }}
      />
    </div>
  );
}
