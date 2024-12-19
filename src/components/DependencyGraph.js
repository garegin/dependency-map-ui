import React, { useState, useEffect } from 'react';
import ReactFlow, {
  addEdge,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
} from 'react-flow-renderer';
import dagre from 'dagre';

import data from '../data/Cleaned_Final_Simulated_Data.json';

const getLayoutedElements = (nodes, edges) => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  const nodeWidth = 172;
  const nodeHeight = 36;

  dagreGraph.setGraph({ rankdir: 'LR' });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.targetPosition = 'left';
    node.sourcePosition = 'right';

    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2,
    };

    return node;
  });

  return { nodes, edges };
};

const DependencyGraph = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
  const [popupSize, setPopupSize] = useState({ width: 300, height: 'auto' });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Parse JSON data to create nodes and edges
    const parsedNodes = data.map((service) => ({
      id: String(service.sid),
      data: {
        label: (
          <div style={{ textAlign: 'center', marginLeft:'0px' }}>
            <div><strong>{service.solution_name}</strong></div>
            <div style={{ textAlign: 'left', backgroundColor: 'white', color: 'black' }}>{service.tribe} - {service.squad}</div>
            <div style={{ textAlign: 'left', backgroundColor: 'white', color: 'black' }}>{service.version}</div>
            <button onClick={() => showDatabases(service)} title="Show Databases" style={{ marginTop: '5px', background: 'none', border: 'none', cursor: 'pointer' }}>
              <i className="bi bi-database"></i>
            </button>
          </div>
        ),
        fullData: service, // Store full data for popup
      },
      position: { x: 0, y: 0 },
      style: {
        borderColor: service.criticality === 'mission_critical' ? 'red' : 'green',
        color: 'black',
        padding: 10,
        borderRadius: '5px',
        cursor: 'pointer',
      },
    }));

    const parsedEdges = data.flatMap((service) => [
      ...service.dependencies.upstream.map((dependency) => ({
        id: `e${dependency.sid}-${service.sid}`,
        source: String(dependency.sid),
        target: String(service.sid),
        animated: true,
        style: {
          stroke: dependency.type === 'internal' ? 'blue' : 'orange',
          strokeWidth: 2,
        },
      })),
      ...service.dependencies.downstream.map((dependency) => ({
        id: `e${service.sid}-${dependency.sid}`,
        source: String(service.sid),
        target: String(dependency.sid),
        animated: true,
        style: {
          stroke: dependency.type === 'internal' ? 'blue' : 'orange',
          strokeWidth: 2,
        },
      })),
    ]);

    const layoutedElements = getLayoutedElements(parsedNodes, parsedEdges);
    setNodes(layoutedElements.nodes);
    setEdges(layoutedElements.edges);
  }, []);

  const onConnect = (params) => setEdges((eds) => addEdge(params, eds));

  const onNodeClick = (_, node) => {
    setSelectedNode(node.data.fullData);
    const nodeElement = document.querySelector(`[data-id="${node.id}"]`);
    const rect = nodeElement.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const popupLeft = rect.right + 20 > viewportWidth ? rect.left - 220 : rect.right + 20;
    setPopupPosition({ top: rect.top, left: popupLeft });
  };

  const closePopup = () => setSelectedNode(null);

  const onDragStart = (e) => {
    if (e.target.classList.contains('popup-drag-handle')) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - popupPosition.left, y: e.clientY - popupPosition.top });
    }
  };

  const onDrag = (e) => {
    if (isDragging) {
      setPopupPosition({ top: e.clientY - dragStart.y, left: e.clientX - dragStart.x });
    }
  };

  const onDragEnd = () => {
    setIsDragging(false);
  };

  const showDatabases = (service) => {
    const newNodes = service.databases.map((db, index) => ({
      id: `${service.sid}-db-${index}`,
      data: {
        label: (
          <div style={{ textAlign: 'center', marginLeft:'0px' }}>
            <div><strong>{db.type}</strong></div>
            <div style={{ textAlign: 'left', backgroundColor: 'white', color: 'black' }}>{db.engine}</div>
            <div style={{ textAlign: 'left', backgroundColor: 'white', color: 'black' }}>{db.hostname}</div>
          </div>
        ),
        fullData: db, // Store full data for popup
      },
      position: { x: Math.random() * 800, y: Math.random() * 600 },
      style: {
        borderColor: 'blue',
        color: 'black',
        padding: 10,
        borderRadius: '5px',
        cursor: 'pointer',
      },
    }));

    const newEdges = newNodes.map((node) => ({
      id: `e${service.sid}-${node.id}`,
      source: String(service.sid),
      target: node.id,
      style: { stroke: 'black', strokeWidth: 2 },
    }));

    setNodes((nds) => nds.concat(newNodes));
    setEdges((eds) => eds.concat(newEdges));
  };

  return (
    <div style={{ height: '100vh', position: 'relative' }} onMouseMove={onDrag} onMouseUp={onDragEnd}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
      >
        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
      {selectedNode && (
        <div
          className="popup"
          style={{
            position: 'absolute',
            top: popupPosition.top,
            left: popupPosition.left,
            backgroundColor: 'white',
            border: '1px solid black',
            padding: '10px',
            zIndex: 10,
            width: popupSize.width,
            height: popupSize.height,
            resize: 'both',
            overflow: 'auto',
          }}
          onMouseDown={onDragStart}
        >
          <div className="popup-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid black', paddingBottom: '5px' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <button onClick={closePopup} title="Close the window" style={{ background: 'none', border: 'none', cursor: 'pointer', marginRight: '5px' }}>
                <i className="bi bi-x"></i>
              </button>
              <div className="popup-drag-handle" title="Drag the window" style={{ cursor: 'move', marginRight: '10px' }}>
                <i className="bi bi-arrows-move"></i>
              </div>
              <strong>{selectedNode.solution_name}</strong>
            </div>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              {Object.entries(selectedNode).map(([key, value], index) => (
                key !== 'databases' && key !== 'dependencies' && (
                  <tr key={key} style={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#e9e9e9' }}>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}><strong>{key}</strong></td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{value}</td>
                  </tr>
                )
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DependencyGraph;