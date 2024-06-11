import { User } from "../models/user.models.js";
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/generateToken.js";

const signup = async (req, res) => {
  try {
    const { username, fullname, password, email } = req.body;

    if (!username || !fullname || !password || !email) {
      return res.status(400).json({
        error: 'Every field is required',
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: 'Invalid email format',
      });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({
        error: 'Username already taken',
      });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({
        error: 'Email already exists',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      fullname,
      username,
      email,
      password: hashPassword,
    });

    generateTokenAndSetCookie(newUser._id, res);

    res.status(201).json({
      _id: newUser._id,
      fullname: newUser.fullname,
      username: newUser.username,
      email: newUser.email,
      followers: newUser.followers,
      following: newUser.following,
      profileImg: newUser.profileImg,
      coverImg: newUser.coverImg,
    });

    
  } catch (error) {
    console.log('Error with SignUp Controller', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const login = async(req,res)=>{
    try {
        const { username, password}= req.body;
        if (!username || !password) {
            res.status(400).json({
                error:"Field is required"
            })
        }

        const user = await User.findOne({username})
            if (!user) {
                res.status(400).json({
                    error:"User not found"
                 }) 
                }
        const isPasswordCorrect = await bcrypt.compare(password,user.password)
                if (!isPasswordCorrect) {
                    res.status(400).json({
                        error:"Incorrect Password"
                     })  
                }
    
        generateTokenAndSetCookie(user._id,res);

        res.status(200).json({
            _id: user._id,
        fullname: user.fullname,
        username: user.username,
        email: user.email,
        followers: user.followers,
        following: user.following,
        profileImg: user.profileImg,
        coverImg: user.coverImg,
        })
        
    } catch (error) {
        console.log("Error with Logni Controller", error.message);
    res.status(500).json({ error: "Internal server error" });
    }
}

const logout = async(req,res)=>{
    try {
        res.cookie("jwt", "",{maxAge:0})
        res.status(200).json({
            message:"Logged out successfully"
        })
    } catch (error) {
        res.status(500).json({
            error:"Internal server error"
        })
    }
}

//get me
const getMe = async(req,res)=>{
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.status(200).json(user)
    
  } catch (error) {
    console.log("Error in getMe controller", error.message);
    return res.status(500).json({error:"Internal Server error"})
  }
}


export {
    signup,
    login,
    logout,
    getMe
}