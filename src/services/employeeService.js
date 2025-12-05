const { calculateDeductions } = require('../utils/salaryUtils');
const {
  createEmployee: createEmployeeDB,
  getAllEmployees,
  getEmployeeById,
  updateEmployee: updateEmployeeDB,
  deleteEmployee: deleteEmployeeDB,
  getEmployeesByCountry,
  getEmployeesByJobTitle,
  getSalariesByCountry,
  getSalariesByJobTitle
} = require('../models/employeeModel');

/**
 * Create a new employee
 */
async function createEmployee(data) {
  return await createEmployeeDB({
    fullName: data.fullName.trim(),
    jobTitle: data.jobTitle.trim(),
    country: data.country.trim(),
    salary: Number(data.salary)
  });
}

/**
 * Get all employees
 */
async function getAll() {
  return await getAllEmployees();
}

/**
 * Get employee by ID
 */
async function getById(id) {
  const employee = await getEmployeeById(id);
  if (!employee) {
    const error = new Error('Employee not found');
    error.status = 404;
    throw error;
  }
  return employee;
}

/**
 * Update employee
 */
async function updateEmployee(id, data) {
  const updateData = {};
  
  if (data.fullName !== undefined) updateData.fullName = data.fullName.trim();
  if (data.jobTitle !== undefined) updateData.jobTitle = data.jobTitle.trim();
  if (data.country !== undefined) updateData.country = data.country.trim();
  if (data.salary !== undefined) updateData.salary = Number(data.salary);

  try {
    return await updateEmployeeDB(id, updateData);
  } catch (error) {
    if (error.code === 'P2025') {
      const notFoundError = new Error('Employee not found');
      notFoundError.status = 404;
      throw notFoundError;
    }
    throw error;
  }
}

/**
 * Delete employee
 */
async function deleteEmployee(id) {
  try {
    await deleteEmployeeDB(id);
  } catch (error) {
    if (error.code === 'P2025') {
      const notFoundError = new Error('Employee not found');
      notFoundError.status = 404;
      throw notFoundError;
    }
    throw error;
  }
}

/**
 * Calculate salary deductions for an employee
 */
async function calculateSalary(id, gross) {
  const employee = await getById(id);
  const { tds, net } = calculateDeductions(gross, employee.country);
  
  return {
    employeeId: id,
    country: employee.country,
    gross,
    tds,
    net
  };
}

/**
 * Get salary metrics by country
 */
async function getMetricsByCountry(country) {
  const employees = await getEmployeesByCountry(country);

  if (employees.length === 0) {
    const error = new Error('No employees found for this country');
    error.status = 404;
    throw error;
  }

  const salaries = employees.map(e => e.salary);
  const min = Math.min(...salaries);
  const max = Math.max(...salaries);
  const avg = salaries.reduce((a, b) => a + b, 0) / salaries.length;

  return { country, min, max, avg };
}

/**
 * Get average salary by job title
 */
async function getAverageByJobTitle(jobTitle) {
  const employees = await getEmployeesByJobTitle(jobTitle);

  if (employees.length === 0) {
    const error = new Error('No employees found for this job title');
    error.status = 404;
    throw error;
  }

  const avg = employees.reduce((a, b) => a + b.salary, 0) / employees.length;
  return { jobTitle, avg };
}

/**
 * Get salary report by country
 */
async function getSalaryReportByCountry(country) {
  const salaries = await getSalariesByCountry(country);

  if (salaries.length === 0) {
    const error = new Error('No employees found for this country');
    error.status = 404;
    throw error;
  }

  const values = salaries.map(s => s.salary);
  return {
    country,
    minSalary: Math.min(...values),
    maxSalary: Math.max(...values),
    avgSalary: values.reduce((a, b) => a + b, 0) / values.length
  };
}

/**
 * Get salary report by job title
 */
async function getSalaryReportByJobTitle(jobTitle) {
  const employees = await getSalariesByJobTitle(jobTitle);

  if (employees.length === 0) {
    const error = new Error('No employees found for this job title');
    error.status = 404;
    throw error;
  }

  const avgSalary = employees.reduce((sum, emp) => sum + emp.salary, 0) / employees.length;
  return {
    jobTitle,
    employeeCount: employees.length,
    averageSalary: avgSalary
  };
}

module.exports = {
  createEmployee,
  getAll,
  getById,
  updateEmployee,
  deleteEmployee,
  calculateSalary,
  getMetricsByCountry,
  getAverageByJobTitle,
  getSalaryReportByCountry,
  getSalaryReportByJobTitle
};

