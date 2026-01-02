import jwt from 'jsonwebtoken'

const generateToken = (res, userId) => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined in environment variables. Please add it to your .env file and restart the server.');
    }
    
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn: "30d"})

    res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV != 'development',
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000
    })

    return token 

}

export default generateToken;
