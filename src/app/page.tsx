'use client';

import { useState, useEffect } from 'react';
import { Prompt, Folder } from '@/types/prompt';
import PromptSidebar from '@/components/PromptSidebar';
import PromptDetail from '@/components/PromptDetail';
import PromptForm from '@/components/PromptForm';
import ChatPanel from '@/components/ChatPanel';

export default function Home() {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [editingData, setEditingData] = useState<{ title: string; content: string; folderId?: string } | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [promptsRes, foldersRes] = await Promise.all([
        fetch('/api/prompts'),
        fetch('/api/folders')
      ]);
      const promptsData = await promptsRes.json();
      const foldersData = await foldersRes.json();
      setPrompts(promptsData);
      setFolders(foldersData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreate = async (data: { title: string; content: string; folderId?: string }) => {
    try {
      const response = await fetch('/api/prompts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        const newPrompt = await response.json();
        await fetchData();
        setSelectedId(newPrompt.id);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Failed to create prompt:', error);
    }
  };

  const handleUpdate = async (data: { title: string; content: string; folderId?: string }) => {
    if (!selectedId) return;
    try {
      const response = await fetch(`/api/prompts/${selectedId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        await fetchData();
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Failed to update prompt:', error);
    }
  };

  const handleDelete = async () => {
    if (!selectedId) return;
    if (!confirm('确定要删除这个提示词吗？')) return;
    try {
      const response = await fetch(`/api/prompts/${selectedId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        await fetchData();
        setSelectedId(undefined);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Failed to delete prompt:', error);
    }
  };

  const handleCreateFolder = async (name: string) => {
    try {
      const response = await fetch('/api/folders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      if (response.ok) {
        await fetchData();
      }
    } catch (error) {
      console.error('Failed to create folder:', error);
    }
  };

  const handleRenameFolder = async (id: string, name: string) => {
    try {
      const response = await fetch(`/api/folders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      if (response.ok) {
        await fetchData();
      }
    } catch (error) {
      console.error('Failed to rename folder:', error);
    }
  };

  const handleDeleteFolder = async (id: string) => {
    try {
      const response = await fetch(`/api/folders/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        await fetchData();
      }
    } catch (error) {
      console.error('Failed to delete folder:', error);
    }
  };

  const handleMovePrompt = async (promptId: string, folderId: string | undefined) => {
    try {
      const prompt = prompts.find(p => p.id === promptId);
      if (!prompt) return;

      const response = await fetch(`/api/prompts/${promptId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...prompt, folderId }),
      });
      if (response.ok) {
        await fetchData();
      }
    } catch (error) {
      console.error('Failed to move prompt:', error);
    }
  };

  const handleSelect = (id: string) => {
    setSelectedId(id);
    setIsEditing(false);
  };

  const handleNew = () => {
    setSelectedId(undefined);
    setIsEditing(true);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (!selectedId && prompts.length > 0) {
        // If we were creating a new one and cancelled, maybe select the first one or nothing?
        // Keeping it undefined is fine.
    }
  };

  const selectedPrompt = prompts.find(p => p.id === selectedId);
  const systemPrompt = isEditing ? (editingData?.content || '') : (selectedPrompt?.content || '');

  return (
    <main className="flex h-screen bg-gray-100 overflow-hidden">
      <PromptSidebar
        prompts={prompts}
        folders={folders}
        selectedId={selectedId}
        onSelect={handleSelect}
        onNew={handleNew}
        onCreateFolder={handleCreateFolder}
        onDeleteFolder={handleDeleteFolder}
        onRenameFolder={handleRenameFolder}
        onMovePrompt={handleMovePrompt}
      />
      
      <div className="flex-1 flex flex-col h-full overflow-hidden border-r border-gray-200">
        {isLoading ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            加载中...
          </div>
        ) : isEditing ? (
          <PromptForm
            initialData={selectedPrompt}
            folders={folders}
            onSubmit={selectedId ? handleUpdate : handleCreate}
            onCancel={handleCancel}
            isEditing={!!selectedId}
            onChange={setEditingData}
          />
        ) : selectedPrompt ? (
          <PromptDetail
            prompt={selectedPrompt}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 bg-gray-50/30">
            <div className="text-center max-w-sm mx-auto p-8">
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 inline-block mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-indigo-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">准备好开始了吗？</h3>
              <p className="text-gray-500">从左侧列表选择一个提示词查看详情，或者点击“新建”按钮创建新的提示词。</p>
            </div>
          </div>
        )}
      </div>

      <ChatPanel systemPrompt={systemPrompt} />
    </main>
  );
}

