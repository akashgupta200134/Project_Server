const User = require("../models/user");
const profile = require("../models/profile");

exports.createProfile = async (req, res) => {
  try {
    // data fetch
    const {
      gender,
      dateofBirth = "",
      profession,
      about = "",
      contactNumber,
    } = req.body;

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

    // return success response
    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      profileDetails,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// delete account
exports.deleteAccount = async (req, res) => {
  try {
    //fetch  id
    const id = req.user.id;
    const userDetails = await User.findById(id);

    // validation
    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // delete account
    await profile.findByIdAndDelete({ _id: userDetails.additionalDetials });

    await User.findByIdAndDelete({ _id: id });

    // return success response
    return res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while deleting user",
    });
  }
};


exports.getuserDetails = async (req, res) => {
  try {

    //fetch  id
    const id = req.user.id;
    const userDetails = await User.findById(id).populate("additionalDetials").exec();

    // validation
    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    };


    // return success response
    return res.status(200).json({
      success: true,
      message: "user details fetched successfully",
    });

  } 
  catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching user details",
    });
  }
};


