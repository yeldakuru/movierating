import jwt from 'jsonwebtoken';

export const generateToken = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '7d', // Token expiration time
    });
    res.cookie('token', token, {
        httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        sameSite: 'strict', // Prevents CSRF attacks
        maxAge: 604800000, // Cookie expiration time (1 week)
    });

    // res.status(200).json({ message: 'Token generated successfully' }); // Send a response indicating success

    return token; // Return the generated token
}