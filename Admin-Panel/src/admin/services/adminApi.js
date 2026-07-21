import {BASE_URL} from "../apis";
import {invoices, monthlyRevenue, orderMetrics, orders, products, recentOrders, topProducts, userGrowth, users} from "../data/mockAdminData";
import axios from "axios";

const LATENCY_MS = 280;

function clone(payload) {
  return JSON.parse(JSON.stringify(payload));
}

function sleep(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

async function respond(payload) {
  await sleep(LATENCY_MS);
  return clone(payload);
}

export const adminApi = {
  async getDashboardSummary() {
    const totalRevenue = orders.reduce((sum, order) => sum + Number(order.amount || 0), 0);

    return respond({
      totalUsers: users.length,
      totalProducts: products.length,
      totalOrders: orders.length,
      totalRevenue,
      recentOrders,
    });
  },

  async adminRegister({firstName, lastName, email, password, phone, gender}) {
    try {
      const response = await fetch(`${BASE_URL}/users/register-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          password,
          email,
          phone,
          gender,
          role: "admin",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      console.log("Success:", data);

      return data;
    } catch (error) {
      console.log("Error:", error);
      throw error;
    }
  },

  async adminLogin({email, password}) {
    try {
      const res = await fetch(`${BASE_URL}/users/login-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          role: "admin",
        }),
      });

      const data = await res.json();

      console.log("LOGIN RESPONSE:", data);

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      const token = data?.data?.accessToken;

      if (!token) {
        throw new Error("Token not received from server");
      }

      localStorage.setItem("accessToken", token);

      return data;
    } catch (err) {
      console.log("Login Error:", err);
      throw err;
    }
  },

  async getProducts(accessToken) {
    try {
      const response = await fetch(`${BASE_URL}/admin/get-products`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();

      return data.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
    // return respond(products);
  },

  async editProduct(formData, token) {
    const response = await axios.put(`${BASE_URL}/admin/edit-product`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  },

  async addProduct(formData, token) {
    const response = await axios.post(`${BASE_URL}/admin/add-product`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  },

  deleteProduct: async (productId, user_id, token) => {
    const response = await axios.delete(`${BASE_URL}/admin/delete-product`, {
      data: {product_id: productId, user_id},
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  },

  async getOrders(accessToken) {
    try {
      const response = await fetch(`${BASE_URL}/admin/get-orders`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();

      return data.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
    // return respond(orders)
  },

  async getUsers(accessToken) {
    try {
      const response = await fetch(`${BASE_URL}/admin/get-users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();

      return data.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
    // return respond(users);
  },

  async userBlocked(userId, token, ac_status) {
    console.log("SENDING", {
      user_id: userId,
      ac_status,
    });

    const response = await axios.post(
      `${BASE_URL}/admin/set-block`,
      {
        user_id: userId,
        ac_status,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data;
  },

  deleteUser: async (userId, token) => {
    const response = await axios.delete(`${BASE_URL}/admin/delete-user`, {
      data: {user_id: userId},
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  },

  async getInvoices(accessToken) {
    try {
      const response = await fetch(`${BASE_URL}/admin/get-invoice`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();

      return data.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  async getInvoiceByOrderId(accessToken, invoiceId) {
    const response = await axios.post(
      `${BASE_URL}/admin/get-bill`,
      {
        invoiceId,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    return response.data;
  },

  async getHighlight(accessToken) {
    try {
      const response = await fetch(`${BASE_URL}/admin/get-operational-highlight`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();

      return data.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  async getGraphData(accessToken) {
    try {
      const response = await fetch(`${BASE_URL}/admin/graph-data`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const data = await response.json();

      return data.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
};
