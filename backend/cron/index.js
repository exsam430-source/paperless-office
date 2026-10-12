const startSLAMonitoring = require('./slaMonitor');
const initFileCleanup = require('./fileCleanup'); // ✅ Add this

// @desc    Initialize All Cron Jobs
const initCronJobs = () => {
  console.log('🕐 Initializing Cron Jobs...');
  
  startSLAMonitoring();
  initFileCleanup(); // ✅ Add this
  
  console.log('✅ All Cron Jobs Initialized');
};

module.exports = initCronJobs;