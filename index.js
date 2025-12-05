// const express = require('express');
// const app = express();
// // const employeesRouter = require('../routes/employees');
// const employeesRouter = require('./src/routes/employees');

// const prisma = require('./prismaClient')


// app.use(express.json());
// app.use('/employees', employeesRouter);


// // metrics
// const { metricsByCountry, avgByJobTitle } = require('./src/controllers/employeeController');
// app.get('/metrics/country/:country', metricsByCountry);
// app.get('/metrics/job/:jobTitle', avgByJobTitle);


// // health
// app.get('/health', (req, res) => res.json({ ok: true }));


// const port = process.env.PORT || 3000;
// app.listen(port, async () => {
// console.log(`Server running on http://localhost:${port}`);
// // ensure DB connection
// try { await prisma.$connect(); console.log('Connected to DB'); } catch(e) { console.error(e); }
// });


// module.exports = app; // exported for tests



const express = require('express');
const app = express();
const employeesRouter = require('./src/routes/employees');
const prisma = require('./prismaClient');

app.use(express.json());
app.use('/employees', employeesRouter);

// metrics
const { metricsByCountry, avgByJobTitle } = require('./src/controllers/employeeController');
app.get('/metrics/country/:country', metricsByCountry);
app.get('/metrics/job/:jobTitle', avgByJobTitle);

// health
app.get('/health', (req, res) => res.json({ ok: true }));

// Start server ONLY if not running tests
if (process.env.NODE_ENV !== 'test') {
  const port = process.env.PORT || 3000;
  app.listen(port, async () => {
    console.log(`Server running on http://localhost:${port}`);
    try {
      await prisma.$connect();
      console.log('Connected to DB');
    } catch (e) {
      console.error(e);
    }
  });
}

module.exports = app;
