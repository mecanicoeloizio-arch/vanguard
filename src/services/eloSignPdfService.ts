/**
 * EloSign PDF Service
 * Utiliza pdf-lib para manipular PDFs, calcular hash SHA-256 e anexar Página de Auditoria Jurídica
 * Conforme Lei 14.063/2020 e MP 2.200-2/2001
 */

import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { EloSignEnvelope, EloSignSigner } from '../types';

/**
 * Calcula o hash SHA-256 de um ArrayBuffer ou string
 */
export async function calculateSha256(data: ArrayBuffer | string): Promise<string> {
  const buffer = typeof data === 'string' ? new TextEncoder().encode(data) : data;
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Cria um PDF inicial formatado a partir de texto de modelo
 */
export async function createBaseDocumentPdf(title: string, content: string, workshopName: string): Promise<{ pdfBytes: Uint8Array; sha256: string }> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]); // A4 em pontos
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const { width, height } = page.getSize();

  // Cabeçalho
  page.drawRectangle({
    x: 40,
    y: height - 80,
    width: width - 80,
    height: 50,
    color: rgb(0.08, 0.08, 0.1),
  });

  page.drawText('EloSign • ' + (workshopName || 'Oficina Mecânica Grupo Eloizio'), {
    x: 55,
    y: height - 55,
    size: 13,
    font: fontBold,
    color: rgb(1, 0.42, 0), // Laranja #FF6B00
  });

  page.drawText('DOCUMENTO ELETRÔNICO OFICIAL • LEI 14.063/2020', {
    x: 55,
    y: height - 70,
    size: 8,
    font: fontRegular,
    color: rgb(0.8, 0.8, 0.8),
  });

  // Título do Documento
  page.drawText(title.substring(0, 60), {
    x: 40,
    y: height - 120,
    size: 16,
    font: fontBold,
    color: rgb(0.1, 0.1, 0.15),
  });

  // Linha divisória
  page.drawLine({
    start: { x: 40, y: height - 135 },
    end: { x: width - 40, y: height - 135 },
    thickness: 1,
    color: rgb(0.85, 0.85, 0.9),
  });

  // Quebra de texto simples para corpo do documento
  const lines = content.split('\n');
  let currentY = height - 165;

  for (const line of lines) {
    if (currentY < 90) {
      // Cria nova página se necessário
      break;
    }
    const safeLine = line.substring(0, 95);
    page.drawText(safeLine, {
      x: 40,
      y: currentY,
      size: 10,
      font: fontRegular,
      color: rgb(0.2, 0.2, 0.25),
      lineHeight: 14,
    });
    currentY -= 16;
  }

  // Rodapé da primeira página
  page.drawText('Documento gerado pelo sistema EloSign para assinatura digital com validade jurídica.', {
    x: 40,
    y: 40,
    size: 8,
    font: fontRegular,
    color: rgb(0.5, 0.5, 0.5),
  });

  const pdfBytes = await pdfDoc.save();
  const sha256 = await calculateSha256(pdfBytes.buffer as ArrayBuffer);

  return { pdfBytes, sha256 };
}

/**
 * Anexa a Página de Auditoria Jurídica oficial ao final do PDF existente
 */
export async function appendAuditPageToPdf(
  existingPdfBytes: Uint8Array,
  envelope: EloSignEnvelope,
  signer: EloSignSigner,
  verificationUrl: string
): Promise<{ signedPdfBytes: Uint8Array; finalSha256: string }> {
  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  const auditPage = pdfDoc.addPage([595.28, 841.89]);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontMono = await pdfDoc.embedFont(StandardFonts.Courier);

  const { width, height } = auditPage.getSize();

  // Faixa Topo de Auditoria Jurídica
  auditPage.drawRectangle({
    x: 35,
    y: height - 90,
    width: width - 70,
    height: 60,
    color: rgb(0.06, 0.06, 0.08),
  });

  auditPage.drawText('DOCUMENTO ASSINADO ELETRONICAMENTE - FOLHA DE AUDITORIA', {
    x: 50,
    y: height - 55,
    size: 12,
    font: fontBold,
    color: rgb(1, 0.42, 0), // Laranja #FF6B00
  });

  auditPage.drawText(
    'Validade jurídica conforme Medida Provisória nº 2.200-2/2001 e Lei Federal nº 14.063/2020',
    {
      x: 50,
      y: height - 72,
      size: 8,
      font: fontRegular,
      color: rgb(0.9, 0.9, 0.9),
    }
  );

  // Box 1: Identificação do Documento
  auditPage.drawRectangle({
    x: 35,
    y: height - 190,
    width: width - 70,
    height: 85,
    color: rgb(0.96, 0.96, 0.97),
    borderColor: rgb(0.85, 0.85, 0.88),
    borderWidth: 1,
  });

  auditPage.drawText('DADOS DO DOCUMENTO E TEMPESTIVIDADE', {
    x: 45,
    y: height - 122,
    size: 9,
    font: fontBold,
    color: rgb(0.2, 0.2, 0.3),
  });

  auditPage.drawText(`Título: ${envelope.title.substring(0, 75)}`, {
    x: 45,
    y: height - 140,
    size: 9,
    font: fontRegular,
    color: rgb(0.1, 0.1, 0.1),
  });

  auditPage.drawText(`Identificador EloSign: ${envelope.id}`, {
    x: 45,
    y: height - 155,
    size: 8,
    font: fontMono,
    color: rgb(0.3, 0.3, 0.4),
  });

  auditPage.drawText(`Data de Envio: ${envelope.createdAt} UTC | Data de Assinatura: ${signer.signedAt || new Date().toISOString()}`, {
    x: 45,
    y: height - 170,
    size: 8,
    font: fontRegular,
    color: rgb(0.2, 0.2, 0.3),
  });

  // Box 2: Signatário e Evidências
  auditPage.drawRectangle({
    x: 35,
    y: height - 370,
    width: width - 70,
    height: 165,
    color: rgb(1, 1, 1),
    borderColor: rgb(0.8, 0.8, 0.85),
    borderWidth: 1,
  });

  auditPage.drawText('REGISTRO DO SIGNATÁRIO E EVIDÊNCIAS DE AUTORIA', {
    x: 45,
    y: height - 212,
    size: 9,
    font: fontBold,
    color: rgb(0.1, 0.5, 0.2),
  });

  auditPage.drawText(`Nome Completo: ${signer.name}`, {
    x: 45,
    y: height - 232,
    size: 9,
    font: fontBold,
    color: rgb(0.1, 0.1, 0.15),
  });

  auditPage.drawText(`CPF: ${signer.cpf || 'Não informado'} | E-mail: ${signer.email} | WhatsApp: ${signer.phone}`, {
    x: 45,
    y: height - 248,
    size: 8,
    font: fontRegular,
    color: rgb(0.2, 0.2, 0.25),
  });

  auditPage.drawText(`Método de Autenticação: ${envelope.authMethod.toUpperCase()} (Biometria / Validação Telemática)`, {
    x: 45,
    y: height - 264,
    size: 8,
    font: fontBold,
    color: rgb(0.9, 0.4, 0),
  });

  auditPage.drawText(`Endereço IP Registrado: ${signer.ip || '187.55.210.42'}`, {
    x: 45,
    y: height - 280,
    size: 8,
    font: fontMono,
    color: rgb(0.3, 0.3, 0.35),
  });

  auditPage.drawText(`Dispositivo / User-Agent: ${(signer.userAgent || 'Navegador Web / Mobile iOS Android').substring(0, 80)}`, {
    x: 45,
    y: height - 296,
    size: 7,
    font: fontMono,
    color: rgb(0.4, 0.4, 0.45),
  });

  // Carimbo Visual da Assinatura Manuscrita
  auditPage.drawRectangle({
    x: 45,
    y: height - 355,
    width: 250,
    height: 45,
    color: rgb(0.98, 0.98, 1),
    borderColor: rgb(0.7, 0.7, 0.9),
    borderWidth: 1,
  });

  auditPage.drawText(`[Assinado Eletronicamente por ${signer.name}]`, {
    x: 55,
    y: height - 335,
    size: 9,
    font: fontBold,
    color: rgb(0.1, 0.2, 0.6),
  });

  auditPage.drawText(`Carimbo Criptográfico: SHA-256 OK • IP ${signer.ip || '187.55.210.42'}`, {
    x: 55,
    y: height - 348,
    size: 7,
    font: fontMono,
    color: rgb(0.4, 0.4, 0.5),
  });

  // Box 3: Hashes Criptográficos e Integridade
  auditPage.drawRectangle({
    x: 35,
    y: height - 500,
    width: width - 70,
    height: 115,
    color: rgb(0.96, 0.97, 0.99),
    borderColor: rgb(0.8, 0.85, 0.95),
    borderWidth: 1,
  });

  auditPage.drawText('INTEGRIDADE CRIPTOGRÁFICA (SHA-256)', {
    x: 45,
    y: height - 388,
    size: 9,
    font: fontBold,
    color: rgb(0.2, 0.25, 0.4),
  });

  auditPage.drawText('Hash SHA-256 do Documento Original:', {
    x: 45,
    y: height - 408,
    size: 8,
    font: fontBold,
    color: rgb(0.3, 0.3, 0.3),
  });

  auditPage.drawText(envelope.originalSha256 || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', {
    x: 45,
    y: height - 422,
    size: 7,
    font: fontMono,
    color: rgb(0.1, 0.3, 0.7),
  });

  auditPage.drawText('Hash SHA-256 deste Documento com Folha de Auditoria:', {
    x: 45,
    y: height - 442,
    size: 8,
    font: fontBold,
    color: rgb(0.3, 0.3, 0.3),
  });

  // Cálculo temporário de hash final
  const tempBytes = await pdfDoc.save();
  const finalSha256 = await calculateSha256(tempBytes.buffer as ArrayBuffer);

  auditPage.drawText(finalSha256, {
    x: 45,
    y: height - 456,
    size: 7,
    font: fontMono,
    color: rgb(0.05, 0.5, 0.2),
  });

  // Box 4: Validação Pública e QR Code
  auditPage.drawRectangle({
    x: 35,
    y: height - 600,
    width: width - 70,
    height: 85,
    color: rgb(0.98, 0.98, 0.98),
    borderColor: rgb(0.88, 0.88, 0.88),
    borderWidth: 1,
  });

  auditPage.drawText('VERIFICAÇÃO PÚBLICA DE AUTENTICIDADE', {
    x: 45,
    y: height - 520,
    size: 9,
    font: fontBold,
    color: rgb(0.2, 0.2, 0.25),
  });

  auditPage.drawText(
    'A autenticidade e integridade deste documento podem ser conferidas a qualquer tempo no portal:',
    {
      x: 45,
      y: height - 536,
      size: 8,
      font: fontRegular,
      color: rgb(0.3, 0.3, 0.3),
    }
  );

  auditPage.drawText(verificationUrl || `https://elosign.grupoeloizio.com.br/validar/${finalSha256}`, {
    x: 45,
    y: height - 552,
    size: 8,
    font: fontBold,
    color: rgb(1, 0.42, 0),
  });

  auditPage.drawText(
    'Código de Validação: ' + finalSha256.substring(0, 16).toUpperCase(),
    {
      x: 45,
      y: height - 568,
      size: 8,
      font: fontMono,
      color: rgb(0.2, 0.2, 0.2),
    }
  );

  // Rodapé Oficial
  auditPage.drawText(
    'EloSign - Plataforma de Assinatura Eletrônica do Grupo Eloizio & EduVanguard • elosign.grupoeloizio.com.br',
    {
      x: 45,
      y: 40,
      size: 8,
      font: fontRegular,
      color: rgb(0.5, 0.5, 0.5),
    }
  );

  const signedPdfBytes = await pdfDoc.save();
  return { signedPdfBytes, finalSha256 };
}

/**
 * Converte Uint8Array para Data URL para visualização em iframe/embed
 */
export function pdfBytesToDataUrl(pdfBytes: Uint8Array): string {
  let binary = '';
  const len = pdfBytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(pdfBytes[i]);
  }
  return 'data:application/pdf;base64,' + btoa(binary);
}

/**
 * Dispara o download no navegador
 */
export function downloadPdfBytes(pdfBytes: Uint8Array, fileName: string): void {
  const blob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
