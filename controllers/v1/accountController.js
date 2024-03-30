const { PrismaClient } = require("@prisma/client")

const prisma = new PrismaClient()

module.exports = {
  createAccount: async (req, res) => {
    const { bank_name, bank_account_number, balance, user_id } = req.body

    try {
      const existingUser = await prisma.user.findUnique({
        where: { id: parseInt(user_id) },
      })

      if (!existingUser) {
        return res.status(404).json({ error: true, message: "User Not Found" })
      }

      const response = await prisma.bank_account.create({
        data: {
          bank_name: bank_name,
          bank_account_number: bank_account_number,
          balance: BigInt(balance),
          user: {
            connect: { id: parseInt(user_id) },
          },
        },
      })

      const balanceInt = parseInt(balance)

      return res.status(201).json({
        error: false,
        message: "Create account Successfully",
        data: {
          ...response,
          balance: balanceInt,
        },
      })
    } catch (error) {
      return res
        .status(500)
        .json({ error: true, message: "Internal Server Error" })
    }
  },

  getAccounts: async (req, res) => {
    try {
      const accounts = await prisma.bank_account.findMany()

      const response = accounts.map((account) => {
        return {
          ...account,
          balance: parseInt(account.balance),
        }
      })

      return res.status(201).json({
        error: false,
        message: "Fetched data bank account successfully",
        data: response,
      })
    } catch (error) {
      return res
        .status(500)
        .json({ error: true, message: "Internal Server Error" })
    }
  },

  getAccountsDetail: async (req, res) => {
    const id = parseInt(req.params.id)

    try {
      const account = await prisma.bank_account.findUnique({
        where: {
          id: id,
        },
        include: {
          user: true,
        },
      })

      if (!account) {
        return res.status(404).json({ error: "Account not found!" })
      }

      const accountData = {
        id: account.id,
        bank_name: account.bank_name,
        bank_account_number: account.bank_account_number,
        balance: Number(account.balance),
        user: account.user,
      }

      return res.json({
        data: accountData,
        message: "account data find",
      })
    } catch (error) {
      return res.status(500).json({ error: "Error fetching account details!" })
    }
  },

  editAccount: async (req, res) => {
    const id = req.params.id
    const accountData = req.body

    if (
      !(
        accountData.bank_name &&
        accountData.bank_account_number &&
        accountData.balance
      )
    ) {
      res.status(400).send("Some field Missing")
      return
    }

    try {
      const updatedAccount = await prisma.bank_account.update({
        where: {
          id: parseInt(id),
        },
        data: {
          bank_name: accountData.bank_name,
          bank_account_number: accountData.bank_account_number,
          balance: BigInt(accountData.balance),
        },
      })

      // Konversi balance dari BigInt ke number sebelum dikirimkan sebagai respons JSON
      updatedAccount.balance = parseInt(updatedAccount.balance)

      res.json({
        data: updatedAccount,
        message: "edit account done",
      })
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" })
    }
  },

  deleteAccount: async (req, res) => {
    const id = req.params.id

    try {
      await prisma.bank_account.delete({
        where: {
          id: parseInt(id),
        },
      })

      return res.json({
        message: "Bank account deleted",
      })
    } catch (error) {
      return res.status(500).json({ error: "Error deleting bank account!" })
    }
  },
}
