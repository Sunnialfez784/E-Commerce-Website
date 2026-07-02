import {useEffect, useMemo, useState} from "react";
import {Card, CardBody} from "@windmill/react-ui";
import AdminPageHeader from "../components/AdminPageHeader";
import AdminPagination from "../components/AdminPagination";
import AdminStateView from "../components/AdminStateView";
import useAdminResource from "../hooks/useAdminResource";
import {adminApi} from "../services/adminApi";
import {formatCurrency, formatDate, getStatusTone} from "../utils/format";
import {useAdminToast} from "../context/AdminToastContext";
import {SearchIcon, ForbiddenIcon, TrashIcon} from "../../icons";
import {adminCardClass, adminInputClass, adminPrimaryButtonClass, adminGhostButtonClass} from "../utils/theme";

function AdminUsers({ searchTerm = "" }) {
  const {data, loading, error, reload} = useAdminResource(adminApi.getUsers);
  const [items, setItems] = useState(null);
  const [search, setSearch] = useState(searchTerm);
  const [page, setPage] = useState(1);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const {showToast} = useAdminToast();
  const pageSize = 5;

  useEffect(() => {
    setSearch(searchTerm);
    setPage(1);
  }, [searchTerm]);

  const accessToken = localStorage.getItem("accessToken");

  const usersWithOrders = useMemo(() => {
    const users = data?.users || [];
    const countingData = data?.countingData || {};

    return users.map((user) => {
      return {
        ...user,
        totalOrders: countingData[user.user_id]?.totalOrders || 0,
        totalSpend: countingData[user.user_id]?.totalSpend || 0,
      };
    });
  }, [data]);

  const sourceItems = useMemo(() => {
    return items ?? usersWithOrders;
  }, [items, usersWithOrders]);

  console.log("SOURCE ITEMS", sourceItems);
  console.log("USERS DATA", data);

  const filtered = useMemo(() => {
    const query = search.toLowerCase();

    return sourceItems.filter((user) =>
      [user.name, user.email, user.role, user.firstName, user.lastName, user.user_id].some((value) =>
        String(value || "")
          .toLowerCase()
          .includes(query),
      ),
    );
  }, [sourceItems, search]);

  const selectedUser = useMemo(() => {
    if (!sourceItems.length) {
      return null;
    }

    if (selectedUserId) {
      return sourceItems.find((user) => user.user_id === selectedUserId) || sourceItems[0];
    }

    return sourceItems[0];
  }, [sourceItems, selectedUserId]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  // function toggleBlock(id) {
  //   setItems((current) => {
  //     const currentItems = current ?? data ?? [];
  //     const next = currentItems.map((user) => (user.id === id ? {...user, status: user.status === "Blocked" ? "Active" : "Blocked"} : user));
  //     const updated = next.find((user) => user.id === id) || null;
  //     setSelectedUserId(updated?.id || selectedUserId);
  //     return next;
  //   });
  //   showToast("User access updated.", "info");
  // }

  // const toggleBlock = async (user) => {
  //   try {
  //     const action = user.ac_status === "active" ? "block" : "unblock";

  //     await adminApi.userBlocked(user.user_id, accessToken, action);

  //     reload();

  //     showToast(action === "block" ? "User blocked successfully" : "User unblocked successfully", "info");
  //   } catch (error) {
  //     console.log(error.response?.data);
  //   }
  // };

  const toggleBlock = async (user) => {
    const ac_status = user.ac_status === "active" ? "block" : "active";

    console.log("PAYLOAD", {
      user_id: user.user_id,
      ac_status,
    });

    try {
      const res = await adminApi.userBlocked(user.user_id, accessToken, ac_status);

      console.log("RESPONSE", res);

      reload();
    } catch (error) {
      console.log("ERROR", error.response?.data);
    }
  };

  const deleteUser = async (userId) => {
    try {
      await adminApi.deleteUser(userId, accessToken);

      setItems((current) => {
        const currentItems = current ?? usersWithOrders;
        const next = currentItems.filter((user) => user.user_id !== userId);

        if (selectedUserId === userId) {
          setSelectedUserId(next[0]?.user_id || null);
        }

        return next;
      });

      showToast("User removed.", "warning");
    } catch (error) {
      console.log(error);
      showToast("Failed to delete user.", "danger");
    }
  };

  return (
    <div>
      <AdminPageHeader eyebrow="Users" title="User management" description="Review registered customers, open profile details, and control account access from one place." />

      {(loading || error) && <AdminStateView loading={loading} error={error} onRetry={reload} title="Loading user directory..." />}

      {!loading && !error && (
        <div className="grid gap-6 xl:grid-cols-[1.3fr_0.95fr]">
          <Card className={adminCardClass}>
            <CardBody className="p-5">
              <div className="relative">
                <SearchIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  className={`${adminInputClass} py-3 pl-10 pr-4`}
                  placeholder="Search users"
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
                      <th className="pb-3 pr-4">User</th>
                      <th className="pb-3 pr-4">Role</th>
                      <th className="pb-3 pr-4">Orders</th>
                      <th className="pb-3 pr-4">Spend</th>
                      <th className="pb-3 pr-4">Status</th>
                      <th className="pb-3 pr-4">Joined</th>
                      <th className="pb-3">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                    {paged.map((user) => (
                      <tr key={user.user_id} className="cursor-pointer text-sm hover:bg-slate-50/80 dark:hover:bg-white/5" onClick={() => setSelectedUserId(user.user_id)}>
                        <td className="py-3 pr-4">
                          <p className="font-semibold text-slate-900 dark:text-white">{`${user.firstName} ${user.lastName}`}</p>
                          <p className="text-slate-500 dark:text-slate-400">{user.email}</p>
                        </td>
                        <td className="py-3 pr-4 text-slate-600 dark:text-slate-300">{user.role}</td>
                        <td className="py-3 pr-4 text-slate-900 dark:text-white">{user.totalOrders}</td>
                        <td className="py-3 pr-4 font-medium text-slate-900 dark:text-white">{formatCurrency(user.totalSpend)}</td>
                        <td className="py-3 pr-4">
                          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getStatusTone(user.ac_status)}`}>{user.ac_status}</span>
                        </td>
                        <td className="py-3 pr-4 text-slate-500 dark:text-slate-400">{formatDate(user.createdAt)}</td>
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <button
                              className="rounded-xl bg-slate-950 px-3 py-2 text-xs font-semibold text-white dark:bg-white dark:text-slate-950"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleBlock(user);
                              }}>
                              <ForbiddenIcon className="mr-1 inline h-3.5 w-3.5" /> {user.ac_status === "block" ? "Unblock" : "Block"}
                            </button>
                            <button
                              className={`${adminGhostButtonClass} border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-xs font-semibold text-rose-700 dark:text-rose-300`}
                              onClick={(event) => {
                                event.stopPropagation();
                                deleteUser(user.user_id);
                              }}
                              type="button">
                              <TrashIcon className="mr-1 inline h-3.5 w-3.5" /> Delete
                            </button>
                          </div>
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
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">User details</p>
              {selectedUser ? (
                <div className="mt-4 space-y-4">
                  <div className="flex items-center gap-4 rounded-3xl bg-slate-100 p-4 dark:bg-white/5">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-indigo-500 text-xl font-bold text-white">{(selectedUser.name || selectedUser.firstName || "?").slice(0, 1)}</div>
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{`${selectedUser.firstName} ${selectedUser.lastName}`}</h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{selectedUser.email}</p>
                    </div>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-slate-100 p-4 dark:bg-white/5">
                      <p className="text-slate-500 dark:text-slate-400">Role</p>
                      <p className="mt-1 font-semibold text-slate-900 dark:text-white">{selectedUser.role}</p>
                    </div>
                    <div className="rounded-2xl bg-slate-100 p-4 dark:bg-white/5">
                      <p className="text-slate-500 dark:text-slate-400">Status</p>
                      <p className="mt-1 font-semibold text-slate-900 dark:text-white">{selectedUser.ac_status}</p>
                    </div>
                    <div className="rounded-2xl bg-slate-100 p-4 dark:bg-white/5">
                      <p className="text-slate-500 dark:text-slate-400">Orders</p>
                      <p className="mt-1 font-semibold text-slate-900 dark:text-white">{selectedUser.totalOrders}</p>
                    </div>
                    <div className="rounded-2xl bg-slate-100 p-4 dark:bg-white/5">
                      <p className="text-slate-500 dark:text-slate-400">Spend</p>
                      <p className="mt-1 font-semibold text-slate-900 dark:text-white">{formatCurrency(selectedUser.totalSpend)}</p>
                    </div>
                  </div>
                  <button className={`w-full ${adminPrimaryButtonClass}`} onClick={() => toggleBlock(selectedUser)} type="button">
                    {selectedUser.ac_status === "block" ? "Unblock user" : "Block user"}
                  </button>
                </div>
              ) : null}
            </CardBody>
          </Card>
        </div>
      )}
    </div>
  );
}

export default AdminUsers;
