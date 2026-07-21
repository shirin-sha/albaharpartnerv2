"use client";

import React, { useRef, useEffect, useState } from 'react';

interface RichTextEditorProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function RichTextEditor({
  label,
  value,
  onChange,
  placeholder = 'Enter description...',
  className = '',
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [showStyleDropdown, setShowStyleDropdown] = useState(false);
  const [currentFormat, setCurrentFormat] = useState('Normal');

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      const selection = window.getSelection();
      const range = selection?.rangeCount ? selection.getRangeAt(0) : null;
      editorRef.current.innerHTML = value || '';
      if (range && selection) {
        try {
          selection.removeAllRanges();
          selection.addRange(range);
        } catch (e) {
          // Ignore selection errors
        }
      }
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
      updateCurrentFormat();
    }
  };

  const execCommand = (command: string, value?: string) => {
    if (!editorRef.current) return;
    
    // Ensure editor is focused
    editorRef.current.focus();
    
    // Get current selection
    const selection = window.getSelection();
    let range: Range | null = null;
    
    // Try to get existing selection
    if (selection && selection.rangeCount > 0) {
      range = selection.getRangeAt(0);
      // Check if selection is within editor
      if (!editorRef.current.contains(range.commonAncestorContainer)) {
        range = null;
      }
    }
    
    // If no valid selection, create one at the end
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
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
    
    // Execute the command
    try {
      const success = document.execCommand(command, false, value);
      
      // If list command failed, create list manually
      if (!success && (command === 'insertOrderedList' || command === 'insertUnorderedList')) {
        const listTag = command === 'insertOrderedList' ? 'ol' : 'ul';
        const list = document.createElement(listTag);
        const listItem = document.createElement('li');
        
        // Get selected text or use default
        if (range && !range.collapsed) {
          const contents = range.extractContents();
          listItem.appendChild(contents);
        } else {
          listItem.textContent = 'List item';
        }
        
        list.appendChild(listItem);
        range.insertNode(list);
        
        // Set cursor after list item
        const newRange = document.createRange();
        newRange.setStartAfter(listItem);
        newRange.collapse(true);
        if (selection) {
          selection.removeAllRanges();
          selection.addRange(newRange);
        }
      }
    } catch (error) {
      console.error('Error executing command:', error);
    }
    
    // Update content
    handleInput();
    
    // Maintain focus
    editorRef.current.focus();
  };

  const updateCurrentFormat = () => {
    if (!editorRef.current) return;
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    
    const node = selection.anchorNode;
    if (!node) return;
    
    let element = node.nodeType === 3 ? node.parentElement : node as Element;
    while (element && element !== editorRef.current) {
      const tagName = element.tagName.toLowerCase();
      if (tagName === 'h1') {
        setCurrentFormat('Heading 1');
        return;
      } else if (tagName === 'h2') {
        setCurrentFormat('Heading 2');
        return;
      } else if (tagName === 'h3') {
        setCurrentFormat('Heading 3');
        return;
      } else if (tagName === 'h4') {
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
        execCommand('formatBlock', '<p>');
        break;
      case 'Heading 1':
        execCommand('formatBlock', '<h1>');
        break;
      case 'Heading 2':
        execCommand('formatBlock', '<h2>');
        break;
      case 'Heading 3':
        execCommand('formatBlock', '<h3>');
        break;
      case 'Heading 4':
        execCommand('formatBlock', '<h4>');
        break;
    }
  };

  const ToolbarButton = ({ 
    onClick, 
    title, 
    children, 
    active = false 
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
        // Ensure editor has focus before executing command
        if (editorRef.current) {
          editorRef.current.focus();
        }
        onClick();
      }}
      onMouseDown={(e) => {
        // Prevent losing focus when clicking button
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
    <div className={`form-group ${className}`}>
      {label && (
        <label className="form-label">{label}</label>
      )}
      <div className="border rounded" style={{ backgroundColor: '#fff' }}>
        {/* Toolbar */}
        <div 
          className="d-flex align-items-center gap-1 p-2 border-bottom" 
          style={{ 
            flexWrap: 'wrap',
            backgroundColor: '#f8f9fa',
            borderColor: '#dee2e6',
            minHeight: '40px'
          }}
        >
          {/* Style Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              type="button"
              onClick={() => setShowStyleDropdown(!showStyleDropdown)}
              style={{
                border: 'none',
                background: 'transparent',
                padding: '6px 12px',
                cursor: 'pointer',
                borderRadius: '3px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                color: '#333',
                fontSize: '14px',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <span>{currentFormat}</span>
              <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            {showStyleDropdown && (
              <>
                <div 
                  style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 999,
                  }}
                  onClick={() => setShowStyleDropdown(false)}
                />
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    marginTop: '4px',
                    backgroundColor: '#fff',
                    border: '1px solid #dee2e6',
                    borderRadius: '4px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    zIndex: 1000,
                    minWidth: '150px',
                  }}
                >
                  {['Normal', 'Heading 1', 'Heading 2', 'Heading 3', 'Heading 4'].map((format) => (
                    <button
                      key={format}
                      type="button"
                      onClick={() => applyFormat(format)}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '8px 12px',
                        border: 'none',
                        background: currentFormat === format ? '#e6f2ff' : 'transparent',
                        cursor: 'pointer',
                        fontSize: '14px',
                        color: '#333',
                      }}
                      onMouseEnter={(e) => {
                        if (currentFormat !== format) e.currentTarget.style.backgroundColor = '#f0f0f0';
                      }}
                      onMouseLeave={(e) => {
                        if (currentFormat !== format) e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      {format}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Divider */}
          <div style={{ width: '1px', height: '20px', backgroundColor: '#dee2e6', margin: '0 4px' }} />

          {/* Line Spacing (placeholder - can be enhanced later) */}
          <ToolbarButton onClick={() => {}} title="Line Spacing">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M4 4L8 1L12 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M4 12L8 15L12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </ToolbarButton>

          {/* Bold */}
          <ToolbarButton onClick={() => execCommand('bold')} title="Bold">
            <strong style={{ fontWeight: 700, fontSize: '14px' }}>B</strong>
          </ToolbarButton>

          {/* Italic */}
          <ToolbarButton onClick={() => execCommand('italic')} title="Italic">
            <em style={{ fontStyle: 'italic', fontSize: '14px' }}>I</em>
          </ToolbarButton>

          {/* Underline */}
          <ToolbarButton onClick={() => execCommand('underline')} title="Underline">
            <u style={{ fontSize: '14px' }}>U</u>
          </ToolbarButton>

          {/* Strikethrough */}
          <ToolbarButton onClick={() => execCommand('strikeThrough')} title="Strikethrough">
            <span style={{ fontSize: '14px', textDecoration: 'line-through' }}>S</span>
          </ToolbarButton>

          {/* Divider */}
          <div style={{ width: '1px', height: '20px', backgroundColor: '#dee2e6', margin: '0 4px' }} />

          {/* Numbered List */}
          <ToolbarButton onClick={() => execCommand('insertOrderedList')} title="Numbered List">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M2 4.5H4M2 9H4M2 13.5H4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M7 4.5H16M7 9H16M7 13.5H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </ToolbarButton>

          {/* Bulleted List */}
          <ToolbarButton onClick={() => execCommand('insertUnorderedList')} title="Bulleted List">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <circle cx="3" cy="4.5" r="1" fill="currentColor"/>
              <circle cx="3" cy="9" r="1" fill="currentColor"/>
              <circle cx="3" cy="13.5" r="1" fill="currentColor"/>
              <path d="M7 4.5H16M7 9H16M7 13.5H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </ToolbarButton>

          {/* Indent Decrease */}
          <ToolbarButton onClick={() => execCommand('outdent')} title="Decrease Indent">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M2 4.5H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M2 9H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M2 13.5H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M2 9L5 6L2 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
          </ToolbarButton>

          {/* Indent Increase */}
          <ToolbarButton onClick={() => execCommand('indent')} title="Increase Indent">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M2 4.5H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M5 9H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M2 13.5H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M2 9L5 6L2 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
          </ToolbarButton>

          {/* Divider */}
          <div style={{ width: '1px', height: '20px', backgroundColor: '#dee2e6', margin: '0 4px' }} />

          {/* Link */}
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
              <path d="M6.5 9.5L9.5 6.5M9.5 6.5L11.5 4.5C12.3284 3.67157 12.3284 2.32843 11.5 1.5C10.6716 0.671573 9.32843 0.671573 8.5 1.5L6.5 3.5M9.5 6.5L11.5 8.5M6.5 3.5L4.5 1.5C3.67157 0.671573 2.32843 0.671573 1.5 1.5C0.671573 2.32843 0.671573 3.67157 1.5 4.5L3.5 6.5M6.5 3.5L3.5 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </ToolbarButton>

          {/* Clear Formatting */}
          <ToolbarButton onClick={() => execCommand('removeFormat')} title="Clear Formatting">
            <div style={{ position: 'relative', width: '16px', height: '16px' }}>
              <span style={{ fontSize: '12px', fontWeight: 'bold', lineHeight: '1', color: 'currentColor' }}>T</span>
              <span style={{ fontSize: '8px', position: 'absolute', bottom: '-2px', right: '-2px', color: 'currentColor' }}>x</span>
              <svg width="16" height="16" viewBox="0 0 16 16" style={{ position: 'absolute', top: 0, left: 0 }}>
                <path d="M2 2L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
          </ToolbarButton>
        </div>
        {/* Editor */}
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          onClick={updateCurrentFormat}
          onKeyUp={updateCurrentFormat}
          className="p-3"
          style={{
            minHeight: '150px',
            outline: 'none',
            fontSize: '14px',
            lineHeight: '1.6',
            color: '#333',
          }}
          data-placeholder={placeholder}
        />
        <style jsx>{`
          div[contenteditable][data-placeholder]:empty:before {
            content: attr(data-placeholder);
            color: #999;
            pointer-events: none;
          }
        `}</style>
      </div>
    </div>
  );
}
