import React from 'react';
import { MessageSquare } from 'lucide-react';

interface NodesPanelProps {
  isOpen: boolean;
}

export default function NodesPanel({ isOpen }: NodesPanelProps) {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="absolute top-0 right-0 h-full w-80 bg-flow-panel border-l border-flow-panel-border shadow-flow-panel z-10">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-flow-panel-border">
          <h2 className="font-semibold text-lg">Nodes Panel</h2>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 space-y-4">
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">Available Nodes</h3>
            
            {/* Message Node */}
            <div
              className="flex items-center gap-3 p-4 bg-muted rounded-lg border-2 border-dashed border-border hover:border-primary cursor-grab active:cursor-grabbing transition-all"
              draggable
              onDragStart={(event) => onDragStart(event, 'messageNode')}
            >
              <div className="p-2 bg-flow-node rounded">
                <MessageSquare className="w-5 h-5 text-flow-node-text" />
              </div>
              <div>
                <div className="font-medium">Message</div>
                <div className="text-sm text-muted-foreground">
                  Send a text message
                </div>
              </div>
            </div>
          </div>

          <div className="text-xs text-muted-foreground mt-4 p-3 bg-muted/50 rounded">
            Drag and drop nodes onto the canvas to add them to your flow.
          </div>
        </div>
      </div>
    </div>
  );
}