const Employee = require('../models/employee');

// Show the list of Employees
const index = (req, res, next) => {
  if (req.query.page && req.query.limit) {
    Employee.paginate({}, { page: req.query.page, limit: req.query.limit })
      .then((data) => {
        res.status(200).json({
          data,
        });
      })
      .catch((error) => {
        res.status(400).json({
          error,
        });
      });
  } else {
    Employee.find()
      .then((data) => {
        res.status(200).json({
          data,
        });
      })
      .catch((error) => {
        res.status(400).json({
          error,
        });
      });
  }
};

const show = (req, res, next) => {
  let employeeID = req.body.employeeID;
  Employee.findById(employeeID)
    .then((response) => {
      res.json({
        response,
      });
    })
    .catch((err) => {
      res.json({
        message: 'An error Occured!',
      });
    });
};

// add new employee
const store = (req, res, next) => {
  let employee = new Employee({
    name: req.body.name,
    designation: req.body.designation,
    email: req.body.email,
    phone: req.body.phone,
    age: req.body.age,
  });
  if (req.file) {
    let path = '';
    req.files.forEach(function (files, index, arr) {
      path = path + files.path + ',';
    });
    path = path.substring(0, path.lastIndexOf(','));
    employee.avatar = path;
  }
  employee
    .save()
    .then(() => {
      res.json({
        message: 'Employee Added Successfully!',
      });
    })
    .catch((err) => {
      res.json({
        message: 'An error Occured!',
      });
    });
};

// update an employee
const update = (req, res, next) => {
  let employeeID = req.body.employeeID;

  let updatedData = {
    name: req.body.name,
    designation: req.body.designation,
    email: req.body.email,
    phone: req.body.phone,
    age: req.body.age,
  };

  Employee.findByIdAndUpdate(employeeID, { $set: updatedData })
    .then(() => {
      res.json({
        message: 'Employee updated successfully!',
      });
    })
    .catch((err) => {
      res.json({
        message: 'An error Occured!',
      });
    });
};

// delete an employee
const destroy = (req, res, next) => {
  let employeeID = req.body.employeeID;
  Employee.findByIdAndDelete(employeeID)
    .then(() => {
      res.json({
        message: 'Employee deleted successfully!',
      });
    })
    .catch((err) => {
      res.json({
        message: 'An error Occured!',
      });
    });
};

module.exports = { index, show, store, update, destroy };
