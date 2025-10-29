import { ReactNode } from 'react';

interface CollapsiblePanelProps {
    title: string;
    direction: 'left' | 'right';
    isCollapsed: boolean;
    children: ReactNode;
}

export function CollapsiblePanel({ title, direction, isCollapsed, children }: CollapsiblePanelProps) {
    return (
        <div className="panel">
            {/* Main Panel */}
            <div
                className={`
                    panel-content
                    ${direction === 'left' ? 'panel-left' : 'panel-right'}
                    ${isCollapsed ? 'panel-collapsed' : 'panel-expanded'}
                `}
            >
                <div className="panel-inner">
                    {/* Header */}
                    <div className="panel-header">
                        <h2 className="panel-title">{title}</h2>
                    </div>

                    {/* Content */}
                    <div className="panel-content-area">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}

