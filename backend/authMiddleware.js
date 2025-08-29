const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    // 1. Get the Authorization header
    const authHeader = req.header('Authorization');

    // 2. Check if the header exists and is in the correct "Bearer <token>" format
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ msg: 'No token or malformed token, authorization denied' });
    }

    try {
        // 3. Extract the token from the "Bearer <token>" string
        const token = authHeader.split(' ')[1];

        // 4. Verify the extracted token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token is not valid' });
    }
};