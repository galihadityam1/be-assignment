const prisma = require("../prismaClient");
const bcrypt = require('bcryptjs');


class UserManagementController {
    static async addAccount(req, res) {
    try {
      let { accountType, token } = req.body;
      const userId = req.user.id;

      if(!token || token.length > 4) throw "Invalid Token"
      token = bcrypt.hashSync(token, bcrypt.genSaltSync(10))

      if(!accountType) accountType = "Savings"

      const account = await prisma.account.create({
        data: {
          accountType,
          userId,
          token
        },
      });

      res.status(200).json({ message: `New account success added`, account });
    } catch (error) {
      console.error("addAccount failed:", error);
      res.status(400).json({ errMessage: `New account failed added` });
    }
  }

}

module.exports = { UserManagementController };
