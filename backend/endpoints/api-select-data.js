const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
require("dotenv").config();

// get data
router.get("/:page", async (req, res) => {
  const { page } = req.params;

  if (!page) return res.status(404).json({ message: "page not found" });

  try {
    const data = await prisma.pages.findUnique({
      where: { page: page },
    });
    if (!data) res.status(404).json({message: `data not found for page ${page}` })
    setTimeout(() => {
      if (page === "contact") {
        const datas = JSON.parse(data.data);
        return res.json({
          data: datas.contact,
        });
      }
      res.json({
        data: JSON.parse(data.data),
      });
    }, 1000);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
