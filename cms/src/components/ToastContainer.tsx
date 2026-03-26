import { useToastStore, type ToastMessage } from '../store/useToastStore';
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

const icons = {
  success: <CheckCircle size={18} />,
  error: <AlertCircle size={18} />,
  info: <Info size={18} />,
  warning: <AlertTriangle size={18} />
};

export default function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div
      style={{
        position: 'fixed',
        top: 24,
        right: 24,
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        pointerEvents: 'none'
      }}
    >
      {toasts.map((toast: ToastMessage) => (
        <div
          key={toast.id}
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 12,
            padding: '14px 20px',
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 500,
            color: '#fff',
            background: toast.type === 'success' 
              ? 'linear-gradient(135deg, #10b981, #059669)'
              : toast.type === 'error'
              ? 'linear-gradient(135deg, #ef4444, #dc2626)'
              : toast.type === 'warning'
              ? 'linear-gradient(135deg, #f59e0b, #d97706)'
              : 'linear-gradient(135deg, #3b82f6, #2563eb)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
            animation: 'slideInRight 0.3s ease forwards',
            pointerEvents: 'auto',
            minWidth: 280,
            maxWidth: 400
          }}
        >
          <div style={{ marginTop: 2 }}>{icons[toast.type]}</div>
          <div style={{ flex: 1, wordBreak: 'break-word', lineHeight: 1.4 }}>
            {toast.message}
          </div>
          <button 
            onClick={() => removeToast(toast.id)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'rgba(255,255,255,0.8)',
              cursor: 'pointer',
              padding: 0,
              marginLeft: 8,
              display: 'flex'
            }}
          >
            <X size={16} />
          </button>
        </div>
      ))}

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
      `}</style>
    </div>
  );
}
