import { useState, useEffect } from "react";
import { AlertTriangle, CheckCircle, XCircle, Clock } from "lucide-react";
import { toast } from "sonner";
import { invoiceService } from "@/services/invoiceService";
import type { DisputeResponse, DisputeDecision, DisputeSearchRequest, ResolveDisputeRequest, InvoiceResponse } from "@/types/invoice";
import Pagination from "@/components/ui/pagination";

interface DisputeWithInvoice {
    dispute: DisputeResponse;
    invoice: InvoiceResponse | null;
    loadingInvoice: boolean;
}

const AdminDisputes = () => {
    const [filterDecision, setFilterDecision] = useState<DisputeDecision | undefined>(undefined);
    const [sortOrder, setSortOrder] = useState<string>("");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10);

    const [disputes, setDisputes] = useState<DisputeWithInvoice[]>([]);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [loading, setLoading] = useState(false);

    // Resolve form states for each dispute
    const [resolveForms, setResolveForms] = useState<Record<number, ResolveDisputeRequest>>({});
    const [submittingDisputes, setSubmittingDisputes] = useState<Set<number>>(new Set());

    // Fetch disputes
    const fetchDisputes = async () => {
        setLoading(true);
        try {
            const request: DisputeSearchRequest = {
                decision: filterDecision,
                sort: sortOrder || undefined,
            };

            const response = await invoiceService.getAllDisputes(request, currentPage, pageSize);
            const disputesData = response.data.data;

            // Initialize with disputes and null invoices
            const disputesWithInvoices: DisputeWithInvoice[] = disputesData.map((dispute) => ({
                dispute,
                invoice: null,
                loadingInvoice: true,
            }));

            setDisputes(disputesWithInvoices);
            setTotalPages(response.data.totalPages);
            setTotalElements(response.data.totalElements);

            // Initialize resolve forms for PENDING disputes
            const initialForms: Record<number, ResolveDisputeRequest> = {};
            disputesData.forEach((dispute) => {
                if (dispute.decision === "PENDING") {
                    initialForms[dispute.id] = {
                        decision: "REFUND_TO_BUYER",
                        adminNote: "",
                    };
                }
            });
            setResolveForms(initialForms);

            // Fetch invoice details for each dispute
            disputesData.forEach(async (dispute, index) => {
                try {
                    const invoiceResponse = await invoiceService.getInvoiceByIdForAdmin(dispute.invoiceId);
                    setDisputes((prev) => {
                        const updated = [...prev];
                        if (updated[index]) {
                            updated[index] = {
                                ...updated[index],
                                invoice: invoiceResponse.data,
                                loadingInvoice: false,
                            };
                        }
                        return updated;
                    });
                } catch (error) {
                    console.error(`Failed to fetch invoice ${dispute.invoiceId}:`, error);
                    setDisputes((prev) => {
                        const updated = [...prev];
                        if (updated[index]) {
                            updated[index] = {
                                ...updated[index],
                                loadingInvoice: false,
                            };
                        }
                        return updated;
                    });
                }
            });
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Không thể tải danh sách khiếu nại");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDisputes();
    }, [currentPage, pageSize, filterDecision, sortOrder]);

    const handleResolveDispute = async (disputeId: number) => {
        const form = resolveForms[disputeId];
        if (!form) return;

        setSubmittingDisputes((prev) => new Set(prev).add(disputeId));
        try {
            await invoiceService.resolveDispute(disputeId, form);
            toast.success(
                form.decision === "REFUND_TO_BUYER"
                    ? "Đã chấp nhận khiếu nại và hoàn tiền cho người mua"
                    : "Đã từ chối khiếu nại và chuyển tiền cho người bán"
            );
            fetchDisputes();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Không thể giải quyết khiếu nại");
        } finally {
            setSubmittingDisputes((prev) => {
                const updated = new Set(prev);
                updated.delete(disputeId);
                return updated;
            });
        }
    };

    const updateResolveForm = (disputeId: number, field: keyof ResolveDisputeRequest, value: any) => {
        setResolveForms((prev) => ({
            ...prev,
            [disputeId]: {
                ...prev[disputeId],
                [field]: value,
            },
        }));
    };

    const getDecisionBadge = (decision: DisputeDecision) => {
        const badges = {
            PENDING: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Chờ xử lý", icon: Clock },
            REFUND_TO_BUYER: { bg: "bg-green-100", text: "text-green-800", label: "Phán quyết người mua thắng", icon: CheckCircle },
            RELEASE_TO_SELLER: { bg: "bg-blue-100", text: "text-blue-800", label: "Phán quyết người bán thắng", icon: XCircle },
        };
        const badge = badges[decision] || { bg: "bg-gray-100", text: "text-gray-800", label: decision, icon: AlertTriangle };
        const Icon = badge.icon;
        return (
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${badge.bg} ${badge.text}`}>
                <Icon size={14} />
                {badge.label}
            </span>
        );
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(price);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Quản lý khiếu nại</h1>
                <p className="text-gray-600 mt-1">Xử lý tranh chấp giữa người mua và người bán</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-yellow-700">Chờ xử lý</p>
                            <p className="text-2xl font-bold text-yellow-900">
                                {disputes.filter((d) => d.dispute.decision === "PENDING").length}
                            </p>
                        </div>
                        <Clock className="text-yellow-500" size={32} />
                    </div>
                </div>

                <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-green-700">Hoàn tiền</p>
                            <p className="text-2xl font-bold text-green-900">
                                {disputes.filter((d) => d.dispute.decision === "REFUND_TO_BUYER").length}
                            </p>
                        </div>
                        <CheckCircle className="text-green-500" size={32} />
                    </div>
                </div>

                <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-blue-700">Chuyển người bán</p>
                            <p className="text-2xl font-bold text-blue-900">
                                {disputes.filter((d) => d.dispute.decision === "RELEASE_TO_SELLER").length}
                            </p>
                        </div>
                        <XCircle className="text-blue-500" size={32} />
                    </div>
                </div>

                <div className="bg-gray-50 border-l-4 border-gray-500 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-700">Tổng khiếu nại</p>
                            <p className="text-2xl font-bold text-gray-900">{totalElements}</p>
                        </div>
                        <AlertTriangle className="text-gray-500" size={32} />
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex gap-3 flex-wrap items-center">
                    <select
                        value={filterDecision || "all"}
                        onChange={(e) => {
                            const value = e.target.value;
                            setFilterDecision(value === "all" ? undefined : (value as DisputeDecision));
                            setCurrentPage(1);
                        }}
                        className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
                    >
                        <option value="all">Tất cả quyết định</option>
                        <option value="PENDING">Chờ xử lý</option>
                        <option value="RESOLVED">Đã giải quyết</option>
                    </select>

                    <select
                        value={sortOrder}
                        onChange={(e) => {
                            setSortOrder(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
                    >
                        <option value="">Mới nhất (mặc định)</option>
                        <option value="oldest">Cũ nhất</option>
                        <option value="resolved_newest">Đã giải quyết mới nhất</option>
                        <option value="resolved_oldest">Đã giải quyết cũ nhất</option>
                    </select>
                </div>
            </div>

            {/* Disputes List */}
            <div className="space-y-4">
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
                            <p className="mt-4 text-gray-600">Đang tải...</p>
                        </div>
                    </div>
                ) : disputes.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl shadow-lg">
                        <AlertTriangle className="mx-auto text-gray-400" size={48} />
                        <p className="text-gray-500 mt-4">Không tìm thấy khiếu nại nào</p>
                    </div>
                ) : (
                    disputes.map(({ dispute, invoice, loadingInvoice }) => (
                        <div key={dispute.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
                                {/* Left: Dispute Info */}
                                <div className="space-y-4">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900">Khiếu nại #{dispute.id}</h3>
                                            <p className="text-sm text-gray-500">Invoice ID: #{dispute.invoiceId}</p>
                                        </div>
                                        {getDecisionBadge(dispute.decision)}
                                    </div>

                                    {/* Invoice Info */}
                                    {loadingInvoice ? (
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <p className="text-sm text-gray-600">Đang tải thông tin invoice...</p>
                                        </div>
                                    ) : invoice ? (
                                        <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                                            <div>
                                                <p className="text-xs text-gray-600">Sản phẩm</p>
                                                <p className="font-semibold text-gray-900">{invoice.product.name}</p>
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <p className="text-xs text-gray-600">Người mua</p>
                                                    <p className="font-semibold text-gray-900">
                                                        {invoice.user.firstName} {invoice.user.lastName}
                                                    </p>
                                                    <p className="text-xs text-gray-500">{invoice.user.email}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-600">Người bán</p>
                                                    <p className="font-semibold text-gray-900">
                                                        {invoice.product.seller.firstName} {invoice.product.seller.lastName}
                                                    </p>
                                                    <p className="text-xs text-gray-500">{invoice.product.seller.email}</p>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-600">Giá trị đơn hàng</p>
                                                <p className="text-lg font-bold text-green-600">{formatPrice(invoice.finalPrice)}</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="bg-red-50 p-4 rounded-lg">
                                            <p className="text-sm text-red-600">Không thể tải thông tin invoice</p>
                                        </div>
                                    )}

                                    {/* Dispute Details */}
                                    <div className="border-t pt-4">
                                        <div className="space-y-3">
                                            <div>
                                                <p className="text-sm text-gray-600 mb-1">Lý do khiếu nại:</p>
                                                <p className="text-gray-900 bg-red-50 p-3 rounded-lg border-l-4 border-red-500">
                                                    {dispute.reason}
                                                </p>
                                            </div>
                                            {dispute.adminNote && (
                                                <div>
                                                    <p className="text-sm text-gray-600 mb-1">Ghi chú admin:</p>
                                                    <p className="text-gray-900 bg-blue-50 p-3 rounded-lg border-l-4 border-blue-500">
                                                        {dispute.adminNote}
                                                    </p>
                                                </div>
                                            )}
                                            <div className="grid grid-cols-2 gap-3 text-sm">
                                                <div>
                                                    <p className="text-gray-600">Ngày tạo:</p>
                                                    <p className="font-semibold text-gray-900">{formatDate(dispute.createdAt)}</p>
                                                </div>
                                                {dispute.resolvedAt && (
                                                    <div>
                                                        <p className="text-gray-600">Ngày giải quyết:</p>
                                                        <p className="font-semibold text-gray-900">{formatDate(dispute.resolvedAt)}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Right: Resolve Form (only for PENDING) */}
                                {dispute.decision === "PENDING" && resolveForms[dispute.id] && (
                                    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-lg border-2 border-yellow-300">
                                        <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                            <AlertTriangle className="text-yellow-600" size={20} />
                                            Giải quyết khiếu nại
                                        </h4>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Quyết định <span className="text-red-500">*</span>
                                                </label>
                                                <select
                                                    value={resolveForms[dispute.id].decision}
                                                    onChange={(e) =>
                                                        updateResolveForm(dispute.id, "decision", e.target.value as DisputeDecision)
                                                    }
                                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none bg-white"
                                                >
                                                    <option value="REFUND_TO_BUYER">Người mua thắng</option>
                                                    <option value="RELEASE_TO_SELLER">Người bán thắng</option>
                                                </select>
                                                <p className="text-xs text-gray-600 mt-1">
                                                    {resolveForms[dispute.id].decision === "REFUND_TO_BUYER"
                                                        ? "Người mua sẽ nhận lại tiền, người bán không nhận được thanh toán"
                                                        : "Người bán sẽ nhận tiền, khiếu nại bị từ chối"}
                                                </p>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Ghi chú admin (Tùy chọn)
                                                </label>
                                                <textarea
                                                    value={resolveForms[dispute.id].adminNote || ""}
                                                    onChange={(e) => updateResolveForm(dispute.id, "adminNote", e.target.value)}
                                                    rows={4}
                                                    placeholder="Nhập ghi chú về quyết định của bạn..."
                                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none resize-none"
                                                />
                                            </div>

                                            <button
                                                onClick={() => handleResolveDispute(dispute.id)}
                                                disabled={submittingDisputes.has(dispute.id)}
                                                className="w-full py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-semibold rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                            >
                                                {submittingDisputes.has(dispute.id) ? (
                                                    <>
                                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                                        Đang xử lý...
                                                    </>
                                                ) : (
                                                    <>
                                                        <CheckCircle size={20} />
                                                        Xác nhận giải quyết
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Right: Resolved Info (for resolved disputes) */}
                                {dispute.decision !== "PENDING" && (
                                    <div className="bg-gray-50 p-6 rounded-lg border-2 border-gray-200 flex items-center justify-center">
                                        <div className="text-center">
                                            {dispute.decision === "REFUND_TO_BUYER" ? (
                                                <CheckCircle className="mx-auto text-green-600 mb-3" size={48} />
                                            ) : (
                                                <XCircle className="mx-auto text-blue-600 mb-3" size={48} />
                                            )}
                                            <h4 className="text-lg font-bold text-gray-900 mb-2">Đã giải quyết</h4>
                                            <p className="text-gray-600">
                                                {dispute.decision === "REFUND_TO_BUYER"
                                                    ? "Đã hoàn tiền cho người mua"
                                                    : "Đã chuyển tiền cho người bán"}
                                            </p>
                                            {dispute.resolvedAt && (
                                                <p className="text-sm text-gray-500 mt-2">{formatDate(dispute.resolvedAt)}</p>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Pagination */}
            {!loading && disputes.length > 0 && totalPages > 1 && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600">
                            Hiển thị {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, totalElements)} /{" "}
                            {totalElements} khiếu nại
                        </p>

                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                            itemsPerPage={pageSize}
                            totalItems={totalElements}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDisputes;
