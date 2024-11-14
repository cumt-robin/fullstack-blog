const jwt = require("jsonwebtoken");
const config = require("../config");

const parseToken = (req) =>
    new Promise((resolve, reject) => {
        const token = req.headers.authorization ? req.headers.authorization.replace("Bearer ", "") : undefined;
        if (token) {
            jwt.verify(token, config.jwt.secret, (err, payload) => {
                if (err) {
                    resolve(null);
                } else {
                    resolve(payload);
                }
            });
        }
        resolve(null);
    });

module.exports = {
    parseToken,
};
