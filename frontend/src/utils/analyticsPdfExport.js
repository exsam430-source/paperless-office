import jsPDF from 'jspdf';

export const exportAnalyticsToPdf = (stats, aiInsights, dateRange, kpiData) => {
  try {
    const doc = new jsPDF();
    let yPos = 20;

    // Title
    doc.setFontSize(20);
    doc.setFont(undefined, 'bold');
    doc.text('Analytics Report', 14, yPos);
    yPos += 10;

    // Subtitle
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(100);
    doc.text(`Generated on ${new Date().toLocaleString()}`, 14, yPos);
    yPos += 6;
    doc.text(`Period: Last ${dateRange}`, 14, yPos);
    yPos += 15;

    // KPI Summary Section
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(0);
    doc.text('Key Performance Indicators', 14, yPos);
    yPos += 10;

    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');

    kpiData.forEach(kpi => {
      doc.text(`${kpi.title}:`, 20, yPos);
      doc.text(String(kpi.value), 100, yPos);
      doc.setTextColor(0, 150, 0);
      doc.text(kpi.change, 140, yPos);
      doc.setTextColor(0);
      yPos += 7;
    });

    yPos += 10;

    // File Statistics Section
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('File Statistics', 14, yPos);
    yPos += 10;

    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');

    const fileStats = [
      ['Total Files', stats?.totalFiles || 0],
      ['Approved Files', stats?.approvedFiles || 0],
      ['Rejected Files', stats?.rejectedFiles || 0],
      ['Pending Files', stats?.pendingFiles || 0],
      ['Escalated Files', stats?.escalatedFiles || 0],
    ];

    fileStats.forEach(([label, value]) => {
      doc.text(`${label}:`, 20, yPos);
      doc.text(String(value), 100, yPos);
      yPos += 7;
    });

    yPos += 10;

    // AI Insights Section
    if (aiInsights) {
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text('AI Insights', 14, yPos);
      yPos += 10;

      doc.setFontSize(10);
      doc.setFont(undefined, 'normal');

      const aiStats = [
        ['Total AI Predictions', aiInsights.totalPredictions || 0],
        ['Average Confidence', `${aiInsights.avgConfidence || 0}%`],
        ['Delay Risk Percentage', `${aiInsights.delayRiskPercentage || 0}%`],
        ['High Priority Count', aiInsights.highPriorityCount || 0],
      ];

      aiStats.forEach(([label, value]) => {
        doc.text(`${label}:`, 20, yPos);
        doc.text(String(value), 100, yPos);
        yPos += 7;
      });
    }

    // Footer
    const pageHeight = doc.internal.pageSize.getHeight();
    const pageWidth = doc.internal.pageSize.getWidth();
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text('Paperless Office System - Analytics Report', pageWidth / 2, pageHeight - 10, { align: 'center' });

    // Save
    const filename = `analytics-report-${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(filename);

    return true;
  } catch (error) {
    console.error('PDF Export Error:', error);
    throw error;
  }
};