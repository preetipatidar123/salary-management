const prisma = require('../config/database');

// CREATE employee
async function createEmployee(data) {
  return await prisma.employee.create({
    data: {
      fullName: data.fullName,
      jobTitle: data.jobTitle,
      country: data.country,
      salary: Number(data.salary)
    }
  });
}

// GET all employees
async function getAllEmployees() {
  return await prisma.employee.findMany();
}

// GET employee by ID
async function getEmployeeById(id) {
  return await prisma.employee.findUnique({ where: { id } });
}

// UPDATE employee
async function updateEmployee(id, data) {
  return await prisma.employee.update({
    where: { id },
    data: {
      fullName: data.fullName,
      jobTitle: data.jobTitle,
      country: data.country,
      salary: data.salary == null ? undefined : Number(data.salary)
    }
  });
}

// DELETE employee
async function deleteEmployee(id) {
  return await prisma.employee.delete({ where: { id } });
}

// GET employees by country
async function getEmployeesByCountry(country) {
  return await prisma.employee.findMany({ where: { country } });
}

// GET employees by job title
async function getEmployeesByJobTitle(jobTitle) {
  return await prisma.employee.findMany({ where: { jobTitle } });
}

// GET salaries by country (select only salary field)
async function getSalariesByCountry(country) {
  return await prisma.employee.findMany({
    where: { country },
    select: { salary: true }
  });
}

// GET employees by job title (select only salary field)
async function getSalariesByJobTitle(jobTitle) {
  return await prisma.employee.findMany({
    where: { jobTitle },
    select: { salary: true }
  });
}

module.exports = {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  getEmployeesByCountry,
  getEmployeesByJobTitle,
  getSalariesByCountry,
  getSalariesByJobTitle
};

