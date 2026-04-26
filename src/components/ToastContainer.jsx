import React, { useState, useEffect } from 'react';
import { subscribeToToasts } from '../utils/helpers';

const ToastContainer = () => {
    const [toasts, setToasts] = useState([]);

    useEffect(() => {
        subscribeToToasts(setToasts);
        return () => {
            subscribeToToasts(null);
        };
    }, []);

    if (!toasts.length) {
        return null;
    }

    return (
        <div className="toast-container">
            {toasts.map((toast) => (
                <div key={toast.id} className={`toast toast-${toast.type} ${toast.exiting ? "toast-exit" : ""}`}>
                    {toast.type === "success" && "✓ "}
                    {toast.type === "info" && "ℹ "}
                    {toast.type === "warning" && "⚠ "}
                    {toast.message}
                </div>
            ))}
        </div>
    );
};

export default ToastContainer;