const jwt = require('jsonwebtoken');
const Customer = require('../src/model/customerModel');

const authUser = async (req, res, next) => {
    try {
        console.log('Starting authentication middleware...');
        
        const token = req.cookies.token;
        console.log('Token from cookie:', token ? 'Token exists' : 'No token found');

        if (!token) {
            console.log('Authentication failed: No token provided');
            return res.status(401).json({
                success: false,
                message: 'Authentication required. Please login.'
            });
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log('Token decoded successfully:', { userId: decoded.id });

            // Find user
            const user = await Customer.findById(decoded.id);
            console.log('User found:', user ? 'Yes' : 'No');

            if (!user) {
                console.log('Authentication failed: User not found');
                return res.status(401).json({
                    success: false,
                    message: 'User not found'
                });
            }

            // Attach user to request object
            req.user = user;
            console.log('User attached to request. Authentication successful');
            next();

        } catch (tokenError) {
            console.log('Token verification failed:', tokenError.message);
            
            // Clear invalid token
            res.clearCookie('token');
            
            return res.status(401).json({
                success: false,
                message: 'Invalid token. Please login again.'
            });
        }

    } catch (error) {
        console.error('Authentication middleware error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error during authentication',
            error: error.message
        });
    }
};

module.exports = authUser;
