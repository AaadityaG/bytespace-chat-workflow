import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { MessageSquare } from 'lucide-react';

interface MessageNodeData {
  label: string;
  message: string;
  icon?: React.ComponentType<any>;
}

const MessageNode = memo(({ data, selected }: NodeProps<MessageNodeData>) => {
  const Icon = data.icon || MessageSquare;

  return (
    <div className={`
      relative bg-gradient-flow border-2 border-flow-node-border rounded-lg px-4 py-3 
      shadow-flow-node min-w-[200px] transition-all duration-200
      ${selected ? 'ring-2 ring-primary ring-offset-2' : ''}
      hover:shadow-lg hover:scale-105
    `}>
      <Handle
        type="target"
        position={Position.Left}
        className="w-3 h-3 bg-flow-edge border-2 border-white"
      />
      
      <div className="flex items-center gap-2 mb-2">
        <div className="p-1 bg-flow-node-border rounded">
          <Icon className="w-4 h-4 text-flow-node-text" />
        </div>
        <span className="font-medium text-flow-node-text text-sm">
          {data.label}
        </span>
      </div>
      
      <div className="text-flow-node-text text-sm bg-white/20 rounded px-2 py-1 backdrop-blur-sm">
        {data.message}
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="w-3 h-3 bg-flow-edge border-2 border-white"
      />
    </div>
  );
});

MessageNode.displayName = 'MessageNode';

export default MessageNode;