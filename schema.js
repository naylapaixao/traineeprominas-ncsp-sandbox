var mongoose = require("mongoose");
var schema = mongoose.Schema;

var userSchema = new schema(
    {
        id: {type: Number, require:true, unique: true},
        name: {type: String, require:true},
        lastname: {type: String, require:true},
        profile: {type: String, require:true},
        status: {type: Number, require:true}
    }
);

var User = mongoose.model('User', userSchema);

var teacherSchema = new schema(
    {
        id: {type: Number, require:true, unique:true},
        name: {type: String, require:true},
        lastname: {type: String, require:true},
        phd: {type: Boolean, require:true},
        status: {type: Number, require:true}
    }
);

var Teacher = mongoose.model('Teacher', teacherSchema);

var courseSchema = new schema(
    {
        id: {type: Number, require:true, unique:true},
        name: {type: String, require:true},
        period: {type: String, require:true},
        teacher: {type: Array, require:true},
        city: {type: String, require:true},
        status: {type: Number, require:true}
    }
);

var Course = mongoose.model('Course', courseSchema);

var studentSchema = new schema(
    {
        id: {type: Number, require:true, unique:true},
        name: {type: String, require:true},
        lastname: {type: String, require:true},
        age: {type: Number, require:true},
        course:{type: Array},
        status: {type: Number, require:true}
    }
);

var Student = mongoose.model('Student', studentSchema);




module.exports = mongoose.model('User', userSchema);