export interface Question {
  q: string;
  options: string[];
  correct: number;
  explanation: string;
}

export interface QuizCategory {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  time: string;
  questions: Question[];
}

export const QUIZ_CATEGORIES: QuizCategory[] = [
  {
    id: "voter_basics",
    title: "Voter Basics",
    description: "Covers registration, eligibility, and basic IDs.",
    difficulty: "Beginner",
    time: "5 min",
    questions: [
      {
        q: "What is the minimum age to vote in India?",
        options: ["16 years", "18 years", "21 years", "25 years"],
        correct: 1,
        explanation: "The Constitution of India sets the minimum voting age at 18 years."
      },
      {
        q: "What document is used as the primary voter identity in India?",
        options: ["Aadhar Card", "PAN Card", "EPIC (Voter ID Card)", "Passport"],
        correct: 2,
        explanation: "EPIC stands for Electors Photo Identity Card, issued by ECI."
      },
      {
        q: "Which form is filled to register as a new voter?",
        options: ["Form 6", "Form 7", "Form 8", "Form 9"],
        correct: 0,
        explanation: "Form 6 is used to enroll as a new voter or to add your name to the electoral roll."
      },
      {
        q: "Where can you check your name on the voter list?",
        options: ["eci.gov.in", "india.gov.in", "aadhar.gov.in", "rbi.gov.in"],
        correct: 0,
        explanation: "The official ECI website eci.gov.in lets you search your voter registration status."
      },
      {
        q: "What is the Voter Helpline number in India?",
        options: ["100", "1090", "1950", "1800"],
        correct: 2,
        explanation: "1950 is the national Voter Helpline number managed by ECI."
      },
      {
        q: "Can a Non-Resident Indian (NRI) vote in Indian elections?",
        options: ["No, NRIs cannot vote", "Yes, they can vote from abroad", "Yes, but only in person at their registered constituency", "Only in Presidential elections"],
        correct: 2,
        explanation: "NRIs can vote but must be physically present in India at their registered constituency on voting day."
      },
      {
        q: "How many times can a voter vote in a single election?",
        options: ["As many times as they wish", "Twice", "Once", "Depends on their state"],
        correct: 2,
        explanation: "Each registered voter can cast their vote only once per election."
      },
      {
        q: "What is the NVSP portal used for?",
        options: ["Checking election results", "National Voter Service Portal for voter registration services", "Paying election taxes", "Filing nomination papers"],
        correct: 1,
        explanation: "NVSP (National Voters Service Portal) at nvsp.in is the one-stop portal for all voter registration services."
      },
      {
        q: "Which authority maintains the electoral rolls in India?",
        options: ["State Government", "Prime Minister's Office", "Election Commission of India", "Supreme Court"],
        correct: 2,
        explanation: "The Election Commission of India (ECI) is the constitutional authority responsible for maintaining electoral rolls."
      },
      {
        q: "What happens if your name is not on the electoral roll on voting day?",
        options: ["You can vote with Aadhar card", "You cannot vote", "You can vote with a court order", "You can add your name on the spot"],
        correct: 1,
        explanation: "If your name is not on the electoral roll, you cannot vote. Registration must be done before the deadline."
      }
    ]
  },
  {
    id: "election_process",
    title: "Election Process",
    description: "Covers EVM, VVPAT, counting, and election timeline.",
    difficulty: "Intermediate",
    time: "5 min",
    questions: [
      {
        q: "What does EVM stand for?",
        options: ["Electronic Voting Module", "Electronic Voting Machine", "Electoral Vote Manager", "Electronic Vote Monitor"],
        correct: 1,
        explanation: "EVM stands for Electronic Voting Machine, used in Indian elections since 2004 nationwide."
      },
      {
        q: "What is VVPAT?",
        options: ["Voter Verified Paper Audit Trail", "Virtual Voter Paper Audit Technology", "Verified Voting Paper Audit Test", "Voter Verified Public Audit Trail"],
        correct: 0,
        explanation: "VVPAT shows a paper slip to the voter confirming their vote after pressing the EVM button."
      },
      {
        q: "How many hours before voting day does campaigning officially stop?",
        options: ["12 hours", "24 hours", "48 hours", "72 hours"],
        correct: 2,
        explanation: "Under the Model Code of Conduct, all campaigning must stop 48 hours before the voting date."
      },
      {
        q: "What is the Model Code of Conduct?",
        options: ["A law passed by Parliament", "A set of guidelines issued by ECI for parties and candidates during elections", "Rules for journalists covering elections", "Code of conduct for EVM manufacturers"],
        correct: 1,
        explanation: "The Model Code of Conduct (MCC) is a set of guidelines issued by ECI that political parties and candidates must follow during election time."
      },
      {
        q: "Who is the Returning Officer?",
        options: ["The winner of the election", "An official appointed by ECI to oversee elections in a constituency", "The Chief Election Commissioner", "The District Collector who counts votes"],
        correct: 1,
        explanation: "The Returning Officer is the government official responsible for conducting elections in a particular constituency."
      },
      {
        q: "What percentage of votes can trigger an election recount request?",
        options: ["Any margin", "Less than 1%", "Less than 5%", "The rules vary by state"],
        correct: 0,
        explanation: "A candidate can request a recount regardless of the margin, subject to payment of a prescribed fee."
      },
      {
        q: "What color ink is used to mark the voter's finger after voting?",
        options: ["Black", "Blue", "Indelible violet/purple", "Red"],
        correct: 2,
        explanation: "Indelible ink (a violet/purple-colored ink that cannot be easily removed) is applied to the left index finger."
      },
      {
        q: "What is the minimum number of voters required to form a polling station?",
        options: ["100", "500", "1000", "1500"],
        correct: 3,
        explanation: "As per ECI guidelines, a polling station typically serves a maximum of 1500 electors."
      },
      {
        q: "Can independent candidates contest in Lok Sabha elections?",
        options: ["No", "Yes, without any restrictions", "Yes, but only if they were previously in a political party", "Yes, but they need a certain number of proposers"],
        correct: 3,
        explanation: "Yes, independent candidates can contest but must submit a nomination with the required number of proposers from the constituency."
      },
      {
        q: "How is the winning candidate determined in a constituency election in India?",
        options: ["Proportional representation", "First-Past-The-Post system", "Ranked choice voting", "Two-round system"],
        correct: 1,
        explanation: "India uses the First-Past-The-Post (FPTP) system — the candidate with the most votes wins, even without a majority."
      }
    ]
  },
  {
    id: "voting_rights",
    title: "Your Voting Rights",
    description: "Covers constitutional rights, NOTA, and legal aspects.",
    difficulty: "Advanced",
    time: "5 min",
    questions: [
      {
        q: "What is NOTA?",
        options: ["Name Of The Applicant", "None Of The Above", "National Online Tallying Application", "No Official Ticket Available"],
        correct: 1,
        explanation: "NOTA (None Of The Above) was introduced in 2013 by the Supreme Court order, allowing voters to reject all candidates."
      },
      {
        q: "Does pressing NOTA affect the election result if it gets the most votes?",
        options: ["Yes, a re-election is held", "No, the candidate with the next highest votes still wins", "Yes, all candidates are disqualified", "The constituency remains unrepresented"],
        correct: 1,
        explanation: "Currently, even if NOTA gets the most votes, the candidate with the highest votes among contestants wins. NOTA has no power to void an election."
      },
      {
        q: "Is voting in India compulsory?",
        options: ["Yes, it is compulsory by law everywhere", "No, it is a right, not a duty", "Yes in some states like Gujarat", "Only for government employees"],
        correct: 2,
        explanation: "Voting is not compulsory in most of India, but Gujarat and a few other states have local laws encouraging compulsory voting in local body elections."
      },
      {
        q: "Under what Article of the Constitution is the Election Commission of India established?",
        options: ["Article 72", "Article 324", "Article 356", "Article 226"],
        correct: 1,
        explanation: "Article 324 of the Indian Constitution establishes the Election Commission of India and grants it superintendence of elections."
      },
      {
        q: "What is the Right to Vote in India classified as?",
        options: ["Fundamental Right", "Constitutional Right", "Statutory Right under Representation of People Act", "Natural Right"],
        correct: 2,
        explanation: "The right to vote in India is a statutory right under the Representation of the People Act, 1951 — not a Fundamental Right under Part III of the Constitution."
      },
      {
        q: "Can a person in judicial custody vote?",
        options: ["Yes", "No", "Only if released on bail", "Only in state elections"],
        correct: 2,
        explanation: "A person in judicial custody (under-trial) can vote only if released on bail on voting day and their name is on the voter list."
      },
      {
        q: "What is the 'silent period' during elections?",
        options: ["When candidates are not allowed to speak publicly", "48 hours before polling when no campaigning is allowed", "The period between announcement and nomination filing", "The counting period"],
        correct: 1,
        explanation: "The 48 hours before voting begins is called the 'silence period' or 'silence zone' when all campaign activities must stop."
      },
      {
        q: "Who appoints the Chief Election Commissioner of India?",
        options: ["The Prime Minister", "The President of India", "The Parliament", "The Supreme Court"],
        correct: 1,
        explanation: "The Chief Election Commissioner (CEC) is appointed by the President of India on the advice of a selection committee."
      },
      {
        q: "What is the security deposit amount for a general category Lok Sabha candidate?",
        options: ["Rs 10,000", "Rs 25,000", "Rs 50,000", "Rs 1,00,000"],
        correct: 1,
        explanation: "The security deposit for Lok Sabha candidates is Rs 25,000 for general category and Rs 12,500 for SC/ST candidates."
      },
      {
        q: "When was the voting age in India reduced from 21 to 18 years?",
        options: ["1947", "1952", "1989", "2000"],
        correct: 2,
        explanation: "The 61st Constitutional Amendment Act of 1988 (in effect from 1989) reduced the voting age from 21 to 18 years."
      }
    ]
  }
];
