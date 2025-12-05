const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/employeeController');


router.get('/metrics/country/:country', ctrl.metricsByCountry);
router.get('/metrics/job-title/:jobTitle', ctrl.avgByJobTitle);

router.get('/country/:country', ctrl.getSalaryByCountry);
router.get('/job/:jobTitle', ctrl.getSalaryByJobTitle);


router.post('/', ctrl.createEmployee);
router.get('/', ctrl.getEmployees);
router.get('/:id', ctrl.getEmployee);
router.put('/:id', ctrl.updateEmployee);
router.delete('/:id', ctrl.deleteEmployee);


router.get('/:id/salary', ctrl.salaryCalculation);

module.exports = router;
