'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from "@/store/useAuthStore";
import { ChevronRight, Lock, MapPin, ScrollText, ArrowLeft } from 'lucide-react';
import { UserService } from "@/lib/api";

const AccountMobile = () => {
  const { user, logout, updateUser } = useAuthStore();
  const [isEditingDob, setIsEditingDob] = useState(false);
  const [dobInput, setDobInput] = useState(user?.dateOfBirth || "");
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateDob = async () => {
    try {
      setIsUpdating(true);
      const res = await UserService.updateProfile({ dateOfBirth: dobInput });
      updateUser({ dateOfBirth: res.dateOfBirth });
      setIsEditingDob(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsUpdating(false);
    }
  };

  const formatDOB = (dobStr: string | undefined) => {
    if (!dobStr) return "Chưa cập nhật";
    const [year, month, day] = dobStr.split('-');
    if (day && month && year) {
        return `${day}/${month}/${year}`;
    }
    return dobStr;
  };

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f7f7f7]">
      {/* Mobile Header */}
      <header className="px-5 py-4 w-full bg-white flex items-center justify-between sticky top-0 z-10 border-b border-gray-100 shadow-sm">
        <Link href="/" className="flex items-center justify-center p-2 -ml-2 active:bg-gray-50 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-black" strokeWidth={1.5} />
        </Link>
        <h1 className="text-[17px] font-bold text-black tracking-wide absolute left-1/2 -translate-x-1/2">
          Tài khoản
        </h1>
        <div className="w-9 h-9"></div> {/* Placeholder for centering */}
      </header>

      {/* User Banner */}
      <div className="bg-white px-5 py-8 flex flex-col items-center border-b border-gray-100">
        <div className="w-[84px] h-[84px] rounded-full bg-black flex items-center justify-center text-white text-[28px] font-bold uppercase shadow-lg shadow-black/10">
          {getInitials(user?.fullName || "")}
        </div>
        <h2 className="mt-4 text-[22px] font-bold text-black tracking-tight">{user?.fullName || "Người dùng"}</h2>
        <p className="text-[15px] text-gray-500 mt-1 font-medium">{user?.email || user?.phoneNumber || "Chưa cập nhật email"}</p>
      </div>

      {/* Quick Navigation Menu */}
      <div className="mt-2 bg-white border-y border-gray-100">
        <Link href="/orders" className="flex items-center justify-between px-5 py-4 border-b border-gray-50 active:bg-gray-50 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#f5f5f5] flex items-center justify-center">
              <ScrollText className="w-5 h-5 text-black" strokeWidth={1.5} />
            </div>
            <span className="text-[16px] font-medium text-black">Lịch sử đơn hàng</span>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" strokeWidth={2} />
        </Link>
        <Link href="/addresses" className="flex items-center justify-between px-5 py-4 active:bg-gray-50 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#f5f5f5] flex items-center justify-center">
              <MapPin className="w-5 h-5 text-black" strokeWidth={1.5} />
            </div>
            <span className="text-[16px] font-medium text-black">Sổ địa chỉ</span>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" strokeWidth={2} />
        </Link>
      </div>

      {/* Personal Details */}
      <div className="mt-2 bg-white border-t border-gray-100 px-5 pt-6 pb-2">
        <h3 className="text-[15px] font-bold text-black uppercase tracking-wider mb-6">Thông tin cá nhân</h3>
        
        <div className="flex flex-col gap-6">
          <div className="border-b border-gray-50 pb-5">
            <p className="text-[12px] text-gray-400 font-bold uppercase tracking-wider mb-2">Họ và tên</p>
            <p className="text-[16px] text-black font-medium">{user?.fullName || "Chưa cập nhật"}</p>
          </div>

          <div className="border-b border-gray-50 pb-5">
            <p className="text-[12px] text-gray-400 font-bold uppercase tracking-wider mb-2">Ngày sinh</p>
            {isEditingDob ? (
              <div className="flex flex-col gap-3 mt-1">
                <input 
                  type="date" 
                  value={dobInput} 
                  onChange={(e) => setDobInput(e.target.value)}
                  className="w-full text-[16px] border border-gray-200 py-3 px-4 outline-none text-black bg-white rounded-xl font-medium focus:border-black transition-colors"
                />
                <div className="flex gap-3">
                  <button 
                    onClick={handleUpdateDob} 
                    disabled={isUpdating}
                    className="flex-1 text-[14px] bg-black text-white px-4 py-3 rounded-full font-bold uppercase tracking-wide disabled:opacity-50 active:scale-[0.98] transition-transform"
                  >
                    {isUpdating ? "..." : "Lưu"}
                  </button>
                  <button 
                    onClick={() => {
                      setIsEditingDob(false);
                      setDobInput(user?.dateOfBirth || "");
                    }}
                    className="flex-1 text-[14px] bg-gray-100 text-black px-4 py-3 rounded-full font-bold uppercase tracking-wide active:bg-gray-200 transition-colors"
                  >
                    Hủy
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between" onClick={() => setIsEditingDob(true)}>
                <p className="text-[16px] text-black font-medium">{formatDOB(user?.dateOfBirth)}</p>
                <span className="text-[14px] text-gray-500 font-bold underline underline-offset-4 active:text-black">Chỉnh sửa</span>
              </div>
            )}
          </div>

          <div className="border-b border-gray-50 pb-5">
            <p className="text-[12px] text-gray-400 font-bold uppercase tracking-wider mb-2">Giới tính</p>
            <p className="text-[16px] text-black font-medium">Nam</p>
          </div>

          <div className="border-b border-gray-50 pb-5">
            <p className="text-[12px] text-gray-400 font-bold uppercase tracking-wider mb-2">Số điện thoại</p>
            <div className="flex items-center gap-2">
              <p className="text-[16px] text-black font-medium">{user?.phoneNumber || "Chưa cập nhật"}</p>
              <Lock className="w-4 h-4 text-gray-300" />
            </div>
          </div>

          <div className="pb-5">
            <p className="text-[12px] text-gray-400 font-bold uppercase tracking-wider mb-2">Email</p>
            <div className="flex items-center gap-2">
              <p className="text-[16px] text-black font-medium">{user?.email || "Chưa cập nhật"}</p>
              <Lock className="w-4 h-4 text-gray-300" />
            </div>
          </div>
        </div>
      </div>

      <div className="px-5 py-8 pb-12 bg-[#f7f7f7]">
        <button 
          onClick={logout} 
          className="w-full py-4 bg-black text-white font-bold text-[15px] uppercase tracking-wider rounded-full active:scale-[0.98] transition-all shadow-lg shadow-black/20"
        >
          Đăng xuất
        </button>
      </div>
    </div>
  );
};

export default AccountMobile;
