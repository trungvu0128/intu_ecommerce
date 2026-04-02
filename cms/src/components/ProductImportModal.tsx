import { useState, useRef } from 'react';
import { Upload, Download, X, FileSpreadsheet, CheckCircle, AlertCircle, Loader2, Image as ImageIcon, FolderOpen } from 'lucide-react';
import { AdminService } from '@/lib/adminApi';

interface ImportResult {
  success: number;
  failed: number;
  errors: string[];
  importedProducts?: Array<{
    name: string;
    imageUrl?: string;
    status: 'success' | 'failed';
    error?: string;
  }>;
}

interface ProductImportModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ProductImportModal({ open, onClose, onSuccess }: ProductImportModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [imageFolder, setImageFolder] = useState<FileList | null>(null);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageFolderInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const validTypes = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
      if (!validTypes.includes(selectedFile.type) && !selectedFile.name.endsWith('.csv') && !selectedFile.name.endsWith('.xlsx') && !selectedFile.name.endsWith('.xls')) {
        alert('Please upload a CSV or Excel file');
        return;
      }
      setFile(selectedFile);
      setResult(null);
    }
  };

  const handleImport = async () => {
    if (!file) return;

    setImporting(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      
      if (imageFolder && imageFolder.length > 0) {
        Array.from(imageFolder).forEach((imgFile) => {
          formData.append('images', imgFile);
        });
      }

      const importResult = await AdminService.importProducts(formData);
      setResult(importResult);
      
      if (importResult.success > 0) {
        onSuccess();
      }
    } catch (error: any) {
      console.error('Import failed:', error);
      setResult({
        success: 0,
        failed: 1,
        errors: [error.response?.data?.message || error.message || 'Import failed']
      });
    } finally {
      setImporting(false);
    }
  };

  const handleDownloadTemplate = () => {
    const template = `name,slug,description,basePrice,isFeatured,categoryId,brandId,sku,color,size,priceAdjustment,stockQuantity,imageUrl
Sample Product,sample-product,Sample product description,100000,false,category-id,brand-id,SKU001,Red,M,0,50,product-image-1.jpg
Another Product,another-product,Another product description,150000,true,category-id,brand-id,SKU002,Blue,L,10000,30,product-image-2.jpg`;
    
    const blob = new Blob([template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'product_import_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setFile(null);
    setImageFolder(null);
    setResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (imageFolderInputRef.current) {
      imageFolderInputRef.current.value = '';
    }
  };

  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: 600 }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Import Products</h2>
          <button className="modal-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: '24px' }}>
          {!result ? (
            <>
              <div style={{ marginBottom: '20px' }}>
                <p style={{ color: '#6b7280', marginBottom: '12px' }}>
                  Upload a CSV or Excel file containing product data. Each row represents a product with its variants.
                </p>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className="btn btn--outline"
                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                    onClick={handleDownloadTemplate}
                  >
                    <Download size={16} />
                    Download Template
                  </button>
                </div>
                <div style={{ marginTop: '12px', padding: '12px', backgroundColor: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '6px' }}>
                  <p style={{ fontSize: '13px', color: '#0c4a6e', margin: 0 }}>
                    <strong>💡 Image Support:</strong> Include image filenames in CSV (e.g., "product-image-1.jpg") and optionally upload a folder of images.
                  </p>
                </div>
              </div>

              <div
                style={{
                  border: '2px dashed #e5e7eb',
                  borderRadius: '8px',
                  padding: '32px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  backgroundColor: 'rgba(249, 250, 251, 0.5)',
                }}
                onClick={() => fileInputRef.current?.click()}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#3b82f6';
                  e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e5e7eb';
                  e.currentTarget.style.backgroundColor = 'rgba(249, 250, 251, 0.5)';
                }}
              >
                <input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  style={{ display: 'none' }}
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
                {file ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <FileSpreadsheet size={48} style={{ color: '#3b82f6' }} />
                    <div style={{ fontWeight: 500 }}>{file.name}</div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>
                      {(file.size / 1024).toFixed(2)} KB
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <Upload size={48} style={{ color: '#9ca3af' }} />
                    <div style={{ fontWeight: 500, color: '#374151' }}>
                      Click to upload or drag and drop
                    </div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>
                      CSV or Excel files only
                    </div>
                  </div>
                )}
              </div>

              <div style={{ marginTop: '20px' }}>
                <label style={{ display: 'block', fontWeight: 500, marginBottom: '8px', color: '#374151' }}>
                  <FolderOpen size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '8px' }} />
                  Product Images (Optional)
                </label>
                <div
                  style={{
                    border: '2px dashed #e5e7eb',
                    borderRadius: '8px',
                    padding: '24px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    backgroundColor: 'rgba(249, 250, 251, 0.5)',
                  }}
                  onClick={() => imageFolderInputRef.current?.click()}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#3b82f6';
                    e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#e5e7eb';
                    e.currentTarget.style.backgroundColor = 'rgba(249, 250, 251, 0.5)';
                  }}
                >
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    style={{ display: 'none' }}
                    ref={imageFolderInputRef}
                    onChange={(e) => setImageFolder(e.target.files)}
                  />
                  {imageFolder && imageFolder.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                      <ImageIcon size={32} style={{ color: '#3b82f6' }} />
                      <div style={{ fontWeight: 500 }}>{imageFolder.length} images selected</div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>
                        {Array.from(imageFolder).reduce((acc, f) => acc + f.size, 0) / 1024} KB total
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                      <FolderOpen size={32} style={{ color: '#9ca3af' }} />
                      <div style={{ fontWeight: 500, color: '#374151' }}>
                        Click to select images
                      </div>
                      <div style={{ fontSize: '12px', color: '#6b7280' }}>
                        JPG, PNG, GIF, WebP supported
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div style={{ marginTop: '24px', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  className="btn btn--outline"
                  onClick={onClose}
                  disabled={importing}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn--primary"
                  onClick={handleImport}
                  disabled={!file || importing}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  {importing ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Importing...
                    </>
                  ) : (
                    <>
                      <Upload size={16} />
                      Import Products
                    </>
                  )}
                </button>
              </div>
            </>
          ) : (
            <div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                {result.success > 0 ? (
                  <div style={{ 
                    width: '64px', 
                    height: '64px', 
                    borderRadius: '50%', 
                    backgroundColor: '#d1fae5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <CheckCircle size={32} style={{ color: '#10b981' }} />
                  </div>
                ) : (
                  <div style={{ 
                    width: '64px', 
                    height: '64px', 
                    borderRadius: '50%', 
                    backgroundColor: '#fee2e2',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <AlertCircle size={32} style={{ color: '#ef4444' }} />
                  </div>
                )}
                
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>
                    Import {result.success > 0 ? 'Completed' : 'Failed'}
                  </div>
                  <div style={{ color: '#6b7280' }}>
                    {result.success} products imported successfully
                    {result.failed > 0 && `, ${result.failed} failed`}
                  </div>
                </div>
              </div>

              {result.errors.length > 0 && (
                <div style={{ 
                  backgroundColor: '#fee2e2', 
                  border: '1px solid #fecaca', 
                  borderRadius: '8px', 
                  padding: '16px',
                  marginBottom: '24px'
                }}>
                  <div style={{ fontWeight: 600, color: '#991b1b', marginBottom: '8px' }}>
                    Errors:
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '20px', color: '#991b1b' }}>
                    {result.errors.slice(0, 5).map((error, index) => (
                      <li key={index} style={{ marginBottom: '4px' }}>{error}</li>
                    ))}
                    {result.errors.length > 5 && (
                      <li style={{ fontStyle: 'italic' }}>
                        ...and {result.errors.length - 5} more errors
                      </li>
                    )}
                  </ul>
                </div>
              )}

              {result.importedProducts && result.importedProducts.length > 0 && (
                <div style={{ 
                  backgroundColor: '#f0f9ff', 
                  border: '1px solid #bae6fd', 
                  borderRadius: '8px', 
                  padding: '16px',
                  marginBottom: '24px'
                }}>
                  <div style={{ fontWeight: 600, color: '#0c4a6e', marginBottom: '12px' }}>
                    Imported Products:
                  </div>
                  <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {result.importedProducts.slice(0, 10).map((product, index) => (
                      <div 
                        key={index} 
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '12px', 
                          padding: '8px',
                          borderBottom: index < (result.importedProducts?.length || 0) - 1 ? '1px solid #e5e7eb' : 'none'
                        }}
                      >
                        {product.imageUrl && (
                          <img 
                            src={product.imageUrl} 
                            alt={product.name}
                            style={{ 
                              width: '48px', 
                              height: '48px', 
                              objectFit: 'cover',
                              borderRadius: '4px',
                              backgroundColor: '#f3f4f6'
                            }}
                          />
                        )}
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 500, color: '#374151' }}>{product.name}</div>
                          {product.status === 'failed' && product.error && (
                            <div style={{ fontSize: '12px', color: '#ef4444', marginTop: '4px' }}>
                              {product.error}
                            </div>
                          )}
                        </div>
                        {product.status === 'success' ? (
                          <CheckCircle size={20} style={{ color: '#10b981' }} />
                        ) : (
                          <AlertCircle size={20} style={{ color: '#ef4444' }} />
                        )}
                      </div>
                    ))}
                    {result.importedProducts.length > 10 && (
                      <div style={{ textAlign: 'center', padding: '12px', color: '#6b7280', fontStyle: 'italic' }}>
                        ...and {result.importedProducts.length - 10} more products
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  className="btn btn--outline"
                  onClick={handleReset}
                >
                  Import Another File
                </button>
                <button
                  type="button"
                  className="btn btn--primary"
                  onClick={onClose}
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}