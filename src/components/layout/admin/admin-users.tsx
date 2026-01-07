import { useState, useEffect } from "react";
import { Search, UserPlus, CheckCircle, XCircle, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { userService } from "@/services/userService";
import type { UserResponse, AdminCreationRequest, AdminUpdateRequest } from "@/types/user";
import Pagination from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const AdminUsers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<boolean | undefined>(undefined);
  const [filterRole, setFilterRole] = useState<"ADMIN" | "USER" | undefined>(undefined);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  const [users, setUsers] = useState<UserResponse[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  // Form states
  const [createForm, setCreateForm] = useState<AdminCreationRequest>({
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    isActive: true,
    roles: ["USER"],
  });

  const [editForm, setEditForm] = useState<AdminUpdateRequest>({
    password: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    isActive: true,
    strikeCount: 0,
    reputationScore: 0,
    roles: ["USER"],
  });

  // Fetch users từ API
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await userService.searchUsers({
        page: currentPage,
        size: pageSize,
        isActive: filterStatus,
        role: filterRole,
        sort: sortOrder,
      });

      setUsers(response.data.data);
      setTotalPages(response.data.totalPages);
      setTotalElements(response.data.totalElements);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Không thể tải danh sách người dùng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, pageSize, filterStatus, filterRole, sortOrder]);

  // Filter users locally by search query
  const filteredUsers = users.filter((user) => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    const searchLower = searchQuery.toLowerCase();
    return (
      fullName.includes(searchLower) ||
      user.username.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower)
    );
  });

  const handleToggleActiveStatus = async (userId: string, currentStatus: boolean, userName: string) => {
    try {
      await userService.updateUserActiveStatus(userId, !currentStatus);
      toast.success(
        currentStatus
          ? `Đã chặn người dùng ${userName}`
          : `Đã kích hoạt lại người dùng ${userName}`
      );
      fetchUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Không thể cập nhật trạng thái");
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (window.confirm(`Bạn có chắc muốn xóa người dùng ${userName}?`)) {
      try {
        await userService.deleteUser(userId);
        toast.success(`Đã xóa người dùng ${userName}`);
        fetchUsers();
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Không thể xóa người dùng");
      }
    }
  };

  const handleCreateUser = async () => {
    // Validation
    if (!createForm.username || !createForm.password || !createForm.firstName ||
      !createForm.lastName || !createForm.email) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    setFormLoading(true);
    try {
      await userService.createUserByAdmin(createForm);
      toast.success("Tạo người dùng thành công");
      setShowCreateModal(false);
      setCreateForm({
        username: "",
        password: "",
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        isActive: true,
        roles: ["USER"],
      });
      fetchUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Không thể tạo người dùng");
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setSelectedUser(user);
      setEditForm({
        password: "",
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber || "",
        isActive: user.isActive,
        strikeCount: 0,
        reputationScore: 0,
        roles: user.roles.map(r => r.name),
      });
      setShowEditModal(true);
    }
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;

    // Validation
    if (!editForm.firstName || !editForm.lastName || !editForm.email) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    setFormLoading(true);
    try {
      await userService.updateUserByAdmin(selectedUser.id, editForm);
      toast.success("Cập nhật người dùng thành công");
      setShowEditModal(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Không thể cập nhật người dùng");
    } finally {
      setFormLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const getUserRole = (user: UserResponse): string => {
    if (user.roles.some(role => role.name === "ADMIN")) return "ADMIN";
    return "USER";
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
              placeholder="Tìm kiếm theo tên, username, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent outline-none"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-3 flex-wrap">
            <select
              value={filterStatus === undefined ? "all" : filterStatus ? "active" : "blocked"}
              onChange={(e) => {
                const value = e.target.value;
                setFilterStatus(value === "all" ? undefined : value === "active");
                setCurrentPage(1);
              }}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Đang hoạt động</option>
              <option value="blocked">Đã chặn</option>
            </select>

            <select
              value={filterRole || "all"}
              onChange={(e) => {
                const value = e.target.value;
                setFilterRole(value === "all" ? undefined : value as "ADMIN" | "USER");
                setCurrentPage(1);
              }}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
            >
              <option value="all">Tất cả vai trò</option>
              <option value="USER">Người dùng</option>
              <option value="ADMIN">Admin</option>
            </select>

            <select
              value={sortOrder}
              onChange={(e) => {
                setSortOrder(e.target.value as "newest" | "oldest");
                setCurrentPage(1);
              }}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
            >
              <option value="newest">Mới nhất</option>
              <option value="oldest">Cũ nhất</option>
            </select>

            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all shadow-md hover:shadow-lg"
            >
              <UserPlus size={20} />
              <span className="font-medium">Thêm người dùng</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200">
          <div>
            <p className="text-sm text-gray-600">Tổng người dùng</p>
            <p className="text-2xl font-bold text-gray-800">{totalElements}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Đang hoạt động</p>
            <p className="text-2xl font-bold text-green-600">
              {users.filter((u) => u.isActive).length}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Đã chặn</p>
            <p className="text-2xl font-bold text-red-600">
              {users.filter((u) => !u.isActive).length}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Quản trị viên</p>
            <p className="text-2xl font-bold text-yellow-600">
              {users.filter((u) => getUserRole(u) === "ADMIN").length}
            </p>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
                <p className="mt-4 text-gray-600">Đang tải...</p>
              </div>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Không tìm thấy người dùng nào</p>
            </div>
          ) : (
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
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((user) => {
                  const role = getUserRole(user);
                  const fullName = `${user.firstName} ${user.lastName}`;

                  return (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 flex items-center justify-center text-white font-bold">
                            {fullName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">{fullName}</p>
                            <p className="text-sm text-gray-500">@{user.username}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-800">{user.email}</p>
                        {user.phoneNumber && (
                          <p className="text-sm text-gray-500">{user.phoneNumber}</p>
                        )}
                        {user.noPassword && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                            OAuth
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${role === "ADMIN"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-blue-100 text-blue-800"
                            }`}
                        >
                          {role === "ADMIN" ? "Admin" : "Người dùng"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${user.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                            }`}
                        >
                          {user.isActive ? (
                            <CheckCircle size={14} />
                          ) : (
                            <XCircle size={14} />
                          )}
                          {user.isActive ? "Hoạt động" : "Đã chặn"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-800">{formatDate(user.createdAt)}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleToggleActiveStatus(user.id, user.isActive, fullName)}
                            className={`p-2 rounded-lg transition-colors ${user.isActive
                              ? "text-red-600 hover:bg-red-50"
                              : "text-green-600 hover:bg-green-50"
                              }`}
                            title={user.isActive ? "Chặn người dùng" : "Kích hoạt lại"}
                          >
                            {user.isActive ? <XCircle size={18} /> : <CheckCircle size={18} />}
                          </button>
                          <button
                            onClick={() => handleEditUser(user.id)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Chỉnh sửa"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id, fullName)}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Xóa"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {!loading && filteredUsers.length > 0 && totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Hiển thị {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, totalElements)} / {totalElements} người dùng
            </p>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              itemsPerPage={pageSize}
              totalItems={totalElements}
            />
          </div>
        )}
      </div>

      {/* Create User Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Tạo người dùng mới</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
            <div className="grid gap-2">
              <Label htmlFor="create-username">
                Username <span className="text-red-500">*</span>
              </Label>
              <Input
                id="create-username"
                value={createForm.username}
                onChange={(e) => setCreateForm({ ...createForm, username: e.target.value })}
                placeholder="Nhập username"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="create-password">
                Mật khẩu <span className="text-red-500">*</span>
              </Label>
              <Input
                id="create-password"
                type="password"
                value={createForm.password}
                onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                placeholder="Nhập mật khẩu"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="create-firstName">
                  Họ <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="create-firstName"
                  value={createForm.firstName}
                  onChange={(e) => setCreateForm({ ...createForm, firstName: e.target.value })}
                  placeholder="Nhập họ"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="create-lastName">
                  Tên <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="create-lastName"
                  value={createForm.lastName}
                  onChange={(e) => setCreateForm({ ...createForm, lastName: e.target.value })}
                  placeholder="Nhập tên"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="create-email">
                Email <span className="text-red-500">*</span>
              </Label>
              <Input
                id="create-email"
                type="email"
                value={createForm.email}
                onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                placeholder="Nhập email"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="create-phone">Số điện thoại</Label>
              <Input
                id="create-phone"
                value={createForm.phoneNumber}
                onChange={(e) => setCreateForm({ ...createForm, phoneNumber: e.target.value })}
                placeholder="Nhập số điện thoại"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="create-role">Vai trò</Label>
              <select
                id="create-role"
                value={createForm.roles?.[0] || "USER"}
                onChange={(e) => setCreateForm({ ...createForm, roles: [e.target.value] })}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
              >
                <option value="USER">Người dùng</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <input
                id="create-active"
                type="checkbox"
                checked={createForm.isActive}
                onChange={(e) => setCreateForm({ ...createForm, isActive: e.target.checked })}
                className="w-4 h-4 text-yellow-600 rounded focus:ring-yellow-500"
              />
              <Label htmlFor="create-active" className="cursor-pointer">
                Kích hoạt tài khoản
              </Label>
            </div>
          </div>
          <DialogFooter>
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={formLoading}
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleCreateUser}
              disabled={formLoading}
              className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {formLoading ? "Đang tạo..." : "Tạo người dùng"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa người dùng</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto">
              <div className="grid gap-2">
                <Label>Username</Label>
                <Input
                  value={selectedUser.username}
                  disabled
                  className="bg-gray-100 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500">Username không thể thay đổi</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-firstName">
                    Họ <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="edit-firstName"
                    value={editForm.firstName}
                    onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                    placeholder="Nhập họ"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-lastName">
                    Tên <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="edit-lastName"
                    value={editForm.lastName}
                    onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                    placeholder="Nhập tên"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-email">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  placeholder="Nhập email"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-phone">Số điện thoại</Label>
                <Input
                  id="edit-phone"
                  value={editForm.phoneNumber}
                  onChange={(e) => setEditForm({ ...editForm, phoneNumber: e.target.value })}
                  placeholder="Nhập số điện thoại"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-password">Mật khẩu mới</Label>
                <Input
                  id="edit-password"
                  type="password"
                  value={editForm.password}
                  onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                  placeholder="Để trống nếu không đổi"
                />
                <p className="text-xs text-gray-500">Chỉ nhập nếu muốn thay đổi mật khẩu</p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-role">Vai trò</Label>
                <select
                  id="edit-role"
                  value={editForm.roles?.[0] || "USER"}
                  onChange={(e) => setEditForm({ ...editForm, roles: [e.target.value] })}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
                >
                  <option value="USER">Người dùng</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-strikeCount">Strike Count</Label>
                  <Input
                    id="edit-strikeCount"
                    type="number"
                    value={editForm.strikeCount}
                    onChange={(e) => setEditForm({ ...editForm, strikeCount: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                    min="0"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-reputationScore">Reputation Score</Label>
                  <Input
                    id="edit-reputationScore"
                    type="number"
                    value={editForm.reputationScore}
                    onChange={(e) => setEditForm({ ...editForm, reputationScore: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  id="edit-active"
                  type="checkbox"
                  checked={editForm.isActive}
                  onChange={(e) => setEditForm({ ...editForm, isActive: e.target.checked })}
                  className="w-4 h-4 text-yellow-600 rounded focus:ring-yellow-500"
                />
                <Label htmlFor="edit-active" className="cursor-pointer">
                  Kích hoạt tài khoản
                </Label>
              </div>
            </div>
          )}
          <DialogFooter>
            <button
              type="button"
              onClick={() => {
                setShowEditModal(false);
                setSelectedUser(null);
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={formLoading}
            >
              Hủy
            </button>
            <button
              type="button"
              onClick={handleUpdateUser}
              disabled={formLoading}
              className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {formLoading ? "Đang cập nhật..." : "Cập nhật"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminUsers;
