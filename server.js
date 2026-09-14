const express = require("express");
const cors = require("cors");

const app = express();

const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Store orders in memory
app.locals.orders = [];

// =========================================
// HOME
// =========================================

app.get("/", (req, res) => {
    res.send("Smart Canteen Backend is Running 🚀");
});

// =========================================
// TEST API
// =========================================

app.get("/api/test", (req, res) => {
    res.json({
        success: true,
        message: "Smart Canteen API is working!"
    });
});

// =========================================
// GET ALL ORDERS
// =========================================

app.get("/api/orders", (req, res) => {
    const orders = req.app.locals.orders || [];

    res.json({
        success: true,
        orders: orders
    });
});

// =========================================
// PLACE NEW ORDER
// =========================================

app.post("/api/orders", (req, res) => {

    const order = req.body;

    if (
        !order.student ||
        !Array.isArray(order.items) ||
        order.items.length === 0 ||
        order.total === undefined ||
        order.total === null
    ) {
        return res.status(400).json({
            success: false,
            message: "Invalid order data"
        });
    }

    if (!order.orderId) {
        order.orderId = "ORD" + Date.now();
    }

    if (!order.status) {
        order.status = "Pending";
    }

    if (!order.date) {
        order.date = new Date().toLocaleString();
    }

    req.app.locals.orders.push(order);

    res.status(201).json({
        success: true,
        message: "Order placed successfully",
        order: order
    });
});

// =========================================
// UPDATE ORDER STATUS
// =========================================

app.put("/api/orders/:orderId", (req, res) => {

    const orderId = req.params.orderId;
    const newStatus = req.body.status;

    const orders = req.app.locals.orders || [];

    const order = orders.find(
        item => item.orderId === orderId
    );

    if (!order) {
        return res.status(404).json({
            success: false,
            message: "Order not found"
        });
    }

    if (!newStatus) {
        return res.status(400).json({
            success: false,
            message: "Status is required"
        });
    }

    order.status = newStatus;

    res.json({
        success: true,
        message: "Order status updated",
        order: order
    });
});

// =========================================
// DELETE ORDER
// =========================================

app.delete("/api/orders/:orderId", (req, res) => {

    const orderId = req.params.orderId;

    let orders = req.app.locals.orders || [];

    const oldLength = orders.length;

    orders = orders.filter(
        order => order.orderId !== orderId
    );

    req.app.locals.orders = orders;

    if (orders.length === oldLength) {
        return res.status(404).json({
            success: false,
            message: "Order not found"
        });
    }

    res.json({
        success: true,
        message: "Order deleted successfully"
    });
});

// =========================================
// START SERVER
// =========================================

app.listen(PORT, () => {
    console.log(
        `Smart Canteen Server running at http://localhost:${PORT}`
    );
});