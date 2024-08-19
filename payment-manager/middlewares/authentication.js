const { Helpers } = require("../helpers/Helpers");
const prisma = require("../prismaClient");

class LoginValidation {
    static async authentication(req, res, next) {
        try {
            const { authorization } = req.headers;
            if(!authorization){
                throw "Access denied"
            }

            const [type, token] = authorization.split(" ");
            if (type !== "Bearer") {
                throw { name: "LoginValidation" };
              }
          
              const { id } = Helpers.verifyToken(token);
          
              const user = await prisma.user.findUnique({
                where: {id},
                select: {
                    id: true,
                    email: true,
                }
            });
              
              if (!user) {
                throw { name: "LoginValidation" };
              }
          
              req.user = user;
          
              next();
        } catch (error) {
            res.status(400).json({errorMessage: error})
        }
    }
}

module.exports = { LoginValidation }