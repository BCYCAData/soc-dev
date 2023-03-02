import type jsPDF from 'jspdf';

export const pdf = {
	tab: 4,
	startX: 20,
	startY: 20
};

export function setFrontPage(pdfDoc: jsPDF, reportStreet: string | undefined) {
	pdfDoc.setFont('Poppins-Regular', 'normal');
	pdfDoc.setFontSize(24);
	let title = 'RFS Emergency Report';
	let titleX = (pdfDoc.internal.pageSize.getWidth() - pdfDoc.getTextWidth(title)) / 2;
	let titleY = 40;
	pdfDoc.text(title, titleX, titleY);
	titleY += 14;
	title = 'for';
	titleX = (pdfDoc.internal.pageSize.getWidth() - pdfDoc.getTextWidth(title)) / 2;
	pdfDoc.text(title, titleX, titleY);
	titleY += 14;
	title = `${reportStreet}`;
	titleX = (pdfDoc.internal.pageSize.getWidth() - pdfDoc.getTextWidth(title)) / 2;
	pdfDoc.text(title, titleX, titleY);
	let logo = new Image();
	logo.src = '../../../src/components/SOCLogo.png';
	titleY += 14;
	titleX = (pdfDoc.internal.pageSize.getWidth() - 40) / 2;
	pdfDoc.addImage(logo, 'PNG', titleX + 10, titleY, 20, 20);
}
