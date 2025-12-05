const asyncHandler = require('../middleware/asyncHandler');
const employeeService = require('../services/employeeService');

/**
 * CREATE employee
 */
const createEmployee = asyncHandler(async (req, res) => {
  const employee = await employeeService.createEmployee(req.body);
  res.status(201).json(employee);
});

/**
 * GET all employees
 */
const getEmployees = asyncHandler(async (req, res) => {
  const employees = await employeeService.getAll();
  res.json(employees);
});

/**
 * GET employee by ID
 */
const getEmployee = asyncHandler(async (req, res) => {
  const employee = await employeeService.getById(req.params.id);
  res.json(employee);
});

/**
 * UPDATE employee
 */
const updateEmployee = asyncHandler(async (req, res) => {
  const employee = await employeeService.updateEmployee(req.params.id, req.body);
  res.json(employee);
});

/**
 * DELETE employee
 */
const deleteEmployee = asyncHandler(async (req, res) => {
  await employeeService.deleteEmployee(req.params.id);
  res.status(204).end();
});

/**
 * Calculate salary deductions
 */
const salaryCalculation = asyncHandler(async (req, res) => {
  const result = await employeeService.calculateSalary(req.params.id, req.gross);
  res.json(result);
});

/**
 * Get metrics by country
 */
const metricsByCountry = asyncHandler(async (req, res) => {
  const result = await employeeService.getMetricsByCountry(req.params.country);
  res.json(result);
});

/**
 * Get average salary by job title
 */
const avgByJobTitle = asyncHandler(async (req, res) => {
  const result = await employeeService.getAverageByJobTitle(req.params.jobTitle);
  res.json(result);
});

/**
 * Get salary report by country
 */
const getSalaryByCountry = asyncHandler(async (req, res) => {
  const result = await employeeService.getSalaryReportByCountry(req.params.country);
  res.json(result);
});

/**
 * Get salary report by job title
 */
const getSalaryByJobTitle = asyncHandler(async (req, res) => {
  const result = await employeeService.getSalaryReportByJobTitle(req.params.jobTitle);
  res.json(result);
});

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
