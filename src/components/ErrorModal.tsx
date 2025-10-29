interface ErrorModalProps {
    title: string;
    errors: string[];
    onClose: () => void;
}

export function ErrorModal({ title, errors, onClose }: ErrorModalProps) {
    return (
        <div className="modal-backdrop">
            <div className="modal">
                {/* Header */}
                <div className="modal-header">
                    <div className="flex items-center gap-3">
                        <span className="error-modal-icon">⚠️</span>
                        <h2 className="modal-title">{title}</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="modal-close"
                        aria-label="Close"
                    >
                        ×
                    </button>
                </div>

                {/* Content */}
                <div className="modal-body">
                    <p className="text-secondary mb-4">
                        Unable to import this file. The following errors were found:
                    </p>
                    <ul className="error-list">
                        {errors.map((error, index) => (
                            <li key={index} className="error-item">
                                <span className="error-bullet">•</span>
                                <span>{error}</span>
                            </li>
                        ))}
                    </ul>
                    <p className="text-sm text-light mt-4">
                        Please check the file and try again.
                    </p>
                </div>

                {/* Footer */}
                <div className="modal-footer">
                    <button
                        onClick={onClose}
                        className="btn"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

