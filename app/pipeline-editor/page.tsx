"use client"

import React, { useState, useCallback, useEffect } from 'react';
import ReactFlow, { 
  addEdge, 
  MiniMap, 
  Controls, 
  Background, 
  useNodesState, 
  useEdgesState,
  Panel,
  Connection,
  Edge,
  Node,
  BackgroundVariant,
  ReactFlowProvider
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from "@/components/ui/use-toast"

const initialNodes: Node[] = [
  {
    id: 'input',
    type: 'input',
    data: { label: 'Input' },
    position: { x: 50, y: 200 },
  },
  {
    id: 'output',
    type: 'output',
    data: { label: 'Output' },
    position: { x: 100, y: 300 },
  },
];

export default function PipelineEditor() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [pipelineName, setPipelineName] = useState('');
  const { toast } = useToast()

  const onConnect = useCallback((params: Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  const addNode = (type: string) => {
    const newNode = {
      id: `${type}-${Date.now()}`,
      type: 'default',
      position: { x: Math.random() * 300 + 100, y: Math.random() * 300 + 100 },
      data: { label: type },
    };
    setNodes((nds) => nds.concat(newNode));
  };

const handleSavePipeline = async () => {
    if (!pipelineName) {
      toast({
        title: "Error",
        description: "Please enter a pipeline name",
        variant: "destructive",
      });
      return;
    }

    const pipeline = {
      name: pipelineName,
      nodes,
      edges,
    };

    try {
      const response = await fetch('/api/pipelines', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pipeline),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      toast({
        title: "Pipeline saved",
        description: `Pipeline "${result.name}" saved successfully`,
      });
    } catch (error) {
      console.error('Error saving pipeline:', error);
      toast({
        title: "Error saving pipeline",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };


const handleExecutePipeline = async () => {
    const testData = {
      url: 'https://example.com',
      title: 'Example Title',
      description: 'This is an example description with an email@example.com.'
    };

    try {
      const response = await fetch('/api/pipelines', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pipeline: { nodes, edges }, data: testData }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      toast({
        title: "Pipeline executed",
        description: `Result: ${JSON.stringify(result, null, 2)}`,
      });
    } catch (error) {
      console.error('Error executing pipeline:', error);
      toast({
        title: "Error executing pipeline",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };


  return (
    <ReactFlowProvider>
      <div style={{ width: '100%', height: 'calc(100vh - 60px)' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView={false}
          defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        >
          <Controls />
          <MiniMap />
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
          <Panel position="top-left" className="bg-background p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Add Action</h3>
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => addNode('Parse URL')}>Parse URL</Button>
              <Button onClick={() => addNode('Clean Data')}>Clean Data</Button>
              <Button onClick={() => addNode('Anonymize')}>Anonymize</Button>
              <Button onClick={() => addNode('Extract Entities')}>Extract Entities</Button>
              <Button onClick={() => addNode('Summarize')}>Summarize</Button>
            </div>
          </Panel>
          <Panel position="top-right" className="bg-background p-4 rounded-lg shadow">
            <Label htmlFor="pipeline-name">Pipeline Name</Label>
            <Input
              id="pipeline-name"
              value={pipelineName}
              onChange={(e) => setPipelineName(e.target.value)}
              placeholder="Enter pipeline name"
              className="mb-2"
            />
            <div className="flex space-x-2">
              <Button onClick={handleSavePipeline}>Save Pipeline</Button>
              <Button onClick={handleExecutePipeline}>Execute Pipeline</Button>
            </div>
          </Panel>
        </ReactFlow>
      </div>
    </ReactFlowProvider>
  );
}