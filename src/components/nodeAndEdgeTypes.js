// src/components/nodeAndEdgeTypes.js

// Define node types
export const nodeTypes = {
  default: (props) => (
    <div
      style={{
        padding: 10,
        background: 'white',
        borderRadius: '5px',
        border: '1px solid #ddd',
      }}
    >
      {props.data.label}
    </div>
  ),
};

// Define edge types
export const edgeTypes = {
  default: ({ id, source, target }) => (
    <div>
      Custom edge from {source} to {target} (ID: {id})
    </div>
  ),
};

