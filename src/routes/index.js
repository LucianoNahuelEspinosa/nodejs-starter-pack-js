import { Router } from "express";
const router = Router();

/**
 * Health checker
 *
 * @param {import("express").Request} req - Express request
 * @param {import("express").Response} res - Express response
 */
router.get("/health", (req, res) => {
    res.status(200).send("Server is working!!");
});

export default router;