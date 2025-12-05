const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const { validateEmployee, validateEmployeeUpdate, validateSalaryQuery, validateId } = require('../middleware/validation');

// Metrics routes (must come before /:id routes to avoid conflicts)
router.get('/metrics/country/:country', employeeController.metricsByCountry);
router.get('/metrics/job-title/:jobTitle', employeeController.avgByJobTitle);

// Salary report routes
router.get('/country/:country', employeeController.getSalaryByCountry);
router.get('/job/:jobTitle', employeeController.getSalaryByJobTitle);

// CRUD routes
router.post('/', validateEmployee, employeeController.createEmployee);
router.get('/', employeeController.getEmployees);
router.get('/:id', validateId, employeeController.getEmployee);
router.put('/:id', validateId, validateEmployeeUpdate, employeeController.updateEmployee);
router.delete('/:id', validateId, employeeController.deleteEmployee);

// Salary calculation route (must come after /:id route)
router.get('/:id/salary', validateId, validateSalaryQuery, employeeController.salaryCalculation);

module.exports = router;
