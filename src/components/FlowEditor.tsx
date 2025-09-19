import React, { useCallback, useState, useRef } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  ReactFlowProvider,
  Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';

import MessageNode from './MessageNode';
import SettingsPanel from './SettingsPanel';
import NodesPanel from './NodesPanel';
import { Button } from './ui/button';
import { Plus, Save, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const nodeTypes = {
  messageNode: MessageNode,
};

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'messageNode',
    position: { x: 100, y: 100 },
    data: { 
      label: 'Send Message',
      message: 'test message 1',
      icon: MessageSquare,
    },
  },
  {
    id: '2',
    type: 'messageNode',
    position: { x: 400, y: 200 },
    data: { 
      label: 'Send Message',
      message: 'test message 2',
      icon: MessageSquare,
    },
  },
];

const initialEdges: Edge[] = [
  {
    id: 'e1-2',
    source: '1',
    target: '2',
    style: { stroke: 'hsl(var(--flow-edge))', strokeWidth: 2 },
    type: 'smoothstep',
  },
];

export default function FlowEditor() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [isSettingsPanelOpen, setIsSettingsPanelOpen] = useState(false);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const onConnect = useCallback(
    (params: Connection) => {
      if (!params.source || !params.target) return;
      
      // Check if source already has an outgoing edge
      const existingSourceEdge = edges.find(edge => edge.source === params.source);
      if (existingSourceEdge) {
        toast({
          title: "Connection not allowed",
          description: "Each node can only have one outgoing connection.",
          variant: "destructive",
        });
        return;
      }

      const edge = {
        ...params,
        style: { stroke: 'hsl(var(--flow-edge))', strokeWidth: 2 },
        type: 'smoothstep',
      };
      setEdges((eds) => addEdge(edge, eds));
    },
    [setEdges, edges, toast]
  );

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
    setIsSettingsPanelOpen(true);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
    setIsSettingsPanelOpen(false);
  }, []);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      if (typeof type === 'undefined' || !type) {
        return;
      }

      const position = {
        x: event.clientX - (reactFlowWrapper.current?.getBoundingClientRect().left || 0),
        y: event.clientY - (reactFlowWrapper.current?.getBoundingClientRect().top || 0),
      };

      const newNode: Node = {
        id: `${Date.now()}`,
        type,
        position,
        data: { 
          label: 'Send Message',
          message: 'New message',
          icon: MessageSquare,
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes]
  );

  const updateNodeData = useCallback((nodeId: string, newData: any) => {
    setNodes((nds) =>
      nds.map((node) =>
        node.id === nodeId ? { ...node, data: { ...node.data, ...newData } } : node
      )
    );
  }, [setNodes]);

  // Added deleteNode function
  const deleteNode = useCallback((nodeId: string) => {
    // Remove the node
    setNodes((nds) => nds.filter(node => node.id !== nodeId));
    // Remove any edges connected to this node
    setEdges((eds) => eds.filter(edge => edge.source !== nodeId && edge.target !== nodeId));
    
    toast({
      title: "Node deleted",
      description: "The selected node has been removed from the flow.",
    });
  }, [setNodes, setEdges, toast]);

  const saveFlow = useCallback(() => {
    try {
      // Validation: Check if there are more than one nodes and any node has empty target handles
      if (nodes.length > 1) {
        const nodesWithoutConnections = nodes.filter(node => {
          const hasIncomingEdge = edges.some(edge => edge.target === node.id);
          const hasOutgoingEdge = edges.some(edge => edge.source === node.id);
          // A node has empty target handle if it has no incoming connections and there are other nodes
          return !hasIncomingEdge && nodes.length > 1;
        });

        if (nodesWithoutConnections.length > 1) {
          toast({
            title: "Cannot save Flow",
            description: "More than one node has empty target handles. Please connect all nodes properly.",
            variant: "destructive",
          });
          return;
        }
      }

      const flowData = {
        nodes,
        edges,
        timestamp: Date.now(),
      };
      localStorage.setItem('flow-editor-data', JSON.stringify(flowData));
      toast({
        title: "Flow saved successfully",
        description: "Your flow has been saved to local storage.",
      });
    } catch (error) {
      toast({
        title: "Cannot save Flow",
        description: "There was an error saving your flow.",
        variant: "destructive",
      });
    }
  }, [nodes, edges, toast]);

  const loadFlow = useCallback(() => {
    try {
      const savedData = localStorage.getItem('flow-editor-data');
      if (savedData) {
        const flowData = JSON.parse(savedData);
        setNodes(flowData.nodes || []);
        setEdges(flowData.edges || []);
        toast({
          title: "Flow loaded successfully",
          description: "Your saved flow has been restored.",
        });
      }
    } catch (error) {
      toast({
        title: "Cannot load Flow",
        description: "There was an error loading your saved flow.",
        variant: "destructive",
      });
    }
  }, [setNodes, setEdges, toast]);

  return (
    <div className="h-screen w-full bg-flow-background">
      <ReactFlowProvider>
        <div className="relative h-full" ref={reactFlowWrapper}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={nodeTypes}
            fitView
            className="bg-flow-background"
          >
            <Controls className="bg-card border-border" />
            <MiniMap 
              className="bg-card border-border"
              nodeStrokeColor="hsl(var(--flow-node-border))"
              nodeColor="hsl(var(--flow-node))"
              maskColor="hsl(var(--muted) / 0.1)"
            />
            <Background variant={'dots' as any} gap={12} size={1} color="hsl(var(--border))" />
            
            <Panel position="top-right" className="flex gap-2">
              <Button
                onClick={saveFlow}
                variant="default"
                size="sm"
                className="shadow-md"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </Panel>
          </ReactFlow>

          <SettingsPanel
            isOpen={isSettingsPanelOpen}
            onClose={() => setIsSettingsPanelOpen(false)}
            selectedNode={selectedNode}
            updateNodeData={updateNodeData}
            deleteNode={deleteNode} // Pass deleteNode function
          />
          
          <NodesPanel 
            isOpen={!isSettingsPanelOpen} 
          />
        </div>
      </ReactFlowProvider>
    </div>
  );
}