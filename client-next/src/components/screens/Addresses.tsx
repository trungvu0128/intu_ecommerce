'use client';

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import AccountSidebar from '@/components/account/AccountSidebar';
import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import Link from 'next/link';
import Image from 'next/image';
import logoBlack from '@/assets/LOGO_black.png';
import { AddressService } from '@/lib/api';
import { Address } from '@/types';
import { Loader2, Plus, Trash2, MapPin } from 'lucide-react';

const Addresses = () => {
  const { user, token } = useAuthStore();
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
  }, [user, token, router]);

  const fetchAddresses = async () => {
    setIsLoading(true);
    try {
      const data = await AddressService.getUserAddresses();
      setAddresses(data);
    } catch (err: any) {
      console.error(err);
      setError('Không thể tải danh sách địa chỉ.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc xoá địa chỉ này?')) return;
    try {
      await AddressService.delete(id);
      setAddresses(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      console.error(err);
      alert('Lỗi xoá địa chỉ');
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
      alert('Lỗi thêm địa chỉ mới');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f5f5f5]">
        <header className="w-full bg-white h-[71px] flex items-center border-b border-gray-100 shrink-0">
          <div className="w-full max-w-[1240px] mx-auto px-6">
            <Link href="/">
              <Image src={logoBlack} alt="INTU" className="h-[18px] w-auto object-contain" />
            </Link>
          </div>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <Loader2 size={32} className="text-black animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f5]">
      <header className="w-full bg-white h-[71px] flex items-center border-b border-gray-100 shrink-0">
        <div className="w-full max-w-[1240px] mx-auto px-6">
          <Link href="/">
            <Image src={logoBlack} alt="INTU" className="h-[18px] w-auto object-contain" />
          </Link>
        </div>
      </header>

      <main className="flex-1 w-full max-w-[1240px] mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <AccountSidebar activeTab="addresses" />

          {/* RIGHT CONTENT */}
          <div className="flex-1 w-full max-w-[858px]">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-[20px] font-bold text-black tracking-wide">
                Địa chỉ đã lưu
              </h1>
              {!isAdding && (
                <button 
                  onClick={() => setIsAdding(true)}
                  className="bg-black text-white text-[13px] font-semibold px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-zinc-800 transition"
                >
                  <Plus size={16} /> Thêm địa chỉ mới
                </button>
              )}
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm">
                {error}
              </div>
            )}

            {isAdding && (
              <form onSubmit={handleCreate} className="bg-white rounded-2xl p-6 shadow-sm mb-6 w-full">
                <h3 className="text-[15px] font-semibold text-black mb-4">Thêm địa chỉ</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input required placeholder="Họ Tên" className="border border-gray-200 rounded px-3 py-2 text-sm" value={newAddress.recipientName} onChange={e => setNewAddress({...newAddress, recipientName: e.target.value})} />
                  <input required placeholder="Số điện thoại" className="border border-gray-200 rounded px-3 py-2 text-sm" value={newAddress.phoneNumber} onChange={e => setNewAddress({...newAddress, phoneNumber: e.target.value})} />
                  <input required placeholder="Địa chỉ chi tiết (Số nhà, đường)" className="col-span-1 md:col-span-2 border border-gray-200 rounded px-3 py-2 text-sm" value={newAddress.street} onChange={e => setNewAddress({...newAddress, street: e.target.value})} />
                  <input required placeholder="Tỉnh / Thành phố" className="border border-gray-200 rounded px-3 py-2 text-sm" value={newAddress.city} onChange={e => setNewAddress({...newAddress, city: e.target.value})} />
                  <input placeholder="Quận / Huyện" className="border border-gray-200 rounded px-3 py-2 text-sm" value={newAddress.state} onChange={e => setNewAddress({...newAddress, state: e.target.value})} />
                </div>
                <div className="flex gap-3 mt-4 justify-end">
                  <button type="button" onClick={() => setIsAdding(false)} className="text-[13px] font-medium text-gray-600 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg">Huỷ</button>
                  <button type="submit" disabled={isSubmitting} className="text-[13px] font-medium text-white px-4 py-2 bg-black hover:bg-zinc-800 rounded-lg disabled:opacity-50">Lưu địa chỉ</button>
                </div>
              </form>
            )}

            {addresses.length === 0 && !isAdding ? (
              <div className="bg-white rounded-2xl p-12 shadow-sm text-center flex flex-col items-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <MapPin size={24} className="text-gray-400" />
                </div>
                <p className="text-[15px] text-black font-medium">Bạn chưa lưu địa chỉ nào</p>
                <p className="text-[13px] text-gray-500 mt-1">Thêm địa chỉ để thanh toán nhanh hơn.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {addresses.map(address => (
                  <div key={address.id} className="bg-white rounded-2xl p-6 shadow-sm flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="font-semibold text-[15px] text-black">{address.recipientName}</span>
                        {address.isDefault && <span className="bg-black text-white text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">Mặc định</span>}
                      </div>
                      <p className="text-[13px] text-gray-600 mb-1">{address.phoneNumber}</p>
                      <p className="text-[13px] text-gray-600 line-clamp-2">
                        {address.street}, {address.state ? address.state + ', ' : ''}{address.city}, {address.country}
                      </p>
                    </div>
                    <button 
                      onClick={() => handleDelete(address.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-2"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Addresses;
