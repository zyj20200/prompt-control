'use client';

import { useState, useEffect, useRef } from 'react';
import { Prompt, Folder } from '@/types/prompt';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface PromptFormProps {
  initialData?: Prompt;
  folders: Folder[];
  onSubmit: (data: { title: string; content: string; folderId?: string }) => void;
  onCancel: () => void;
  isEditing?: boolean;
  onChange?: (data: { title: string; content: string; folderId?: string }) => void;
}

export default function PromptForm({ initialData, folders, onSubmit, onCancel, isEditing, onChange }: PromptFormProps) {
  const [viewMode, setViewMode] = useState<'edit' | 'preview' | 'split'>('edit');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [folderId, setFolderId] = useState<string | undefined>(undefined);
  const [isFolderDropdownOpen, setIsFolderDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsFolderDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    onChange?.({ title, content, folderId });
  }, [title, content, folderId, onChange]);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setContent(initialData.content);
      setFolderId(initialData.folderId);
    } else {
      setTitle('');
      setContent('');
      setFolderId(undefined);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, content, folderId });
  };

  return (
    <form onSubmit={handleSubmit} className="h-full flex flex-col bg-white">
      <div className="flex-none p-4 border-b border-gray-100 bg-white/50 backdrop-blur-sm z-10">
        <div className="flex items-center justify-between mb-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="输入提示词标题..."
            className="text-lg font-semibold text-gray-900 placeholder-gray-400 bg-transparent border-none focus:ring-0 p-0 w-full"
          />
          
          <div className="relative inline-block ml-4" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsFolderDropdownOpen(!isFolderDropdownOpen)}
              className="flex items-center space-x-2 pl-3 pr-2 py-1.5 text-xs font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-full hover:bg-gray-100 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            >
              <span className="truncate max-w-[150px]">
                {folderId 
                  ? `📁 ${folders.find(f => f.id === folderId)?.name || '未知文件夹'}`
                  : '📂 未分类'
                }
              </span>
              <svg 
                className={`h-3 w-3 text-gray-400 transition-transform duration-200 ${isFolderDropdownOpen ? 'rotate-180' : ''}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth={2} 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>

            {isFolderDropdownOpen && (
              <div className="absolute top-full right-0 mt-1 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="max-h-60 overflow-y-auto">
                  <button
                    type="button"
                    onClick={() => {
                      setFolderId(undefined);
                      setIsFolderDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm flex items-center space-x-2 hover:bg-gray-50 transition-colors ${
                      !folderId ? 'text-indigo-600 bg-indigo-50/50' : 'text-gray-700'
                    }`}
                  >
                    <span>📂</span>
                    <span>未分类</span>
                    {!folderId && (
                      <svg className="w-4 h-4 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                  {folders.length > 0 && <div className="h-px bg-gray-100 my-1" />}
                  {folders.map(f => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => {
                        setFolderId(f.id);
                        setIsFolderDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm flex items-center space-x-2 hover:bg-gray-50 transition-colors ${
                        folderId === f.id ? 'text-indigo-600 bg-indigo-50/50' : 'text-gray-700'
                      }`}
                    >
                      <span>📁</span>
                      <span className="truncate">{f.name}</span>
                      {folderId === f.id && (
                        <svg className="w-4 h-4 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
        
        <div className="flex bg-gray-100 p-1 rounded-lg mr-4">
          <button
            type="button"
            onClick={() => setViewMode('edit')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              viewMode === 'edit' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            编辑
          </button>
          <button
            type="button"
            onClick={() => setViewMode('split')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              viewMode === 'split' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            分屏
          </button>
          <button
            type="button"
            onClick={() => setViewMode('preview')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              viewMode === 'preview' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            预览
          </button>
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
      </div>
      
      <div className="flex-1 overflow-hidden relative">
        <div className={`h-full flex ${viewMode === 'split' ? 'divide-x divide-gray-200' : ''}`}>
          {/* Editor Area */}
          <div className={`
            h-full flex flex-col p-8 overflow-y-auto transition-all duration-300
            ${viewMode === 'preview' ? 'hidden' : ''}
            ${viewMode === 'split' ? 'w-1/2' : 'w-full mx-auto max-w-4xl'}
          `}>
            <div className="flex-1 flex flex-col min-h-[500px] relative group">
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                placeholder="在此输入提示词内容 (支持 Markdown)..."
                className="flex-1 block w-full text-base leading-relaxed text-gray-800 placeholder-gray-300 border-none focus:ring-0 focus:outline-none p-0 bg-transparent resize-none font-mono"
              />
              <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                <span className="inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-400 ring-1 ring-inset ring-gray-500/10">
                  Markdown
                </span>
              </div>
            </div>
          </div>

          {/* Preview Area */}
          <div className={`
            h-full overflow-y-auto bg-gray-50/50 p-8 transition-all duration-300
            ${viewMode === 'edit' ? 'hidden' : ''}
            ${viewMode === 'split' ? 'w-1/2' : 'w-full mx-auto max-w-4xl'}
          `}>
            <div className="prose prose-indigo max-w-none">
              {content ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {content}
                </ReactMarkdown>
              ) : (
                <p className="text-gray-400 italic">预览区域...</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}