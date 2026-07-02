import {useEffect, useMemo, useState, useRef} from "react";
import {Card, CardBody} from "@windmill/react-ui";
import {jsPDF} from "jspdf";
import AdminPageHeader from "../components/AdminPageHeader";
import AdminPagination from "../components/AdminPagination";
import AdminStateView from "../components/AdminStateView";
import useAdminResource from "../hooks/useAdminResource";
import {adminApi} from "../services/adminApi";
import {formatCurrency, formatDate, getStatusTone} from "../utils/format";
import {useAdminToast} from "../context/AdminToastContext";
import {SearchIcon} from "../../icons";
import {adminCardClass, adminInputClass, adminPrimaryButtonClass} from "../utils/theme";
import Invoice from "../components/Invoice";
import html2canvas from "html2canvas";

function AdminInvoices({searchTerm = ""}) {
  const {data, loading, error, reload} = useAdminResource(adminApi.getInvoices);
  const invoiceData = data?.data || data || [];
  const [search, setSearch] = useState(searchTerm);
  const [page, setPage] = useState(1);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);
  const [invoiceDetails, setInvoiceDetails] = useState(null);
  const accessToken = localStorage.getItem("accessToken");
  const {showToast} = useAdminToast();
  const pageSize = 5;

  useEffect(() => {
    setSearch(searchTerm);
    setPage(1);
  }, [searchTerm]);

  const invoiceRef = useRef(null);

  const sourceItems = useMemo(() => {
    if (!invoiceData.length) return [];

    return invoiceData.flatMap((user) =>
      (user.Order_Items || []).flatMap((item) =>
        (item.Order_Bills || []).map((bill) => ({
          ...bill,

          invoiceId: bill.invoiceId,

          user_id: user.user_id,
          firstName: user.firstName,
          lastName: user.lastName,

          order_id: item.Order?.order_id,

          payment_status: item.Order?.payment_status,

          productName: item.itemName,

          totalPrice: item.itemPrice,
        })),
      ),
    );
  }, [invoiceData]);

  const filtered = useMemo(() => {
    const query = search.toLowerCase();

    return sourceItems.filter((invoice) =>
      [invoice.bill_id, invoice.order_id, invoice.firstName, invoice.payment_status].some((value) =>
        String(value || "")
          .toLowerCase()
          .includes(query),
      ),
    );
  }, [sourceItems, search]);

  const selectedInvoice = useMemo(() => {
    if (!sourceItems.length) {
      return null;
    }

    if (selectedInvoiceId) {
      return sourceItems.find((invoice) => invoice.bill_id === selectedInvoiceId) || sourceItems[0];
    }

    return sourceItems[0];
  }, [sourceItems, selectedInvoiceId]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  async function handleViewInvoice(invoice) {
    try {
      console.log("INVOICE ID =>", invoice.invoiceId);
      console.log("CLICK DATA =>", invoice);

      if (!invoice.invoiceId) {
        showToast("Invoice id missing", "danger");
        return;
      }

      const response = await adminApi.getInvoiceByOrderId(accessToken, invoice.invoiceId);

      console.log("API RESPONSE =>", response);

      const details = response?.data?.[0] || response?.data || response;

      setInvoiceDetails({
        ...invoice,
        ...details,
      });
    } catch (error) {
      console.log(error);

      showToast(error?.response?.data?.message || "Failed to fetch invoice details", "danger");
    }
  }

  const downloadPdf = async () => {
    try {
      const input = invoiceRef.current;

      if (!input) return;

      const canvas = await html2canvas(input, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");

      const pageWidth = 210;
      const pageHeight = 297;

      const imgWidth = pageWidth;

      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, Math.min(imgHeight, pageHeight));

      pdf.save(`Invoice-${invoiceDetails?.invoiceId || invoiceDetails?.bill_id}.pdf`);

      showToast("Invoice downloaded successfully", "success");
    } catch (error) {
      console.log(error);
      showToast("Failed to download invoice", "danger");
    }
  };

  return (
    <div>
      <AdminPageHeader eyebrow="Invoice" title="Invoice management" description="Search invoices, inspect billing details, and download professional PDF copies with one click." />

      {(loading || error) && <AdminStateView loading={loading} error={error} onRetry={reload} title="Loading invoices..." />}

      {!loading && !error && (
        <div className="grid gap-6 xl:grid-cols-[1.35fr_0.95fr]">
          <Card className={adminCardClass}>
            <CardBody className="p-5">
              <div className="relative">
                <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  className={`${adminInputClass} py-3 pl-10 pr-4`}
                  placeholder="Search invoices"
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setPage(1);
                  }}
                />
              </div>

              <div className="mt-5 overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 dark:divide-white/10">
                  <thead>
                    <tr className="text-left text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                      <th className="pb-3 pr-4">Invoice</th>
                      <th className="pb-3 pr-4">Customer</th>
                      <th className="pb-3 pr-4">Amount</th>
                      <th className="pb-3 pr-4">Status</th>
                      <th className="pb-3 pr-4">Issued</th>
                      <th className="pb-3">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                    {paged.map((invoice) => (
                      <tr key={invoice.bill_id} className="text-sm hover:bg-slate-100/80 dark:hover:bg-white/5">
                        <td className="py-3 pr-4 font-semibold text-slate-900 dark:text-white">{invoice.bill_id}</td>
                        <td className="py-3 pr-4 text-slate-600 dark:text-slate-300">{`${invoice.firstName} ${invoice.lastName}`}</td>
                        <td className="py-3 pr-4 font-medium text-slate-900 dark:text-white">{formatCurrency(invoice.totalPrice)}</td>
                        <td className="py-3 pr-4">
                          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusTone(invoice.payment_status)}`}>{invoice.payment_status}</span>
                        </td>
                        <td className="py-3 pr-4 text-slate-500 dark:text-slate-400">{formatDate(invoice.bill_date)}</td>
                        <td className="py-3">
                          <button className={`${adminPrimaryButtonClass} px-3 py-2 text-xs`} onClick={() => handleViewInvoice(invoice)} type="button">
                            View invoice
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <AdminPagination page={page} totalPages={totalPages} onPageChange={setPage} totalItems={filtered.length} pageSize={pageSize} />
            </CardBody>
          </Card>

          <Card className={`h-fit ${adminCardClass}`}>
            <CardBody className="p-5">
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Invoice details</p>
              {invoiceDetails ? (
                <div className="mt-4 space-y-4">
                  <div className="rounded-2xl bg-slate-100 p-4 dark:bg-white/5">
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Invoice #{invoiceDetails?.bill_id}</h3>

                    <p className="text-sm text-slate-500 dark:text-slate-400">Order #{invoiceDetails?.order_id || invoiceDetails?.orderId}</p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-slate-100 p-4 dark:bg-white/5">
                      <p className="text-slate-500 dark:text-slate-400">Buyer City</p>

                      <p className="mt-1 font-semibold text-slate-900 dark:text-white">{invoiceDetails?.buyer_city}</p>

                      <p className="mt-2 text-slate-500 dark:text-slate-400">{invoiceDetails?.buyer_address}</p>
                    </div>
                    <div className="rounded-2xl bg-slate-100 p-4 dark:bg-white/5">
                      <p className="text-slate-500 dark:text-slate-400">Amount</p>
                      <p className="mt-1 font-semibold text-slate-900 dark:text-white">{formatCurrency(invoiceDetails?.totalPrice || invoiceDetails?.total_amount || 0)}</p>
                    </div>
                  </div>
                  <div className="rounded-2xl bg-slate-100 p-4 dark:bg-white/5">
                    <p className="text-slate-500 dark:text-slate-400">Product</p>

                    <p className="mt-2 text-slate-900 dark:text-white">{invoiceDetails?.productName || "No product data"}</p>
                  </div>

                  <div ref={invoiceRef} className="absolute left-[-9999px] top-0 bg-white w-[1200px]">
                    <Invoice invoice={invoiceDetails} />
                  </div>

                  <button className={`w-full ${adminPrimaryButtonClass}`} onClick={() => downloadPdf()} type="button">
                    Download PDF
                  </button>
                </div>
              ) : (
                <div className="mt-4 rounded-xl bg-slate-100 p-4 dark:bg-white/5">
                  <p className="text-slate-500 dark:text-slate-400">Select an invoice to view details</p>
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      )}
    </div>
  );
}

export default AdminInvoices;
