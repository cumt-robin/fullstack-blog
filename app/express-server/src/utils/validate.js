const { validationResult } = require("express-validator");

class ValidationError extends Error {
    constructor(body) {
        super("Validation Error");
        this.errorBody = body;
        this.statusCode = 400;
    }
}

module.exports.ValidationError = ValidationError;

module.exports.validateInterceptor = (req, res, next) => {
    const errors = validationResult(req);
    console.error(errors);
    if (!errors.isEmpty()) {
        throw new ValidationError({
            msg: "请求有误",
        });
    }
    next();
};
