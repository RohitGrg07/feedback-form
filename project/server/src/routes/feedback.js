const express = require("express");
const router = express.Router();
const Feedback = require("../models/Feedback");

// POST /feedback - Create new feedback
router.post("/", async (req, res) => {
  try {
    const { name, email, phone, rating, feedback } = req.body;

    if (!name || !email || !phone || !rating || !feedback) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const created = await Feedback.create({
      name: String(name).trim(),
      email: String(email).trim(),
      phone: String(phone).trim(),
      rating: Number(rating),
      feedback: String(feedback).trim(),
    });

    return res.status(201).json({ data: created });
  } catch (err) {
    console.error("Error creating feedback", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// GET /feedback - List feedback with pagination
router.get("/", async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page || "0", 10), 0);
    const limit = Math.min(
      Math.max(parseInt(req.query.limit || "10", 10), 1),
      100
    );
    const skip = page * limit;
    const sortQuery = String(req.query.sort || "desc").toLowerCase();
    const sortOrder = sortQuery === "asc" ? 1 : -1;

    const [items, total] = await Promise.all([
      Feedback.find({})
        .sort({ createdAt: sortOrder })
        .skip(skip)
        .limit(limit)
        .lean(),
      Feedback.countDocuments({}),
    ]);

    return res.json({
      data: items,
      total,
      page,
      limit,
      sort: sortQuery,
    });
  } catch (err) {
    console.error("Error fetching feedback", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
