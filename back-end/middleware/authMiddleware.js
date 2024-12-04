const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

const protect = (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            console.log("Token extracted:", token); // Log the token

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log("Decoded JWT:", decoded); // Log the decoded token payload

            req.user = decoded; // Populate req.user with the decoded token data
            console.log("req.user populated:", req.user); // Log req.user to verify

            next(); // Proceed to the next middleware or route
        } catch (err) {
            console.error("JWT verification failed:", err); // Log the error
            return res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        console.log("No token provided"); // Log if no token is provided
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
};

module.exports = { protect };
