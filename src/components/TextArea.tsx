'use client';

import { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface TextAreaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  minRows?: number;
  maxRows?: number;
}

export function TextArea({
  value,
  onChange,
  placeholder,
  className,
  minRows = 3,
  maxRows = 8,
}: TextAreaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize with smooth transition
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = 'auto';
    const lineHeight = 26; // Slightly more generous line height
    const padding = 32; // Account for padding
    const minHeight = lineHeight * minRows + padding;
    const maxHeight = lineHeight * maxRows + padding;
    const scrollHeight = Math.min(Math.max(textarea.scrollHeight, minHeight), maxHeight);
    textarea.style.height = `${scrollHeight}px`;
  }, [value, minRows, maxRows]);

  return (
    <div className="relative">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          'input textarea resize-none leading-[1.65] text-[15px]',
          'transition-all duration-200',
          className
        )}
        rows={minRows}
      />
      
      {/* Subtle gradient fade at bottom when content overflows */}
      {value && value.length > 200 && (
        <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-[hsl(var(--background))] to-transparent pointer-events-none rounded-b-xl opacity-50" />
      )}
    </div>
  );
}
