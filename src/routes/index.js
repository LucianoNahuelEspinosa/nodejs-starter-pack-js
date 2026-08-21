import { Router } from "express";
const router = Router();

/**
 * Health checker
 *
 * @param {import("express").Request} req - Express request
 * @param {import("express").Response} res - Express response
 * @param {import("express").NextFunction} next - Express next function
 */
router.get("/health", (req, res, next) => {
    res.status(200).send("Server is working!!");
});

export default router;