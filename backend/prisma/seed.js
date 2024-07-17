const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");
const bcrypt = require('bcrypt');
require('dotenv').config();

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("updatecuy#", 10);

  // Prepare data for seeding
  const seedData = [
    prisma.admin.create({
      data: {
        username: "ajib",
        password: hashedPassword,
      },
    }),
    prisma.pages.upsert({
      where: { page: "about" },
      update: {},
      create: {
        page: "about",
        data: JSON.stringify({
          photo: fs.readFileSync(path.join(__dirname, "assets", "photo.png")).toString("base64"),
          description: "Hello! I'm Muhamad Ajib Firdaus, a passionate web programmer with a knack for creating dynamic and user-friendly websites.",
          description2: "With a strong foundation in both front-end and back-end development, I have honed my skills to deliver high-quality digital solutions that meet the needs of clients and users alike.",
        }),
      },
    }),
    prisma.pages.upsert({
      where: { page: "home" },
      update: {},
      create: {
        page: "home",
        data: JSON.stringify({
          name: "Ajib Firdaus",
          description: "a website developer",
          description2: "I am currently developing an e-commerce website",
          link: "https://www.growtovia.com",
          namaWebsite: "growtovia.com",
        }),
      },
    }),
    prisma.pages.upsert({
      where: { page: "projects" },
      update: {},
      create: {
        page: "projects",
        data: JSON.stringify({
          projects: [
            {
              title: "Absensi SMKN 4",
              description: "a student attendance website",
              link: "",
              image: fs.readFileSync(path.join(__dirname, "assets", "absensi-smkn4.png")).toString("base64"),
            },
            {
              title: "Growtovia",
              description: "an e-commerce website",
              link: "https://growtovia.com",
              image: fs.readFileSync(path.join(__dirname, "assets", "growtovia.png")).toString("base64"),
            },
          ],
        }),
      },
    }),
    prisma.pages.upsert({
      where: { page: "contact" },
      update: {},
      create: {
        page: "contact",
        data: JSON.stringify({
          contact: {
            contactInformation: {
              email: "example@ajibfirdaus.my.id",
              telephone: "+62 123456789",
              location: "Bandung, Indonesia",
            },
            followMe: {
              X: "https://x.com/majibfirdaus",
              github: "https://github.com/AjibFirdaus",
              instagram: "https://www.instagram.com/majibfirdaus",
            },
          },
        }),
      },
    }),
  ];

  // Execute all database operations concurrently
  const results = await Promise.all(seedData);

  console.log("Seeding completed:", results);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });