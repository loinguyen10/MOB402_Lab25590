const express = require('express');
const bodyParser = require('body-parser');
const calculator = require('./tinhtoan.js');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/', (req, res) => {
  const num1 = parseInt(req.body.num1);
  const num2 = parseInt(req.body.num2);

  let result,op;

  switch (req.body.operator) {
    case "add":
      result = calculator.add(num1, num2);
      op = "+";
      break;
    case "subtract":
      result = calculator.subtract(num1, num2);
      op = "-";
      break;
    case "multiply":
      result = calculator.multiply(num1, num2);
      op = "*";
      break;
    case "divide":
      try {
        result = calculator.divide(num1, num2);
      } catch (error) {
        result = error.message;
      }

      op = "+";
      break;
    default:
      result = "Invalid operator";
  }

  res.send(`<p>${num1} ${op} ${num2} = ${result}</p>`);
});

app.listen(8080);