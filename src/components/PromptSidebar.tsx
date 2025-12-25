'use client';

import { Prompt } from '@/types/prompt';

interface PromptSidebarProps {
  prompts: Prompt[];
  selectedId?: string;
  onSelect: (id: string) => void;
  onNew: () => void;
}

export default function PromptSidebar({ prompts, selectedId, onSelect, onNew }: PromptSidebarProps) {
  return (
    <div className="flex flex-col h-full bg-gray-50 border-r border-gray-200 w-80">
      <div className="h-[88px] px-6 border-b border-gray-200 flex justify-between items-center shrink-0 bg-white">
        <h2 className="text-xl font-bold text-gray-900">提示词</h2>
        <button
          onClick={onNew}
          className="p-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors"
          title="新增提示词"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {prompts.length === 0 ? (
          <div className="text-center text-gray-500 text-sm py-8">
            暂无提示词，点击右上角新增
          </div>
        ) : (
          <ul className="space-y-2">
            {prompts.map((prompt) => (
              <li key={prompt.id}>
                <button
                  onClick={() => onSelect(prompt.id)}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 group ${
                    selectedId === prompt.id 
                      ? 'bg-white shadow-md ring-1 ring-black/5' 
                      : 'hover:bg-white hover:shadow-sm'
                  }`}
                >
                  <div className={`text-sm font-semibold truncate mb-1 ${
                    selectedId === prompt.id ? 'text-indigo-600' : 'text-gray-900'
                  }`}>
                    {prompt.title}
                  </div>
                  <div className="text-xs text-gray-500 truncate flex justify-between items-center">
                    <span>{new Date(prompt.updatedAt).toLocaleDateString()}</span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
