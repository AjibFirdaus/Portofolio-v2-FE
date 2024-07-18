const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
require("dotenv").config();

// get data
router.get("/:page", async (req, res) => {
  const { page } = req.params;

  if (!page) return res.status(404).json({ message: "Page not found" });

  if (page === "messages") {
    const dataMessages = await prisma.messages.findMany();
    return res.json({data: dataMessages});
  }

  try {
    const data = await prisma.pages.findUnique({
      where: { page: page },
    });

    if (!data)
      return res
        .status(404)
        .json({ message: `Data not found for page ${page}` });

    if (page === "contact") {
      return res.json({
        data: JSON.parse(data.data),
      });
    }

    res.json({
      data: JSON.parse(data.data),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
