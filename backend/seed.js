const { User, Credential, Student, Attendance, Mark, BehaviorData } = require('./models');
const { sequelize } = require('./config/db');
const bcrypt = require('bcryptjs');

const SAMPLE_STUDENTS = [
    { name: 'Sarah Williams', studentId: 'S001', class: '10A', email: 'sarah@example.com' },
    { name: 'Michael Brown', studentId: 'S002', class: '10A', email: 'michael@example.com' },
    { name: 'James Wilson', studentId: 'S003', class: '10B', email: 'james@example.com' },
    { name: 'Emily Davis', studentId: 'S004', class: '10B', email: 'emily@example.com' },
    { name: 'David Martinez', studentId: 'S005', class: '10C', email: 'david@example.com' },
    { name: 'Lisa Anderson', studentId: 'S006', class: '10C', email: 'lisa@example.com' },
    { name: 'Robert Taylor', studentId: 'S007', class: '10A', email: 'robert@example.com' },
    { name: 'Jennifer Thomas', studentId: 'S008', class: '10B', email: 'jennifer@example.com' },
    { name: 'Christopher Jackson', studentId: 'S009', class: '10C', email: 'chris@example.com' },
    { name: 'Amanda White', studentId: 'S010', class: '10A', email: 'amanda@example.com' }
];

const SUBJECTS = ['Math', 'Science', 'English', 'History', 'Computer'];
const EXAM_TYPES = ['Quiz', 'Midterm', 'Final', 'Assignment'];

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

async function seedDatabase() {
    try {
        console.log('🌱 Starting database seeding...\n');

        const password = await bcrypt.hash('password123', 10);

        let adminUser = await User.findOne({ where: { role: 'admin', name: 'Admin User' } });
        if (!adminUser) {
            adminUser = await User.create({
                name: 'Admin User',
                role: 'admin',
                isActive: true
            });
            await Credential.create({
                userId: adminUser.id,
                email: 'admin@school.edu',
                password
            });
            console.log('✅ Created admin user: admin@school.edu / password123');
        }

        let teacherUser = await User.findOne({ where: { role: 'teacher' } });
        if (!teacherUser) {
            teacherUser = await User.create({
                name: 'Demo Teacher',
                role: 'teacher',
                isActive: true
            });
            await Credential.create({
                userId: teacherUser.id,
                email: 'teacher@school.edu',
                password
            });
            console.log('✅ Created teacher user: teacher@school.edu / password123');
        }

        let parentUser = await User.findOne({ where: { role: 'parent' } });
        if (!parentUser) {
            parentUser = await User.create({
                name: 'Demo Parent',
                role: 'parent',
                isActive: true
            });
            await Credential.create({
                userId: parentUser.id,
                email: 'parent@school.edu',
                password
            });
            console.log('✅ Created parent user: parent@school.edu / password123');
        }

        let demoStudentCred = await Credential.findOne({ where: { email: 'student@school.edu' } });
        let demoStudent;
        if (!demoStudentCred) {
            demoStudent = await User.create({
                name: 'Demo Student',
                role: 'student',
                studentId: 'DEMO001',
                class: '10A',
                isActive: true
            });
            await Credential.create({
                userId: demoStudent.id,
                email: 'student@school.edu',
                password
            });
            await Student.create({
                userId: demoStudent.id,
                parentId: parentUser.id,
                registerNumber: 'DEMO001',
                department: 'Science',
                year: 10
            });
            console.log('✅ Created demo student: student@school.edu / password123');
        } else {
            // Find existing user if demoStudentCred existed
            demoStudent = await User.findByPk(demoStudentCred.userId);
        }

        const createdStudents = [];
        for (const studentData of SAMPLE_STUDENTS) {
            let user = await User.findOne({ where: { studentId: studentData.studentId } });
            
            if (!user) {
                user = await User.create({
                    name: studentData.name,
                    role: 'student',
                    studentId: studentData.studentId,
                    class: studentData.class,
                    isActive: true
                });
                await Credential.create({
                    userId: user.id,
                    email: studentData.email,
                    password
                });
            }

            let student = await Student.findOne({ where: { userId: user.id } });
            if (!student) {
                student = await Student.create({
                    userId: user.id,
                    registerNumber: studentData.studentId,
                    department: 'Science',
                    year: 10
                });
            }

            createdStudents.push({ user, student });
            console.log(`✅ Created student: ${studentData.name} (${studentData.studentId})`);
        }

        console.log('\n📅 Creating attendance records...');
        const today = new Date();
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(today.getDate() - 30);

        for (const { student } of createdStudents) {
            const existingAttendance = await Attendance.count({ where: { studentId: student.id } });
            if (existingAttendance === 0) {
                for (let d = new Date(thirtyDaysAgo); d <= today; d.setDate(d.getDate() + 1)) {
                    if (d.getDay() !== 0 && d.getDay() !== 6) {
                        const rand = Math.random();
                        let status = 'Present';
                        if (rand < 0.15) status = 'Absent';
                        else if (rand < 0.2) status = 'Leave';

                        await Attendance.create({
                            studentId: student.id,
                            date: new Date(d),
                            status
                        });
                    }
                }
            }
        }
        console.log('✅ Created attendance records for all students');

        console.log('\n📝 Creating grade records...');
        for (const { student } of createdStudents) {
            const existingMarks = await Mark.count({ where: { studentId: student.id } });
            if (existingMarks === 0) {
                for (const subject of SUBJECTS) {
                    for (const examType of EXAM_TYPES) {
                        const baseScore = randomInt(60, 95);
                        const score = Math.min(100, baseScore + randomInt(-5, 5));

                        await Mark.create({
                            studentId: student.id,
                            subject,
                            score,
                            examType
                        });
                    }
                }
            }
        }
        console.log('✅ Created grade records for all students');

        console.log('\n🎯 Calculating behavior scores...');
        for (const { user } of createdStudents) {
            await BehaviorData.create({
                userId: user.id,
                date: new Date(),
                attendanceRate: randomInt(70, 100),
                daysPresent: randomInt(18, 25),
                daysAbsent: randomInt(1, 7),
                gradeAverage: randomInt(65, 95),
                assignmentsCompleted: randomInt(8, 20),
                assignmentsTotal: 20,
                assignmentCompletionRate: randomInt(40, 100),
                loginFrequency: randomInt(5, 30),
                participationScore: randomInt(30, 100),
                forumPosts: randomInt(0, 10),
                engagementScore: randomInt(40, 95),
                riskScore: randomInt(5, 45),
                behaviorClass: 'average',
                trendIndicator: 'stable'
            });
        }
        console.log('✅ Calculated behavior scores');

        console.log('\n🎉 Seeding complete!');
        console.log('\n📋 Login credentials:');
        console.log('   Admin: admin@school.com / password123');
        console.log('   Students: [student]@example.com / password123');
        
    } catch (error) {
        console.error('❌ Seeding error:', error);
    } finally {
        await sequelize.close();
        process.exit(0);
    }
}

seedDatabase();
