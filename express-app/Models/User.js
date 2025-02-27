const mongodb_connection = require('mongoose'); //import moongose

const UserSchema = new mongodb_connection.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    age: {type: Number, required: true}
})

module.exports = mongodb_connection.model("User", UserSchema);