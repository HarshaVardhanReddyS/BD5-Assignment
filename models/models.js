const { DataTypes, sequelize } = require('../lib/index.js');

const department = sequelize.define('departments', {
  name: DataTypes.TEXT,
});

const role = sequelize.define('roles', {
  title: DataTypes.TEXT,
});

const employee = sequelize.define('employees', {
  name: DataTypes.TEXT,
  email: DataTypes.TEXT,
});

const employeeRole = sequelize.define('employeeRoles', {
  employeeId: DataTypes.INTEGER,
  roleId: DataTypes.INTEGER,
});

const employeeDepartment = sequelize.define('employeeDepartments', {
  employeeId: DataTypes.INTEGER,
  departmentId: DataTypes.INTEGER,
});

// // Define associations
// employee.belongsToMany(department, {
//   through: employeeDepartment,
//   foreignKey: 'employeeId',
// });
// department.belongsToMany(employee, {
//   through: employeeDepartment,
//   foreignKey: 'departmentId',
// });

// employee.belongsToMany(role, {
//   through: employeeRole,
//   foreignKey: 'employeeId',
// });
// role.belongsToMany(employee, {
//   through: employeeRole,
//   foreignKey: 'roleId',
// });

module.exports = {
  department,
  role,
  employee,
  employeeRole,
  employeeDepartment,
};
