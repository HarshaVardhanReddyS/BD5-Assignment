const sqlite3 = require('sqlite3');

const db = new sqlite3.Database('./database.sqlite', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

function readData(sqlQuery, tableName) {
  let sql = sqlQuery; // Replace with your table name

  db.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }

    console.log(tableName, rows);
    // Process the rows
    // rows.forEach((row) => {
    //   console.log(row);
    // });
  });
}

readData('SELECT * FROM departments', 'departments');
readData('SELECT * FROM roles', 'roles');
readData('SELECT * FROM employees', 'employees');
readData('SELECT * FROM employeeRoles', 'employeeRoles');
readData('SELECT * FROM employeeDepartments', 'employeeDepartments');

db.close((err) => {
  if (err) {
    console.error('Error closing database:', err.message);
  } else {
    console.log('Database connection closed.');
  }
});
