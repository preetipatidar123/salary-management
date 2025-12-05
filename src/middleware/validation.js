/**
 * Validation middleware for employee data
 */
function validateEmployee(req, res, next) {
  const { fullName, jobTitle, country, salary } = req.body;

  if (!fullName || typeof fullName !== 'string' || fullName.trim().length === 0) {
    return res.status(400).json({ error: 'fullName is required and must be a non-empty string' });
  }

  if (!jobTitle || typeof jobTitle !== 'string' || jobTitle.trim().length === 0) {
    return res.status(400).json({ error: 'jobTitle is required and must be a non-empty string' });
  }

  if (!country || typeof country !== 'string' || country.trim().length === 0) {
    return res.status(400).json({ error: 'country is required and must be a non-empty string' });
  }

  if (salary == null) {
    return res.status(400).json({ error: 'salary is required' });
  }

  const salaryNum = Number(salary);
  if (Number.isNaN(salaryNum) || salaryNum < 0) {
    return res.status(400).json({ error: 'salary must be a non-negative number' });
  }

  next();
}

/**
 * Validation middleware for salary calculation query parameter
 */
function validateSalaryQuery(req, res, next) {
  const grossQ = req.query.gross;

  if (!grossQ) {
    return res.status(400).json({ error: 'gross query parameter is required' });
  }

  const gross = Number(grossQ);
  if (Number.isNaN(gross) || gross < 0) {
    return res.status(400).json({ error: 'gross must be a non-negative number' });
  }

  req.gross = gross;
  next();
}

/**
 * Validation middleware for employee update (allows partial updates)
 */
function validateEmployeeUpdate(req, res, next) {
  const { fullName, jobTitle, country, salary } = req.body;

  if (fullName !== undefined && (typeof fullName !== 'string' || fullName.trim().length === 0)) {
    return res.status(400).json({ error: 'fullName must be a non-empty string' });
  }

  if (jobTitle !== undefined && (typeof jobTitle !== 'string' || jobTitle.trim().length === 0)) {
    return res.status(400).json({ error: 'jobTitle must be a non-empty string' });
  }

  if (country !== undefined && (typeof country !== 'string' || country.trim().length === 0)) {
    return res.status(400).json({ error: 'country must be a non-empty string' });
  }

  if (salary !== undefined) {
    const salaryNum = Number(salary);
    if (Number.isNaN(salaryNum) || salaryNum < 0) {
      return res.status(400).json({ error: 'salary must be a non-negative number' });
    }
  }

  next();
}

/**
 * Validation middleware for ID parameter
 */
function validateId(req, res, next) {
  const id = Number(req.params.id);
  
  if (Number.isNaN(id) || id <= 0 || !Number.isInteger(id)) {
    return res.status(400).json({ error: 'Invalid ID parameter' });
  }

  req.params.id = id;
  next();
}

module.exports = {
  validateEmployee,
  validateEmployeeUpdate,
  validateSalaryQuery,
  validateId
};

