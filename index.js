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
function addEmployee() {
    db.promise().query("SELECT * FROM role") //from schema
        .then(roleData => {
            db.promise().query("SELECT * FROM employee") //from schema
                .then(employeeData => {
                    const roleChoices = roleData[0].map(role => ({ name: role.title, value: role.id }))
                    const employeeChoices = employeeData[0].map(employee => ({ name: employee.firstName + " " + employee.lastName, value: employee.id }))
                    const addEmployeeQuestions = [
                        {
                            type: "input",
                            name: "firstName",
                            message: "What is the employee's first name?"
                        },
                        {
                            type: "input",
                            name: "lastName",
                            message: "What is the employee's last name?"
                        },
                        {
                            type: "list",
                            name: "role_id",
                            message: "What is the role of the employee?",
                            choices: roleChoices
                        },
                        {
                            type: "list",
                            name: "manager_id",
                            message: "What is the name of of the employee's manager?",
                            choices: employeeChoices
                        },
                    ]
                    inquirer.prompt(addEmployeeQuestions)
                        .then(answers => {
                            return db.promise().query("INSERT INTO employee SET ?", answers)
                        })
                        .then(() => {
                            init()
                        })
                })

        })
}

function updateEmployee() {
    db.promise().query("SELECT * FROM role") //from schema
        .then(roleData => {
            db.promise().query("SELECT * FROM employee") //from schema
                .then(employeeData => {
                    const roleChoices = roleData[0].map(role => ({ name: role.title, value: role.id }))
                    const employeeChoices = employeeData[0].map(employee => ({ name: employee.firstName + " " + employee.lastName, value: employee.id }))
                    const updateEmployeeQuestions = [
                        {
                            type: "list",
                            name: "id",
                            message: "Which employee would you like to update?",
                            choices: employeeChoices
                        },
                        {
                            type: "list",
                            name: "roleId",
                            message: "Which role should this employee have now?",
                            choices: roleChoices
                        }
                    ]
                    inquirer.prompt(updateEmployeeQuestions)
                        .then(answers => {
                            return db.promise().query("UPDATE employee SET role_id = ? WHERE id = ?", [answers.roleId, answers.id])
                        }).then(() => {
                            init()
                        })
                })
        })
}


function finished() {
    console.log("Goodbye")
    process.exit()

}


init()