import React from 'react';
import './App.css';
import LifeGridVisualization from './components/LifeGridVisualization';
import { Analytics } from "@vercel/analytics/react"

function App() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <LifeGridVisualization />
    </div>
  );
}

export default App;
