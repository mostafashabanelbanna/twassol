const jwt = require('jsonwebtoken');
const JWT_KEY = 'the-secret-to-jwt-lives-here';

module.exports = (req, res, next) => {
    try{
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, JWT_KEY);
        req.userData = {email: decodedToken.email, userId: decodedToken.userId};
        next();
    } catch (error) {
        res.status(401).json({message: 'لا توجد مصادقة'});
    }
}