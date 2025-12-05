const prisma = require('../../prismaClient');
const { calculateDeductions } = require('../utils/salaryUtils'); // ← missing import fixed

// CREATE employee
async function createEmployee(req, res) {
  const { fullName, jobTitle, country, salary } = req.body;

  if (!fullName || !jobTitle || !country || salary == null) {
    return res.status(400).json({ error: 'fullName, jobTitle, country, salary are required' });
  }

  const employee = await prisma.employee.create({
    data: { fullName, jobTitle, country, salary: Number(salary) }
  });

  res.status(201).json(employee);
}

// GET all employees
async function getEmployees(req, res) {
  const employees = await prisma.employee.findMany();
  res.json(employees);
}

async function getEmployee(req, res) {
  const id = Number(req.params.id);
  const emp = await prisma.employee.findUnique({ where: { id } });
  if (!emp) return res.status(404).json({ error: 'Employee not found' });
  res.json(emp);
}

async function updateEmployee(req, res) {
  const id = Number(req.params.id);
  const { fullName, jobTitle, country, salary } = req.body;

  try {
    const emp = await prisma.employee.update({
      where: { id },
      data: { fullName, jobTitle, country, salary: salary == null ? undefined : Number(salary) }
    });
    res.json(emp);
  } catch (err) {
    res.status(404).json({ error: 'Employee not found' });
  }
}

async function deleteEmployee(req, res) {
  const id = Number(req.params.id);

  try {
    await prisma.employee.delete({ where: { id } });
    res.status(204).end();
  } catch {
    res.status(404).json({ error: 'Employee not found' });
  }
}

// Salary calculation endpoint: GET /employees/:id/salary?gross=12345
async function salaryCalculation(req, res) {
  const id = Number(req.params.id);
  const grossQ = req.query.gross;

  if (!grossQ) return res.status(400).json({ error: 'gross query parameter required' });

  const gross = Number(grossQ);
  if (Number.isNaN(gross) || gross < 0) {
    return res.status(400).json({ error: 'gross must be a non-negative number' });
  }

  const emp = await prisma.employee.findUnique({ where: { id } });
  if (!emp) return res.status(404).json({ error: 'Employee not found' });

  const { tds, net } = calculateDeductions(gross, emp.country);
  res.json({ employeeId: id, country: emp.country, gross, tds, net });
}

// Metrics by country
async function metricsByCountry(req, res) {
  const country = req.params.country;
  const emps = await prisma.employee.findMany({ where: { country } });

  if (!emps.length) return res.status(404).json({ error: 'No employees found for this country' });

  const salaries = emps.map(e => e.salary);
  const min = Math.min(...salaries);
  const max = Math.max(...salaries);
  const avg = salaries.reduce((a, b) => a + b, 0) / salaries.length;

  res.json({ country, min, max, avg });
}

// Average salary by job title
async function avgByJobTitle(req, res) {
  const jobTitle = req.params.jobTitle;
  const emps = await prisma.employee.findMany({ where: { jobTitle } });

  if (!emps.length) return res.status(404).json({ error: 'No employees found for this job title' });

  const avg = emps.reduce((a, b) => a + b.salary, 0) / emps.length;
  res.json({ jobTitle, avg });
}


// Get salary report by country
async function getSalaryByCountry(req, res)  {
  try {
    const { country } = req.params;

    const salaries = await prisma.employee.findMany({
      where: { country },
      select: { salary: true }
    });

    if (salaries.length === 0) {
      return res.status(404).json({ message: "No employees found for this country" });
    }

    const values = salaries.map(s => s.salary);

    const response = {
      country,
      minSalary: Math.min(...values),
      maxSalary: Math.max(...values),
      avgSalary: values.reduce((a, b) => a + b, 0) / values.length
    };

    return res.json(response);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Get salary report by job title
async function getSalaryByJobTitle(req, res) {
  try {
    const { jobTitle } = req.params;

    const employees = await prisma.employee.findMany({
      where: { jobTitle },
      select: { salary: true }
    });

    if (employees.length === 0) {
      return res.status(404).json({ message: "No employees found for this job title" });
    }

    const avgSalary = employees.reduce((sum, emp) => sum + emp.salary, 0) / employees.length;

    return res.json({
      jobTitle,
      employeeCount: employees.length,
      averageSalary: avgSalary
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
    createEmployee,
    getEmployees,
    getEmployee,
    updateEmployee,
    deleteEmployee,
    salaryCalculation,
    metricsByCountry,
    avgByJobTitle,
    getSalaryByCountry,
    getSalaryByJobTitle
  };
  
