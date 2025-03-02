import React, { useState } from 'react';
import { Save, X, Plus, Star, Clock } from 'lucide-react';
import { updateModelMetadata, getModelMetadataByName } from '@/utils/aiServices';

interface ModelMetadataEditorProps {
  modelName: string;
  onClose: () => void;
}

export function ModelMetadataEditor({ modelName, onClose }: ModelMetadataEditorProps) {
  const metadata = getModelMetadataByName(modelName) || {
    tags: [],
    notes: '',
    performance: {
      tasks: [],
      rating: 0,
      lastUsed: undefined
    }
  };

  const [tags, setTags] = useState<string[]>(metadata.tags || []);
  const [newTag, setNewTag] = useState('');
  const [notes, setNotes] = useState(metadata.notes || '');
  const [rating, setRating] = useState(metadata.performance?.rating || 0);
  const [tasks, setTasks] = useState<string[]>(metadata.performance?.tasks || []);
  const [newTask, setNewTask] = useState('');

  const handleSave = () => {
    updateModelMetadata(modelName, {
      tags,
      notes,
      performance: {
        tasks,
        rating,
        lastUsed: metadata.performance?.lastUsed
      }
    });
    onClose();
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const addTask = () => {
    if (newTask.trim() && !tasks.includes(newTask.trim())) {
      setTasks([...tasks, newTask.trim()]);
      setNewTask('');
    }
  };

  const removeTask = (task: string) => {
    setTasks(tasks.filter(t => t !== task));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-lg w-full mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">{modelName}</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-1"
                >
                  {tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="hover:text-blue-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTag()}
                className="flex-1 px-3 py-2 border rounded-lg"
                placeholder="Add a tag..."
              />
              <button
                onClick={addTag}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
              rows={4}
              placeholder="Add notes about this model..."
            />
          </div>

          {/* Performance Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Performance Rating
            </label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= rating
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Best For Tasks */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Best For Tasks
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tasks.map((task) => (
                <span
                  key={task}
                  className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm flex items-center gap-1"
                >
                  {task}
                  <button
                    onClick={() => removeTask(task)}
                    className="hover:text-green-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTask()}
                className="flex-1 px-3 py-2 border rounded-lg"
                placeholder="Add a task..."
              />
              <button
                onClick={addTask}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {metadata.performance?.lastUsed && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              Last used: {new Date(metadata.performance.lastUsed).toLocaleString()}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-6 border-t">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}