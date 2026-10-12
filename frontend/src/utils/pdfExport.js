import jsPDF from 'jspdf';

export const exportReportToPdfManual = (stats, computed, aiInsights, range) => {
  try {
    const doc = new jsPDF();
    let yPos = 20;

    // Title
    doc.setFontSize(20);
    doc.setFont(undefined, 'bold');
    doc.text('Workflow Report', 14, yPos);
    yPos += 10;

    // Subtitle
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.setTextColor(100);
    doc.text(`Generated on ${new Date().toLocaleString()}`, 14, yPos);
    yPos += 6;
    doc.text(`Period: Last ${range} days`, 14, yPos);
    yPos += 15;

    // Summary Statistics Section
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(0);
    doc.text('Summary Statistics', 14, yPos);
    yPos += 10;

    // Draw table manually
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');

    const summaryStats = [
      ['Total Files', computed.total],
      ['Approved Files', computed.approved],
      ['Rejected Files', computed.rejected],
      ['Pending Files', computed.pending],
      ['Approval Rate', `${computed.approvalRate.toFixed(2)}%`],
      ['Rejection Rate', `${computed.rejectionRate.toFixed(2)}%`],
      ['Delay Rate', `${computed.delayRate.toFixed(2)}%`],
    ];

    summaryStats.forEach(([label, value]) => {
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
    doc.text('Paperless Office System', pageWidth / 2, pageHeight - 10, { align: 'center' });

    // Save
    const filename = `workflow-report-${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(filename);

    return true;
  } catch (error) {
    console.error('PDF Export Error:', error);
    throw error;
  }
};