const mongoose = require("mongoose");//import mongoose to create schema

const collegeSchema = new mongoose.Schema({
    name: { type: String, unique: true, required : true,trim:true },

    fullName : { type: String, required: true,trim:true},

    logoLink: { type: String, required: true,trim:true},

    isDeleted: { type: Boolean, default: false}

    },{timestamps: true})

    module.exports = mongoose.model("college", collegeSchema);
    // models are higher order constructors which create document with the help of schema


