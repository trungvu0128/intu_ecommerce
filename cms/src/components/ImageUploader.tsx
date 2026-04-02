import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { AdminService } from '@/lib/adminApi';

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  placeholder?: string;
  compact?: boolean;
}

export default function ImageUploader({ value, onChange, folder = 'misc', placeholder = "https://...", compact = false }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const result = await AdminService.uploadImage(file, folder);
      // result is { originalUrl, thumbnailUrl }
      const url = typeof result === 'string' ? result : result.originalUrl;
      onChange(url);
    } catch (err) {
      alert('Failed to upload image. Please check file size and backend configuration.');
      console.error(err);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Compact mode: thumbnail-style with click-to-upload
  if (compact) {
    return (
      <div style={{ position: 'relative', width: '100%' }}>
        <input 
          type="file" 
          accept="image/*" 
          style={{ display: 'none' }} 
          ref={fileInputRef} 
          onChange={handleFileChange} 
        />
        {value ? (
          <div style={{ position: 'relative', width: '100%' }}>
            <img
              src={value}
              alt="Custom"
              style={{
                width: '100%',
                height: 80,
                objectFit: 'cover',
                borderRadius: 6,
                border: '1px solid var(--admin-border)',
                cursor: 'pointer',
              }}
              onClick={() => fileInputRef.current?.click()}
              title="Click to change image"
            />
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onChange(''); }}
              style={{
                position: 'absolute',
                top: -6,
                right: -6,
                width: 20,
                height: 20,
                borderRadius: '50%',
                background: '#ef4444',
                border: '2px solid white',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                padding: 0,
                fontSize: 10,
                lineHeight: 1,
                boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
              }}
              title="Remove image"
            >
              <X size={10} />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            style={{
              width: '100%',
              height: 64,
              border: '2px dashed var(--admin-border)',
              borderRadius: 6,
              background: 'var(--admin-surface-2)',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 4,
              color: 'var(--admin-text-muted)',
              transition: 'all 0.15s',
              fontSize: 10,
            }}
            onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--admin-accent)'; e.currentTarget.style.color = 'var(--admin-accent)'; }}
            onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--admin-border)'; e.currentTarget.style.color = 'var(--admin-text-muted)'; }}
          >
            {uploading ? (
              <div className="admin-spinner" style={{ width: 16, height: 16 }} />
            ) : (
              <>
                <ImageIcon size={16} />
                <span style={{ fontWeight: 500, letterSpacing: '0.02em' }}>Upload</span>
              </>
            )}
          </button>
        )}
      </div>
    );
  }

  // Default mode: text input + upload button
  return (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', width: '100%' }}>
      <input 
        className="form-control" 
        value={value} 
        onChange={e => onChange(e.target.value)} 
        placeholder={placeholder}
        style={{ flex: 1 }}
      />
      <input 
        type="file" 
        accept="image/*" 
        style={{ display: 'none' }} 
        ref={fileInputRef} 
        onChange={handleFileChange} 
      />
      <button 
        type="button" 
        className="btn btn--outline" 
        style={{ padding: '0 12px', height: '36px', display: 'flex', alignItems: 'center', gap: '6px' }}
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
      >
        <Upload size={14} /> {uploading ? 'Uploading...' : 'Upload'}
      </button>
    </div>
  );
}
