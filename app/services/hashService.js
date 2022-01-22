const bcrypt = require("bcryptjs");

let salt = bcrypt.genSaltSync(10);

exports.hash = (str) => bcrypt.hashSync(str, salt);

exports.compare = (str, passwordHash) => bcrypt.compareSync(str, passwordHash);
