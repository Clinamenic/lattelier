import { ReactNode } from 'react';

interface CollapsiblePanelProps {
    title: string;
    direction: 'left' | 'right';
    isCollapsed: boolean;
    onToggle: () => void;
    children: ReactNode;
}

export function CollapsiblePanel({ title, direction, isCollapsed, onToggle, children }: CollapsiblePanelProps) {
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

            {/* Overhanging Toggle Button */}
            <button
                onClick={onToggle}
                className={`
                    panel-expand-button
                    ${direction === 'left' ? 'panel-expand-button-left' : 'panel-expand-button-right'}
                `}
                aria-label={`${isCollapsed ? 'Expand' : 'Collapse'} ${direction} panel`}
            >
                <svg
                    className="panel-expand-button-icon"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    {isCollapsed ? (
                        // Expand icon
                        direction === 'left' ? (
                            <path d="M9 5l7 7-7 7" />
                        ) : (
                            <path d="M15 19l-7-7 7-7" />
                        )
                    ) : (
                        // Collapse icon
                        direction === 'left' ? (
                            <path d="M15 19l-7-7 7-7" />
                        ) : (
                            <path d="M9 5l7 7-7 7" />
                        )
                    )}
                </svg>
            </button>
        </div>
    );
}

