"use client"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  SELECTION_CHANGE_COMMAND,
  COMMAND_PRIORITY_LOW,
} from "lexical";
import { useEffect, useState } from "react";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import {
  INSERT_UNORDERED_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  ListNode,
} from "@lexical/list";
import { TOGGLE_LINK_COMMAND, $isLinkNode } from "@lexical/link";
import { $setBlocksType } from "@lexical/selection";
import { $createHeadingNode, $createQuoteNode } from "@lexical/rich-text";

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isBullet, setIsBullet] = useState(false);
  const [isNumbered, setIsNumbered] = useState(false);
  const [isLink, setIsLink] = useState(false);
  const [isH1, setIsH1] = useState(false);
  const [isH2, setIsH2] = useState(false);
  const [isQuote, setIsQuote] = useState(false);

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          setIsBold(selection.hasFormat("bold"));
          setIsItalic(selection.hasFormat("italic"));
          setIsUnderline(selection.hasFormat("underline"));
          setIsBullet(
            selection.getNodes().some(
              (n) => n instanceof ListNode && n.getListType() === "bullet"
            )
          );
          setIsNumbered(
            selection.getNodes().some(
              (n) => n instanceof ListNode && n.getListType() === "number"
            )
          );
          setIsLink(selection.getNodes().some((n) => $isLinkNode(n)));
          setIsH1(
            selection.getNodes().some(
              (n) =>
                n instanceof HeadingNode &&
                n.getTag &&
                n.getTag() === "h1"
            )
          );
          setIsH2(
            selection.getNodes().some(
              (n) =>
                n instanceof HeadingNode &&
                n.getTag &&
                n.getTag() === "h2"
            )
          );
          setIsQuote(
            selection.getNodes().some((n) => n instanceof QuoteNode)
          );
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
        className={`px-2 py-1 rounded transition-colors ${
          isBold
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-foreground hover:bg-primary/80"
        }`}
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")}
        aria-label="Negrita"
        title="Negrita (Ctrl+B)"
      >
        <b>B</b>
      </button>
      <button
        type="button"
        className={`px-2 py-1 rounded transition-colors ${
          isItalic
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-foreground hover:bg-primary/80"
        }`}
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")}
        aria-label="Itálica"
        title="Itálica (Ctrl+I)"
      >
        <i>I</i>
      </button>
      <button
        type="button"
        className={`px-2 py-1 rounded transition-colors ${
          isUnderline
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-foreground hover:bg-primary/80"
        }`}
        onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline")}
        aria-label="Subrayado"
        title="Subrayado (Ctrl+U)"
      >
        <u>U</u>
      </button>
      <button
        type="button"
        className={`px-2 py-1 rounded transition-colors ${
          isBullet
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-foreground hover:bg-primary/80"
        }`}
        onClick={() =>
          editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
        }
        aria-label="Lista con viñetas"
        title="Lista con viñetas"
      >
        • List
      </button>
      <button
        type="button"
        className={`px-2 py-1 rounded transition-colors ${
          isNumbered
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-foreground hover:bg-primary/80"
        }`}
        onClick={() =>
          editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
        }
        aria-label="Lista numerada"
        title="Lista numerada"
      >
        1. List
      </button>
      <button
        type="button"
        className={`px-2 py-1 rounded transition-colors ${
          isH1
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-foreground hover:bg-primary/80"
        }`}
        onClick={() => {
          editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
              $setBlocksType(selection, () => $createHeadingNode("h1"));
            }
          });
        }}
        aria-label="Encabezado H1"
        title="Encabezado H1"
      >
        H1
      </button>
      <button
        type="button"
        className={`px-2 py-1 rounded transition-colors ${
          isH2
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-foreground hover:bg-primary/80"
        }`}
        onClick={() => {
          editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
              $setBlocksType(selection, () => $createHeadingNode("h2"));
            }
          });
        }}
        aria-label="Encabezado H2"
        title="Encabezado H2"
      >
        H2
      </button>
      <button
        type="button"
        className={`px-2 py-1 rounded transition-colors ${
          isQuote
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-foreground hover:bg-primary/80"
        }`}
        onClick={() => {
          editor.update(() => {
            const selection = $getSelection();
            if ($isRangeSelection(selection)) {
              $setBlocksType(selection, () => $createQuoteNode());
            }
          });
        }}
        aria-label="Cita"
        title="Cita"
      >
        ❝
      </button>
      <button
        type="button"
        className={`px-2 py-1 rounded transition-colors ${
          isLink
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-foreground hover:bg-primary/80"
        }`}
        onClick={() => {
          const url = prompt("Ingrese la URL del enlace:");
          if (url) {
            editor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
          } else {
            editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
          }
        }}
        aria-label="Enlace"
        title="Enlace"
      >
        🔗
      </button>
    </div>
  );
}
