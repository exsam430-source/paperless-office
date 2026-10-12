require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Department = require('../models/Department');
const WorkflowTemplate = require('../models/WorkflowTemplate');

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ MongoDB Connected');
};

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Department.deleteMany({});
    await WorkflowTemplate.deleteMany({});

    console.log('🗑️  Database cleared');

    // Create Departments
    const departments = await Department.insertMany([
      { name: 'Administration', code: 'ADMIN', description: 'Administration Department' },
      { name: 'Finance', code: 'FIN', description: 'Finance Department' },
      { name: 'Human Resources', code: 'HR', description: 'HR Department' },
      { name: 'IT', code: 'IT', description: 'IT Department' },
      { name: 'Academic', code: 'ACAD', description: 'Academic Department' }
    ]);

    console.log('✅ Departments created');

    // Create Users for ALL Roles
    const adminUser = new User({
      name: 'System Admin',
      email: 'shawkatsiddeqi@gmail.com',
      password: 'Admin@123',
      role: 'ADMIN',
      department: departments[0]._id
    });
    await adminUser.save();

    const clerkUser = new User({
      name: 'John Clerk',
      email: 'shawkatmerndeveloper@gmail.com',
      password: 'Clerk@123',
      role: 'CLERK',
      department: departments[0]._id
    });
    await clerkUser.save();

    const registrarUser = new User({
      name: 'Jane Registrar',
      email: 'registrar@paperless.com',
      password: 'Registrar@123',
      role: 'REGISTRAR',
      department: departments[0]._id
    });
    await registrarUser.save();

    const directorUser = new User({
      name: 'Bob Director',
      email: 'director@paperless.com',
      password: 'Director@123',
      role: 'DIRECTOR',
      department: departments[0]._id
    });
    await directorUser.save();

    const financeUser = new User({
      name: 'Alice Finance',
      email: 'finance@paperless.com',
      password: 'Finance@123',
      role: 'FINANCE',
      department: departments[1]._id
    });
    await financeUser.save();

    const deanUser = new User({
      name: 'Charlie Dean',
      email: 'dean@paperless.com',
      password: 'Dean@123',
      role: 'DEAN',
      department: departments[4]._id
    });
    await deanUser.save();

    const vcUser = new User({
      name: 'David VC',
      email: 'vc@paperless.com',
      password: 'VC@123',
      role: 'VC',
      department: departments[0]._id
    });
    await vcUser.save();

    console.log('✅ All users created (7 roles)');

    // Create Workflow Templates
    await WorkflowTemplate.insertMany([
      {
        fileType: 'LEAVE_APPLICATION',
        department: departments[0]._id,
        steps: [
          { stepNumber: 1, role: 'CLERK', slaHours: 24 },
          { stepNumber: 2, role: 'REGISTRAR', slaHours: 48 },
          { stepNumber: 3, role: 'DIRECTOR', slaHours: 72 }
        ]
      },
      {
        fileType: 'BUDGET_REQUEST',
        department: departments[1]._id,
        steps: [
          { stepNumber: 1, role: 'CLERK', slaHours: 12 },
          { stepNumber: 2, role: 'FINANCE', slaHours: 24 },
          { stepNumber: 3, role: 'DIRECTOR', slaHours: 48 },
          { stepNumber: 4, role: 'VC', slaHours: 72 }
        ]
      },
      {
        fileType: 'PURCHASE_ORDER',
        department: departments[1]._id,
        steps: [
          { stepNumber: 1, role: 'CLERK', slaHours: 24 },
          { stepNumber: 2, role: 'FINANCE', slaHours: 48 },
          { stepNumber: 3, role: 'DIRECTOR', slaHours: 72 }
        ]
      },
      {
        fileType: 'ACADEMIC_REQUEST',
        department: departments[4]._id,
        steps: [
          { stepNumber: 1, role: 'CLERK', slaHours: 12 },
          { stepNumber: 2, role: 'DEAN', slaHours: 48 },
          { stepNumber: 3, role: 'VC', slaHours: 96 }
        ]
      },
      {
        fileType: 'HR_DOCUMENT',
        department: departments[2]._id,
        steps: [
          { stepNumber: 1, role: 'CLERK', slaHours: 24 },
          { stepNumber: 2, role: 'REGISTRAR', slaHours: 48 },
          { stepNumber: 3, role: 'DIRECTOR', slaHours: 72 }
        ]
      }
    ]);

    console.log('✅ Workflow templates created');

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Database seeded successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n📧 Login Credentials (All Roles):');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('1. Admin:     admin@paperless.com     / Admin@123');
    console.log('2. Clerk:     clerk@paperless.com     / Clerk@123');
    console.log('3. Registrar: registrar@paperless.com / Registrar@123');
    console.log('4. Director:  director@paperless.com  / Director@123');
    console.log('5. Finance:   finance@paperless.com   / Finance@123');
    console.log('6. Dean:      dean@paperless.com      / Dean@123');
    console.log('7. VC:        vc@paperless.com        / VC@123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    console.log('📊 Summary:');
    console.log(`   Departments: ${departments.length}`);
    console.log(`   Users: 7 (all roles covered)`);
    console.log(`   Workflows: 5 different file types`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed Error:', error.message);
    console.error(error);
    process.exit(1);
  }
};

seedDatabase();