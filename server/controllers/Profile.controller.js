const Profile = require("../models/Profile.model");
const User = require("../models/User.model");
const Course = require("../models/Course.model");

exports.updateProfile = async (req, res) => {
  try {
    //get data
    const { dateOfBirth = "", about = "", contactNumber, gender } = req.body;

    //get userId
    const id = req.user.id;

    //data validation
    if (!contactNumber || !gender) {
      return res.status(400).json({
        success: false,
        message: "all fileds are required",
      });
    }

    //find profile
    const userDetails = await User.findById(id);
    const profileId = userDetails.additionalDetails;
    const profileDetails = await Profile.findById(profileId);

    //update profile
    profileDetails.dateOfBirth = dateOfBirth;
    profileDetails.about = about;
    profileDetails.gender = gender;
    profileDetails.contactNumber = contactNumber;

    await profileDetails.save();

    //return resopnse
    return res.status(200).json({
      success: true,
      message: "Profile Updated successfully",
      profileDetails,
    });
  } catch (error) {
    console.log("erro rupdating profile", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    const id = req.user.id;
    console.log(id);
    const user = await User.findById({ _id: id });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    // Delete Assosiated Profile with the User
    await Profile.findByIdAndDelete({
      _id: new mongoose.Types.ObjectId(user.additionalDetails),
    });
    for (const courseId of user.courses) {
      await Course.findByIdAndUpdate(
        courseId,
        { $pull: { studentsEnroled: id } },
        { new: true }
      );
    }
    // Now Delete User
    await User.findByIdAndDelete({ _id: id });
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
    await CourseProgress.deleteMany({ userId: id });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "User Cannot be deleted successfully" });
  }
};

exports.getAllUserDetails = async (req, res) => {
  try {
    const id = req.user.id;

    const userDetails = await User.findById(id)
      .populate("additionalDetails")
      .exec();

    return res.status(200).json({
      success: true,
      message: "User Data fetched successfullly",
      userDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
