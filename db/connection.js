const mysql = require("mysql2")


const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Sedona3131&",
    database: "employee_tracker"

})

connection.connect((error) => {
    if (error) throw error
})

module.exports = connection;