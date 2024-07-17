const express = require('express');
const router = express.Router();
const verifyToken = require("../helper/verifyToken");
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

router.put('/:page', verifyToken, async (req, res) => {
  const { page } = req.params;
  const { data } = req.body

  if (!data) return res.status(404).json({message: "no data found"});

  try {
    const updatedPage = await prisma.pages.update({
      where: { page: page },
      data: { data: JSON.stringify(data) },
    });

    res.json({ message: 'Data updated successfully', data: updatedPage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;