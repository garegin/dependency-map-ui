import React, { useState, useEffect } from 'react';
import ReactFlow, {
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
} from 'react-flow-renderer';

import data from '../data/Cleaned_Final_Simulated_Data.json';

const DependencyGraph = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    // Parse JSON data to create nodes and edges
    const parsedNodes = data.map((service, index) => ({
      id: String(service.sid),
      data: { label: service.solution_name },
      position: { x: index * 150, y: index * 100 }, // Basic layout logic
      style: {
        background: service.criticality === 'mission_critical' ? 'red' : 'green',
        color: 'white',
        padding: 10,
      },
    }));

    const parsedEdges = data.flatMap((service) =>
      service.dependencies.downstream.map((dependency) => ({
        id: `e${service.sid}-${dependency.sid}`,
        source: String(service.sid),
        target: String(dependency.sid),
        animated: true,
        style: { stroke: 'blue', strokeWidth: 2 },
      }))
    );

    setNodes(parsedNodes);
    setEdges(parsedEdges);
  }, []);

  const onConnect = (params) => setEdges((eds) => addEdge(params, eds));

  return (
    <div style={{ height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <MiniMap />
        <Controls />
        <Background gap={16} color="#ddd" />
      </ReactFlow>
    </div>
  );
};

export default DependencyGraph;
