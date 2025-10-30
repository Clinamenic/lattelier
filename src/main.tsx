import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { initializeRangeFills } from './utils/range-fill';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
);

// Initialize range fills after DOM is ready
document.addEventListener('DOMContentLoaded', initializeRangeFills);

