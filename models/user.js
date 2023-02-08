const mongoose = require("mongoose");

const Schema = mongoose.Schema
const userSchema = new Schema({
    email: "string",
    password: "string"
});

module.exports = mongoose.model('user', userSchema, 'users')