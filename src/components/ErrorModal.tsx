interface ErrorModalProps {
    title: string;
    errors: string[];
    onClose: () => void;
}

export function ErrorModal({ title, errors, onClose }: ErrorModalProps) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <span className="text-2xl">⚠️</span>
                        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                        aria-label="Close"
                    >
                        ×
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <p className="text-gray-700 mb-4">
                        Unable to import this file. The following errors were found:
                    </p>
                    <ul className="space-y-2 bg-red-50 border border-red-200 rounded-md p-4">
                        {errors.map((error, index) => (
                            <li key={index} className="text-sm text-red-800 flex items-start gap-2">
                                <span className="text-red-500 mt-0.5">•</span>
                                <span>{error}</span>
                            </li>
                        ))}
                    </ul>
                    <p className="text-sm text-gray-600 mt-4">
                        Please check the file and try again.
                    </p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end p-6 border-t border-gray-200 bg-gray-50">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-white bg-gray-600 rounded-md hover:bg-gray-700 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

