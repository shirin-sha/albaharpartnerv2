"use client";

import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { mergeDivLinesToParagraph, prepareRichTextContent } from '@/lib/rich-text-utils';

interface RichTextEditorProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

function ensureBlockContent(html: string): string {
  const prepared = prepareRichTextContent(html);
  const merged = mergeDivLinesToParagraph(prepared);
  if (!merged.trim() || merged === '<p></p>') return '<p><br></p>';
  return merged;
}

function placeCursorAtEnd(element: HTMLElement) {
  const selection = window.getSelection();
  if (!selection) return;

  const range = document.createRange();
  range.selectNodeContents(element);
  range.collapse(false);
  selection.removeAllRanges();
  selection.addRange(range);
}

function debounce<T extends (...args: never[]) => void>(fn: T, delay: number) {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

export default function RichTextEditor({
  label,
  value,
  onChange,
  placeholder = 'Enter description...',
  className = '',
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const lastHtmlRef = useRef(value);
  const isFocusedRef = useRef(false);
  const lastKeyRef = useRef('');
  const allowMultipleParagraphsRef = useRef(false);
  const [showStyleDropdown, setShowStyleDropdown] = useState(false);
  const [currentFormat, setCurrentFormat] = useState('Normal');
  const [isInitialized, setIsInitialized] = useState(false);

  const debouncedOnChange = useMemo(
    () =>
      debounce((html: string) => {
        onChange(html);
      }, 200),
    [onChange],
  );

  useEffect(() => {
    if (!editorRef.current || isInitialized) return;
    const prepared = ensureBlockContent(value || '');
    editorRef.current.innerHTML = prepared;
    lastHtmlRef.current = prepared;
    setIsInitialized(true);
  }, [value, isInitialized]);

  useEffect(() => {
    if (!editorRef.current || !isInitialized || isFocusedRef.current) return;

    const prepared = ensureBlockContent(value || '');
    if (prepared === lastHtmlRef.current) return;

    editorRef.current.innerHTML = prepared;
    lastHtmlRef.current = prepared;
    allowMultipleParagraphsRef.current = (prepared.match(/<\/p>\s*<p/gi) ?? []).length > 0;
  }, [value, isInitialized]);

  const normalizeWhileTyping = useCallback(() => {
    const editor = editorRef.current;
    if (!editor) return;

    document.execCommand('defaultParagraphSeparator', false, 'p');

    const topLevelDivs = editor.querySelectorAll(':scope > div');
    if (topLevelDivs.length > 0 && lastKeyRef.current !== 'Enter') {
      const merged = Array.from(topLevelDivs)
        .map((div) => div.innerHTML.replace(/<br\s*\/?>/gi, ' ').replace(/\s+/g, ' ').trim())
        .filter(Boolean)
        .join(' ');

      if (merged) {
        editor.innerHTML = `<p>${merged}</p>`;
        placeCursorAtEnd(editor);
      }
      return;
    }

    if (!allowMultipleParagraphsRef.current && lastKeyRef.current !== 'Enter') {
      const topLevelBlocks = editor.querySelectorAll(':scope > p, :scope > div');
      if (topLevelBlocks.length > 1) {
        const merged = Array.from(topLevelBlocks)
          .map((block) => block.innerHTML.replace(/<br\s*\/?>/gi, ' ').replace(/\s+/g, ' ').trim())
          .filter(Boolean)
          .join(' ');

        if (merged) {
          editor.innerHTML = `<p>${merged}</p>`;
          placeCursorAtEnd(editor);
        }
      }
    }
  }, []);

  const syncEditorContent = useCallback(
    (clean = false) => {
      if (!editorRef.current) return;

      if (!clean) {
        normalizeWhileTyping();
      }

      let html = editorRef.current.innerHTML;
      if (clean) {
        html = prepareRichTextContent(html);
        html = mergeDivLinesToParagraph(html);
        if (html !== editorRef.current.innerHTML) {
          editorRef.current.innerHTML = html || '<p><br></p>';
        }
      }

      if (html === lastHtmlRef.current) return;

      lastHtmlRef.current = html;
      debouncedOnChange(html);
    },
    [debouncedOnChange, normalizeWhileTyping],
  );

  const handleInput = () => {
    syncEditorContent(false);
  };

  const handleFocus = () => {
    isFocusedRef.current = true;
    document.execCommand('defaultParagraphSeparator', false, 'p');

    if (!editorRef.current) return;

    if (!editorRef.current.textContent?.trim()) {
      editorRef.current.innerHTML = '<p><br></p>';
      lastHtmlRef.current = editorRef.current.innerHTML;
      allowMultipleParagraphsRef.current = false;
      return;
    }

    const merged = mergeDivLinesToParagraph(editorRef.current.innerHTML);
    if (merged !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = merged;
      placeCursorAtEnd(editorRef.current);
      lastHtmlRef.current = merged;
    }

    allowMultipleParagraphsRef.current = (merged.match(/<\/p>\s*<p/gi) ?? []).length > 0;
  };

  const handleBlur = () => {
    isFocusedRef.current = false;
    syncEditorContent(true);
    onChange(lastHtmlRef.current);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    lastKeyRef.current = e.key;

    if (e.key === 'Enter' && !e.shiftKey) {
      allowMultipleParagraphsRef.current = true;
      document.execCommand('defaultParagraphSeparator', false, 'p');
    }
  };

  const execCommand = (command: string, commandValue?: string) => {
    if (!editorRef.current) return;

    editorRef.current.focus();

    const selection = window.getSelection();
    let range: Range | null = null;

    if (selection && selection.rangeCount > 0) {
      range = selection.getRangeAt(0);
      if (!editorRef.current.contains(range.commonAncestorContainer)) {
        range = null;
      }
    }

    if (!range) {
      range = document.createRange();
      if (editorRef.current.childNodes.length > 0) {
        const lastNode = editorRef.current.childNodes[editorRef.current.childNodes.length - 1];
        if (lastNode.nodeType === Node.TEXT_NODE) {
          range.setStart(lastNode, lastNode.textContent?.length || 0);
        } else {
          range.setStartAfter(lastNode);
        }
      } else {
        range.selectNodeContents(editorRef.current);
      }
      range.collapse(true);
      selection?.removeAllRanges();
      selection?.addRange(range);
    }

    try {
      const success = document.execCommand(command, false, commandValue);

      if (!success && (command === 'insertOrderedList' || command === 'insertUnorderedList')) {
        const listTag = command === 'insertOrderedList' ? 'ol' : 'ul';
        const list = document.createElement(listTag);
        const listItem = document.createElement('li');

        if (range && !range.collapsed) {
          const contents = range.extractContents();
          listItem.appendChild(contents);
        } else {
          listItem.textContent = 'List item';
        }

        list.appendChild(listItem);
        range.insertNode(list);

        const newRange = document.createRange();
        newRange.setStartAfter(listItem);
        newRange.collapse(true);
        selection?.removeAllRanges();
        selection?.addRange(newRange);
      }
    } catch (error) {
      console.error('Error executing command:', error);
    }

    syncEditorContent(false);
    editorRef.current.focus();
  };

  const updateCurrentFormat = () => {
    if (!editorRef.current) return;
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const node = selection.anchorNode;
    if (!node) return;

    let element = node.nodeType === 3 ? node.parentElement : (node as Element);
    while (element && element !== editorRef.current) {
      const tagName = element.tagName.toLowerCase();
      if (tagName === 'h1') {
        setCurrentFormat('Heading 1');
        return;
      }
      if (tagName === 'h2') {
        setCurrentFormat('Heading 2');
        return;
      }
      if (tagName === 'h3') {
        setCurrentFormat('Heading 3');
        return;
      }
      if (tagName === 'h4') {
        setCurrentFormat('Heading 4');
        return;
      }
      element = element.parentElement as Element;
    }
    setCurrentFormat('Normal');
  };

  const applyFormat = (format: string) => {
    setShowStyleDropdown(false);
    setCurrentFormat(format);

    switch (format) {
      case 'Normal':
        execCommand('formatBlock', 'p');
        break;
      case 'Heading 1':
        execCommand('formatBlock', 'h1');
        break;
      case 'Heading 2':
        execCommand('formatBlock', 'h2');
        break;
      case 'Heading 3':
        execCommand('formatBlock', 'h3');
        break;
      case 'Heading 4':
        execCommand('formatBlock', 'h4');
        break;
    }
  };

  const ToolbarButton = ({
    onClick,
    title,
    children,
    active = false,
  }: {
    onClick: () => void;
    title: string;
    children: React.ReactNode;
    active?: boolean;
  }) => (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        editorRef.current?.focus();
        onClick();
      }}
      onMouseDown={(e) => {
        e.preventDefault();
      }}
      title={title}
      style={{
        border: 'none',
        background: 'transparent',
        padding: '6px 8px',
        cursor: 'pointer',
        borderRadius: '3px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: active ? '#0066cc' : '#333',
        backgroundColor: active ? '#e6f2ff' : 'transparent',
      }}
      onMouseEnter={(e) => {
        if (!active) e.currentTarget.style.backgroundColor = '#f0f0f0';
      }}
      onMouseLeave={(e) => {
        if (!active) e.currentTarget.style.backgroundColor = 'transparent';
      }}
    >
      {children}
    </button>
  );

  return (
    <div className={`form-group rich-text-editor ${className}`}>
      {label && <label className="form-label">{label}</label>}
      <div className="rich-text-editor-shell border rounded">
        <div className="rich-text-editor-toolbar d-flex align-items-center gap-1 p-2 border-bottom">
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setShowStyleDropdown(!showStyleDropdown)}
              className="rich-text-toolbar-btn"
            >
              <span>{currentFormat}</span>
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                <path
                  d="M1 1L5 5L9 1"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            {showStyleDropdown && (
              <>
                <div className="rich-text-dropdown-backdrop" onClick={() => setShowStyleDropdown(false)} />
                <div className="rich-text-dropdown-menu">
                  {['Normal', 'Heading 1', 'Heading 2', 'Heading 3', 'Heading 4'].map((format) => (
                    <button
                      key={format}
                      type="button"
                      onClick={() => applyFormat(format)}
                      className={currentFormat === format ? 'active' : ''}
                    >
                      {format}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="rich-text-toolbar-divider" />

          <ToolbarButton onClick={() => execCommand('bold')} title="Bold">
            <strong style={{ fontWeight: 700, fontSize: '14px' }}>B</strong>
          </ToolbarButton>

          <ToolbarButton onClick={() => execCommand('italic')} title="Italic">
            <em style={{ fontStyle: 'italic', fontSize: '14px' }}>I</em>
          </ToolbarButton>

          <ToolbarButton onClick={() => execCommand('underline')} title="Underline">
            <u style={{ fontSize: '14px' }}>U</u>
          </ToolbarButton>

          <ToolbarButton onClick={() => execCommand('strikeThrough')} title="Strikethrough">
            <span style={{ fontSize: '14px', textDecoration: 'line-through' }}>S</span>
          </ToolbarButton>

          <div className="rich-text-toolbar-divider" />

          <ToolbarButton onClick={() => execCommand('insertOrderedList')} title="Numbered List">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M2 4.5H4M2 9H4M2 13.5H4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M7 4.5H16M7 9H16M7 13.5H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </ToolbarButton>

          <ToolbarButton onClick={() => execCommand('insertUnorderedList')} title="Bulleted List">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <circle cx="3" cy="4.5" r="1" fill="currentColor" />
              <circle cx="3" cy="9" r="1" fill="currentColor" />
              <circle cx="3" cy="13.5" r="1" fill="currentColor" />
              <path d="M7 4.5H16M7 9H16M7 13.5H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </ToolbarButton>

          <div className="rich-text-toolbar-divider" />

          <ToolbarButton
            onClick={() => {
              const url = prompt('Enter URL:');
              if (url) {
                execCommand('createLink', url);
              }
            }}
            title="Insert Link"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M6.5 9.5L9.5 6.5M9.5 6.5L11.5 4.5C12.3284 3.67157 12.3284 2.32843 11.5 1.5C10.6716 0.671573 9.32843 0.671573 8.5 1.5L6.5 3.5M9.5 6.5L11.5 8.5M6.5 3.5L4.5 1.5C3.67157 0.671573 2.32843 0.671573 1.5 1.5C0.671573 2.32843 0.671573 3.67157 1.5 4.5L3.5 6.5M6.5 3.5L3.5 6.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </ToolbarButton>

          <ToolbarButton onClick={() => execCommand('removeFormat')} title="Clear Formatting">
            <div style={{ position: 'relative', width: '16px', height: '16px' }}>
              <span style={{ fontSize: '12px', fontWeight: 'bold', lineHeight: '1', color: 'currentColor' }}>T</span>
              <span
                style={{
                  fontSize: '8px',
                  position: 'absolute',
                  bottom: '-2px',
                  right: '-2px',
                  color: 'currentColor',
                }}
              >
                x
              </span>
              <svg width="16" height="16" viewBox="0 0 16 16" style={{ position: 'absolute', top: 0, left: 0 }}>
                <path d="M2 2L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
          </ToolbarButton>
        </div>

        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleInput}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          onClick={updateCurrentFormat}
          className="p-3 rich-text-editor-content"
          data-placeholder={placeholder}
        />
      </div>
    </div>
  );
}
