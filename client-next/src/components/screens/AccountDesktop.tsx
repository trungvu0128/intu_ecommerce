'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuthStore } from "@/store/useAuthStore";
import logoBlack from "@/assets/LOGO_black.png";
import { ChevronRight, Lock } from 'lucide-react';
import { UserService } from "@/lib/api";
import AccountSidebar from "@/components/account/AccountSidebar";

const AccountDesktop = () => {
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
  );
};

export default AccountDesktop;
