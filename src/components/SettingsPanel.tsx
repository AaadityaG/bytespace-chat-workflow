import React, { useState, useEffect } from 'react';
import { Node } from 'reactflow';
import { X, ArrowLeft, MessageSquare, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  selectedNode: Node | null;
  updateNodeData: (nodeId: string, newData: any) => void;
  deleteNode?: (nodeId: string) => void; // Added deleteNode prop
}

export default function SettingsPanel({ 
  isOpen, 
  onClose, 
  selectedNode, 
  updateNodeData,
  deleteNode // Destructure deleteNode prop
}: SettingsPanelProps) {
  const [message, setMessage] = useState('');
  const [label, setLabel] = useState('');

  useEffect(() => {
    if (selectedNode) {
      setMessage(selectedNode.data.message || '');
      setLabel(selectedNode.data.label || '');
    }
  }, [selectedNode]);

  const handleSave = () => {
    if (selectedNode) {
      updateNodeData(selectedNode.id, {
        message,
        label,
      });
      onClose();
    }
  };

  // Added handleDelete function
  const handleDelete = () => {
    if (selectedNode && deleteNode) {
      deleteNode(selectedNode.id);
      onClose();
    }
  };

  if (!isOpen || !selectedNode) {
    return null;
  }

  return (
    <div className="absolute top-0 right-0 h-full w-80 bg-flow-panel border-l border-flow-panel-border shadow-flow-panel z-10">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-flow-panel-border">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h2 className="font-semibold text-lg">Settings panel</h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
            data-testid="close-settings-panel"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 space-y-6">
          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
            <div className="p-2 bg-flow-node rounded">
              <MessageSquare className="w-5 h-5 text-flow-node-text" />
            </div>
            <div>
              <div className="font-medium">Message</div>
              <div className="text-sm text-muted-foreground">
                Configure message node settings
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="node-label">Node Label</Label>
              <Input
                id="node-label"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="Enter node label"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message-text">Text</Label>
              <Textarea
                id="message-text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter your message here..."
                className="w-full min-h-[100px] resize-none"
              />
              <div className="text-xs text-muted-foreground">
                {message.length} characters
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-flow-panel-border">
          <div className="flex gap-2">
            <Button
              onClick={handleSave}
              className="flex-1"
            >
              Save Changes
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
          {/* Added Delete button */}
          <div className="mt-2">
            <Button
              variant="outline"
              onClick={handleDelete}
              className="w-full border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
              disabled={!deleteNode} // Disable if deleteNode is not provided
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Node
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}