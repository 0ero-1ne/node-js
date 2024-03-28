"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_http_1 = require("passport-http");
const users_1 = __importDefault(require("./users"));
passport_1.default.use(new passport_http_1.BasicStrategy(function (_username, _password, done) {
    try {
        const user = users_1.default.find(user => user.username === _username);
        if (!user)
            return done(null, false);
        if ((user === null || user === void 0 ? void 0 : user.password) !== _password)
            return done(null, false);
        return done(null, user);
    }
    catch (err) {
        done(err);
    }
}));
passport_1.default.serializeUser((_user, done) => {
    done(null, _user);
});
passport_1.default.deserializeUser((_user, done) => {
    const user = users_1.default.find(user => (user === null || user === void 0 ? void 0 : user.username) === (_user === null || _user === void 0 ? void 0 : _user.username));
    done(null, user);
});
exports.default = passport_1.default;
