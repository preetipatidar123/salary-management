This repository contains a small Express API with Prisma + SQLite that implements:


- Employee CRUD
- Salary calculation (per-country deduction rules)
- Salary metrics endpoints
- Tests with Jest + Supertest


## Quickstart


1. Install dependencies


```bash
npm install
npm run prisma:generate - Generate Prisma client
npm run migrate - Run migrations (this will create prisma/dev.db)
npm run dev - Run the app
npm test - Run tests

2. API endpoints

POST /employees - create employee. Body: { fullName, jobTitle, country, salary }

GET /employees - list

GET /employees/:id - get

PUT /employees/:id - update

DELETE /employees/:id - delete

GET /employees/:id/salary?gross=NUMBER - calculate deductions and net salary based on employee's country

GET /employees/metrics/country/:country - Salary analytics grouped by country (min, max, average)

GET /employees/metrics/job-title/:jobTitle - Average salary based on job title

GET /employees/country/:country - Country-based salary report

GET /employees/job/:jobTitle - Salary report for a job title including employee count