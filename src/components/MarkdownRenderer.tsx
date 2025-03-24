'use client';

import React, { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { CodeBlock } from './ui/code-block';
import Prism from 'prismjs';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-python';
import './syntax-highlighting.css';

type MarkdownRendererProps = {
  content: string;
};

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  useEffect(() => {
    Prism.highlightAll();
  }, [content]);

  return (
    <div className="prose dark:prose-invert max-w-none">
      <ReactMarkdown
        components={{
          code({ node, className, children, ...props }: any) {
            const inline = props.inline;
            const match = /language-(\w+)/.exec(className || '');
            const matchTitle = /title="([^"]*)"/.exec(className || '');
            const matchHighlight = /\{([^}]*)\}/.exec(className || '');
            const hasLineNumbers = className?.includes('showLineNumbers');
            
            if (inline) {
              return (
                <code className="bg-muted px-1 py-0.5 rounded text-sm" {...props}>
                  {children}
                </code>
              );
            }

            return (
              <CodeBlock
                language={match ? match[1] : undefined}
                title={matchTitle ? matchTitle[1] : undefined}
                showLineNumbers={hasLineNumbers}
                highlightLines={matchHighlight ? matchHighlight[1] : ''}
              >
                {String(children).replace(/\n$/, '')}
              </CodeBlock>
            );
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}