import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import DependencyGraph from './components/DependencyGraph';

function App() {
  return (
    <div className="container mt-5">
      <h1 className="text-center">Dependency Map UI</h1>
      <DependencyGraph />
    </div>
  );
}

export default App;

