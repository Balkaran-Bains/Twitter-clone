import { Notification } from "../models/notification.models.js";
import { User } from "../models/user.models.js";
import { v2 as cloudinary } from "cloudinary";
import bcrypt from "bcryptjs";

const getUserProfile = async(req,res)=>{
    const {username} = req.params;

    try {
        const user = User.findOne({username}).select("-password")

        if (!user) {
            return res.status(400).json({error:"User not found"})
        }

        return res.status(200).json(user)
    } catch (error) {
        console.log("Error in getUserProfile",error.message);
        return res.status(500).json({error:"Internal Server Error"})
    }
}


const getSuggestedUsers = async (req, res) => {
    try {
      // Get the current user's ID from the request object
      const userId = req.user._id;
  
      // Retrieve the list of users followed by the current user
      const usersFollowedByMe = await User.findById(userId).select("following");
  
      // Aggregate a random sample of 10 users, excluding the current user
      const users = await User.aggregate([
        {
          $match: {
            _id: { $ne: userId }, // Exclude the current user
          },
        },
        { $sample: { size: 10 } } // Randomly select 10 users
      ]);
  
      // Filter out the users who are already followed by the current user
      const filteredUsers = users.filter((user) => !usersFollowedByMe.following.includes(user._id));
      
      // Select the first 4 users from the filtered list as suggestions
      const suggestedUsers = filteredUsers.slice(0, 4);
  
      // Remove the password field from each suggested user
      suggestedUsers.forEach((user) => (user.password = null));
  
      // Send the list of suggested users as the response
      res.status(200).json(suggestedUsers);
    } catch (error) {
      // Log the error and send a 500 response in case of an internal server error
      console.log("Error in getSuggestedUsers", error.message);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  };
  


const followUnfollowUser = async(req,res)=>{
    try {
        const {id} = req.params;
        const userToModify = await User.findById(id);
        const currentUser  = await User.findById(req.user._id);

        if (id === req.user._id.toString()) {
            return res.status(400).json({error: "You can't follow/unfollow yourself"})
        }

        if (!userToModify || !currentUser) {
            return res.status(400).json({error:"User not found"})
        }

        const isFollowing = currentUser.following.includes(id)

        if (isFollowing) {
            // Unfollow the user
            await User.findByIdAndUpdate(id, {$pull:{followers:req.user._id}})
            await User.findByIdAndUpdate(req.user._id, {$pull:{following:id}})
            res.status(200).json({message:"user unfollowed successfully"})
        }
        else{
            // Follow the user
            await User.findByIdAndUpdate(id, {$push:{followers:req.user._id}})
            await User.findByIdAndUpdate(req.user._id, {$push:{following:id}})

            // send notification 
            const newNotification = new Notification({
                type: "follow",
                from: req.user._id,
                to: userToModify._id
            });

            await newNotification.save();

            // todo : return the id of the user as a response
            res.status(200).json({message:"user followed successfully"})
        }
    } catch (error) {
        console.log("Error in getUserProfile",error.message);
        return res.status(500).json({error:"Internal Server Error"})
    }
}

const updateUser = async (req, res) => {
    // Destructuring the incoming request body to extract user details
    const { fullname, email, username, currentPassword, newPassword, bio, link } = req.body;
    let { profileImg, coverImg } = req.body;
  
    // Getting the user ID from the authenticated user in the request
    const userId = req.user._id;
  
    try {
      // Finding the user in the database
      let user = await User.findById(userId);
      if (!user) return res.status(404).json({ message: "User not found" });
  
      // Validating password update requirements
      if ((!newPassword && currentPassword) || (!currentPassword && newPassword)) {
        return res.status(400).json({ error: "Please provide both current password and new password" });
      }
  
      // Handling password change
      if (currentPassword && newPassword) {
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) return res.status(400).json({ error: "Current password is incorrect" });
        if (newPassword.length < 6) {
          return res.status(400).json({ error: "Password must be at least 6 characters long" });
        }
  
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
      }
  
      // Handling profile image update
      if (profileImg) {
        if (user.profileImg) {
          await cloudinary.uploader.destroy(user.profileImg.split("/").pop().split(".")[0]);
        }
  
        const uploadedResponse = await cloudinary.uploader.upload(profileImg);
        profileImg = uploadedResponse.secure_url;
      }
  
      // Handling cover image update
      if (coverImg) {
        if (user.coverImg) {
          await cloudinary.uploader.destroy(user.coverImg.split("/").pop().split(".")[0]);
        }
  
        const uploadedResponse = await cloudinary.uploader.upload(coverImg);
        coverImg = uploadedResponse.secure_url;
      }
  
      // Updating user details
      user.fullname = fullname || user.fullname;
      user.email = email || user.email;
      user.username = username || user.username;
      user.bio = bio || user.bio;
      user.link = link || user.link;
      user.profileImg = profileImg || user.profileImg;
      user.coverImg = coverImg || user.coverImg;
  
      // Saving updated user to the database
      user = await user.save();
  
      // Ensuring the password is not included in the response
      user.password = null;
  
      // Sending the updated user object as the response
      return res.status(200).json(user);
    } catch (error) {
      // Logging and returning an error response in case of failure
      console.log("Error in updateUser: ", error.message);
      res.status(500).json({ error: error.message });
    }
  };
  

export{
    getUserProfile,
    getSuggestedUsers,
    followUnfollowUser,
    updateUser
}