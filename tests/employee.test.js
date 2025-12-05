const request = require("supertest");
const app = require("../index");

const prisma = require("../src/config/database");

beforeAll(async () => {
  await prisma.$connect();
  await prisma.employee.deleteMany(); // clean DB before tests
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe("Employee API Tests", () => {

  let employeeId;

  // CREATE EMPLOYEE
  test("POST /employees - should create an employee", async () => {
    const res = await request(app)
      .post("/employees")
      .send({
        fullName: "John Doe",
        jobTitle: "Software Engineer",
        country: "India",
        salary: 50000
      });
    
    expect(res.statusCode).toBe(201);
    expect(res.body.fullName).toBe("John Doe");
    employeeId = res.body.id;
  });

  // GET ALL EMPLOYEES
  test("GET /employees - should return employees", async () => {
    const res = await request(app).get("/employees");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  // GET SINGLE EMPLOYEE
  test("GET /employees/:id - should return single employee", async () => {
    const res = await request(app).get(`/employees/${employeeId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.id).toBe(employeeId);
  });

  // UPDATE EMPLOYEE
  test("PUT /employees/:id - should update employee", async () => {
    const res = await request(app)
      .put(`/employees/${employeeId}`)
      .send({ fullName: "Updated User" });

    expect(res.statusCode).toBe(200);
    expect(res.body.fullName).toBe("Updated User");
  });

  // SALARY CALCULATION
  test("GET /employees/:id/salary - should calculate salary", async () => {
    const res = await request(app).get(`/employees/${employeeId}/salary?gross=100000`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("net");
    expect(res.body).toHaveProperty("tds");
  });

  // METRICS BY COUNTRY
  test("GET /employees/metrics/country/:country - should return metrics", async () => {
    const res = await request(app).get(`/employees/metrics/country/India`);
    
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("min");
    expect(res.body).toHaveProperty("max");
    expect(res.body).toHaveProperty("avg");
  });

  // METRICS BY JOB
  test("GET /employees/metrics/job-title/:title - should return avg salary for job", async () => {
    const res = await request(app).get(`/employees/metrics/job-title/Software Engineer`);
    
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("avg");
  });

  // NEW ENDPOINT: Salary grouping by country
  test("GET /employees/country/:country - should return salary report", async () => {
    const res = await request(app).get(`/employees/country/India`);
    
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("minSalary");
    expect(res.body).toHaveProperty("maxSalary");
    expect(res.body).toHaveProperty("avgSalary");
  });

  // NEW ENDPOINT: Salary report by job
  test("GET /employees/job/:jobTitle - should return salary report for job", async () => {
    const res = await request(app).get(`/employees/job/Software Engineer`);
    
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("averageSalary");
  });

  // DELETE EMPLOYEE
  test("DELETE /employees/:id - should delete employee", async () => {
    const res = await request(app).delete(`/employees/${employeeId}`);
    expect(res.statusCode).toBe(204);
  });

  // GET NON-EXISTING EMPLOYEE
  test("GET /employees/:id - return 404 if not found", async () => {
    const res = await request(app).get(`/employees/999999`);
    expect(res.statusCode).toBe(404);
  });

});


