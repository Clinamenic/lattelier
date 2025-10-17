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
        <div className="relative h-full pointer-events-none">
            {/* Main Panel */}
            <div
                className={`
                    h-full bg-white border-gray-200 overflow-hidden transition-all duration-300 ease-in-out pointer-events-auto
                    ${direction === 'left' ? 'border-r' : 'border-l'}
                    ${isCollapsed ? 'w-0' : 'w-80'}
                `}
            >
                <div className="w-80 h-full overflow-y-auto">
                    {/* Header */}
                    <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
                        <button
                            onClick={onToggle}
                            className="p-1 hover:bg-gray-100 rounded transition-colors"
                            aria-label={`Collapse ${direction} panel`}
                        >
                            <svg
                                className="w-5 h-5 text-gray-600"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                {direction === 'left' ? (
                                    <path d="M15 19l-7-7 7-7" />
                                ) : (
                                    <path d="M9 5l7 7-7 7" />
                                )}
                            </svg>
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                        {children}
                    </div>
                </div>
            </div>

            {/* Collapsed Tab */}
            {isCollapsed && (
                <button
                    onClick={onToggle}
                    className={`
                        absolute top-1/2 -translate-y-1/2 h-32 w-8 bg-white border border-gray-200
                        hover:bg-gray-50 transition-colors flex items-center justify-center pointer-events-auto
                        ${direction === 'left' ? 'left-0 rounded-r' : 'right-0 rounded-l'}
                    `}
                    aria-label={`Expand ${direction} panel`}
                >
                    <div className="flex flex-col items-center">
                        <svg
                            className="w-4 h-4 text-gray-600 mb-2"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            {direction === 'left' ? (
                                <path d="M9 5l7 7-7 7" />
                            ) : (
                                <path d="M15 19l-7-7 7-7" />
                            )}
                        </svg>
                        <span
                            className="text-xs text-gray-600"
                            style={{
                                writingMode: 'vertical-rl',
                                transform: 'rotate(180deg)'
                            }}
                        >
                            {title}
                        </span>
                    </div>
                </button>
            )}
        </div>
    );
}

