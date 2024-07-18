const express = require('express');
const router = express.Router();
const verifyToken = require("../helper/verifyToken");
const { PrismaClient } = require('@prisma/client');
const { io } = require("../server");
const prisma = new PrismaClient();

router.post('/addProject', verifyToken, async (req, res) => {
  const { data } = req.body;

  try {
    if (!data || !data.title || !data.description || !data.link || !data.image) {
      return res.status(400).json({ error: 'some field null' });
    }

    const projectsPage = await prisma.pages.findUnique({
      where: { page: 'projects' },
    });

    if (!projectsPage) {
      return res.status(404).json({ error: 'page projects not found' });
    }

    const currentData = JSON.parse(projectsPage.data);

    currentData.projects.push({
      title: data.title,
      description: data.description,
      link: data.link,
      image: data.image
    });

    const updatedProjectsPage = await prisma.pages.update({
      where: { page: 'projects' },
      data: {
        data: JSON.stringify(currentData)
      },
    });

    res.status(200).json({
      message: 'Project successfully added',
      updatedData: JSON.parse(updatedProjectsPage.data)
    });
    io.emit("newProject")
  } catch (error) {
    console.error('Error saat menambahkan proyek:', error);
    res.status(500).json({ error: 'Terjadi kesalahan saat menambahkan proyek' });
  }
});


router.post('/createMessage', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const createMessages = await prisma.messages.create({
      data: {
        sender: name,
        email: email,
        message: message
      }
    });

    io.emit("createMessage")

    res.status(201).json({ message: 'Message created successfully' });
  } catch (error) {
    console.error('Error creating message:', error);
    res.status(500).json({ error: 'An error occurred while creating the message' });
  }
});

module.exports = router;