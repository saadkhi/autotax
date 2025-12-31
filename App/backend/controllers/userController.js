import userModel from '../models/userModel.js';
import asyncHandler from '../middlewares/asyncHandler.js';

const createUser = asyncHandler(async (req, res) => {
    const {username, email, password} = req.body;
    console.log(username, email, password);

    if (!username || !email || !password) {
        throw new Error("please fill all the inputs.")
    }

    // const user = await userModel.create({username, email, password});
    // res.status(201).json({message: "User created successfully", user});

    const userExists = await userModel.findOne({email});
    if (userExists) return res.status(400).json({message: "User already exists."});

    const newUser = new userModel ({username, email, password});
    
    try {
        await newUser.save();
        res.status(201)
        .json({message: "User created successfully", user: newUser});
    } catch (error) {
        res.status(400)
        throw new Error(error.message);
    }
});


export {createUser}