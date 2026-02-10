const User = require('./User');
const Activity = require('./Activity');
const BehaviorData = require('./BehaviorData');
const Alert = require('./Alert');

// Define associations
User.hasMany(Activity, { foreignKey: 'userId', as: 'activities' });
Activity.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(BehaviorData, { foreignKey: 'userId', as: 'behaviorData' });
BehaviorData.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Alert, { foreignKey: 'userId', as: 'alerts' });
Alert.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Alert.belongsTo(User, { foreignKey: 'acknowledgedBy', as: 'acknowledger' });
Alert.belongsTo(User, { foreignKey: 'resolvedBy', as: 'resolver' });

module.exports = {
    User,
    Activity,
    BehaviorData,
    Alert
};
