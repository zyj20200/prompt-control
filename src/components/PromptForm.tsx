'use client';

import { useState, useEffect } from 'react';
import { Prompt } from '@/types/prompt';

interface PromptFormProps {
  initialData?: Prompt;
  onSubmit: (data: { title: string; content: string }) => void;
  onCancel: () => void;
  isEditing?: boolean;
  onChange?: (data: { title: string; content: string }) => void;
}

export default function PromptForm({ initialData, onSubmit, onCancel, isEditing, onChange }: PromptFormProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    onChange?.({ title, content });
  }, [title, content, onChange]);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setContent(initialData.content);
    } else {
      setTitle('');
      setContent('');
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, content });
  };

  return (
    <form onSubmit={handleSubmit} className="h-full flex flex-col bg-white">
      <div className="h-[88px] px-8 border-b border-gray-200 flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-10 shrink-0">
        <div className="flex-1 mr-8">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="输入提示词标题..."
            className="block w-full text-2xl font-bold text-gray-900 placeholder-gray-300 border-none focus:ring-0 p-0 bg-transparent transition-colors"
          />
        </div>
        <div className="flex space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors shadow-sm"
          >
            取消
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors shadow-sm flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mr-1.5">
              <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
            </svg>
            保存
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto h-full flex flex-col">
          <div className="flex-1 flex flex-col min-h-[500px] relative group">
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              placeholder="在此输入提示词内容 (支持 Markdown)..."
              className="flex-1 block w-full text-base leading-relaxed text-gray-600 placeholder-gray-300 border-none focus:ring-0 p-0 bg-transparent resize-none font-mono"
            />
            <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-400 ring-1 ring-inset ring-gray-500/10">
                Markdown
              </span>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}