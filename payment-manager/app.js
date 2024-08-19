require("dotenv").config();
const PORT = process.env.PORT || 3000;
const express = require("express");
const { UserController } = require("./controllers/UserController");
const { LoginValidation } = require("./middlewares/authentication");
const { TransactionController } = require("./controllers/TransactionController");
const { UserManagementController } = require("./controllers/UserManagement");

const app = express()
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/trydocker', (req, res) => res.send("hello docker"))


app.post('/register', UserController.register)
app.post('/login', UserController.login)

app.use(LoginValidation.authentication);

app.post('/addAccount', UserManagementController.addAccount)

app.get('/', TransactionController.getAllAcc)
app.post('/send', TransactionController.send)
app.post('/withdraw', TransactionController.withdraw)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})



