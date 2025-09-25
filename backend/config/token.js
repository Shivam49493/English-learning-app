import jwt from 'jsonwebtoken';

export const genToken = async (user) => {
    try {
        let token =await jwt.sign({userId: user._id}, process.env.JWT_SECRET, {
            expiresIn: '6d' // Token
        })
        return token;
    } catch (error) {
        console.error("Error generating token:", error);
        throw new Error("Token generation failed");
    }
};
