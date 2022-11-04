const createHttpError = require("http-errors");
const { catchAsync } = require("../../helpers/catchAsync");
const { endpointResponse } = require("../../helpers/success");
const { ErrorObject } = require("../../helpers/error");
const { User } = require("../../database/models");


module.exports = {
    deleteUser: catchAsync(async (req, res, next) => {
        try {
            const { id } = req.params;    
            const user = await User.findByPk(id);
    
            if (user != null) {
                const responce = await User.destroy({
                    where: { id }
                })
                endpointResponse({
                    res,
                    message: "User successfully deleted",
                    body: responce,
                  });
            } else {
                throw next(new ErrorObject(" Usuario not found", 400));
            }
    
        } catch (error) {
            const httpError = createHttpError(
                error.statusCode,
                `[Error deleted used] - [User/userDeleteControllers.js - DELETE]: ${error.message}`
              );
              next(httpError);
        }

    })
  };
  