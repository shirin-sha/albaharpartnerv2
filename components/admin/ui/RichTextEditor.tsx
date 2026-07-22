"use client";

import React, { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import { toEditorHtml } from "@/lib/rich-text-utils";

interface RichTextEditorProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

function normalizeEditorOutput(html: string): string {
  const trimmed = html.trim();
  if (!trimmed || trimmed === "<p></p>") return "";
  return trimmed;
}

function ToolbarButton({
  onClick,
  title,
  active = false,
  disabled = false,
  children,
}: {
  onClick: () => void;
  title: string;
  active?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      disabled={disabled}
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      className={`rich-text-toolbar-icon-btn${active ? " active" : ""}`}
    >
      {children}
    </button>
  );
}

export default function RichTextEditor({
  label,
  value,
  onChange,
  placeholder = "Enter description...",
  className = "",
}: RichTextEditorProps) {
  const isRtl = className.includes("rtl-editor");

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: false,
        blockquote: false,
        codeBlock: false,
        code: false,
        horizontalRule: false,
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          rel: "noopener noreferrer",
          target: "_blank",
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: toEditorHtml(value || ""),
    editorProps: {
      attributes: {
        class: "rich-text-prosemirror",
        dir: isRtl ? "rtl" : "ltr",
      },
    },
    onUpdate: ({ editor: currentEditor }) => {
      onChange(normalizeEditorOutput(currentEditor.getHTML()));
    },
  });

  useEffect(() => {
    if (!editor || editor.isFocused) return;

    const nextContent = toEditorHtml(value || "");
    const current = editor.getHTML();

    if (nextContent !== current) {
      editor.commands.setContent(nextContent, { emitUpdate: false });
    }
  }, [editor, value]);

  const setLink = () => {
    if (!editor) return;

    const previousUrl = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Enter URL:", previousUrl || "https://");

    if (url === null) return;

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  if (!editor) {
    return (
      <div className={`form-group rich-text-editor ${className}`}>
        {label && <label className="form-label">{label}</label>}
        <div className="rich-text-editor-shell border rounded rich-text-editor-loading">
          Loading editor...
        </div>
      </div>
    );
  }

  return (
    <div className={`form-group rich-text-editor ${className}`}>
      {label && <label className="form-label">{label}</label>}
      <div className="rich-text-editor-shell border rounded">
        <div className="rich-text-editor-toolbar d-flex align-items-center gap-1 p-2 border-bottom">
          <ToolbarButton
            title="Bold"
            active={editor.isActive("bold")}
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <strong>B</strong>
          </ToolbarButton>

          <ToolbarButton
            title="Italic"
            active={editor.isActive("italic")}
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <em>I</em>
          </ToolbarButton>

          <ToolbarButton
            title="Underline"
            active={editor.isActive("underline")}
            onClick={() => editor.chain().focus().toggleUnderline().run()}
          >
            <u>U</u>
          </ToolbarButton>

          <ToolbarButton
            title="Strikethrough"
            active={editor.isActive("strike")}
            onClick={() => editor.chain().focus().toggleStrike().run()}
          >
            <span style={{ textDecoration: "line-through" }}>S</span>
          </ToolbarButton>

          <div className="rich-text-toolbar-divider" />

          <ToolbarButton
            title="Bullet List"
            active={editor.isActive("bulletList")}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            • List
          </ToolbarButton>

          <ToolbarButton
            title="Numbered List"
            active={editor.isActive("orderedList")}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            1. List
          </ToolbarButton>

          <div className="rich-text-toolbar-divider" />

          <ToolbarButton title="Insert Link" active={editor.isActive("link")} onClick={setLink}>
            Link
          </ToolbarButton>

          <ToolbarButton
            title="Clear Formatting"
            onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
          >
            Clear
          </ToolbarButton>

          <div className="rich-text-toolbar-divider" />

          <ToolbarButton
            title="Undo"
            disabled={!editor.can().chain().focus().undo().run()}
            onClick={() => editor.chain().focus().undo().run()}
          >
            Undo
          </ToolbarButton>

          <ToolbarButton
            title="Redo"
            disabled={!editor.can().chain().focus().redo().run()}
            onClick={() => editor.chain().focus().redo().run()}
          >
            Redo
          </ToolbarButton>
        </div>

        <div className="rich-text-editor-content p-3">
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
}
