const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateToken = async (user,req) => {
    try{
        if (!process.env.JWT_SECRET) {
      throw new Error("Secret key is not defined in the environment variables.");
    }

        const token = jwt.sign(
            {user_id : user._id, role: user.role},
            process.env.JWT_SECRET,
            {expiresIn: '7d'}
        );
        console.log("Generated Token:", token);

        res.cookie("DigiVyaarToken", token, {
            secure: true,
            httpOnly: true,
            sameSite: 'None',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        return token;
    }
    catch(error){
        console.error("Error generating token:", error);
        throw new Error("Token generation failed");
    }
};

module.exports = generateToken;