import { useState } from "react";
import { Search, Filter, UserPlus, MoreVertical, CheckCircle, XCircle, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: "user" | "admin";
  status: "active" | "blocked";
  joinDate: string;
  totalBids: number;
  totalSpent: string;
}

const AdminUsers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "blocked">("all");
  const [filterRole, setFilterRole] = useState<"all" | "user" | "admin">("all");

  // Mock users data
  const [users] = useState<User[]>([
    {
      id: 1,
      name: "Nguyễn Văn A",
      email: "nguyenvana@gmail.com",
      phone: "0901234567",
      role: "user",
      status: "active",
      joinDate: "15/01/2024",
      totalBids: 45,
      totalSpent: "125,000,000",
    },
    {
      id: 2,
      name: "Trần Thị B",
      email: "tranthib@gmail.com",
      phone: "0912345678",
      role: "user",
      status: "active",
      joinDate: "20/01/2024",
      totalBids: 32,
      totalSpent: "85,000,000",
    },
    {
      id: 3,
      name: "Lê Văn C",
      email: "levanc@gmail.com",
      phone: "0923456789",
      role: "admin",
      status: "active",
      joinDate: "10/12/2023",
      totalBids: 0,
      totalSpent: "0",
    },
    {
      id: 4,
      name: "Phạm Thị D",
      email: "phamthid@gmail.com",
      phone: "0934567890",
      role: "user",
      status: "blocked",
      joinDate: "05/02/2024",
      totalBids: 12,
      totalSpent: "25,000,000",
    },
    {
      id: 5,
      name: "Hoàng Văn E",
      email: "hoangvane@gmail.com",
      phone: "0945678901",
      role: "user",
      status: "active",
      joinDate: "12/02/2024",
      totalBids: 58,
      totalSpent: "210,000,000",
    },
    {
      id: 6,
      name: "Vũ Thị F",
      email: "vuthif@gmail.com",
      phone: "0956789012",
      role: "user",
      status: "active",
      joinDate: "18/02/2024",
      totalBids: 23,
      totalSpent: "67,000,000",
    },
    {
      id: 7,
      name: "Đỗ Văn G",
      email: "dovang@gmail.com",
      phone: "0967890123",
      role: "user",
      status: "blocked",
      joinDate: "25/02/2024",
      totalBids: 8,
      totalSpent: "15,000,000",
    },
  ]);

  // Filter users
  const filteredUsers = users.filter((user) => {
    const matchSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = filterStatus === "all" || user.status === filterStatus;
    const matchRole = filterRole === "all" || user.role === filterRole;
    return matchSearch && matchStatus && matchRole;
  });

  const handleBlockUser = (userId: number, userName: string) => {
    toast.success(`Đã chặn người dùng ${userName}`);
  };

  const handleUnblockUser = (userId: number, userName: string) => {
    toast.success(`Đã bỏ chặn người dùng ${userName}`);
  };

  const handleEditUser = (userId: number) => {
    toast.info("Chức năng chỉnh sửa đang được phát triển");
  };

  const handleDeleteUser = (userId: number, userName: string) => {
    if (window.confirm(`Bạn có chắc muốn xóa người dùng ${userName}?`)) {
      toast.success(`Đã xóa người dùng ${userName}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-3 flex-wrap">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Đang hoạt động</option>
              <option value="blocked">Đã chặn</option>
            </select>

            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value as any)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
            >
              <option value="all">Tất cả vai trò</option>
              <option value="user">Người dùng</option>
              <option value="admin">Admin</option>
            </select>

            <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all shadow-md hover:shadow-lg">
              <UserPlus size={20} />
              <span className="font-medium">Thêm người dùng</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200">
          <div>
            <p className="text-sm text-gray-600">Tổng người dùng</p>
            <p className="text-2xl font-bold text-gray-800">{users.length}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Đang hoạt động</p>
            <p className="text-2xl font-bold text-green-600">
              {users.filter((u) => u.status === "active").length}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Đã chặn</p>
            <p className="text-2xl font-bold text-red-600">
              {users.filter((u) => u.status === "blocked").length}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Quản trị viên</p>
            <p className="text-2xl font-bold text-yellow-600">
              {users.filter((u) => u.role === "admin").length}
            </p>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Người dùng
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Liên hệ
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Vai trò
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Trạng thái
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Ngày tham gia
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Hoạt động
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 flex items-center justify-center text-white font-bold">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{user.name}</p>
                        <p className="text-sm text-gray-500">ID: {user.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-800">{user.email}</p>
                    <p className="text-sm text-gray-500">{user.phone}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                        user.role === "admin"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {user.role === "admin" ? "Admin" : "Người dùng"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                        user.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.status === "active" ? (
                        <CheckCircle size={14} />
                      ) : (
                        <XCircle size={14} />
                      )}
                      {user.status === "active" ? "Hoạt động" : "Đã chặn"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-800">{user.joinDate}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-800">{user.totalBids} lượt đấu giá</p>
                    <p className="text-sm font-semibold text-green-600">
                      {user.totalSpent} VNĐ
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      {user.status === "active" ? (
                        <button
                          onClick={() => handleBlockUser(user.id, user.name)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Chặn người dùng"
                        >
                          <XCircle size={18} />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUnblockUser(user.id, user.name)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Bỏ chặn"
                        >
                          <CheckCircle size={18} />
                        </button>
                      )}
                      <button
                        onClick={() => handleEditUser(user.id)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Chỉnh sửa"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id, user.name)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Xóa"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Hiển thị {filteredUsers.length} / {users.length} người dùng
          </p>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              Trước
            </button>
            <button className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors">
              1
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              2
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              3
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              Sau
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
