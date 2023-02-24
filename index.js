const inquirer = require("inquirer")
const db = require("./db/connection")
require("console.table")
console.log(db)

const mainQuestion = {
    type: "list",
    name: "question1",
    message: "What would you like to do?",
    choices: ["View all employees", "View all roles", "View all departments", "I'm done"] //add more choices before I'm done choice
}

const init = async () => {
    const answers = await inquirer.prompt(mainQuestion)
    switch (answers.question1) {
        case "View all employees":
            viewAllEmployees()
            break
        case "View all roles":
            viewAllRoles()
            break //make these for each choice, call a new/different function to be written later
    }
}

function viewAllEmployees() {
    db.promise().query("SELECT * FROM employee") //from schema
        .then(data => {
            console.table(data[0])
        })
}


init()