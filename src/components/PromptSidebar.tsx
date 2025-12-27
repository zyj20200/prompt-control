'use client';

import { useState } from 'react';
import { Prompt, Folder } from '@/types/prompt';

interface PromptSidebarProps {
  prompts: Prompt[];
  folders: Folder[];
  selectedId?: string;
  onSelect: (id: string) => void;
  onNew: () => void;
  onCreateFolder: (name: string) => void;
  onDeleteFolder: (id: string) => void;
  onRenameFolder: (id: string, name: string) => void;
  onMovePrompt: (promptId: string, folderId: string | undefined) => void;
}

export default function PromptSidebar({ 
  prompts, 
  folders, 
  selectedId, 
  onSelect, 
  onNew,
  onCreateFolder,
  onDeleteFolder,
  onRenameFolder,
  onMovePrompt
}: PromptSidebarProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [editingFolderName, setEditingFolderName] = useState('');
  const [dragOverFolderId, setDragOverFolderId] = useState<string | null>(null);

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const handleDragStart = (e: React.DragEvent, promptId: string) => {
    e.dataTransfer.setData('promptId', promptId);
  };

  const handleDragOver = (e: React.DragEvent, folderId: string | null) => {
    e.preventDefault();
    setDragOverFolderId(folderId);
  };

  const handleDrop = (e: React.DragEvent, folderId: string | undefined) => {
    e.preventDefault();
    const promptId = e.dataTransfer.getData('promptId');
    if (promptId) {
      onMovePrompt(promptId, folderId);
    }
    setDragOverFolderId(null);
  };

  const handleCreateFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (newFolderName.trim()) {
      onCreateFolder(newFolderName.trim());
      setNewFolderName('');
      setIsCreatingFolder(false);
    }
  };

  const handleRenameFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingFolderId && editingFolderName.trim()) {
      onRenameFolder(editingFolderId, editingFolderName.trim());
      setEditingFolderId(null);
      setEditingFolderName('');
    }
  };

  const unorganizedPrompts = prompts.filter(p => !p.folderId);

  return (
    <div className="flex flex-col h-full bg-gray-50 border-r border-gray-200 w-80">
      <div className="h-[88px] px-6 border-b border-gray-200 flex justify-between items-center shrink-0 bg-white">
        <h2 className="text-xl font-bold text-gray-900">提示词</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setIsCreatingFolder(true)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="新建文件夹"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 10.5v6m3-3H9m4.06-7.19l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
            </svg>
          </button>
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
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Create Folder Input */}
        {isCreatingFolder && (
          <form onSubmit={handleCreateFolder} className="mb-2">
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="文件夹名称..."
              autoFocus
              onBlur={() => setIsCreatingFolder(false)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </form>
        )}

        {/* Folders List */}
        <div className="space-y-1">
          {folders.map(folder => {
            const folderPrompts = prompts.filter(p => p.folderId === folder.id);
            const isExpanded = expandedFolders.has(folder.id);
            const isEditing = editingFolderId === folder.id;

            return (
              <div 
                key={folder.id} 
                className={`select-none rounded-lg transition-colors ${
                  dragOverFolderId === folder.id ? 'bg-indigo-50 ring-2 ring-indigo-500 ring-inset' : ''
                }`}
                onDragOver={(e) => handleDragOver(e, folder.id)}
                onDrop={(e) => handleDrop(e, folder.id)}
                onDragLeave={() => setDragOverFolderId(null)}
              >
                {isEditing ? (
                  <form onSubmit={handleRenameFolder} className="px-2 py-1">
                    <input
                      type="text"
                      value={editingFolderName}
                      onChange={(e) => setEditingFolderName(e.target.value)}
                      autoFocus
                      onBlur={() => setEditingFolderId(null)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </form>
                ) : (
                  <div 
                    className="group flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-gray-200 cursor-pointer text-gray-700"
                    onClick={() => toggleFolder(folder.id)}
                  >
                    <div className="flex items-center space-x-2 overflow-hidden">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 20 20" 
                        fill="currentColor" 
                        className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                      >
                        <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
                      </svg>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-yellow-500">
                        <path d="M3.75 3A1.75 1.75 0 002 4.75v3.26a3.235 3.235 0 011.75-.51h12.5c.644 0 1.245.188 1.75.51V6.75A1.75 1.75 0 0016.25 5h-4.836a.25.25 0 01-.177-.073L9.823 3.513A1.75 1.75 0 008.586 3H3.75zM3.75 9A1.75 1.75 0 002 10.75v4.5c0 .966.784 1.75 1.75 1.75h12.5A1.75 1.75 0 0018 15.25v-4.5A1.75 1.75 0 0016.25 9H3.75z" />
                      </svg>
                      <span className="text-sm font-medium truncate">{folder.name}</span>
                      <span className="text-xs text-gray-400">({folderPrompts.length})</span>
                    </div>
                    
                    <div className="hidden group-hover:flex items-center space-x-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingFolderId(folder.id);
                          setEditingFolderName(folder.name);
                        }}
                        className="p-1 hover:bg-gray-300 rounded"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                          <path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" />
                          <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" />
                        </svg>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm('确定要删除此文件夹吗？文件夹内的提示词将变为未分类。')) {
                            onDeleteFolder(folder.id);
                          }
                        }}
                        className="p-1 hover:bg-gray-300 rounded text-red-500"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                          <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}

                {isExpanded && (
                  <ul className="ml-6 mt-1 space-y-1 border-l border-gray-200 pl-2">
                    {folderPrompts.map((prompt) => (
                      <li key={prompt.id} className="group">
                        <div
                          onClick={() => onSelect(prompt.id)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200 text-sm cursor-pointer ${
                            selectedId === prompt.id 
                              ? 'bg-white shadow-sm text-indigo-600 font-medium' 
                              : 'hover:bg-white/50 text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          <div className="truncate flex-1">{prompt.title}</div>
                          <div
                            draggable
                            onDragStart={(e) => handleDragStart(e, prompt.id)}
                            onClick={(e) => e.stopPropagation()}
                            className="hidden group-hover:block cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 p-1 ml-2"
                            title="按住拖动"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                              <path fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                      </li>
                    ))}
                    {folderPrompts.length === 0 && (
                      <li className="text-xs text-gray-400 px-3 py-2 italic">空文件夹</li>
                    )}
                  </ul>
                )}
              </div>
            );
          })}
        </div>

        {/* Unorganized Prompts */}
        {unorganizedPrompts.length > 0 && (
          <div 
            className={`pt-2 rounded-lg transition-colors ${
              dragOverFolderId === 'unorganized' ? 'bg-indigo-50 ring-2 ring-indigo-500 ring-inset' : ''
            }`}
            onDragOver={(e) => handleDragOver(e, 'unorganized')}
            onDrop={(e) => handleDrop(e, undefined)}
            onDragLeave={() => setDragOverFolderId(null)}
          >
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-2">
              未分类
            </div>
            <ul className="space-y-1">
              {unorganizedPrompts.map((prompt) => (
                <li key={prompt.id} className="group">
                  <div
                    onClick={() => onSelect(prompt.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200 text-sm cursor-pointer ${
                      selectedId === prompt.id 
                        ? 'bg-white shadow-sm text-indigo-600 font-medium' 
                        : 'hover:bg-white/50 text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <div className="truncate flex-1">{prompt.title}</div>
                    <div
                      draggable
                      onDragStart={(e) => handleDragStart(e, prompt.id)}
                      onClick={(e) => e.stopPropagation()}
                      className="hidden group-hover:block cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 p-1 ml-2"
                      title="按住拖动"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                        <path fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
