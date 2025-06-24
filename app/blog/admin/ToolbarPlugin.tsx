"use client"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND, SELECTION_CHANGE_COMMAND, COMMAND_PRIORITY_LOW } from "lexical";
import { useEffect, useState } from "react";

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          setIsBold(selection.hasFormat("bold"));
          setIsItalic(selection.hasFormat("italic"));
          setIsUnderline(selection.hasFormat("underline"));
        }
        return false;
      },
      COMMAND_PRIORITY_LOW
    );
  }, [editor]);

  return (
    <div className="flex gap-2 mb-2">
      <button
        type="button"
        className={isBold ? "font-bold bg-gray-200 px-2 rounded" : "px-2"}
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}
        aria-label="Negrita"
      >
        B
      </button>
      <button
        type="button"
        className={isItalic ? "italic bg-gray-200 px-2 rounded" : "px-2"}
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")}
        aria-label="Itálica"
      >
        I
      </button>
      <button
        type="button"
        className={isUnderline ? "underline bg-gray-200 px-2 rounded" : "px-2"}
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")}
        aria-label="Subrayado"
      >
        U
      </button>
      {/* Puedes agregar más botones para listas, links, etc. */}
    </div>
  );
}
