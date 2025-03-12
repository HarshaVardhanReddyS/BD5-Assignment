const express = require("express");
const { sequelize } = require("./lib/index.js");
const cors = require("cors");
const {
  department,
  employeeDepartment,
  employeeRole,
  role,
  employee,
} = require("./models/models.js");

const {
  getEmployeeDepartments,
  getEmployeeRoles,
  getEmployeeDetails,
} = require("./helperFunctions.js");

const app = express();
app.use(express.json());
app.use(cors());
// app.use(
//   cors({
//     origin: '*',
//     methods: ['GET', 'POST', 'PUT', 'DELETE'],
//     allowedHeaders: ['Content-Type', 'Authorization'],
//   })
// );
// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', 'https://stackblitz.com');
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//   res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
//   next();
// });
const port = 3010;

app.get("/", async (req, res) => {
  console.log("Hello");
  // console.log(await sequelize.getQueryInterface().showAllTables())
  return res.status(200).json({ message: "ok" });
  // console.log(await getEmployeeDepartments(0));
});

// Endpoint to seed database
app.get("/seed_db", async (req, res) => {
  try {
    await sequelize.sync({ force: true });

    const departments = await department.bulkCreate([
      { name: "Engineering" },
      { name: "Marketing" },
    ]);

    const roles = await role.bulkCreate([
      { title: "Software Engineer" },
      { title: "Marketing Specialist" },
      { title: "Product Manager" },
    ]);

    const employees = await employee.bulkCreate([
      { name: "Rahul Sharma", email: "rahul.sharma@example.com" },
      { name: "Priya Singh", email: "priya.singh@example.com" },
      { name: "Ankit Verma", email: "ankit.verma@example.com" },
    ]);

    // Associate employees with departments and roles using create method on junction models
    await employeeDepartment.create({
      employeeId: employees[0].id,
      departmentId: departments[0].id,
    });
    await employeeRole.create({
      employeeId: employees[0].id,
      roleId: roles[0].id,
    });

    await employeeDepartment.create({
      employeeId: employees[1].id,
      departmentId: departments[1].id,
    });
    await employeeRole.create({
      employeeId: employees[1].id,
      roleId: roles[1].id,
    });

    await employeeDepartment.create({
      employeeId: employees[2].id,
      departmentId: departments[0].id,
    });
    await employeeRole.create({
      employeeId: employees[2].id,
      roleId: roles[2].id,
    });

    return res.status(200).json({ message: "Database seeded!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get("/employees", async (req, res) => {
  try {
    let employeeData = await employee.findAll();
    let employeesArr = [];
    for (let emp of employeeData) {
      employeesArr.push(await getEmployeeDetails(emp));
    }
    res.status(200).json({ employees: employeesArr });
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message, stackTrace: error.stackTrace });
  }
});

app.get("/employees/details/:id", async (req, res) => {
  try {
    let id = req.params.id;
    let employeeData = await employee.findOne({ where: { id: id } });
    let emp = await getEmployeeDetails(employeeData);
    res.status(200).json({ employee: emp });
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message, stackTrace: error.stackTrace });
  }
});

app.get("/employees/department/:id", async (req, res) => {
  try {
    let id = req.params.id;
    let employeeDpt = await employeeDepartment.findAll({
      where: { departmentId: id },
    });
    let employeeArr = [];
    // console.log('employeeDpt : ', employeeDpt);
    // let i = 1;
    for (let emp of employeeDpt) {
      let employeeData = await employee.findOne({
        where: { id: emp.departmentId },
      });
      // console.log('emp : ', i, ' : ', emp);
      // i++;
      employeeArr.push(await getEmployeeDetails(employeeData));
    }
    res.status(200).json({ employee: employeeArr });
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message, stackTrace: error.stackTrace });
  }
});

app.get("/employees/role/:id", async (req, res) => {
  try {
    let id = req.params.id;
    let empRole = await employeeRole.findAll({
      where: { roleId: id },
    });
    let employeeArr = [];

    let i = 1;
    for (let emp of empRole) {
      let employeeData = await employee.findOne({
        where: { id: emp.roleId },
      });

      employeeArr.push(await getEmployeeDetails(employeeData));
    }
    res.status(200).json({ employee: employeeArr });
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message, stackTrace: error.stackTrace });
  }
});

app.get("/employees/sort-by-name", async (req, res) => {
  try {
    let order = req.query.order;

    // let employeeArr = [];
    let employeeData = await employee.findAll({});

    // this logic works. Provided by chatgpt and pretty much most of the llms
    // if (order === 'asc') {
    //   employeeData = employeeData.sort((a, b) => a.name.localeCompare(b.name));
    //   res.status(200).json({ employee: employeeData });
    // } else if (order === 'desc') {
    //   employeeData = employeeData.sort((a, b) => b.name.localeCompare(a.name));
    //   res.status(200).json({ employee: employeeData });
    // }

    // alternate logic. My logic
    if (order === "asc") {
      employeeData = employeeData.sort((a, b) => {
        return a.name[0].charCodeAt() < b.name[0].charCodeAt() ? -1 : 1;
      });
      res.status(200).json({ employee: employeeData });
    } else if (order === "desc") {
      employeeData = employeeData.sort((a, b) => {
        return a.name[0].charCodeAt() < b.name[0].charCodeAt() ? 1 : -1;
      });
      res.status(200).json({ employee: employeeData });
    }

    // res.status(200).json({ employee: employeeData });
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message, stackTrace: error.stackTrace });
  }
});

app.post("/employee/new", async (req, res) => {
  try {
    metadata = req.body;
    console.log("metadata : ", metadata);
    employee.create({
      name: req.body.name,
      email: req.body.email,
    });
    const emp = await employee.findOne({
      where: { name: req.body.name, email: req.body.email },
    });
    const empDepartment = await getEmployeeDepartments(req.body.departmentId);
    const empRole = await getEmployeeRoles(req.body.roleId);
    let result = {
      ...emp.dataValues,
      empDepartment,
      empRole,
    };
    res.status(500).json(result);
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message, stackTrace: error.stackTrace });
  }
});

app.post("/employees/update/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { name, email, departmentId, roleId } = req.body;
    if (id !== undefined && id !== null) {
      if (
        name !== undefined &&
        name !== null &&
        email !== undefined &&
        email !== null
      ) {
        employee.update({ name: name, email: email }, { where: { id: id } });
      } else if (name !== undefined && name !== null) {
        employee.update({ name: name }, { where: { id: id } });
      } else if (email !== undefined && email !== null) {
        employee.update({ email: email }, { where: { id: id } });
      }

      if (departmentId !== undefined && departmentId !== null) {
        employeeDepartment.update(
          { departmentId: departmentId },
          { where: { employeeId: id } },
        );
      }

      if (roleId !== undefined && roleId !== null) {
        employeeRole.update({ roleId: roleId }, { where: { employeeId: id } });
      }

      const emp = await employee.findOne({
        where: { id: id },
      });

      const updatedResult = await getEmployeeDetails(emp);

      res.status(200).json({ employee: updatedResult });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message, stackTrace: error.stackTrace });
  }
});

app.delete("/employees/delete", async (req, res) => {
  const { id } = req.body;

  await employee
    .destroy({ where: { id: id } })
    .then(() => {
      res.status(200).json({ message: "User deleted successfully" });
    })
    .catch((error) => {
      res.status(500).json({ message: error.message });
    });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
