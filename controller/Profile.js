const User = require("../models/user");
const profile = require("../models/profile");

exports.createProfile = async (req, res) => {
  try {
    // data fetch
    const { gender, dateofBirth = "", profession, about = "", contactNumber} = req.body;

    //fetch  id
    const id = req.user.id;

    // validation
    if (!gender || !profession || !contactNumber || !id) {
      return res.status(500).json({
        success: false,
        message: " All fields are required",
      });
    }

    // find details

    const userDetails = await User.findById(id);
    const profileId = userDetails.additionalDetials;
    const profileDetails = await profile.findById(profileId);

    //updateProfiledetails

    profileDetails.gender = gender;
    profileDetails.about = about;
    profileDetails.profession = profession;
    profileDetails.contactNumber = contactNumber;
    profileDetails.dateofBirth = dateofBirth;

    // save the data into db
    await profileDetails.save();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
