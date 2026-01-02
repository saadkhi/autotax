import userModel from '../models/userModel.js';
import asyncHandler from '../middlewares/asyncHandler.js';
import bcrypt from 'bcryptjs';
import generateToken from '../utils/createToken.js';
import User from '../models/userModel.js';

const createUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
    console.log(username, email, password);

    if (!username || !email || !password) {
        throw new Error("please fill all the inputs.")
    }

    // const user = await userModel.create({username, email, password});
    // res.status(201).json({message: "User created successfully", user});

    const userExists = await userModel.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists." });

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    const newUser = new userModel({ username, email, password: hashedPassword });

    try {
        await newUser.save();
        generateToken(res, newUser._id);

        res.status(201)
            .json({ message: "User created successfully", user: newUser });
    } catch (error) {
        res.status(400)
        throw new Error(error.message);
    }
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        res.status(400);
        throw new Error("Please provide email and password.");
    }

    const existingUser = await User.findOne({ email })

    if (!existingUser) {
        res.status(401);
        throw new Error("Invalid email or password.");
    }

    const isPasswordValid = await bcrypt.compare(password, existingUser.password)

    if (!isPasswordValid) {
        res.status(401);
        throw new Error("Invalid email or password.");
    }

    generateToken(res, existingUser._id)

    res.status(200).json({
        _id: existingUser._id,
        username: existingUser.username,
        email: existingUser.email,
        isAdmin: existingUser.isAdmin,
    })
})

const logoutCurrentUser = asyncHandler(async (req, res) => {
    res.cookie("jwt", "", {
      httyOnly: true,
      expires: new Date(0),
    });
  
    res.status(200).json({ message: "Logged out successfully" });
  });
  
  const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({});
    res.json(users);
  });

const getCurrentUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)

    if (user) {
        res.json({
            _id: user._id,
            username: user.username,
            email: user.email
        })
    } else {
        res.status(404)
        throw new Error('User not avaiable')
    }

})

const updateCurrentUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)

    if (user) {
        user.username = req.body.username || user.username
        user.email = req.body.email || user.email


        if (req.body.password) {
            user.password = req.body.password
        }

        const updatedUser = await user.save()

        res.json({
            _id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin
        })
    } else {
        res.status(404);
        throw new Error("user not found")
    }
})

const deleteUserById = asyncHandler(async (req, res) => {
    const user =  await User.findById(req.params.id)

    if (user) {
        if (user.isAdmin) {
            res.status(400);
            throw new Error("Cannot delete admin user")
        }
        await user.deleteOne();
        res.status(200).json({ message: "User deleted successfully" })
    } else {
        res.status(404);
        throw new Error("User not found")
    }

})

const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select('-password')
    
    if (user) {
        res.json(user)
    } else {
        res.status(404);
        throw new Error("User not found")
    }
})

const updateUserById = asyncHandler(async (req, res) => {

    const user = await User.findById(req.params.id)

    if (user) {
        user.username = req.body.username || user.username
        user.email = req.body.email || user.email
        user.isAdmin = Boolean(req.body.isAdmin)

        const updatedUser = await user.save()

        res.json({
            _id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin
        })
    } else {
        res.status(404);
        throw new Error("User not found")

    }

})

export { createUser, loginUser, logoutCurrentUser, getAllUsers, getCurrentUserProfile, updateCurrentUserProfile, deleteUserById, getUserById, updateUserById }
