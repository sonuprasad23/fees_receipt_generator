import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useReactToPrint } from 'react-to-print';
import html2canvas from 'html2canvas';
import { FeeStructureDisplay } from './FeeStructureDisplay';
import { Check, Plus, X, ArrowLeft, ArrowRight, Download, Image as ImageIcon } from 'lucide-react';

// ... (interfaces, constants, calculateRelevantMonths as before)
interface FeeStructureFormProps {
  userName: string;
}

interface StudentData {
  name: string;
  class: string;
  joiningDate: string;
  feesPaidUpTo: string;
  monthlyFees: string;
  subjects: string[];
  paidMonths: Record<string, boolean>;
}

const DEFAULT_SUBJECTS = ['Physics', 'Chemistry', 'Mathematics', 'English', 'Science', 'Social Science', 'Java', 'Python'];

const calculateRelevantMonths = (dojString: string, fputString: string): string[] => {
  if (!dojString || !fputString) { return []; }
  const [jy, jm, jd] = dojString.split('-').map(Number);
  const joiningDate = new Date(jy, jm - 1, jd);
  const [fy, fm, fd] = fputString.split('-').map(Number);
  const feesPaidUpToDate = new Date(fy, fm - 1, fd);
  if (isNaN(joiningDate.getTime()) || isNaN(feesPaidUpToDate.getTime()) || joiningDate > feesPaidUpToDate) { return []; }
  const monthsNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const relevantMonthsArray: string[] = [];
  let currentDateInLoop = new Date(joiningDate.getFullYear(), joiningDate.getMonth(), 1);
  const endDateLoopLimit = new Date(feesPaidUpToDate.getFullYear(), feesPaidUpToDate.getMonth(), 1);
  while (currentDateInLoop <= endDateLoopLimit) {
    relevantMonthsArray.push(`${monthsNames[currentDateInLoop.getMonth()]} ${currentDateInLoop.getFullYear()}`);
    currentDateInLoop.setMonth(currentDateInLoop.getMonth() + 1);
  }
  return relevantMonthsArray;
};


export function FeeStructureForm({ userName }: FeeStructureFormProps) {
  const initialJoiningDate = new Date().toISOString().split('T')[0];
  const initialFeesPaidUpTo = (() => {
    const today = new Date();
    let year = today.getFullYear();
    if (today.getMonth() >= 3) { year += 1; }
    return new Date(year, 2, 31).toISOString().split('T')[0];
  })();

  const [studentData, setStudentData] = useState<StudentData>({
    name: '', class: '', joiningDate: initialJoiningDate, feesPaidUpTo: initialFeesPaidUpTo,
    monthlyFees: '', subjects: [], paidMonths: {},
  });

  const [customSubject, setCustomSubject] = useState('');
  const [step, setStep] = useState(1);
  const [relevantMonths, setRelevantMonths] = useState<string[]>(() =>
    calculateRelevantMonths(initialJoiningDate, initialFeesPaidUpTo)
  );

  // Single ref for the component that will be printed to PDF and captured for Image
  const outputSourceRef = useRef<HTMLDivElement>(null); 

  useEffect(() => {
    const newRelevantMonths = calculateRelevantMonths(studentData.joiningDate, studentData.feesPaidUpTo);
    setRelevantMonths(newRelevantMonths);
    setStudentData(prev => {
      const updatedPaidMonths: Record<string, boolean> = {};
      newRelevantMonths.forEach(monthYear => { updatedPaidMonths[monthYear] = prev.paidMonths[monthYear] || false; });
      return { ...prev, paidMonths: updatedPaidMonths };
    });
  }, [studentData.joiningDate, studentData.feesPaidUpTo]);

  const pageStyle = `
    @page { size: A4 portrait; margin: 0; }
    @media print {
      body, html { background-color: white !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
      /* Styles for .fee-display-container (root of FeeStructureDisplay) are handled by its own classes and outputType='pdf' */
      .print-hidden { display: none !important; }
      .print-visible-only { display: block !important; visibility: visible !important; position: static !important; }
    }
  `;

  const handlePrint = useReactToPrint({
    content: () => outputSourceRef.current, // Target the single source
    pageStyle: pageStyle,
    documentTitle: `${studentData.name.trim() || 'Student'} Fee Receipt - Hopes Academy`,
    onPrintError: (errorType, error) => console.error("PDF Print Error:", errorType, error),
  });

  const handleDownloadImage = useCallback(() => {
    const elementToCapture = outputSourceRef.current; // Target the single source

    if (elementToCapture) {
      const images = Array.from(elementToCapture.getElementsByTagName('img'));
      const promises = images.map(img => {
        if (img.complete && img.naturalHeight !== 0) return Promise.resolve();
        return new Promise<void>(resolve => {
          img.onload = () => resolve();
          img.onerror = () => { console.warn("Image load error, proceeding for image capture:", img.src); resolve(); };
        });
      });

      Promise.all(promises).then(() => {
        html2canvas(elementToCapture, { // elementToCapture IS the FeeStructureDisplay (styled for PDF)
          scale: 2.5, 
          useCORS: true,
          backgroundColor: '#ffffff',
          logging: true, // Keep true for debugging this
          scrollX: 0,
          scrollY: 0,
          width: elementToCapture.offsetWidth,
          height: elementToCapture.offsetHeight,
          windowWidth: elementToCapture.scrollWidth,
          windowHeight: elementToCapture.scrollHeight,
        }).then(canvas => {
          const link = document.createElement('a');
          link.download = `${studentData.name.trim() || 'Student'} Fee Receipt.png`;
          link.href = canvas.toDataURL('image/png');
          link.click();
        }).catch(err => {
          console.error("Image Capture Error (html2canvas):", err);
          alert("Error generating image. Check console.");
        });
      }).catch(err => {
          console.error("Error waiting for images to load for image capture:", err);
          alert("An error occurred while preparing the image. Please try again.");
      });
    } else {
      alert("Source element for image/PDF (outputSourceRef) not found or not attached.");
      console.error("outputSourceRef.current is null or undefined when attempting image/PDF generation.");
    }
  }, [studentData.name]);


  // ... (handleChange, toggleSubject, addCustomSubject, togglePaidMonth, getDueAmount, nextStep, prevStep - ensure these are complete)
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setStudentData(prev => ({ ...prev, [name]: value }));
  }, []);

  const toggleSubject = useCallback((subject: string) => {
    setStudentData(prev => ({ ...prev, subjects: prev.subjects.includes(subject) ? prev.subjects.filter(s => s !== subject) : [...prev.subjects, subject] }));
  }, []);

  const addCustomSubject = useCallback(() => {
    if (customSubject.trim() && !studentData.subjects.includes(customSubject.trim())) {
      setStudentData(prev => ({ ...prev, subjects: [...prev.subjects, customSubject.trim()] }));
      setCustomSubject('');
    }
  }, [customSubject, studentData.subjects]);

  const togglePaidMonth = useCallback((monthYear: string) => {
    setStudentData(prev => ({ ...prev, paidMonths: { ...prev.paidMonths, [monthYear]: !prev.paidMonths[monthYear] } }));
  }, []);

  const getDueAmount = useCallback(() => {
    const monthlyFees = parseFloat(studentData.monthlyFees) || 0;
    return monthlyFees * relevantMonths.filter(monthYear => !studentData.paidMonths[monthYear]).length;
  }, [studentData.monthlyFees, relevantMonths, studentData.paidMonths]);

  const nextStep = useCallback(() => {
    if (step === 1 && (!studentData.name.trim() || !studentData.class.trim() || !studentData.monthlyFees || parseFloat(studentData.monthlyFees) <= 0 || !studentData.joiningDate || !studentData.feesPaidUpTo || new Date(studentData.joiningDate + "T00:00:00") > new Date(studentData.feesPaidUpTo + "T00:00:00"))) {
      alert('Please fill all details correctly. Joining date cannot be after "fees up to" date.'); return;
    }
    if (step === 2 && studentData.subjects.length === 0) { alert('Please select at least one subject.'); return; }
    setStep(prev => prev + 1);
  }, [step, studentData]);

  const prevStep = useCallback(() => setStep(prev => prev - 1), []);


  const renderStepContent = () => {
    switch (step) {
      // Cases 1, 2, 3 - Input Forms (Full JSX omitted for brevity - use your existing)
      case 1: return (/* ... Step 1 JSX ... */ <div className="space-y-6"> <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4"> <div> <label className="block text-sm font-medium text-green-300 mb-1">Student Name *</label> <input type="text" name="name" value={studentData.name} onChange={handleChange} className="w-full px-4 py-2.5 rounded-md bg-gray-800 border border-green-600 text-white focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-500" placeholder="Enter student name" required /> </div> <div> <label className="block text-sm font-medium text-green-300 mb-1">Class *</label> <input type="text" name="class" value={studentData.class} onChange={handleChange} className="w-full px-4 py-2.5 rounded-md bg-gray-800 border border-green-600 text-white focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-500" placeholder="Enter class" required /> </div> <div> <label className="block text-sm font-medium text-green-300 mb-1">Date of Joining *</label> <input type="date" name="joiningDate" value={studentData.joiningDate} onChange={handleChange} className="w-full px-4 py-2.5 rounded-md bg-gray-800 border border-green-600 text-white focus:outline-none focus:ring-2 focus:ring-green-500 custom-date-input" required /> </div> <div> <label className="block text-sm font-medium text-green-300 mb-1">Fees calculated up to *</label> <input type="date" name="feesPaidUpTo" value={studentData.feesPaidUpTo} onChange={handleChange} className="w-full px-4 py-2.5 rounded-md bg-gray-800 border border-green-600 text-white focus:outline-none focus:ring-2 focus:ring-green-500 custom-date-input" required /> </div> <div className="md:col-span-2"> <label className="block text-sm font-medium text-green-300 mb-1">Monthly Tuition Fees (₹) *</label> <input type="number" name="monthlyFees" value={studentData.monthlyFees} onChange={handleChange} className="w-full md:w-1/2 px-4 py-2.5 rounded-md bg-gray-800 border border-green-600 text-white focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-500" placeholder="e.g., 500" required min="1" /> </div> </div> <div className="flex justify-end mt-6"> <button onClick={nextStep} className="flex items-center gap-2 relative group bg-green-500 text-black font-bold py-3 px-6 rounded-lg transform transition-all duration-300 hover:scale-105 hover:shadow-[0_0_15px_rgba(52,211,153,0.7)] active:scale-95"> <span className="relative z-10">Next: Select Subjects</span> <ArrowRight size={20} className="relative z-10" /> </button> </div> </div>);
      case 2: return (/* ... Step 2 JSX ... */ <div className="space-y-6"> <div> <h3 className="text-xl font-semibold text-green-400 mb-4">Select Subjects *</h3> <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-6"> {DEFAULT_SUBJECTS.map(subject => ( <div key={subject} onClick={() => toggleSubject(subject)} className={`cursor-pointer rounded-lg p-3 border-2 transition-all duration-200 flex items-center justify-between text-sm ${studentData.subjects.includes(subject) ? 'bg-green-500/30 border-green-500 text-green-300 shadow-md shadow-green-500/30' : 'bg-gray-800 border-gray-700 hover:border-green-600 text-gray-300 hover:text-white'}`}> <span>{subject}</span> {studentData.subjects.includes(subject) && <Check size={18} className="text-green-400" />} </div> ))} </div> <div className="flex items-center gap-3 mb-4"> <input type="text" value={customSubject} onChange={e => setCustomSubject(e.target.value)} className="flex-1 px-4 py-2.5 rounded-md bg-gray-800 border border-green-600 text-white focus:outline-none focus:ring-2 focus:ring-green-500 placeholder-gray-500" placeholder="Add other subject name" /> <button onClick={addCustomSubject} disabled={!customSubject.trim()} className="p-2.5 rounded-md bg-green-500 text-black disabled:opacity-60 disabled:cursor-not-allowed transform transition-all duration-300 hover:scale-105 active:scale-95"> <Plus size={20} /> </button> </div> {studentData.subjects.length > 0 && ( <div className="mt-4 p-3 bg-gray-800/50 border border-gray-700 rounded-lg"> <h4 className="text-sm font-medium text-green-300 mb-2">Selected Subjects:</h4> <div className="flex flex-wrap gap-2"> {studentData.subjects.map(subject => ( <div key={subject} className="bg-green-500/20 text-green-300 px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs"> {subject} <button onClick={() => toggleSubject(subject)} className="text-green-400 hover:text-red-400 transition-colors"> <X size={14} /> </button> </div> ))} </div> </div> )} </div> <div className="flex justify-between mt-8"> <button onClick={prevStep} className="flex items-center gap-2 px-6 py-3 border-2 border-green-600 text-green-400 rounded-lg hover:bg-green-600/10 transition-all duration-300 transform hover:scale-105 active:scale-95"> <ArrowLeft size={20} /> Back </button> <button onClick={nextStep} className="flex items-center gap-2 relative group bg-green-500 text-black font-bold py-3 px-6 rounded-lg transform transition-all duration-300 hover:scale-105 hover:shadow-[0_0_15px_rgba(52,211,153,0.7)] active:scale-95"> <span className="relative z-10">Next: Payment Status</span> <ArrowRight size={20} className="relative z-10" /> </button> </div> </div>);
      case 3: return (/* ... Step 3 JSX ... */ <div className="space-y-6"> <h3 className="text-xl font-semibold text-green-400 mb-1">Mark Paid Months</h3> <p className="text-sm text-gray-400 mb-4 -mt-3"> Session: {relevantMonths.length > 0 ? `${relevantMonths[0]} to ${relevantMonths[relevantMonths.length - 1]}` : 'N/A'} </p> <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-6"> {relevantMonths.map(monthYear => ( <div key={monthYear} onClick={() => togglePaidMonth(monthYear)} className={`cursor-pointer rounded-lg p-3 border-2 transition-all duration-200 text-sm ${studentData.paidMonths[monthYear] ? 'bg-green-500/30 border-green-500 text-green-300 shadow-md shadow-green-500/30' : 'bg-gray-800 border-gray-700 hover:border-green-600 text-gray-300 hover:text-white'}`}> <div className="flex items-center justify-between"> <span>{monthYear.split(' ')[0]} <span className="text-xs text-gray-400">{monthYear.split(' ')[1]}</span></span> <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${studentData.paidMonths[monthYear] ? 'bg-green-500 border-green-400' : 'border-gray-500 bg-gray-700'}`}> {studentData.paidMonths[monthYear] && <Check size={14} className="text-black" />} </div> </div> </div> ))} </div> <div className="bg-gray-800/70 rounded-lg p-4 border border-green-600 shadow-md"> <div className="flex justify-between items-center"> <span className="text-lg font-medium text-green-300">Total Due Amount:</span> <span className="text-xl font-bold text-green-400">₹{getDueAmount().toFixed(2)}</span> </div> </div> <div className="flex justify-between mt-8"> <button onClick={prevStep} className="flex items-center gap-2 px-6 py-3 border-2 border-green-600 text-green-400 rounded-lg hover:bg-green-600/10 transition-all duration-300 transform hover:scale-105 active:scale-95"> <ArrowLeft size={20} /> Back </button> <button onClick={nextStep} className="flex items-center gap-2 relative group bg-green-500 text-black font-bold py-3 px-6 rounded-lg transform transition-all duration-300 hover:scale-105 hover:shadow-[0_0_15px_rgba(52,211,153,0.7)] active:scale-95"> <span className="relative z-10">Generate Fee Structure</span> <ArrowRight size={20} className="relative z-10" /> </button> </div> </div>);

      case 4: // Preview and Download
        return (
          <div className="space-y-6">
            {/* Off-screen div FOR BOTH PDF AND IMAGE SOURCE, styled for PDF (large view) */}
            {/* This div is now the single source of truth for output generation */}
            <div className="absolute -left-[9999px] -top-[9999px] print-visible-only" aria-hidden="true">
              <FeeStructureDisplay 
                ref={outputSourceRef} // Single ref for both PDF and Image source
                studentData={studentData} 
                relevantMonths={relevantMonths} 
                dueAmount={getDueAmount()} 
                userName={userName} 
                outputType="pdf" // Always use "pdf" (larger) style for this source node
              />
            </div>

            <h3 className="text-xl font-semibold text-green-400 mb-3 text-center">Fee Structure Preview</h3>
            {/* On-screen scaled preview (uses outputType="screen_preview") */}
            <div 
                 className="bg-gray-700 p-1 sm:p-2 rounded-lg border border-green-600 shadow-lg overflow-hidden mx-auto" 
                 style={{ width: 'fit-content', maxWidth: '100%'}}>
                <div className="transform scale-[0.35] sm:scale-[0.5] md:scale-[0.65] origin-top-left" 
                     style={{width: '210mm', height: '297mm', overflow: 'hidden'}}>
                    <FeeStructureDisplay 
                        studentData={studentData} 
                        relevantMonths={relevantMonths} 
                        dueAmount={getDueAmount()} 
                        userName={userName} 
                        outputType="screen_preview" // Styles for on-screen scaled preview
                    />
                </div>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-4 print-hidden">
              <button onClick={prevStep} className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 border-2 border-green-600 text-green-400 rounded-lg hover:bg-green-600/10 transition-all duration-300 transform hover:scale-105 active:scale-95">
                <ArrowLeft size={20} /> Edit Details
              </button>
              <button onClick={handlePrint} className="w-full sm:w-auto flex items-center justify-center gap-2 relative group bg-green-500 text-black font-bold py-3 px-6 rounded-lg transform transition-all duration-300 hover:scale-105 hover:shadow-[0_0_15px_rgba(52,211,153,0.7)] active:scale-95">
                <Download size={20} className="relative z-10" /> <span className="relative z-10">Download PDF</span>
              </button>
              <button onClick={handleDownloadImage} className="w-full sm:w-auto flex items-center justify-center gap-2 relative group bg-teal-500 text-black font-bold py-3 px-6 rounded-lg transform transition-all duration-300 hover:scale-105 hover:shadow-[0_0_15px_rgba(20,184,166,0.7)] active:scale-95">
                <ImageIcon size={20} className="relative z-10" /> <span className="relative z-10">Download Image</span>
              </button>
            </div>
          </div>
        );
      default: return <div>Invalid step.</div>;
    }
  };

  return (
    <div className="container mx-auto px-2 sm:px-4 py-6 print-hidden">
      <div className="bg-gray-900 rounded-xl p-4 sm:p-6 md:p-8 border-2 border-green-700/50 shadow-2xl shadow-green-500/10 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-green-400 mb-1.5">Hopes Academy</h2>
        <p className="text-center text-gray-400 mb-5 text-lg">Fee Structure Generator</p>
        <div className="flex justify-center space-x-2 sm:space-x-4 mb-6">
            {['Details', 'Subjects', 'Payment', 'Generate'].map((label, index) => (
                <div key={label} className="flex flex-col items-center">
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300
                                     ${step > index + 1 ? 'bg-green-500 border-green-400 text-black' : ''}
                                     ${step === index + 1 ? 'bg-green-600 border-green-400 text-white scale-110 shadow-lg shadow-green-500/50' : 'border-gray-600 text-gray-400'}
                                     ${step < index + 1 ? 'bg-gray-700 border-gray-600' : ''}`}>
                        {step > index + 1 ? <Check size={18}/> : index + 1}
                    </div>
                    <span className={`mt-2 text-xs sm:text-sm transition-all duration-300 ${step === index + 1 ? 'text-green-400 font-semibold' : 'text-gray-500'}`}>{label}</span>
                </div>
            ))}
        </div>
        {renderStepContent()}
      </div>
    </div>
  );
}