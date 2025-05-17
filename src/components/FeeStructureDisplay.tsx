import React, { forwardRef } from 'react'; // Import forwardRef
import { Check, X } from 'lucide-react';

interface FeeStructureDisplayProps {
  studentData: {
    name: string;
    class: string;
    joiningDate: string;
    feesPaidUpTo: string;
    monthlyFees: string;
    subjects: string[];
    paidMonths: Record<string, boolean>;
  };
  relevantMonths: string[];
  dueAmount: number;
  userName: string;
  outputType?: 'pdf' | 'screen_preview'; // 'pdf' will be the primary, "zoomed" style
}

// Wrap with forwardRef to allow passing ref directly to this component's root div
export const FeeStructureDisplay = forwardRef<HTMLDivElement, FeeStructureDisplayProps>(({
  studentData,
  relevantMonths,
  dueAmount,
  userName,
  outputType = 'screen_preview', // Default for on-screen scaled preview
}, ref) => {
  const isPdfStyle = outputType === 'pdf'; // This is the "master" larger style

  const formattedJoiningDate = studentData.joiningDate
    ? new Date(studentData.joiningDate + 'T00:00:00').toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'N/A';
  const formattedFeesPaidUpTo = studentData.feesPaidUpTo
    ? new Date(studentData.feesPaidUpTo + 'T00:00:00').toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'N/A';

  const getSignatureUrl = (name: string) => {
    switch (name) {
      case 'Izaj Ahmad': return "/izaj_sign.png";
      case 'Sonu Mahato': return "/sonu_sign.png";
      default: return "/guest_sign.png";
    }
  };

  const academyLogoUrl = "/logo.png";
  const monthlyFeeNumeric = parseFloat(studentData.monthlyFees) || 0;
  const totalSessionFee = monthlyFeeNumeric * relevantMonths.length;
  const totalAmountPaid = monthlyFeeNumeric * relevantMonths.filter(month => studentData.paidMonths[month]).length;

  // --- Style Definitions for PDF (Larger/Zoomed) ---
  // These are applied if isPdfStyle is true.
  // If not, screen_preview might use slightly smaller/adjusted Tailwind classes or rely on scaling.
  // For simplicity, we'll primarily use isPdfStyle to differentiate major sizing.

  const containerPadding = isPdfStyle ? "p-[12mm]" : "p-[10mm]"; // A bit less for screen if not scaled heavily
  const headerLogoSize = isPdfStyle ? "h-14 w-14" : "h-12 w-12";
  const mainHeadingSize = isPdfStyle ? "text-3xl" : "text-2xl";
  const subHeadingSize = isPdfStyle ? "text-sm" : "text-xs";
  const addressTextSize = isPdfStyle ? "text-xs" : "text-[10px]";
  const sectionTitleSize = isPdfStyle ? "text-xl" : "text-lg";
  const infoBoxHeadingSize = isPdfStyle ? "text-base" : "text-sm";
  const infoBoxTextSize = isPdfStyle ? "text-xs" : "text-[11px]";
  const subjectTagTextSize = isPdfStyle ? "text-[11px]" : "text-[10px]";
  const tableBaseTextSize = isPdfStyle ? "text-[11px]" : "text-[10px]";
  const summaryBoxLabelSize = isPdfStyle ? "text-xs" : "text-[10px]";
  const summaryBoxValueSize = isPdfStyle ? "text-sm" : "text-xs";
  const signatureSectionTextSize = isPdfStyle ? "text-[11px]" : "text-[10px]";
  const signatureTextSize = isPdfStyle ? "text-[9px]" : "text-[8px]";
  const taglineTextSize = isPdfStyle ? "text-sm" : "text-xs";


  return (
    <div 
      ref={ref} // Attach the forwarded ref here
      className={`fee-display-container bg-white text-black min-h-[297mm] w-[210mm] mx-auto flex flex-col 
                  shadow-xl print:shadow-none print:border-none print:m-0 box-border ${containerPadding}`}
    >
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none -z-0 print:opacity-[0.02]">
        <img src={academyLogoUrl} alt="Hopes Academy Watermark" className="w-3/4 h-3/4 object-contain transform -rotate-[30deg]" />
      </div>

      <div className="relative z-10 flex-grow flex flex-col">
        <div className={`text-center border-b-2 border-green-700 ${isPdfStyle ? 'pb-3 mb-5' : 'pb-2 mb-3'}`}>
          <div className={`flex justify-center items-center ${isPdfStyle ? 'mb-1.5' : 'mb-1'}`}>
            <img src={academyLogoUrl} alt="Hopes Academy" className={`${headerLogoSize} object-contain mr-3`} />
            <div>
              <h1 className={`${mainHeadingSize} font-bold text-green-700 tracking-tight`}>HOPES ACADEMY</h1>
              <p className={`${subHeadingSize} text-gray-700 font-medium`}>A Place for Quality Education</p>
            </div>
          </div>
          <p className={`${addressTextSize} text-gray-600 leading-snug`}>Janta Market, Near Hotel Madhulika Inn, Bartand, Dhanbad-826001</p>
          <p className={`${addressTextSize} text-gray-600 leading-snug`}>Mobile: +91 7903066925 | Email: newhopesacademy@gmail.com</p>
        </div>

        <div className={`text-center ${isPdfStyle ? 'mb-6' : 'mb-4'}`}>
          <h2 className={`${sectionTitleSize} font-bold text-green-700 border-2 border-green-700 inline-block rounded-lg shadow-md bg-green-50 ${isPdfStyle ? 'px-5 py-1.5' : 'px-4 py-1'}`}>
            FEE RECEIPT / STRUCTURE
          </h2>
        </div>

        <div className={`grid grid-cols-2 gap-x-4 gap-y-3 ${infoBoxTextSize} ${isPdfStyle ? 'mb-6' : 'mb-4'}`}>
          <div className={`border border-gray-300 rounded-lg bg-gray-50/50 ${isPdfStyle ? 'p-3' : 'p-2.5'}`}>
            <h3 className={`${infoBoxHeadingSize} font-bold text-green-700 ${isPdfStyle ? 'mb-1.5' : 'mb-1'}`}>Student Information</h3>
            {[
              { label: "Name", value: studentData.name || 'N/A' },
              { label: "Class", value: studentData.class || 'N/A' },
              { label: "Date of Joining", value: formattedJoiningDate },
              { label: "Fees Calculated Up To", value: formattedFeesPaidUpTo },
              { label: "Monthly Tuition Fee", value: `₹${monthlyFeeNumeric.toFixed(2)}` },
            ].map(item => (
              <div key={item.label} className={`flex justify-between items-center border-b border-gray-200 last:border-b-0 ${isPdfStyle ? 'py-0.5 leading-normal' : 'py-0.5 leading-tight'}`}>
                <span className="font-medium text-gray-700 whitespace-nowrap mr-2">{item.label}:</span>
                <span className="text-gray-800 text-right w-full">{item.value}</span>
              </div>
            ))}
          </div>
          <div className={`border border-gray-300 rounded-lg bg-gray-50/50 ${isPdfStyle ? 'p-3' : 'p-2.5'}`}>
            <h3 className={`${infoBoxHeadingSize} font-bold text-green-700 ${isPdfStyle ? 'mb-1.5' : 'mb-1'}`}>Subjects Enrolled</h3>
            {studentData.subjects.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {studentData.subjects.map(subject => (
                  <span key={subject} className={`${subjectTagTextSize} bg-green-100 text-green-800 px-2.5 py-0.5 rounded-full font-medium`}>{subject}</span>
                ))}
              </div>
            ) : (<p className="text-gray-500">No subjects specified.</p>)}
          </div>
        </div>

        <div className={`flex-grow ${isPdfStyle ? 'mb-6' : 'mb-4'}`}>
          <h3 className={`${infoBoxHeadingSize} font-bold text-green-700 ${isPdfStyle ? 'mb-2' : 'mb-1.5'}`}>Fee Payment Details (Session: {relevantMonths.length > 0 ? `${relevantMonths[0]} to ${relevantMonths[relevantMonths.length - 1]}` : 'N/A'})</h3>
          {relevantMonths.length > 0 ? (
            <div className="overflow-x-auto print:overflow-visible">
              <table className={`w-full ${tableBaseTextSize} border border-collapse border-gray-400`}>
                <thead className="bg-green-600 text-white">
                  <tr>
                    <th className={`border border-gray-300 text-left ${isPdfStyle ? 'p-1.5' : 'p-1'}`}>S.No.</th>
                    <th className={`border border-gray-300 text-left ${isPdfStyle ? 'p-1.5' : 'p-1'}`}>Month & Year</th>
                    <th className={`border border-gray-300 text-right ${isPdfStyle ? 'p-1.5' : 'p-1'}`}>Tuition Fee</th>
                    <th className={`border border-gray-300 text-center ${isPdfStyle ? 'p-1.5' : 'p-1'}`}>Payment Status</th>
                  </tr>
                </thead>
                <tbody>
                  {relevantMonths.map((monthYear, index) => (
                    <tr key={monthYear} className={`${index % 2 === 0 ? 'bg-white' : 'bg-green-50/50'} border-b border-gray-200`}>
                      <td className={`border border-gray-300 ${isPdfStyle ? 'p-1.5' : 'p-1'}`}>{index + 1}</td>
                      <td className={`border border-gray-300 ${isPdfStyle ? 'p-1.5' : 'p-1'}`}>{monthYear}</td>
                      <td className={`border border-gray-300 text-right ${isPdfStyle ? 'p-1.5' : 'p-1'}`}>₹{monthlyFeeNumeric.toFixed(2)}</td>
                      <td className={`border border-gray-300 text-center font-semibold ${studentData.paidMonths[monthYear] ? 'text-green-600' : 'text-red-600'} ${isPdfStyle ? 'p-1.5' : 'p-1'}`}>
                        {studentData.paidMonths[monthYear] ? 
                          (<span className="flex items-center justify-center"><Check size={isPdfStyle ? 16:14} className="mr-1" /> Paid</span>) :
                          (<span className="flex items-center justify-center"><X size={isPdfStyle ? 16:14} className="mr-1" /> Due</span>)
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (<p className="text-gray-500 text-center py-3">No fee period applicable.</p>)}
        </div>
        
        <div className={`grid grid-cols-3 gap-3 ${summaryBoxLabelSize} ${isPdfStyle ? 'mb-6' : 'mb-4'}`}>
            {[
                { label: "Total Session Fee:", value: totalSessionFee, bgColor: 'bg-blue-50', textColor: 'text-blue-700' },
                { label: "Total Amount Paid:", value: totalAmountPaid, bgColor: 'bg-green-50', textColor: 'text-green-700' },
                { label: "Total Due Amount:", value: dueAmount, bgColor: dueAmount > 0 ? 'bg-red-50' : 'bg-red-50', textColor: dueAmount > 0 ? 'text-red-700' : 'text-green-700', borderColor: dueAmount > 0 ? 'border-red-400' : 'border-green-400' }
            ].map(summary => (
                <div key={summary.label} className={`border rounded-lg ${summary.bgColor} ${summary.textColor} ${summary.borderColor || 'border-gray-300'} ${isPdfStyle ? 'p-2.5' : 'p-2'}`}>
                    <p className="font-medium leading-snug">{summary.label}</p>
                    <p className={`${summaryBoxValueSize} font-bold`}>₹{summary.value.toFixed(2)}</p>
                </div>
            ))}
        </div>

        <div className={`mt-auto border-t border-gray-300 ${isPdfStyle ? 'pt-4' : 'pt-3'}`}>
          <div className={`${signatureSectionTextSize} flex flex-row justify-between items-end gap-4`}>
            <div className="leading-snug">
              <p className="font-medium">Receipt Generated On:</p>
              <p>{new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
              <p className="mt-1.5 text-gray-500">This is a computer-generated receipt.</p>
            </div>
            <div className="text-right">
              <div className={`mb-1 ${isPdfStyle ? 'h-10' : 'h-8'}`}>
                <img src={getSignatureUrl(userName)} alt={`${userName} Signature`} className={`max-h-full object-contain ml-auto ${isPdfStyle ? 'max-w-[120px]' : 'max-w-[100px]'}`} style={{ filter: 'brightness(0) saturate(100%)' }}/>
              </div>
              <p className="font-semibold border-t border-gray-400 pt-1">{userName}</p>
              <p className={`${signatureTextSize} text-gray-600`}>Authorized Signatory, Hopes Academy</p>
            </div>
          </div>
          <div className={`text-center ${isPdfStyle ? 'mt-5' : 'mt-4'}`}>
            <div className={`inline-block border-2 border-green-700 rounded-lg p-0.5 shadow-lg bg-gradient-to-br from-green-600 to-green-800 transform hover:scale-105 transition-transform duration-300 print:transform-none print:shadow-none`}>
              <div className={`bg-black rounded-md border border-green-400/50 ${isPdfStyle ? 'px-4 py-2' : 'px-3 py-1.5'}`}>
                <p className={`${taglineTextSize} font-bold text-green-400 tracking-wide`}>"Building Dreams, Empowering Minds: Hopes Academy"</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
FeeStructureDisplay.displayName = "FeeStructureDisplay"; // For better debugging in React DevTools