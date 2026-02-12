const { sequelize, User, Credential, Student, Activity, Alert } = require('./models');

async function checkData() {
    try {
        console.log('Checking database tables...\n');

        const usersCount = await User.count();
        console.log(`📊 Users: ${usersCount} records`);

        const studentsCount = await Student.count();
        console.log(`📊 Students: ${studentsCount} records`);

        const activitiesCount = await Activity.count();
        console.log(`📊 Activities: ${activitiesCount} records`);

        const alertsCount = await Alert.count();
        console.log(`📊 Alerts: ${alertsCount} records`);

        console.log('\n--- Sample Data ---\n');

        if (usersCount > 0) {
            const sampleUsers = await User.findAll({
                limit: 3,
                include: [{ model: Credential, as: 'credential' }]
            });
            console.log(`Sample Users (${sampleUsers.length}):`);
            sampleUsers.forEach(user => {
                const email = user.credential ? user.credential.email : 'No Email';
                console.log(`  - ${user.name} (${email}) - Role: ${user.role}`);
            });
        } else {
            console.log('No users found in database.');
        }

        if (studentsCount > 0) {
            const sampleStudents = await Student.findAll({ limit: 3 });
            console.log(`\nSample Students (${sampleStudents.length}):`);
            sampleStudents.forEach(student => {
                console.log(`  - ${student.name} - Roll: ${student.rollNumber}`);
            });
        } else {
            console.log('\nNo students found in database.');
        }

        if (activitiesCount > 0) {
            const sampleActivities = await Activity.findAll({ limit: 3 });
            console.log(`\nSample Activities (${sampleActivities.length}):`);
            sampleActivities.forEach(activity => {
                console.log(`  - ${activity.activityType} - ${activity.timestamp}`);
            });
        } else {
            console.log('\nNo activities found in database.');
        }

        if (alertsCount > 0) {
            const sampleAlerts = await Alert.findAll({ limit: 3 });
            console.log(`\nSample Alerts (${sampleAlerts.length}):`);
            sampleAlerts.forEach(alert => {
                console.log(`  - ${alert.type} - Severity: ${alert.severity} - Status: ${alert.status}`);
            });
        } else {
            console.log('\nNo alerts found in database.');
        }

        console.log('\n✅ Database check complete!');
    } catch (error) {
        console.error('❌ Error checking data:', error.message);
    } finally {
        await sequelize.close();
        process.exit(0);
    }
}

checkData();
