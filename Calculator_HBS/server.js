const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const calculator = require("./caculator.js");
const hbs = require("express-handlebars");

app.engine(".hbs", hbs.engine({
    extname: "hbs",
    defaultLayout: "main",
    layoutsDir: "views/layouts/",
  })
);

app.set("view engine", ".hbs");
app.set("views", "./views");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname));

app.get("/", function (req, res) {
  res.render("main");
});

app.post("/", (req, res) => {
  const num1 = Number(req.body.num1);
  const num2 = Number(req.body.num2);
  const operator = req.body.operator;

  let result,op;

  switch (operator) {
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
      op = "/";
      break;
    default:
      result = "Invalid operator";
  }

  console.log(`${num1} ${num2} ${operator}`);

  res.render("main", {
    num1,
    num2,
    operator,
    result,
  });
});

app.listen(8080, () => {
  console.log("http://localhost:8080");
});
