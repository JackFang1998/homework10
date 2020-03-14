var express = require("express");
var exphbs = require("express-handlebars");
var inquirer = require("inquirer");
var mysql = require("mysql");
var consoletable = require("console.table");

var app = express();

//the initization tool for connecting with mysql
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "company_db"
});
connection.connect(function(err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }

  console.log("connected as id " + connection.threadId);
});

const Option = [
  "View Departments",
  "View Roles",
  "View Employees",
  "Update Employee",
  "Delete Employee",
  "Add Employee",
  "Add Department",
  "Add Role",
  "Delete Role",
  "Delete Department",
  "Exit"
];

function start() {
  console.log("let's start");

  inquirer
    .prompt({
      name: "start",
      type: "list",
      message: "what would you like to do?",
      choices: Option
    })

    .then(function(res) {
      switch (res.start) {
        case Option[0]:
          viewDepartments();
          break;
        case Option[1]:
          viewRoles();
          break;
        case Option[2]:
          viewEmployees();
          break;
        case Option[3]:
          updateEmployee();
          break;
        case Option[4]:
          deleteEmployee();
          break;
        case Option[5]:
          addEmployee();
          break;
        case Option[6]:
          addDepartment();
          break;
        case Option[7]:
          addRole();
          break;
        case Option[8]:
          deleteRole();
          break;
        case Option[9]:
          deleteDepartment();
          break;
        case Option[10]:
          console.log("the check and update is complete");
          connection.end();
          break;
      }
    });
}

function viewDepartments() {
  //the section for displaying the department table
  let sql = "SELECT * FROM department";
  connection.query(sql, function(err, res) {
    if (err) throw err;
    console.table(res);
    start();
  });
}
function viewRoles() {
  //the section for displaying role table
  let sql = "SELECT * FROM role";
  connection.query(sql, function(err, res) {
    if (err) throw err;
    console.table(res);
    start();
  });
}
function viewEmployees() {
  //the section for displayinh the Employee table
  let sql = "SELECT*FROM employee";
  connection.query(sql, function(err, res) {
    if (err) throw err;
    console.table(res);
    start();
  });
}

function updateEmployee() {
  function update() {
    connection.query("SELECT * FROM employee", function(err, res) {
      console.log(res);
      var employeeList = [];
      for (var i = 0; i < res.length; i++) {
        employeeList.push(res[i].first_name);
      }
      inquirer
        .prompt([
          {
            name: "update",
            type: "list",
            message: "Which employee do you want to update?",
            choices: employeeList
          },
          {
            name: "updateOptions",
            type: "list",
            message: "What would you like to update?",
            choices: ["Role", "Manager"]
          }
        ])
        .then(function(answer) {
          connection.query("SELECT * FROM role", function(err, resRole) {
            console.log(resRole);
            var roleList = [];
            for (var i = 0; i < resRole.length; i++) {
              roleList.push(resRole[i].title);
            }
            inquirer
              .prompt({
                name: "roleUpdate",
                type: "list",
                message: "what is the new role",
                choices: roleList
              })
              .then(function(roleAnswer) {
                console.log(roleAnswer);
                var roleID;
                var empID;
                for (var i = 0; i < res.length; i++) {
                  if (answer.update === res[i].first_name) {
                    empID = res[i].first_name;
                    console.log(empID);
                  }
                }
                for (var i = 0; i < resRole.length; i++) {
                  if (roleAnswer.roleUpdate === resRole[i].title) {
                    roleID = resRole[i].id;
                    console.log(roleID);
                  }
                  connection.query(
                    "UPDATE employee SET rold_id = ? WHERE first_name = ?",
                    [roleID, empID],
                    function(err, res) {
                      console.log(res);
                    }
                  );
                }
              });
          });
        });
    });
  }
  update();
  start();
}

function addEmployee() {
  //adding a employee function
  connection.query("SELECT * FROM role", function(err, res) {
    //selectiing all the role
    console.log(err, res); //presenting the data
    var selectRole = []; //making a empty array
    for (var i = 0; i < res.length; i++) {
      selectRole.push(res[i].title); //putting table into the emoty array
    }
    inquirer
      .prompt([
        {
          name: "firstName", ///question
          type: "input",
          message: "What's your employees' first name?"
        },
        {
          name: "lastName", //question
          type: "input",
          message: "What's your employees' last name?"
        },
        {
          name: "employeeRole", //question
          type: "list",
          message: "What is this employees' role?",
          choices: selectRole
        }
      ])
      .then(function(answer) {
        console.log(answer); //presenting user's choice
        var roleid;
        for (var i = 0; i < res.length; i++) {
          //going through role to find out user's input role
          if (answer.employeeRole === res[i].title) {
            roleid = res[i].id;
          }
        }
        connection.query(
          "INSERT INTO employee(first_name, last_name, rold_id, manager_id) VALUES(?, ?, ?, ?)",
          [answer.firstName, answer.lastName, roleid, 1],
          function(err, res) {
            console.log(res);
            start();
          }
        );
      });
  });
}

function addRole() {
  inquirer
    .prompt([
      {
        name: "title", ///question
        type: "input",
        message: "What's the title of the role?"
      },
      {
        name: "salary", //question
        type: "input",
        message: "What's the salary of the role?"
      },
      {
        name: "department_id", //question
        type: "input",
        message: "What is the department id of the role?"
      }
    ])
    .then(function(answer) {
      connection.query(
        "INSERT INTO role(title, salary, department_id) VALUES(?, ?, ?)",
        [answer.title, answer.salary, answer.department_id],
        function(err, res) {
          console.log(res);
          start();
        }
      );
    });
}
function addDepartment() {
  inquirer
    .prompt([
      {
        name: "name", ///question
        type: "input",
        message: "What's the name of the department?"
      }
    ])
    .then(function(ans) {
      connection.query(
        "INSERT INTO department(name)VALUES(?)",
        [ans.name],
        function() {
          start();
        }
      );
    });
}
start();
