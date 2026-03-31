'use client';

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import MobileLayout from '@/components/mobile/MobileLayout';
import { AddressService } from '@/lib/api';
import { Address } from '@/types';
import { Loader2, Plus, Trash2, MapPin } from 'lucide-react';

const MobileAddresses = () => {
  const user = useAuthStore(s => s.user);
  const token = useAuthStore(s => s.token);
  const router = useRouter();
  
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isAdding, setIsAdding] = useState(false);
  const [newAddress, setNewAddress] = useState({
    recipientName: '',
    phoneNumber: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'Vietnam'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!user && !token) {
      router.push('/');
      return;
    }
    fetchAddresses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchAddresses = async () => {
    setIsLoading(true);
    try {
      const data = await AddressService.getUserAddresses();
      setAddresses(data);
    } catch (err: any) {
      console.error(err);
      setError('Unable to load addresses.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return;
    try {
      await AddressService.delete(id);
      setAddresses(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      console.error(err);
      alert('Error deleting address');
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const created = await AddressService.create(newAddress as Partial<Address>);
      setAddresses(prev => [...prev, created]);
      setIsAdding(false);
      setNewAddress({
        recipientName: '',
        phoneNumber: '',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'Vietnam'
      });
    } catch (err) {
      console.error(err);
      alert('Error adding new address');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <MobileLayout>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '50vh' }}>
          <Loader2 size={32} className="text-black animate-spin" />
        </div>
      </MobileLayout>
    );
  }

  return (
    <MobileLayout>
      {/* Header */}
      <div style={{ padding: '24px 16px', background: '#fff', borderBottom: '1px solid #f0f0f0' }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0 }}>Saved Addresses</h1>
        <p style={{ fontSize: 14, color: '#999', margin: '4px 0 0' }}>Manage your shipping addresses</p>
      </div>

      {/* Main Content */}
      <div style={{ padding: '16px' }}>
        {/* Add Address Button */}
        {!isAdding && (
          <button 
            onClick={() => setIsAdding(true)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              padding: '14px',
              background: '#000',
              color: '#fff',
              borderRadius: 12,
              fontSize: 15,
              fontWeight: 600,
              border: 'none',
              marginBottom: 16,
              cursor: 'pointer'
            }}
          >
            <Plus size={18} /> Add New Address
          </button>
        )}

        {error && (
          <div style={{
            background: '#fee2e2',
            color: '#991b1b',
            padding: 12,
            borderRadius: 8,
            fontSize: 14,
            marginBottom: 16
          }}>
            {error}
          </div>
        )}

        {/* Add Address Form */}
        {isAdding && (
          <form onSubmit={handleCreate} style={{
            background: '#fff',
            borderRadius: 16,
            padding: 16,
            marginBottom: 16,
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, margin: '0 0 16px' }}>Add Address</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <input 
                required 
                placeholder="Full Name" 
                style={{
                  padding: '12px 14px',
                  borderRadius: 8,
                  border: '1px solid #e0e0e0',
                  fontSize: 15
                }}
                value={newAddress.recipientName}
                onChange={e => setNewAddress({...newAddress, recipientName: e.target.value})}
              />
              
              <input 
                required 
                placeholder="Phone Number" 
                style={{
                  padding: '12px 14px',
                  borderRadius: 8,
                  border: '1px solid #e0e0e0',
                  fontSize: 15
                }}
                value={newAddress.phoneNumber}
                onChange={e => setNewAddress({...newAddress, phoneNumber: e.target.value})}
              />
              
              <input 
                required 
                placeholder="Street Address (House number, street name)" 
                style={{
                  padding: '12px 14px',
                  borderRadius: 8,
                  border: '1px solid #e0e0e0',
                  fontSize: 15
                }}
                value={newAddress.street}
                onChange={e => setNewAddress({...newAddress, street: e.target.value})}
              />
              
              <input 
                required 
                placeholder="City" 
                style={{
                  padding: '12px 14px',
                  borderRadius: 8,
                  border: '1px solid #e0e0e0',
                  fontSize: 15
                }}
                value={newAddress.city}
                onChange={e => setNewAddress({...newAddress, city: e.target.value})}
              />
              
              <input 
                placeholder="State / Province" 
                style={{
                  padding: '12px 14px',
                  borderRadius: 8,
                  border: '1px solid #e0e0e0',
                  fontSize: 15
                }}
                value={newAddress.state}
                onChange={e => setNewAddress({...newAddress, state: e.target.value})}
              />
              
              <input 
                placeholder="ZIP Code" 
                style={{
                  padding: '12px 14px',
                  borderRadius: 8,
                  border: '1px solid #e0e0e0',
                  fontSize: 15
                }}
                value={newAddress.zipCode}
                onChange={e => setNewAddress({...newAddress, zipCode: e.target.value})}
              />
            </div>

            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              <button 
                type="button" 
                onClick={() => setIsAdding(false)}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: 8,
                  border: '1px solid #e0e0e0',
                  background: '#f5f5f5',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              
              <button 
                type="submit" 
                disabled={isSubmitting}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: 8,
                  border: 'none',
                  background: '#000',
                  color: '#fff',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'pointer',
                  opacity: isSubmitting ? 0.5 : 1
                }}
              >
                {isSubmitting ? 'Saving...' : 'Save Address'}
              </button>
            </div>
          </form>
        )}

        {/* Address List */}
        {addresses.length === 0 && !isAdding ? (
          <div style={{
            background: '#fff',
            borderRadius: 16,
            padding: 24,
            textAlign: 'center',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <div style={{
              width: 64,
              height: 64,
              background: '#f0f0f0',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <MapPin size={24} color="#999" />
            </div>
            <p style={{ fontSize: 16, fontWeight: 600, margin: '0 0 8px' }}>
              No addresses saved yet
            </p>
            <p style={{ fontSize: 14, color: '#999' }}>
              Add an address to checkout faster.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {addresses.map(address => (
              <div key={address.id} style={{
                background: '#fff',
                borderRadius: 16,
                padding: 16,
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: 12
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 15, fontWeight: 600 }}>{address.recipientName}</span>
                    {address.isDefault && (
                      <span style={{
                        background: '#000',
                        color: '#fff',
                        fontSize: 10,
                        padding: '2px 6px',
                        borderRadius: 6,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                      }}>
                        Default
                      </span>
                    )}
                  </div>
                  
                  <p style={{ fontSize: 14, color: '#666', margin: '4px 0' }}>
                    {address.phoneNumber}
                  </p>
                  
                  <p style={{ fontSize: 14, color: '#666' }}>
                    {address.street}, {address.state ? address.state + ', ' : ''}{address.city}, {address.country}
                  </p>
                </div>
                
                <button 
                  onClick={() => handleDelete(address.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#999',
                    cursor: 'pointer',
                    padding: 4,
                    borderRadius: 4,
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => (e.target as HTMLElement).style.color = '#ef4444'}
                  onMouseLeave={(e) => (e.target as HTMLElement).style.color = '#999'}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </MobileLayout>
  );
};

export default MobileAddresses;
