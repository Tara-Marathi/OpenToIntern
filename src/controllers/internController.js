const internModel = require("../models/internModel");
const collegeModel = require("../models/collegeModel");

const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0;
  };

const isValid = function (value) {
    if (typeof value === "undefined" || value === null) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    return true;
  };


const createIntern = async function (req, res) {
    try {
        //Reading input from req.body
        const requestBody = req.body;
  
        if (!isValidRequestBody(requestBody)) {
            return res.status(400).send({
              status: false,
              message: "Invalid request parameter, please provide required Details",
            });
          }
        //assigning values to multiple variables
        const { name, email, mobile, collegeName } = requestBody;

        if (!isValid(name)) {
            return res.status(400).send({ status: false, message: " name required" });
        }

        if (!isValid(email)) {
            return res.status(400).send({ status: false, message: " email required" });
        }

        if (!isValid(mobile)) {
            return res.status(400).send({ status: false, message: " mobile required" });
        }

        if (!isValid(collegeName)) {
            return res.status(400).send({ status: false, message: " collegeName required" });
        }
        
        // check email is valid or not
        const isValidEmail = /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(email);
        if (!isValidEmail) {
            return res.status(400).send({ status: false, msg: "Invalid email address" })
        }

        // check email is already used
        const isEmailUsed = await internModel.findOne({ email });
        if (isEmailUsed) {
            return res.status(400).send({ status: false, msg: `${email} email address is already registered` })
        }

        //check mobile number is valid or not
        const isValidNumber = /^\d{10}$/.test(mobile)
        if (!isValidNumber) {
            return res.status(400).send({ status: false, msg: "Invalid mobile number" })
        }

        // check mobile number is already used
        const isMobileUsed = await internModel.findOne({ mobile });
        if (isMobileUsed) {
            return res.status(400).send({ status: false, msg: `${mobile} mobile number is already registered` })
        }

        //find college with given college name
        const college = await collegeModel.findOne({ name: collegeName });
        if (!college) {
            return res.status(404).send({ status: false, msg: "college not found" })
        }
        const collegeId = college._id

        //check collegeid is valid objectid
        const isValidCollegeId = /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/.test(collegeId);
        if (!isValidCollegeId) {
            return res.status(400).send({ status: false, msg: "Invalid college id" })
        }

        const intern = { name, email, mobile, collegeId }

        //create intern
        const internData = await internModel.create(intern);
        return res.status(201).send({ status: true, data: internData });
    }
    catch (error) {
        // return a error if any case fail on try block 
        return res.status(500).send({ status: false, msg: error.message })
    }
}

module.exports.createIntern = createIntern;
