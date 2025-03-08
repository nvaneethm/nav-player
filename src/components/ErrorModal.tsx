import React from "react";

interface ErrorModalProps {
  message: string;
  onRetry: () => void;
}

const ErrorModal: React.FC<ErrorModalProps> = ({ message, onRetry }) => {
  return (
    <div className="error-modal-overlay">
      <div className="error-modal">
        <h2>⚠️ Error Occurred</h2>
        <p>{message}</p>
        <button onClick={onRetry}>Retry</button>
      </div>
    </div>
  );
};

export default ErrorModal;