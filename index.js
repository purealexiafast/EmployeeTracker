const inquirer = require("inquirer")
const db = require("./db/connection")
require("console.table")

const mainQuestion = {
    type: "list",
    name: "question1",
    message: "What would you like to do?",
    choices: ["View all employees", "View all roles", "View all departments", "Add employee", "Add role", "Add department", "Update employee role", "I'm done"] //add more choices before I'm done choice
}

const addDepartmentQuestion = {
    type: "input",
    name: "questionD",
    message: "What is the name of the department?"
}



const init = async () => {
    const answers = await inquirer.prompt(mainQuestion)
    switch (answers.question1) {
        case "View all employees":
            viewAllEmployees()
            break
        case "View all roles":
            viewAllRoles()
            break
        case "View all departments":
            viewAllDepartments()
            break
        case "Add employee":
            addEmployee()
            break
        case "Add role":
            addRole()
            break
        case "Add department":
            addDepartment()
            break
        case "Update employee role":
            updateEmployee()
            break
        case "I'm done":
            finished()
            break
        //make these for each choice, call a new/different function to be written later
    }
}

function viewAllEmployees() {
    db.promise().query("SELECT * FROM employee") //from schema
        .then(data => {
            console.table(data[0])
            init()
        })
}

function viewAllRoles() {
    db.promise().query("SELECT * FROM role") //from schema
        .then(data => {
            console.table(data[0])
            init()
        })
}

function viewAllDepartments() {
    db.promise().query("SELECT * FROM department") //from schema
        .then(data => {
            console.table(data[0])
            init()
        })
}


function addDepartment() {
    inquirer.prompt(addDepartmentQuestion)
        .then(answer => {

            return db.promise().query("INSERT INTO department SET ?", {
                name: answer.questionD
            })

        }).then(() => {
            init()

        })
}

function addRole() {

    db.promise().query("SELECT * FROM department") //from schema
        .then(data => {
            const choices = data[0].map(department => ({ name: department.name, value: department.id }))


            const addRoleQuestion = [{
                type: "input",
                name: "title",
                message: "What is the name of the role?"
            }, {
                type: "number",
                name: "salary",
                message: "What is the role's salary?",

            },
            {
                type: "list",
                name: "department_id",
                message: "What department does this role belong to?",
                choices: choices
            }]

            inquirer.prompt(addRoleQuestion)
                .then(answers => {
                    console.log(answers)
                    return db.promise().query("INSERT INTO role SET ?", answers)
                })
                .then(() => {
                    init()
                })


        })

}

//create employee, create 2 lists create 2 more functions

function finished() {
    console.log("Goodbye")
    process.exit()

}


init()