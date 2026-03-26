import { useState, useRef } from 'react';
import { Upload } from 'lucide-react';
import { AdminService } from '@/lib/adminApi';

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  placeholder?: string;
}

export default function ImageUploader({ value, onChange, folder = 'misc', placeholder = "https://..." }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await AdminService.uploadImage(file, folder);
      onChange(url);
    } catch (err) {
      alert('Failed to upload image. Please check file size and backend configuration.');
      console.error(err);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

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
