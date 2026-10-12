require('dotenv').config();
const mongoose = require('mongoose');
const Department = require('../models/Department');
const WorkflowTemplate = require('../models/WorkflowTemplate');

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('✅ MongoDB Connected');

  const depts = await Department.find({ isActive: true });
  if (!depts.length) throw new Error('No departments found');

  const templates = [
    {
      fileType: 'LEAVE_APPLICATION',
      steps: [
        { stepNumber: 1, role: 'CLERK', slaHours: 24 },
        { stepNumber: 2, role: 'REGISTRAR', slaHours: 48 },
        { stepNumber: 3, role: 'DIRECTOR', slaHours: 72 },
      ],
    },
    {
      fileType: 'BUDGET_REQUEST',
      steps: [
        { stepNumber: 1, role: 'CLERK', slaHours: 12 },
        { stepNumber: 2, role: 'FINANCE', slaHours: 24 },
        { stepNumber: 3, role: 'DIRECTOR', slaHours: 48 },
        { stepNumber: 4, role: 'VC', slaHours: 72 },
      ],
    },
    {
      fileType: 'PURCHASE_ORDER',
      steps: [
        { stepNumber: 1, role: 'CLERK', slaHours: 24 },
        { stepNumber: 2, role: 'FINANCE', slaHours: 48 },
        { stepNumber: 3, role: 'DIRECTOR', slaHours: 72 },
      ],
    },
    {
      fileType: 'ACADEMIC_REQUEST',
      steps: [
        { stepNumber: 1, role: 'CLERK', slaHours: 12 },
        { stepNumber: 2, role: 'DEAN', slaHours: 48 },
        { stepNumber: 3, role: 'VC', slaHours: 96 },
      ],
    },
    {
      fileType: 'HR_DOCUMENT',
      steps: [
        { stepNumber: 1, role: 'CLERK', slaHours: 24 },
        { stepNumber: 2, role: 'REGISTRAR', slaHours: 48 },
        { stepNumber: 3, role: 'DIRECTOR', slaHours: 72 },
      ],
    },
  ];

  let created = 0;
  for (const d of depts) {
    for (const t of templates) {
      const exists = await WorkflowTemplate.findOne({ department: d._id, fileType: t.fileType });
      if (exists) continue;

      await WorkflowTemplate.create({
        department: d._id,
        fileType: t.fileType,
        steps: t.steps,
        isActive: true,
      });

      created++;
      console.log(`✅ Created workflow: ${t.fileType} for ${d.name}`);
    }
  }

  console.log(`🎉 Done. New workflows created: ${created}`);
  process.exit(0);
})().catch((e) => {
  console.error('❌ Bootstrap error:', e.message);
  process.exit(1);
});