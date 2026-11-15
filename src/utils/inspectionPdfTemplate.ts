import { jsPDF } from 'jspdf';

export interface PdfSubCheckCriterion {
  id: string;
  label: string;
  checked: boolean;
}

export interface PdfInspectionItem {
  id: number;
  text: string;
  category: string;
  referenceNorm: string;
  locationDetail: string;
  acceptanceCriteria: string;
  subChecks: PdfSubCheckCriterion[];
  status: 'CUMPLE' | 'FALLA' | 'PENDIENTE';
  severityLevel: 'Crítico' | 'Mayor' | 'Menor';
  responsibleArea: string;
  dueDate: string;
  evidenceCaptured: boolean;
  descriptionNote: string;
  correctiveAction?: string;
  maintenanceTicketId?: string;
}

export interface InspectionActaPdfPayload {
  actaCode: string;
  roundCode: string;
  roundTitle: string;
  inspectionDate: string;
  signedTimestamp: string;
  inspectorName: string;
  inspectorRole: string;
  inspectorBadge: string;
  signatureDataUrl: string;
  items: PdfInspectionItem[];
}

/**
 * Normaliza caracteres Unicode fuera de Latin-1 para garantizar renderizado limpio en Helvetica de jsPDF.
 */
const sanitizePdfText = (text: string): string => {
  return (text || '')
    .replace(/≥/g, '>=')
    .replace(/≤/g, '<=')
    .replace(/[–—]/g, '-')
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/•/g, '-')
    .replace(/✓/g, 'OK')
    .replace(/✗/g, 'X');
};

/**
 * Convierte el SVG oficial de SST-Active a PNG Data URL para incrustarlo en la cabecera del PDF.
 */
const loadBrandLogoPng = async (): Promise<string | null> => {
  try {
    const response = await fetch('/assets/aistudio/sst-active-logo_678efcf8.svg');
    if (!response.ok) return null;
    const svgText = await response.text();
    const blob = new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    return await new Promise<string | null>((resolve) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = 600;
          canvas.height = 180;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            URL.revokeObjectURL(url);
            resolve(null);
            return;
          }
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const pngUrl = canvas.toDataURL('image/png');
          URL.revokeObjectURL(url);
          resolve(pngUrl);
        } catch {
          URL.revokeObjectURL(url);
          resolve(null);
        }
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve(null);
      };
      img.src = url;
    });
  } catch {
    return null;
  }
};

/**
 * Genera y descarga el PDF oficial de la inspección firmada usando la plantilla corporativa SST-Active.
 */
export const generateAndDownloadInspectionActaPdf = async (
  payload: InspectionActaPdfPayload
): Promise<void> => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 297mm
  const marginX = 14;
  const contentWidth = pageWidth - marginX * 2; // 182mm
  const bottomLimit = pageHeight - 18;

  const logoPng = await loadBrandLogoPng();

  // Paleta oficial Manual de Marca SST-Active
  const NAVY: [number, number, number] = [10, 35, 66];       // #0A2342
  const STEEL: [number, number, number] = [31, 111, 181];    // #1F6FB5
  const DEEP_BLUE: [number, number, number] = [20, 80, 143]; // #14508F
  const ORANGE: [number, number, number] = [255, 138, 0];    // #FF8A00
  const GREEN: [number, number, number] = [46, 204, 113];    // #2ECC71
  const RED: [number, number, number] = [230, 57, 70];       // #E63946
  const GRAPHITE: [number, number, number] = [43, 48, 54];   // #2B3036
  const MUTED: [number, number, number] = [91, 103, 112];    // #5B6770
  const LIGHT_BG: [number, number, number] = [245, 248, 252];
  const BORDER: [number, number, number] = [201, 209, 217];  // #C9D1D9

  let y = 12;

  const drawPageHeader = (isContinuation = false) => {
    // Banda blanca superior con logo y datos del documento
    doc.setFillColor(255, 255, 255);
    doc.rect(marginX, 10, contentWidth, 18, 'F');
    doc.setDrawColor(...BORDER);
    doc.setLineWidth(0.3);
    doc.rect(marginX, 10, contentWidth, 18);

    if (logoPng) {
      doc.addImage(logoPng, 'PNG', marginX + 2, 11.5, 48, 14.4);
    } else {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.setTextColor(...NAVY);
      doc.text('SST-ACTIVE', marginX + 4, 19);
      doc.setFontSize(7);
      doc.setTextColor(...MUTED);
      doc.text('PREVENCION DIGITAL INDUSTRIAL', marginX + 4, 24);
    }

    // Caja derecha de codificación documental
    doc.line(marginX + 118, 10, marginX + 118, 28);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(...NAVY);
    doc.text(sanitizePdfText(`CODIGO: ${payload.actaCode}`), marginX + 121, 15);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...GRAPHITE);
    doc.text(sanitizePdfText(`RONDA: ${payload.roundCode}`), marginX + 121, 19.5);
    doc.text(sanitizePdfText(`FECHA: ${payload.inspectionDate} | RETENCION: 20 ANOS`), marginX + 121, 24);

    // Franja corporativa azul marino con título
    doc.setFillColor(...NAVY);
    doc.rect(marginX, 28, contentWidth, 9, 'F');
    doc.setFillColor(...ORANGE);
    doc.rect(marginX, 37, contentWidth, 1.2, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(255, 255, 255);
    doc.text(
      sanitizePdfText(
        isContinuation
          ? 'ACTA OFICIAL DE INSPECCION PLANEADA DE SEGURIDAD (CONTINUACION)'
          : 'ACTA OFICIAL DE INSPECCION PLANEADA DE SEGURIDAD Y CONDICIONES LOCATIVAS'
      ),
      marginX + 3,
      33.8
    );

    y = 43;
  };

  const ensureSpace = (neededHeight: number) => {
    if (y + neededHeight > bottomLimit) {
      doc.addPage();
      drawPageHeader(true);
    }
  };

  // Dibujar encabezado de portada
  drawPageHeader(false);

  // Bloque 1: Ficha Técnica de la Ronda e Inspector
  const compliantCount = payload.items.filter((i) => i.status === 'CUMPLE').length;
  const failuresCount = payload.items.filter((i) => i.status === 'FALLA').length;
  const totalSub = payload.items.reduce((acc, i) => acc + i.subChecks.length, 0);
  const passedSub = payload.items.reduce(
    (acc, i) => acc + i.subChecks.filter((s) => s.checked).length,
    0
  );

  doc.setFillColor(...LIGHT_BG);
  doc.setDrawColor(...BORDER);
  doc.roundedRect(marginX, y, contentWidth, 26, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...STEEL);
  doc.text('1. DATOS GENERALES DE LA INSPECCION', marginX + 3, y + 5.5);

  doc.setFontSize(8);
  doc.setTextColor(...NAVY);
  doc.text('Ronda / Area:', marginX + 3, y + 11.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...GRAPHITE);
  doc.text(sanitizePdfText(payload.roundTitle), marginX + 27, y + 11.5);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...NAVY);
  doc.text('Inspector HSEQ:', marginX + 3, y + 17);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...GRAPHITE);
  doc.text(
    sanitizePdfText(`${payload.inspectorName} (${payload.inspectorRole} - Carne #${payload.inspectorBadge})`),
    marginX + 31,
    y + 17
  );

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...NAVY);
  doc.text('Marco Normativo:', marginX + 3, y + 22.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...GRAPHITE);
  doc.text(
    'Decreto 1072 de 2015 | Resolucion 0312 de 2019 | Resolucion 2400 de 1979 | RETIE / NFPA',
    marginX + 32,
    y + 22.5
  );

  y += 30;

  // Bloque 2: Resumen Ejecutivo de Cumplimiento (4 tarjetas KPI)
  const kpiGap = 3;
  const kpiW = (contentWidth - kpiGap * 3) / 4;
  const kpis: Array<{ label: string; value: string; accent: [number, number, number] }> = [
    { label: 'PUNTOS EVALUADOS', value: `${payload.items.length}`, accent: STEEL },
    { label: 'CONFORMIDADES', value: `${compliantCount}`, accent: GREEN },
    { label: 'NO CONFORMIDADES', value: `${failuresCount}`, accent: RED },
    { label: 'SUB-CRITERIOS OK', value: `${passedSub} / ${totalSub}`, accent: ORANGE }
  ];

  kpis.forEach((kpi, idx) => {
    const kx = marginX + idx * (kpiW + kpiGap);
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(...BORDER);
    doc.roundedRect(kx, y, kpiW, 15, 1.5, 1.5, 'FD');

    doc.setFillColor(...kpi.accent);
    doc.rect(kx, y, 2, 15, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(...MUTED);
    doc.text(kpi.label, kx + 4.5, y + 5.2);

    doc.setFontSize(12);
    doc.setTextColor(...NAVY);
    doc.text(kpi.value, kx + 4.5, y + 12);
  });

  y += 20;

  // Título sección 2
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...STEEL);
  doc.text('2. RESULTADOS DETALLADOS POR PUNTO INSPECCIONADO', marginX, y);
  y += 4;

  // Bloque 3: Tarjetas detalladas por cada punto de inspección
  payload.items.forEach((item) => {
    const isFail = item.status === 'FALLA';
    const subPassed = item.subChecks.filter((s) => s.checked).length;

    const titleLines = doc.splitTextToSize(sanitizePdfText(item.text), contentWidth - 42);
    const criteriaLines = doc.splitTextToSize(
      sanitizePdfText(`Criterio tecnico: ${item.acceptanceCriteria}`),
      contentWidth - 8
    );
    const noteLines = doc.splitTextToSize(
      sanitizePdfText(item.descriptionNote || 'Sin observaciones adicionales.'),
      contentWidth - 8
    );
    const correctiveLines =
      isFail && item.correctiveAction
        ? doc.splitTextToSize(sanitizePdfText(`Plan de accion: ${item.correctiveAction}`), contentWidth - 10)
        : [];

    // Calcular altura de sub-criterios
    let subChecksHeight = 0;
    const subLineSets = item.subChecks.map((sc) => {
      const lines = doc.splitTextToSize(sanitizePdfText(sc.label), contentWidth - 15);
      subChecksHeight += Math.max(4.5, lines.length * 3.8) + 1.2;
      return { sc, lines };
    });

    const cardHeight =
      10 + // barra superior
      titleLines.length * 4.2 +
      9 + // fila metadatos
      criteriaLines.length * 3.7 +
      4 +
      subChecksHeight +
      5 + // titulo observaciones
      noteLines.length * 3.8 +
      (isFail ? 11 + correctiveLines.length * 3.8 : 2) +
      4;

    ensureSpace(cardHeight);

    const cardTop = y;
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(...(isFail ? RED : BORDER));
    doc.setLineWidth(isFail ? 0.5 : 0.3);
    doc.roundedRect(marginX, cardTop, contentWidth, cardHeight, 2, 2, 'FD');

    // Cabecera de la tarjeta del punto
    doc.setFillColor(...(isFail ? [253, 242, 243] as [number, number, number] : LIGHT_BG));
    doc.rect(marginX + 0.3, cardTop + 0.3, contentWidth - 0.6, 8.2, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...NAVY);
    doc.text(
      sanitizePdfText(`PUNTO #${item.id}  |  ${item.category.toUpperCase()}`),
      marginX + 3,
      cardTop + 5.5
    );

    // Norma en gris medio
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...MUTED);
    doc.text(sanitizePdfText(`(${item.referenceNorm})`), marginX + 68, cardTop + 5.5);

    // Badge CONFORME / NO CONFORME a la derecha
    const badgeW = 30;
    const badgeX = marginX + contentWidth - badgeW - 3;
    doc.setFillColor(...(isFail ? RED : GREEN));
    doc.roundedRect(badgeX, cardTop + 1.8, badgeW, 5.2, 1, 1, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(...(isFail ? [255, 255, 255] as [number, number, number] : NAVY));
    doc.text(isFail ? 'NO CONFORME' : 'CONFORME', badgeX + badgeW / 2, cardTop + 5.3, {
      align: 'center'
    });

    let cy = cardTop + 12.5;

    // Título del punto
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(...NAVY);
    doc.text(titleLines, marginX + 3, cy);
    cy += titleLines.length * 4.2 + 1;

    // Metadatos: Ubicación, Responsable, Criticidad, Evidencia
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.2);
    doc.setTextColor(...GRAPHITE);
    doc.text(
      sanitizePdfText(
        `Ubicacion: ${item.locationDetail}   |   Resp: ${item.responsibleArea}`
      ),
      marginX + 3,
      cy
    );
    cy += 4;
    doc.text(
      sanitizePdfText(
        `Criticidad: ${item.severityLevel}   |   Sub-puntos: ${subPassed}/${item.subChecks.length} OK   |   Evidencia ATEX: ${
          item.evidenceCaptured ? `Foto Sellada (${payload.inspectionDate})` : 'No requerida / Sin adjunto'
        }`
      ),
      marginX + 3,
      cy
    );
    cy += 4.5;

    // Criterio técnico
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7.2);
    doc.setTextColor(...DEEP_BLUE);
    doc.text(criteriaLines, marginX + 3, cy);
    cy += criteriaLines.length * 3.7 + 2;

    // Sub-criterios con iconos vectoriales
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.2);
    doc.setTextColor(...NAVY);
    doc.text('Elementos verificados en sitio:', marginX + 3, cy);
    cy += 3.5;

    subLineSets.forEach(({ sc, lines }) => {
      const boxX = marginX + 4;
      const boxY = cy - 2.6;
      if (sc.checked) {
        doc.setFillColor(...GREEN);
        doc.roundedRect(boxX, boxY, 3.2, 3.2, 0.5, 0.5, 'F');
        doc.setDrawColor(...NAVY);
        doc.setLineWidth(0.45);
        doc.line(boxX + 0.7, boxY + 1.7, boxX + 1.4, boxY + 2.4);
        doc.line(boxX + 1.4, boxY + 2.4, boxX + 2.6, boxY + 0.8);
      } else {
        doc.setFillColor(...RED);
        doc.roundedRect(boxX, boxY, 3.2, 3.2, 0.5, 0.5, 'F');
        doc.setDrawColor(255, 255, 255);
        doc.setLineWidth(0.45);
        doc.line(boxX + 0.8, boxY + 0.8, boxX + 2.4, boxY + 2.4);
        doc.line(boxX + 2.4, boxY + 0.8, boxX + 0.8, boxY + 2.4);
      }

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.2);
      doc.setTextColor(...GRAPHITE);
      doc.text(lines, marginX + 9.5, cy);
      cy += Math.max(4.5, lines.length * 3.8) + 1.2;
    });

    cy += 1.5;

    // Observación del inspector
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.2);
    doc.setTextColor(...(isFail ? RED : DEEP_BLUE));
    doc.text(
      isFail ? 'Descripcion de la No Conformidad:' : 'Descripcion de la Conformidad Verificada:',
      marginX + 3,
      cy
    );
    cy += 3.8;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.3);
    doc.setTextColor(...GRAPHITE);
    doc.text(noteLines, marginX + 3, cy);
    cy += noteLines.length * 3.8 + 1.5;

    // Bloque correctivo si es FALLA
    if (isFail) {
      const boxH = 8 + correctiveLines.length * 3.8;
      doc.setFillColor(255, 245, 245);
      doc.setDrawColor(...RED);
      doc.setLineWidth(0.3);
      doc.roundedRect(marginX + 3, cy, contentWidth - 6, boxH, 1.2, 1.2, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.2);
      doc.setTextColor(...RED);
      doc.text(
        sanitizePdfText(
          `ACCION CORRECTIVA INMEDIATA   |   Orden: ${
            item.maintenanceTicketId || 'N/A'
          }   |   Plazo cierre: ${item.dueDate}`
        ),
        marginX + 5.5,
        cy + 4.3
      );

      if (correctiveLines.length > 0) {
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(...GRAPHITE);
        doc.text(correctiveLines, marginX + 5.5, cy + 8.5);
      }
    }

    y = cardTop + cardHeight + 4;
  });

  // Bloque 4: Cierre Legal y Firma Digital Capturada con Mouse
  ensureSpace(58);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...STEEL);
  doc.text('3. CIERRE DE RONDA, VALIDEZ LEGAL Y FIRMA DIGITAL DEL INSPECTOR', marginX, y + 2);
  y += 5;

  doc.setFillColor(...LIGHT_BG);
  doc.setDrawColor(...NAVY);
  doc.setLineWidth(0.4);
  doc.roundedRect(marginX, y, contentWidth, 48, 2, 2, 'FD');

  // Columna izquierda: declaración y metadatos criptográficos
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...GRAPHITE);
  const legalText = doc.splitTextToSize(
    sanitizePdfText(
      `El suscrito Inspector HSEQ certifica que los ${payload.items.length} puntos y ${totalSub} sub-criterios técnicos listados en la presente acta fueron verificados en campo durante la jornada del ${payload.inspectionDate}. Los hallazgos marcados como No Conforme generaron ordenes de trabajo prioritarias hacia Mantenimiento. Documento autenticado electronicamente con conservacion obligatoria de 20 anos conforme al Decreto 1072 de 2015.`
    ),
    98
  );
  doc.text(legalText, marginX + 4, y + 6.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.2);
  doc.setTextColor(...NAVY);
  doc.text(sanitizePdfText(`Estampa Horaria ATEX: ${payload.signedTimestamp}`), marginX + 4, y + 32);
  doc.text(
    sanitizePdfText(`Sello de Integridad: SST-ACT-${payload.roundCode.replace(/[^A-Z0-9]/g, '')}-${payload.inspectorBadge}`),
    marginX + 4,
    y + 37
  );
  doc.setTextColor(...GREEN);
  doc.text('ESTADO: ACTA FIRMADA Y ARCHIVADA EN BOVEDA HSEQ', marginX + 4, y + 42.5);

  // Columna derecha: firma manuscrita capturada
  const sigBoxX = marginX + 107;
  const sigBoxY = y + 4;
  const sigBoxW = contentWidth - 111;
  const sigBoxH = 27;

  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(...BORDER);
  doc.roundedRect(sigBoxX, sigBoxY, sigBoxW, sigBoxH, 1.5, 1.5, 'FD');

  if (payload.signatureDataUrl) {
    try {
      doc.addImage(payload.signatureDataUrl, 'PNG', sigBoxX + 2, sigBoxY + 1.5, sigBoxW - 4, sigBoxH - 3);
    } catch {
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(12);
      doc.setTextColor(...NAVY);
      doc.text(sanitizePdfText(payload.inspectorName), sigBoxX + sigBoxW / 2, sigBoxY + 16, {
        align: 'center'
      });
    }
  }

  doc.setDrawColor(...NAVY);
  doc.setLineWidth(0.35);
  doc.line(sigBoxX + 4, y + 34, sigBoxX + sigBoxW - 4, y + 34);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...NAVY);
  doc.text(sanitizePdfText(payload.inspectorName), sigBoxX + sigBoxW / 2, y + 38.5, {
    align: 'center'
  });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...MUTED);
  doc.text(
    sanitizePdfText(`${payload.inspectorRole} | Carne #${payload.inspectorBadge}`),
    sigBoxX + sigBoxW / 2,
    y + 42.8,
    { align: 'center' }
  );

  // Pie de página con numeración total en todas las páginas
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setDrawColor(...BORDER);
    doc.setLineWidth(0.25);
    doc.line(marginX, pageHeight - 13, pageWidth - marginX, pageHeight - 13);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(...MUTED);
    doc.text(
      sanitizePdfText(
        `SST-Active | Prevencion Digital e Inteligencia Laboral Industrial | ${payload.actaCode}`
      ),
      marginX,
      pageHeight - 8.5
    );
    doc.text(
      `Pagina ${p} de ${totalPages}`,
      pageWidth - marginX,
      pageHeight - 8.5,
      { align: 'right' }
    );
  }

  doc.save(`${payload.actaCode}.pdf`);
};
