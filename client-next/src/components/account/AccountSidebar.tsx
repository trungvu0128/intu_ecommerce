import React from 'react';
import Link from 'next/link';
import { useAuthStore } from "@/store/useAuthStore";
import { ChevronRight, MapPin, Mail, Globe, UserCircle, ScrollText } from 'lucide-react';

interface AccountSidebarProps {
  activeTab: 'profile' | 'orders' | 'addresses';
}

const AccountSidebar: React.FC<AccountSidebarProps> = ({ activeTab }) => {
  const { user } = useAuthStore();

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
  };

  return (
    <aside className="w-full md:w-[350px] shrink-0 bg-white rounded-2xl shadow-sm p-3">
      {/* User Profile Info Card */}
      <div className="bg-[#f3f4f6] rounded-xl p-4 flex items-center justify-between mb-4">
        <div>
          <h2 className="font-bold text-[16px] text-black tracking-wide">
            {user?.fullName || "Người dùng"}
          </h2>
          <p className="text-[#848484] text-[13px] mt-1 line-clamp-1">
            {user?.email || "Chưa có email"}
            {user?.phoneNumber ? ` | ${user.phoneNumber}` : ""}
          </p>
        </div>
        <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white text-[14px] uppercase shrink-0 ml-3">
          {getInitials(user?.fullName || "")}
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex flex-col gap-1">
        <Link 
          href="/account" 
          className={`flex items-center justify-between p-4 rounded-xl transition-colors ${
            activeTab === 'profile' ? 'bg-[#f3f4f6]' : 'hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center gap-3">
            <UserCircle className="w-5 h-5 text-black" strokeWidth={1.5} />
            <span className="text-[14px] text-black">Thông tin tài khoản</span>
          </div>
          <ChevronRight className="w-4 h-4 text-black" strokeWidth={1.5} />
        </Link>
        
        <Link 
          href="/orders" 
          className={`flex items-center justify-between p-4 rounded-xl transition-colors ${
            activeTab === 'orders' ? 'bg-[#f3f4f6]' : 'hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center gap-3">
            <ScrollText className="w-5 h-5 text-black" strokeWidth={1.5} />
            <span className="text-[14px] text-black">Lịch sử đơn hàng</span>
          </div>
          <ChevronRight className="w-4 h-4 text-black" strokeWidth={1.5} />
        </Link>

        <Link 
          href="/addresses" 
          className={`flex items-center justify-between p-4 rounded-xl transition-colors ${
            activeTab === 'addresses' ? 'bg-[#f3f4f6]' : 'hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-black" strokeWidth={1.5} />
            <span className="text-[14px] text-black">Địa chỉ đã lưu</span>
          </div>
          <ChevronRight className="w-4 h-4 text-black" strokeWidth={1.5} />
        </Link>

        <div className="flex items-center justify-between p-4 pt-8">
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-black" strokeWidth={1.5} />
            <span className="text-[14px] text-black">Email liên hệ</span>
          </div>
          <span className="text-[14px] text-black">intuoo@gmail.com</span>
        </div>

        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Globe className="w-5 h-5 text-black" strokeWidth={1.5} />
            <span className="text-[14px] text-black">Website</span>
          </div>
          <span className="text-[14px] text-black">https://www.intuoo.com/</span>
        </div>
      </nav>
    </aside>
  );
};

export default AccountSidebar;
