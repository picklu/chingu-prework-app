const helper = {};

helper.ignoreFavicon = (req, res, next) => {
    if (req.originalUrl === '/favicon.ico') {
        res.status(204).json({ nope: true });
    } else {
        next();
    }
}; 

module.exports = helper;