const Activity = require('../models/Activity');

exports.logActivity = (activityType) => {
    return async (req, res, next) => {
        try {
            if (req.user) {
                await Activity.create({
                    userId: req.user._id,
                    activityType: activityType,
                    description: `${activityType} action`,
                    ipAddress: req.ip,
                    userAgent: req.get('user-agent'),
                    metadata: {
                        route: req.originalUrl,
                        method: req.method
                    }
                });
            }
        } catch (error) {
            console.error('Activity logging error:', error);
        }
        next();
    };
};
