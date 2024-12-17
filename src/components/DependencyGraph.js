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
  const [selectedNode, setSelectedNode] = useState(null);

  useEffect(() => {
    // Parse JSON data to create nodes and edges
    const parsedNodes = data.map((service, index) => ({
      id: String(service.sid),
      data: {
        label: (
          <div style={{ textAlign: 'center', marginLeft:'0px' }}>
            <div><strong>{service.solution_name}</strong></div>
            <div style={{ textAlign: 'left', backgroundColor: 'white', color: 'black' }}>{service.tribe} - {service.squad}</div>
            <div style={{ textAlign: 'left', backgroundColor: 'white', color: 'black' }}>{service.version}</div>
          </div>
        ),
        fullData: service, // Store full data for popup
      },
      position: { x: index * 150, y: index * 100 },
      style: {
        borderColor: service.criticality === 'mission_critical' ? 'red' : 'green',
        color: 'black',
        padding: 10,
        borderRadius: '5px',
        cursor: 'pointer',
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

  const onNodeClick = (_, node) => {
    setSelectedNode(node.data.fullData);
  };

  const closePopup = () => setSelectedNode(null);

  return (
    <div style={{ height: '100vh', position: 'relative' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        fitView
      >
        <MiniMap />
        <Controls />
        <Background variant="dots" gap={16} color="#ddd" />
      </ReactFlow>

      {selectedNode && (
        <div
          style={{
            position: 'absolute',
            bottom: 20,
            left: 20,
            background: 'white',
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '10px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
            zIndex: 10,
          }}
        >
          <h4>{selectedNode.solution_name}</h4>
          <p><strong>Tribe:</strong> {selectedNode.tribe}</p>
          <p><strong>Squad:</strong> {selectedNode.squad}</p>
          <p><strong>Version:</strong> {selectedNode.version}</p>
          <p><strong>Criticality:</strong> {selectedNode.criticality}</p>
          <p><strong>Logging:</strong> {selectedNode.logging}</p>
          <p><strong>Monitoring:</strong> {selectedNode.monitoring}</p>
          <p><strong>Incident Management:</strong> {selectedNode.incident_management}</p>
          <button onClick={closePopup} style={{ marginTop: '10px' }}>Close</button>
        </div>
      )}
    </div>
  );
};

export default DependencyGraph;