/**
 * Shree Saraswati Secondary School - Dynamic Student QR Identity Ledger Utility
 * 
 * Generates a standard API-based high-density QR code representation 
 * for secure gate access and library ledger verification.
 */

export interface StudentQRData {
  type: 'SHREE_SARASWATI_GATE_PASS';
  studentId: string;
  name: string;
  className: string;
  rollNumber: string;
  bloodGroup: string;
  parentContact: string;
  secureToken: string;
  generatedDate: string;
}

/**
 * Generates a verification QR code URL containing full student identity metadata.
 * Can be scanned by any smartphone, gate check device or library scanner.
 * 
 * @param studentId Unique student ID (e.g. std-1034)
 * @param name Full Name of the student
 * @param className School grade/class
 * @param rollNumber Roll Number inside the class
 * @param bloodGroup Blood Group of the student
 * @param parentContact Contact number for parent authorization checks
 */
export function generateStudentQRCodeURL(
  studentId: string,
  name: string,
  className: string,
  rollNumber: string | number = 'N/A',
  bloodGroup: string = 'O+',
  parentContact: string = 'N/A'
): string {
  // Generate a mock unique gate verification signature hash
  const shortHash = Math.random().toString(36).substring(2, 8).toUpperCase();
  const secureToken = `GATE-${studentId.toUpperCase()}-${shortHash}`;

  const payload: StudentQRData = {
    type: 'SHREE_SARASWATI_GATE_PASS',
    studentId,
    name,
    className,
    rollNumber: String(rollNumber),
    bloodGroup,
    parentContact,
    secureToken,
    generatedDate: new Date().toISOString().split('T')[0]
  };

  // Build high quality, readable QR code with deep slate color matching our school theme
  return `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(JSON.stringify(payload))}&color=0f172a&bgcolor=ffffff&qzone=2`;
}
