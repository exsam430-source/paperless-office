import jsPDF from 'jspdf';
import 'jspdf-autotable'; // ✅ Import as side-effect to extend jsPDF prototype
import { saveAs } from 'file-saver';

/**
 * Export data to CSV
 */
export const exportToCSV = (data, filename = 'report.csv') => {
  if (!data || data.length === 0) {
    throw new Error('No data to export');
  }

  const headers = Object.keys(data[0]);
  
  const csvContent = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        const escaped = String(value).replace(/"/g, '""');
        return escaped.includes(',') ? `"${escaped}"` : escaped;
      }).join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, filename);
};

/**
 * Export stats summary to CSV
 */
export const exportStatsToCsv = (stats, computed) => {
  const data = [
    { Metric: 'Total Files', Value: computed.total },
    { Metric: 'Approved Files', Value: computed.approved },
    { Metric: 'Rejected Files', Value: computed.rejected },
    { Metric: 'Pending Files', Value: computed.pending },
    { Metric: 'Approval Rate', Value: `${computed.approvalRate.toFixed(2)}%` },
    { Metric: 'Rejection Rate', Value: `${computed.rejectionRate.toFixed(2)}%` },
    { Metric: 'Delay Rate', Value: `${computed.delayRate.toFixed(2)}%` },
  ];

  const filename = `workflow-report-${new Date().toISOString().split('T')[0]}.csv`;
  exportToCSV(data, filename);
};

/**
 * Export report to PDF
 */
export const exportReportToPdf = (stats, computed, aiInsights, range) => {
  try {
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(20);
    doc.setTextColor(31, 41, 55);
    doc.text('Workflow Report', 14, 20);
    
    // Subtitle
    doc.setFontSize(10);
    doc.setTextColor(107, 114, 128);
    doc.text(`Generated on ${new Date().toLocaleString()}`, 14, 28);
    doc.text(`Period: Last ${range} days`, 14, 34);
    
    // Summary Statistics
    doc.setFontSize(14);
    doc.setTextColor(31, 41, 55);
    doc.text('Summary Statistics', 14, 45);
    
    const summaryData = [
      ['Total Files', String(computed.total)],
      ['Approved Files', String(computed.approved)],
      ['Rejected Files', String(computed.rejected)],
      ['Pending Files', String(computed.pending)],
      ['Approval Rate', `${computed.approvalRate.toFixed(2)}%`],
      ['Rejection Rate', `${computed.rejectionRate.toFixed(2)}%`],
      ['Delay Rate', `${computed.delayRate.toFixed(2)}%`],
    ];

    // ✅ Use doc.autoTable (attached via side-effect import)
    doc.autoTable({
      startY: 50,
      head: [['Metric', 'Value']],
      body: summaryData,
      theme: 'grid',
      headStyles: { 
        fillColor: [79, 70, 229],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      styles: { 
        fontSize: 10,
        cellPadding: 3
      },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 80 },
        1: { halign: 'right', cellWidth: 80 }
      }
    });

    // AI Insights
    if (aiInsights) {
      // ✅ Get last table position
      const finalY = doc.lastAutoTable.finalY || 100;
      
      doc.setFontSize(14);
      doc.setTextColor(31, 41, 55);
      doc.text('AI Insights', 14, finalY + 15);

      const aiData = [
        ['Total AI Predictions', String(aiInsights.totalPredictions || 0)],
        ['Average Confidence', `${aiInsights.avgConfidence || 0}%`],
        ['Delay Risk Percentage', `${aiInsights.delayRiskPercentage || 0}%`],
        ['High Priority Count', String(aiInsights.highPriorityCount || 0)],
      ];

      doc.autoTable({
        startY: finalY + 20,
        head: [['Metric', 'Value']],
        body: aiData,
        theme: 'grid',
        headStyles: { 
          fillColor: [59, 130, 246],
          textColor: [255, 255, 255],
          fontStyle: 'bold'
        },
        styles: { 
          fontSize: 10,
          cellPadding: 3
        },
        columnStyles: {
          0: { fontStyle: 'bold', cellWidth: 80 },
          1: { halign: 'right', cellWidth: 80 }
        }
      });
    }

    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(156, 163, 175);
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
    }

    // Save
    const filename = `workflow-report-${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(filename);
    
    return true;
  } catch (error) {
    console.error('PDF Generation Error:', error);
    throw error;
  }
};