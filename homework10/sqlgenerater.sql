DROP DATABASE IF EXISTS company_db;
CREATE DATABASE company_db;
USE company_db;
create table department(
id int auto_increment,
 primary key(id),
name varchar(30)
);
create table employee(
id int auto_increment,
first_name varchar(20),
last_name varchar(20),
rold_id int,
manager_id int
);
create table role(
id int auto_increment,
title varchar(30),
salary varchar(30),
department_id int(20)
);
insert into department(name)
values("johndeere");
insert into department(name)
values("catipiler");
insert into department(name)
values("Toro");
insert into department(name)
values("Bobcat");

insert into employee(first_name, last_name, rold_id, manager_id)
value("Jack","Fang",1,3);
insert into employee(first_name, last_name, rold_id, manager_id)
value("peter","Wang",23,2);

insert into role(title, salary, department_id)
value("engineer",55000,3);
insert into role(title, salary, department_id)
value("manager",70000,2);
