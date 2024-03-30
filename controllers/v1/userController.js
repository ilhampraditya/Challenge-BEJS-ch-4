const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

module.exports = {
   registerUser: async (req, res) => {
    try {
      const { name, email, password, identity_number, identity_type, address } = req.body
      const existingUser = await prisma.user.findFirst({
        where: {
          email: email
        },
      })

      if (existingUser) {
        return res.status(400).json({
          status: false,
          message: "Email already used!",
        })
      }

      const newUser = await prisma.user.create({
        data: {
          name: name,
          email: email,
          password: password,
          profile: {
            create: {
              identity_number: identity_number,
              identity_type: identity_type,
              address: address
            }
          }
        },
        include: {
          profile: true
        }
      })

      return res.status(200).json({
        status: true,
        message: "User registered successfully",
        data: newUser
      })
    } catch (error) {
      return res.status(500).json({ error: "Internal Server Error" })
    }
  },


  getUser: async (req, res, next) => {
    try {
      let users = await prisma.user.findMany()

      res.status(200).json({
        status: true,
        message: "OK",
        data: users,
      })
    } catch (error) {
      next(error)
    }
  },

  getUserDetail: async (req, res, next) => {
    try {
      let id = Number(req.params.id)

      let user = await prisma.user.findUnique({
        where: { id },
        include: {
          profile: true,
        },
      })

      if (!user) {
        return res.status(400).json({
          status: false,
          message: "Can't find user with id " + id,
          data: null,
        })
      }

      res.status(200).json({
        status: true,
        message: "OK",
        data: user,
      })
    } catch (error) {
      next(error)
    }
  },

  editUser: async (req, res, next) => {
    const id = req.params.id
    const userData = req.body

    if (!(userData.email && userData.name && userData.password)) {
      res.status(400).send("Some field Missing")
      return
    }

    try {
      const user = await prisma.user.update({
        where: {
          id: parseInt(id),
        },
        data: {
          name: userData.name,
          email: userData.email,
          password: userData.password,
        },
      })
      res.json({
        data: user,
        message: "edit user done",
      })
    } catch (error) {
      next(error)
    }
  },
}
