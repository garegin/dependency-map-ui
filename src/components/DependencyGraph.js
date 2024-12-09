// DependencyGraph.js
import React, { useState, useEffect } from 'react';
import ReactFlow, { Controls, Background } from 'react-flow-renderer';
import data from '../data/Cleaned_Final_Simulated_Data.json';
import { nodeTypes, edgeTypes } from './nodeAndEdgeTypes';


const DependencyGraph = () => {
  const [elements, setElements] = useState([]);


  useEffect(() => {
    const testNodes = [
      { id: '1', data: { label: 'Service A' }, position: { x: 100, y: 100 } },
      { id: '2', data: { label: 'Service B' }, position: { x: 300, y: 100 } },
    ];
  
    const testEdges = [
      { id: 'e1-2', source: '1', target: '2', animated: true },
    ];
  
    setElements([...testNodes, ...testEdges]);
  }, []);

  // useEffect(() => {
  //   // Transform JSON data into nodes and edges
  //   const nodes = data.map((service, index) => ({
  //     id: String(service.sid),
  //     data: { label: service.solution_name },
  //     position: { x: index * 200, y: 100 },
  //     style: {
  //       background: service.criticality === 'mission_critical' ? 'red' : 'green',
  //       color: '#fff',
  //       padding: '10px',
  //     },
  //   }));

  //   const edges = data.flatMap((service) =>
  //     service.dependencies.downstream.map((dep) => ({
  //       id: `e${service.sid}-${dep.sid}`,
  //       source: String(service.sid),
  //       target: String(dep.sid),
  //       animated: true,
  //       style: { stroke: 'blue', strokeWidth: 2 },
  //     }))
  //   );
    
  //   setElements([...nodes, ...edges]);
  // }, []);
  console.log('Elements:', elements);
  return (
    <div style={{ height: '80vh', border: '1px solid #ccc' }}>
      <ReactFlow
        elements={elements}
        defaultZoom={1.5}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
      >
        <Controls />
        <Background color="#000" gap={16} />
      </ReactFlow>
    </div>
  );
};

export default DependencyGraph;
