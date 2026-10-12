const cron = require('node-cron');
const { processSLAWarnings } = require('../services/slaService');

// @desc    SLA Monitoring Cron Job (Runs every 15 minutes)
const startSLAMonitoring = () => {
  // Schedule: Every 15 minutes
  cron.schedule('*/15 * * * *', async () => {
    console.log('⏰ Running SLA Monitor - ', new Date().toLocaleString());
    
    try {
      const result = await processSLAWarnings();
      
      if (result) {
        console.log(`✅ SLA Monitor Complete:`);
        console.log(`   - Files Checked: ${result.totalChecked}`);
        console.log(`   - Warnings Sent: ${result.warningCount}`);
        console.log(`   - Files Escalated: ${result.breachCount}`);
      }
    } catch (error) {
      console.error('❌ SLA Monitor Error:', error.message);
    }
  });

  console.log('✅ SLA Monitor Cron Job Started (Every 15 minutes)');
};

module.exports = startSLAMonitoring;