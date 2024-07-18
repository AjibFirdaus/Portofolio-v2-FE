const express = require('express');
const router = express.Router();
const verifyToken = require("../helper/verifyToken");
const { PrismaClient } = require('@prisma/client');
const { io } = require("../server");
const prisma = new PrismaClient();

router.delete('/project/:title', verifyToken, async (req, res) => {
  const { title } = req.params;

  try {    
    const page = await prisma.pages.findUnique({
      where: { page: 'projects' },
    });

    if (!page) {
      return res.status(404).json({ error: 'Projects page not found' });
    }


    const projectsData = JSON.parse(page.data);


    if (!projectsData || !projectsData.projects || !Array.isArray(projectsData.projects)) {
      return res.status(500).json({ error: 'Invalid projects data structure' });
    }

    const projectIndex = projectsData.projects.findIndex((project) => project.title === title);
    if (projectIndex === -1) {
      return res.status(404).json({ error: 'Project not found' });
    }

    projectsData.projects.splice(projectIndex, 1);

    await prisma.pages.update({
      where: { page: 'projects' },
      data: { data: JSON.stringify(projectsData) },
    });

    res.status(200).json({ message: 'Project deleted successfully' });
    io.emit("updateData");
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'An error occurred while deleting the project', details: error.message });
  }
});

module.exports = router;