const { Helpers } = require("../helpers/Helpers");
const prisma = require("../prismaClient");

class TransactionController {
  static async checkToken(token, senderId) {
    let userId = req.user.id
    let sender = await prisma.account.findUnique({
      where: {
        id: senderId,
        userId
      },
    });
    if (!sender) throw "Source account not found";

    token = Helpers.comparedPassword(token, sender.token);
    if (!token) throw "Invalid Token";

    return sender;
  }

  static async getAllAcc(req, res) {
    const user = await prisma.account.findMany({
      where: {
        userId: req.user.id,
      },
      include: {
        sentTxns: true,
        receivedTxns: true,
      },
    });

    res.status(200).json(user);
  }

  static async send(req, res) {
    try {
      let {
        transactionAmount,
        receiverId,
        senderId,
        currency,
        transactionType,
        description,
        token,
      } = req.body;

      transactionAmount = +transactionAmount;
      receiverId = +receiverId;
      senderId = +senderId;

      if (senderId === receiverId) throw "You cant send money to your account";

      if (!transactionAmount) throw "Input your amount";

      let sender = await TransactionController.checkToken(token, senderId);
      if (!sender) throw "Invalid Token";

      if (sender.accountBalance < transactionAmount)
        throw "Insufficient funds in the source account to complete the transaction.";

      let receiver = await prisma.account.findUnique({
        where: {
          id: receiverId,
        },
      });
      if (!receiver) throw "Receiver account not found";

      let transaction = await prisma.transaction.create({
        data: {
          transactionAmount,
          currency,
          receiverId,
          senderId,
          transactionType,
          description,
        },
      });

      await new Promise(async (resolve, reject) => {
        try {
          sender = await prisma.account.update({
            where: {
              id: sender.id,
            },
            data: {
              accountBalance: {
                decrement: transactionAmount,
              },
            },
          });

          receiver = await prisma.account.update({
            where: {
              id: receiverId,
            },
            data: {
              accountBalance: {
                increment: transactionAmount,
              },
            },
          });

          transaction = await prisma.transaction.update({
            where: {
              id: transaction.id,
            },
            data: {
              status: "completed",
            },
          });

          setTimeout(() => {
            console.log("Transaction processing completed");
            resolve();
          }, 10000);
        } catch (error) {
          reject(error);
        }
      });

      res
        .status(200)
        .json({ message: "transaction send process completed", transaction });
    } catch (error) {
      console.error("Transaction processing failed:", error);
      if (error.name === "PrismaClientKnownRequestError") {
        return res.status(400).json({ errMessage: `Account not found`, error });
      }
      res
        .status(400)
        .json({ errMessage: `transaction processing failed`, error });
    }
  }

  static async withdraw(req, res) {
    try {
      let { withdrawAmount, accountId, transactionType, currency } = req.body;
      accountId = +accountId;
      withdrawAmount = +withdrawAmount;
      let userId = req.user.id

      if (!withdrawAmount) throw "Input amount that you want to withdraw";

      let currentAccount = await prisma.account.findUnique({
        where: {
          id: accountId,
          userId
        },
      });
      if (!currentAccount) throw "Account not found";

      if (currentAccount.accountBalance < withdrawAmount)
        throw "Insufficient funds to make this withdrawal";

      let transaction = await prisma.transaction.create({
        data: {
          transactionType,
          receiverId: currentAccount.id,
          senderId: currentAccount.id,
          currency,
          transactionAmount: withdrawAmount,
        },
      });

      await new Promise(async (resolve, reject) => {
        try {
          await prisma.account.update({
            where: {
              id: accountId,
            },
            data: {
              accountBalance: {
                decrement: withdrawAmount,
              },
            },
          });

          transaction = await prisma.transaction.update({
            where: {
              id: transaction.id,
            },
            data: {
              status: "Completed",
            },
          });

          setTimeout(() => {
            console.log("Transaction processing completed");
            resolve();
          }, 10000);
        } catch (error) {
          reject(error);
        }
      });

      res.status(200).json({
        message: "Transaction withdrawal process completed",
        transaction,
      });
    } catch (error) {
      console.error("Transaction processing failed:", error);
      res
        .status(400)
        .json({ errMessage: `transaction processing failed`, error });
    }
  }
}

module.exports = { TransactionController };
