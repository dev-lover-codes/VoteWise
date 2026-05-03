import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Search, Users, CheckSquare, Shield, Megaphone, BoxSelect, TrendingUp, ChevronDown, ChevronUp, Download, MessageCircle, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const TIMELINE_STAGES = [
  // ... (same stages as before)
  {
    id: 1,
    title: "Election Notification",
    icon: <FileText size={24} />,
    shortDesc: "ECI issues official notification, dates announced",
    details: [
      "The Election Commission of India (ECI) announces the complete schedule.",
      "Notification is issued by the President for Lok Sabha or Governor for Vidhan Sabha.",
      "This triggers the immediate application of the Model Code of Conduct."
    ]
  },
  {
    id: 2,
    title: "Voter Registration & Verification",
    icon: <Search size={24} />,
    shortDesc: "Check your name on voter list using eci.gov.in or 1950 helpline",
    details: [
      "Citizens must ensure their name is on the Electoral Roll.",
      "Use Form 6 for new registration via nvsp.in or Voter Helpline App.",
      "You cannot vote if your name is not on the roll, even if you have a Voter ID."
    ]
  },
  {
    id: 3,
    title: "Filing of Nominations",
    icon: <Users size={24} />,
    shortDesc: "Candidates submit nomination papers to Returning Officer",
    details: [
      "Candidates file their nomination papers along with an affidavit (Form 26).",
      "They must declare criminal records, assets, liabilities, and educational qualifications.",
      "A security deposit is required (Rs 25,000 for general candidates in Lok Sabha)."
    ]
  },
  {
    id: 4,
    title: "Scrutiny of Nominations",
    icon: <CheckSquare size={24} />,
    shortDesc: "Returning Officer checks validity of nominations",
    details: [
      "The Returning Officer (RO) examines all nomination papers.",
      "Invalid forms or those with hidden/false information can be rejected.",
      "Candidates are given a few days to withdraw their nomination if they choose."
    ]
  },
  {
    id: 5,
    title: "Model Code of Conduct",
    icon: <Shield size={24} />,
    shortDesc: "Political parties and candidates must follow ECI rules",
    details: [
      "MCC is a set of guidelines for the conduct of political parties and candidates.",
      "Ensures level playing field and prevents misuse of ruling party power.",
      "No new government schemes can be announced during this period."
    ]
  },
  {
    id: 6,
    title: "Election Campaigning",
    icon: <Megaphone size={24} />,
    shortDesc: "Parties campaign, campaigning stops 48 hours before voting",
    details: [
      "Candidates hold rallies, distribute manifestos, and reach out to voters.",
      "Campaign spending is strictly monitored by ECI observers.",
      "Campaigning officially ends 48 hours before the start of polling (Silence Period)."
    ]
  },
  {
    id: 7,
    title: "Voting Day",
    icon: <BoxSelect size={24} />,
    shortDesc: "Voters cast vote using EVM, VVPAT slip shown for verification",
    details: [
      "Voting is done via Electronic Voting Machines (EVMs).",
      "VVPAT (Voter Verified Paper Audit Trail) prints a slip showing the chosen candidate.",
      "Indelible ink is applied to the left index finger to prevent double voting."
    ]
  },
  {
    id: 8,
    title: "Vote Counting & Results",
    icon: <TrendingUp size={24} />,
    shortDesc: "EVMs opened, votes counted, winner declared",
    details: [
      "EVMs are kept in strong rooms under heavy security.",
      "Counting is done in the presence of candidate representatives.",
      "The candidate with the highest number of votes wins (First-Past-The-Post system)."
    ]
  }
];

export default function Timeline() {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [filter, setFilter] = useState('Lok Sabha');
  const navigate = useNavigate();

  const handleAskAI = (stageTitle: string) => {
    navigate('/chat', { state: { initialMessage: `Can you explain the "${stageTitle}" stage of the Indian election process in more detail?` } });
  };

  const downloadPDF = () => {
    try {
      const doc = new jsPDF();
      
      // Header
      doc.setFontSize(22);
      doc.setTextColor(255, 153, 51); // Saffron
      doc.text("VoteWise: Indian Election Guide", 105, 20, { align: 'center' });
      
      doc.setFontSize(16);
      doc.setTextColor(19, 136, 8); // Green
      doc.text("Step-by-Step Election Process", 105, 30, { align: 'center' });
      
      doc.setDrawColor(200);
      doc.line(20, 35, 190, 35);
      
      // Body
      const tableData = TIMELINE_STAGES.map(stage => [
        stage.id,
        stage.title,
        stage.shortDesc,
        stage.details.join('\n')
      ]);
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (doc as any).autoTable({
        startY: 45,
        head: [['Step', 'Stage', 'Description', 'Details']],
        body: tableData,
        headStyles: { fillColor: [27, 47, 94] }, // Primary color
        theme: 'striped',
        styles: { fontSize: 10, cellPadding: 5 },
        columnStyles: {
          0: { cellWidth: 15 },
          1: { cellWidth: 40 },
          2: { cellWidth: 50 },
          3: { cellWidth: 70 }
        }
      });
      
      doc.save("Indian_Election_Process_Guide.pdf");
      toast.success("Guide downloaded successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate PDF. Please try again.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent font-medium text-xs mb-4"
        >
          <Info size={14} />
          Official ECI Guidelines
        </motion.div>
        <h1 className="text-4xl md:text-5xl font-heading font-extrabold text-primary dark:text-white mb-4 tracking-tight">
          India's Election <span className="text-accent">Journey</span>
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">
          From the initial notification to the declaration of results, follow the world's largest democratic exercise.
        </p>
      </div>

      <div className="flex justify-center mb-12">
        <div className="glass-card flex p-1.5 rounded-full bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
          <button 
            onClick={() => setFilter('Lok Sabha')}
            className={`px-8 py-2.5 rounded-full font-bold transition-all duration-300 ${filter === 'Lok Sabha' ? 'bg-primary text-white shadow-lg scale-105' : 'text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-white'}`}
          >
            Lok Sabha
          </button>
          <button 
            onClick={() => setFilter('Vidhan Sabha')}
            className={`px-8 py-2.5 rounded-full font-bold transition-all duration-300 ${filter === 'Vidhan Sabha' ? 'bg-primary text-white shadow-lg scale-105' : 'text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-white'}`}
          >
            Vidhan Sabha
          </button>
        </div>
      </div>

      <div className="relative">
        <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-primary via-accent to-success opacity-20 -translate-x-1/2 rounded-full"></div>
        
        {TIMELINE_STAGES.map((stage, index) => (
          <motion.div 
            initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
            key={stage.id} 
            className={`relative mb-12 flex flex-col md:flex-row items-center md:justify-between ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
          >
            <div className="hidden md:block md:w-5/12"></div>
            
            <div className="absolute left-6 md:left-1/2 w-12 h-12 rounded-full bg-white dark:bg-slate-800 border-4 border-primary dark:border-primary flex items-center justify-center text-primary font-black shadow-xl -translate-x-1/2 z-10 transition-transform hover:scale-110">
              {stage.id}
            </div>

            <div className="w-full pl-16 md:pl-0 md:w-5/12">
              <div 
                className={`glass-card p-6 cursor-pointer hover:shadow-2xl transition-all duration-500 border border-gray-200 dark:border-white/10 group ${expandedId === stage.id ? 'premium-shadow scale-[1.02]' : ''}`}
                onClick={() => setExpandedId(expandedId === stage.id ? null : stage.id)}
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className={`p-3 rounded-xl bg-slate-100 dark:bg-white/5 text-accent group-hover:scale-110 transition-transform ${expandedId === stage.id ? 'bg-accent/10 text-accent' : ''}`}>
                    {stage.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 dark:text-white group-hover:text-primary dark:group-hover:text-accent transition-colors">{stage.title}</h3>
                  <div className="ml-auto text-slate-400">
                    {expandedId === stage.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{stage.shortDesc}</p>
                
                <AnimatePresence>
                  {expandedId === stage.id && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-6 mt-6 border-t border-gray-100 dark:border-white/10">
                        <ul className="space-y-3 mb-6">
                          {stage.details.map((detail, i) => (
                            <li key={i} className="text-sm text-slate-700 dark:text-slate-300 flex items-start">
                              <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 mr-3 flex-shrink-0" />
                              {detail}
                            </li>
                          ))}
                        </ul>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleAskAI(stage.title); }}
                          className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all font-bold text-sm shadow-md hover:shadow-primary/20"
                        >
                          <MessageCircle size={18} /> Ask AI about this step
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="mt-20 text-center glass-card p-10 border-2 border-primary/10"
      >
        <h3 className="text-2xl font-bold text-primary dark:text-white mb-4 text-glow">Take this guide with you</h3>
        <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto">
          Download our comprehensive step-by-step guide to the Indian election process for offline reading.
        </p>
        <button 
          onClick={downloadPDF}
          className="flex items-center gap-3 mx-auto px-10 py-4 bg-primary text-white rounded-full font-black hover:bg-primary/90 transition-all shadow-xl hover:shadow-primary/30 hover:-translate-y-1 active:scale-95"
        >
          <Download size={22} /> DOWNLOAD GUIDE PDF
        </button>
      </motion.div>
    </div>
  );
}