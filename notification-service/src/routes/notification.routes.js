import express from "express";

import {
    getNotifications,
    markAsRead,
    markAllAsRead,
} from "../controllers/notification.controller.js";

const router = express.Router();

// GET /api/notifications?userId=...
router.get("/", getNotifications);

// PATCH /api/notifications/:id/read
router.patch("/:id/read", markAsRead);

// PATCH /api/notifications/read-all
router.patch("/read-all", markAllAsRead);

export default router;
