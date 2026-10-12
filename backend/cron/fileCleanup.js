const cron = require('node-cron');
const File = require('../models/File');
const { createAuditLog } = require('../middleware/audit');

const initFileCleanupJob = () => {
  // ✅ Get retention period from env (default 3 days)
  const retentionDays = parseInt(process.env.APPROVED_FILE_RETENTION_DAYS || '3', 10);

  // Run every day at 2:00 AM
  cron.schedule('0 2 * * *', async () => {
    try {
      console.log('\n🗑️ Running file cleanup job...');

      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - retentionDays); //getMinutes() - 2

      // Find approved files older than retention period
      const filesToArchive = await File.find({
        status: 'APPROVED',
        updatedAt: { $lt: cutoffDate }
      });

      if (filesToArchive.length === 0) {
        console.log(`✅ No approved files older than ${retentionDays} days to archive`);
        return;
      }

      console.log(`📦 Found ${filesToArchive.length} approved files older than ${retentionDays} days`);

      // Soft delete (archive)
      const result = await File.updateMany(
        {
          status: 'APPROVED',
          updatedAt: { $lt: cutoffDate }
        },
        {
          $set: {
            status: 'ARCHIVED',
            archivedAt: new Date()
          }
        }
      );

      console.log(`✅ Archived ${result.modifiedCount} approved files`);

      // Log each archived file
      for (const file of filesToArchive) {
        await createAuditLog(
          null,
          file._id,
          'FILE_ARCHIVED',
          'SYSTEM',
          'cron-job'
        );
        
        console.log(`   📦 Archived: ${file.fileId}`);
      }

    } catch (error) {
      console.error('❌ File cleanup job error:', error.message);
    }
  });

  console.log(`✅ File Cleanup Cron Job Started (Daily at 2:00 AM - Archives approved files after ${retentionDays} days)`);
};

module.exports = initFileCleanupJob;