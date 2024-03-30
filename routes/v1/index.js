const router = require("express").Router()

const userController = require("../../controllers/v1/userController.js")
const accountController = require("../../controllers/v1/accountController.js")
const transactionController = require("../../controllers/v1/transactionController.js")

// user
router.post("/users", userController.registerUser)
router.get("/users", userController.getUser)
router.get("/users/:id", userController.getUserDetail)
router.put("/users/:id", userController.editUser)

// bank account
router.post("/accounts", accountController.createAccount)
router.get("/accounts", accountController.getAccounts)
router.get("/accounts/:id", accountController.getAccountsDetail)
router.put("/accounts/:id", accountController.editAccount)
router.delete("/accounts/:id", accountController.deleteAccount)


// transaction
router.post("/transactions", transactionController.createTransaction)
router.get("/transactions", transactionController.getAllTransaction)
router.get("/transactions/:id", transactionController.getTransactionDetail)

module.exports = router
