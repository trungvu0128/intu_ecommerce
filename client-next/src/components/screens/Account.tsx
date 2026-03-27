'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuthStore } from "@/store/useAuthStore";
import Footer from "@/components/layout/Footer";
import logoBlack from "@/assets/LOGO_black.png";
import { ChevronRight, Lock, MapPin, ScrollText, ArrowLeft } from 'lucide-react';
import { UserService } from "@/lib/api";
import AccountSidebar from "@/components/account/AccountSidebar";

const Account = () => {
  const user = useAuthStore(s => s.user);
  const logout = useAuthStore(s => s.logout);
  const updateUser = useAuthStore(s => s.updateUser);
  const [isEditingDob, setIsEditingDob] = useState(false);
  const [dobInput, setDobInput] = useState(user?.dateOfBirth || "");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Sync state if user data loads late
  useEffect(() => {
    setIsMounted(true);
    if (user?.dateOfBirth) {
      setDobInput(user.dateOfBirth);
    }
  }, [user?.dateOfBirth]);

  if (!isMounted) return null;

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
    <>
      {/* DESKTOP VIEW */}
      <div className="hidden lg:flex min-h-screen flex-col bg-[#f5f5f5]">
        <header className="w-full bg-white h-[71px] flex items-center border-b border-gray-100 shrink-0">
          <div className="w-full max-w-[1240px] mx-auto px-6">
            <Link href="/">
              <Image src={logoBlack} alt="INTU" className="h-[18px] w-auto object-contain" />
            </Link>
          </div>
        </header>

        <main className="flex-1 w-full max-w-[1240px] mx-auto px-6 py-12">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            
            <AccountSidebar activeTab="profile" />

            {/* RIGHT CONTENT */}
            <div className="flex-1 w-full max-w-[858px]">
              <h1 className="text-[20px] font-bold text-black mb-6 tracking-wide">
                Thông tin cá nhân
              </h1>

              <div className="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col">
                {/* Row 1 */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                  <span className="text-[15px] text-black">Họ và tên</span>
                  <div className="flex items-center gap-4 text-[#848484]">
                    <span className="text-[15px]">{user?.fullName || "Chưa cập nhật"}</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>

                {/* Row 2 */}
                <div className="flex items-center justify-between p-6 bg-[#f9fafb] border-b border-gray-100">
                  <span className="text-[15px] text-black">Ngày sinh</span>
                  {isEditingDob ? (
                    <div className="flex items-center gap-2">
                      <input 
                        type="date" 
                        value={dobInput} 
                        onChange={(e) => setDobInput(e.target.value)}
                        className="text-[14px] border border-gray-200 rounded px-2 py-1 outline-none text-black bg-white focus:border-black"
                      />
                      <button 
                        onClick={handleUpdateDob}
                        disabled={isUpdating}
                        className="text-[12px] bg-black text-white px-3 py-1.5 rounded hover:bg-zinc-800 disabled:opacity-50"
                      >
                        {isUpdating ? "..." : "Lưu"}
                      </button>
                      <button 
                        onClick={() => {
                          setIsEditingDob(false);
                          setDobInput(user?.dateOfBirth || "");
                        }}
                        className="text-[12px] bg-gray-200 text-black px-3 py-1.5 rounded hover:bg-gray-300"
                      >
                        Hủy
                      </button>
                    </div>
                  ) : (
                    <div 
                      className="flex items-center gap-4 text-[#848484] cursor-pointer hover:text-black transition-colors"
                      onClick={() => setIsEditingDob(true)}
                    >
                      <span className="text-[15px]">{formatDOB(user?.dateOfBirth)}</span>
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  )}
                </div>

                {/* Row 3 */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                  <span className="text-[15px] text-black">Giới tính</span>
                  <div className="flex items-center gap-4 text-[#848484]">
                    <span className="text-[15px]">Nam</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>

                {/* Row 4 */}
                <div className="flex items-center justify-between p-6 bg-[#f9fafb] border-b border-gray-100">
                  <span className="text-[15px] text-black">Số điện thoại</span>
                  <div className="flex items-center gap-4 text-[#848484]">
                    <span className="text-[15px]">{user?.phoneNumber || "Chưa cập nhật"}</span>
                    <Lock className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Row 5 */}
                <div className="flex items-center justify-between p-6">
                  <span className="text-[15px] text-black">Email</span>
                  <div className="flex items-center gap-4 text-[#848484]">
                    <span className="text-[15px]">{user?.email || "Chưa cập nhật"}</span>
                    <Lock className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              <button 
                onClick={logout}
                className="mt-8 bg-[#e4e4e4] hover:bg-gray-300 transition-colors text-black font-bold text-[15px] px-8 py-3 rounded-full"
              >
                Đăng xuất
              </button>
            </div>

          </div>
        </main>
      </div>

      {/* MOBILE VIEW */}
      <div className="flex lg:hidden flex-col min-h-screen bg-[#f7f7f7]">
        {/* Mobile Header */}
        <header className="px-5 py-4 w-full bg-white flex items-center justify-between sticky top-0 z-10 border-b border-gray-100">
          <Link href="/" className="flex items-center justify-center p-2 -ml-2">
            <ArrowLeft className="w-5 h-5 text-black" strokeWidth={1.5} />
          </Link>
          <h1 className="text-[16px] font-bold text-black tracking-wide absolute left-1/2 -translate-x-1/2">
            Tài khoản
          </h1>
          <div className="w-9 h-9"></div> {/* Placeholder for centering */}
        </header>

        {/* User Banner */}
        <div className="bg-white px-5 py-8 flex flex-col items-center border-b border-gray-100">
          <div className="w-[80px] h-[80px] rounded-full bg-black flex items-center justify-center text-white text-[24px] font-bold uppercase shadow-lg shadow-black/10">
            {getInitials(user?.fullName || "")}
          </div>
          <h2 className="mt-4 text-[20px] font-bold text-black tracking-tight">{user?.fullName || "Người dùng"}</h2>
          <p className="text-[14px] text-gray-500 mt-1 font-medium">{user?.email || user?.phoneNumber || "Chưa cập nhật"}</p>
        </div>

        {/* Quick Navigation Menu */}
        <div className="mt-2 bg-white border-y border-gray-100">
          <Link href="/orders" className="flex items-center justify-between px-5 py-4 border-b border-gray-50 active:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center">
                <ScrollText className="w-4 h-4 text-black" strokeWidth={1.5} />
              </div>
              <span className="text-[15px] font-medium text-black">Lịch sử đơn hàng</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300" strokeWidth={2} />
          </Link>
          <Link href="/addresses" className="flex items-center justify-between px-5 py-4 active:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center">
                <MapPin className="w-4 h-4 text-black" strokeWidth={1.5} />
              </div>
              <span className="text-[15px] font-medium text-black">Sổ địa chỉ</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300" strokeWidth={2} />
          </Link>
        </div>

        {/* Personal Details */}
        <div className="mt-2 bg-white border-t border-gray-100 px-5 pt-6 pb-2">
          <h3 className="text-[14px] font-bold text-black uppercase tracking-wider mb-6">Thông tin cá nhân</h3>
          
          <div className="flex flex-col gap-5">
            <div className="border-b border-gray-50 pb-5">
              <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-1.5">Họ và tên</p>
              <p className="text-[15px] text-black font-medium">{user?.fullName || "Chưa cập nhật"}</p>
            </div>

            <div className="border-b border-gray-50 pb-5">
              <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-1.5">Ngày sinh</p>
              {isEditingDob ? (
                <div className="flex items-center gap-3">
                  <input 
                    type="date" 
                    value={dobInput} 
                    onChange={(e) => setDobInput(e.target.value)}
                    className="flex-1 text-[15px] border-b border-black py-1 outline-none text-black bg-white rounded-none font-medium mt-1 w-full"
                  />
                  <div className="flex gap-2 shrink-0">
                    <button 
                      onClick={handleUpdateDob} 
                      disabled={isUpdating}
                      className="text-[12px] bg-black text-white px-4 py-1.5 rounded-full font-bold uppercase tracking-wide disabled:opacity-50"
                    >
                      {isUpdating ? "..." : "Lưu"}
                    </button>
                    <button 
                      onClick={() => {
                        setIsEditingDob(false);
                        setDobInput(user?.dateOfBirth || "");
                      }}
                      className="text-[12px] bg-gray-100 text-black px-4 py-1.5 rounded-full font-bold uppercase tracking-wide"
                    >
                      Hủy
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between" onClick={() => setIsEditingDob(true)}>
                  <p className="text-[15px] text-black font-medium">{formatDOB(user?.dateOfBirth)}</p>
                  <span className="text-[13px] text-gray-500 font-medium underline underline-offset-4">Chỉnh sửa</span>
                </div>
              )}
            </div>

            <div className="border-b border-gray-50 pb-5">
              <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-1.5">Giới tính</p>
              <p className="text-[15px] text-black font-medium">Nam</p>
            </div>

            <div className="border-b border-gray-50 pb-5">
              <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-1.5">Số điện thoại</p>
              <div className="flex items-center gap-2">
                <p className="text-[15px] text-black font-medium">{user?.phoneNumber || "Chưa cập nhật"}</p>
                <Lock className="w-3.5 h-3.5 text-gray-300" />
              </div>
            </div>

            <div className="pb-5">
              <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-1.5">Email</p>
              <div className="flex items-center gap-2">
                <p className="text-[15px] text-black font-medium">{user?.email || "Chưa cập nhật"}</p>
                <Lock className="w-3.5 h-3.5 text-gray-300" />
              </div>
            </div>
          </div>
        </div>

        <div className="px-5 py-8 bg-[#f7f7f7]">
          <button 
            onClick={logout} 
            className="w-full py-3.5 bg-black text-white font-bold text-[14px] uppercase tracking-wider rounded-full active:scale-[0.98] transition-all shadow-lg shadow-black/20"
          >
            Đăng xuất
          </button>
        </div>
      </div>
    </>
  );
};

export default Account;
