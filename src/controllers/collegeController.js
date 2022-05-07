const collegeModel = require("../models/collegeModel");
const internModel = require("../models/internModel");

const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0;
  };

const isValid = function (value) {
    if (typeof value === "undefined" || value === null) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    return true;
  };


const createCollege = async function(req, res) {
        
    try{
        //Reading inputs from the body
        const collegeData = req.body;
      
        if (!isValidRequestBody(collegeData)) {
            return res.status(400).send({
              status: false,
              message: "Invalid request parameter, please provide required Details",
            });
          }

        //assigning values to multiple variables
        const { name, fullName, logoLink } = collegeData;

        if (!isValid(name)) {
            return res.status(400).send({ status: false, message: "name required" });
        }

        if (!isValid(fullName)) {
            return res.status(400).send({ status: false, message: "fullname required" });
        }

        if (!isValid(logoLink)) {
            return res.status(400).send({ status: false, message: "logolink required" });
        }

        // validate Url
        const validUrl = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/.test(logoLink);
        if(!validUrl) {
            return res.status(400).send({status: false, msg: "Invalid Url"})  
        }

        //check name is already used
        const isNameUsed = await collegeModel.findOne({name:collegeData.name});
        if(isNameUsed)
        {
            return res.status(400).send({status:false,msg:`document for ${name} college is already created`})
        }

        //create college
        const college = await collegeModel.create(collegeData);

        //send created college in response
        return res.status(201).send({status: true, data: college})

    }catch(error){
        // return a error if any case fail on try block 
        return res.status(500).send({status: false, msg: error.message})
    }
}


//get college details for the requested college
const getCollegeDetails = async function (req, res) {
    try{
       
        //Reading collegename from query param
        const collegeName =  req.query.collegeName;

        if (!collegeName || collegeName.trim().length === 0) {
            return res.status(400).send({ status: false, msg: "collegename required" })
        }

        // find college with given collegeName
        const collegeDetails = await collegeModel.findOne({ name: collegeName, isDeleted:false });
        
        if (!collegeDetails) {
            return res.status(404).send({ status: false, message: `${collegeName} college not found`})
        }

        //assigning values to multiple variables
        const { name, fullName, logoLink, _id } = collegeDetails; // destructuring

        //find documents for interests in given college using _id
        const interests = await internModel.find({ collegeId:_id, isDeleted:false}).select({name:1, email:1, mobile:1});

        const internDetails = { name, fullName, logoLink, interests }

        return res.status(200).send({ status: true, data: internDetails })
    }
    catch(error){
        return res.status(500).send({status:false,msg:error.message})
    }
}

//export function
module.exports.createCollege = createCollege;
module.exports.getCollegeDetails = getCollegeDetails;


