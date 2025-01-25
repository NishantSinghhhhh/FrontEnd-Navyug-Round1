import React, { useEffect, useState , useRef} from "react";
import { creds } from "../data/creds.ts";
import { useAuth } from "../context/AuthContext.tsx";
import "jspdf-autotable";
import { schoolRankingData } from "../data/schoolRanking.ts"
import {schoolFrequencyData} from "../data/schoolFrequency.ts"
import Header from "./Dashboard/Header.tsx";
import TableComponent from "./Dashboard/Table.tsx";
import ScoresTable from "./Dashboard/ScoreTable.tsx";
import BarGraph from "../charts/BarGraph.tsx";
import { armyPublicSchools } from "../data/drive.ts";
import Navbar from "./Navbar.tsx";
import DataLoader from "./DataLoader.tsx";
import { useNavigate } from 'react-router-dom';
interface UserScore {
  username: string;
  studentName: string;
  category: string;
  totalMarks: number;
  [key: string]: any;
}

interface UserScore {
  username: string;
  totalMarks: number;
  section1Marks: number;
  section2Marks: number;
  section3Marks: number;
  category: string;
  studentName: string
}

interface UserInfo {
  username: string;
  student: string;
  setid: string;
}

interface BackendResponse {
  success: boolean;
  message: string;
  userInfo: UserInfo[];
  scores: UserScore[];
}

interface SchoolRankingData {
  school: string;
  averageMarks: number;
  section1Average: number;
  section2Average: number;
  section3Average: number;
  category1Average: number;
  category1Section1Average: number;
  category1Section2Average: number;
  category1Section3Average: number;
  category2Average: number;
  category2Section1Average: number;
  category2Section2Average: number;
  category2Section3Average: number;
  rank: number;
  section1Rank: number;
  section2Rank: number;
  section3Rank: number;
  category1Section1Rank: number;
  category1Section2Rank: number;
  category1Section3Rank: number;
  category2Section1Rank: number;
  category2Section2Rank: number;
  category2Section3Rank: number;
}


const Dashboard: React.FC = () => {
  const { username } = useAuth();
  const [schoolName, setSchoolName] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [fetchedData, setFetchedData] = useState<BackendResponse | null>(null);
  const [schoolRanking, setSchoolRanking] = useState<SchoolRankingData | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const totalMarks = schoolFrequencyData.totalMarks;
  // const category1 = schoolFrequencyData.category1Marks
  const category2 = schoolFrequencyData.category2Marks
  const category1Section1Marks = schoolFrequencyData.category1Section1Marks;
  const category1Section2Marks = schoolFrequencyData.category1Section2Marks;
  const category1Section3Marks = schoolFrequencyData.category1Section3Marks;
  const category2Section1Marks = schoolFrequencyData.category2Section1Marks;
  const category2Section2Marks = schoolFrequencyData.category2Section2Marks;
  const category2Section3Marks = schoolFrequencyData.category2Section3Marks;

  const barGraphRefs = [
    useRef<HTMLDivElement | null>(null),
    useRef<HTMLDivElement | null>(null),
    useRef<HTMLDivElement | null>(null), 
    useRef<HTMLDivElement | null>(null), 
    useRef<HTMLDivElement | null>(null), 
    useRef<HTMLDivElement | null>(null), 
    useRef<HTMLDivElement | null>(null), 
    useRef<HTMLDivElement | null>(null), 
  ];

  useEffect(() => {
    // Redirect to a specific route when the page is loaded or refreshed
    navigate('/Dashboard'); // Change '/Dashboard' to the desired route
  }, [navigate]);

  const handleDownloadAndRedirect = () => {
    const user = creds.find((cred) => cred.username === username);
    
    if (user) {
      const currentSchoolData = armyPublicSchools.find(
        (school) => school.schoolName === user.schoolName
      );
  
      if (currentSchoolData) {
        window.open(currentSchoolData.driveLink, '_blank');
      } else {
        console.error('No matching school found in drive links');
      }
    } else {
      console.error('No user found');
    }
  };

  const calculatePercentile = (maxMarks: number, studentMarks: number): number => {
    if (studentMarks > maxMarks) {
        throw new Error("Student marks cannot exceed maximum marks.");
    }

    const percentage = (studentMarks / maxMarks) * 100;

    return Math.round(percentage * 100) / 100; // Round to 2 decimal places
};

  
  useEffect(() => {
    const user = creds.find((cred) => cred.username === username);
    if (user) {
      setSchoolName(user.schoolName);
      console.log("Found school name:", user.schoolName);
      
      // Find matching school ranking data
      const matchingSchool = schoolRankingData.find(
        (school) => school.school === user.schoolName
      );
      console.log(schoolRanking)
      
      if (matchingSchool) {
        console.log("Found school ranking data:", matchingSchool);
        setSchoolRanking(matchingSchool);
      } else {
        console.log("No matching school found in ranking data");
      }
    }
  }, [username]);

const handleFetchDetails = async () => {
  if (!schoolName || schoolName.trim() === "") {
    alert("School name is not valid.");
    return;
  }

  setIsFetching(true);

  try {
    // Your existing fetch logic remains here...
    const response = await fetch("https://backend-navyug-round1-result-2.onrender.com/result/schoolName", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: schoolName }),
    });

    if (!response.ok) {
      throw new Error("Failed to send school name to backend");
    }

    const data: BackendResponse = await response.json();
    
    console.log(data)
    // Find matching school ranking data
    const matchingSchool = schoolRankingData.find(
      (school) => school.school === schoolName
    );
    
    if (matchingSchool) {
      console.log("School Ranking Details:", {
        "School Name": matchingSchool.school,
        "Overall Rank": matchingSchool.rank,
        "Average Marks": matchingSchool.averageMarks.toFixed(2),
        "Section Rankings": {
          "Section 1": matchingSchool.section1Rank,
          "Section 2": matchingSchool.section2Rank,
          "Section 3": matchingSchool.section3Rank,
          // "Category 1": matchingSchool.category1Rank,

        },
        "Category 1 Averages": {
          "Overall": matchingSchool.category1Average.toFixed(2),
          "Section 1": matchingSchool.category1Section1Average.toFixed(2),
          "Section 2": matchingSchool.category1Section2Average.toFixed(2),
          "Section 3": matchingSchool.category1Section3Average.toFixed(2)
        },
        "Category 2 Averages": {
          "Overall": matchingSchool.category2Average.toFixed(2),
          "Section 1": matchingSchool.category2Section1Average.toFixed(2),
          "Section 2": matchingSchool.category2Section2Average.toFixed(2),
          "Section 3": matchingSchool.category2Section3Average.toFixed(2)
        }
      });
      setSchoolRanking(matchingSchool);
    }

    // Add student name and category to scores
    const updatedScores = data.scores.map((score) => {
      const matchingUser = data.userInfo.find((user) => user.username === score.username);
      const category = matchingUser?.setid.startsWith("67") ? "Category 1" : "Category 2";
      return {
        ...score,
        studentName: matchingUser?.student || "Unknown",
        category,
      };
    });

    setFetchedData({ ...data, scores: updatedScores });
  } catch (error) {
    console.error("Error sending school name to backend:", error);
    alert("Failed to fetch details.");
  } finally {
    setIsFetching(false);
  }
};

useEffect(() => {
  const checkMobileView = () => {
    setIsMobile(window.innerWidth < 768);
  };

  checkMobileView();
  window.addEventListener("resize", checkMobileView);

  return () => window.removeEventListener("resize", checkMobileView);
}, []);

// Conditional rendering for Category 1 Total
const renderCategory1Total = () => {
  if (isMobile) {
    return (
      <div className="p-4 mt-[3rem] text-center bg-gray-50">
        <h2 className="text-xl font-bold text-blue-600">
          Category 1 Detailed Analysis
        </h2>
        <p className="text-gray-700">
          Detailed analysis is not available on mobile devices. Please use a
          desktop or tablet for full view.
        </p>
      </div>
    );
  }
  return null;
};
  const category1Scores = fetchedData?.scores.filter((score) => score.category === "Category 1");
  const category2Scores = fetchedData?.scores.filter((score) => score.category === "Category 2");

  return (
    
    <div className="h-[130vh] bg-gray-50">
      <Header/>
      <div className="flex items-center justify-center mt-[1rem]">

      <Navbar/>
      </div>
      <div className="text-center mb-12 mt-16">
        <h1 className="text-4xl font-bold text-gray-800 mb-3">Navyug Round 1 Analysis</h1>
      </div>

      <div className="text-black text-2xl font-bold flex justify-center items-center pb-10">
        {schoolName ? schoolName : "Loading school name..."}
      </div>
      <div className="text-center flex items-center justify-center gap-[2rem]">
      <button
        onClick={handleFetchDetails}
        className={`bg-[#4494cc] text-white px-6 py-2 rounded shadow flex items-center gap-2 hover:bg-[#0c4f80] ${
          isFetching ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={isFetching}
      >
        {isFetching ? (
          <>
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
            Loading...
          </>
        ) : (
          "Load Marks"
        )}
      </button>
      <button
        onClick={handleDownloadAndRedirect}
        className="bg-[#4494cc] text-white px-6 py-2 rounded shadow hover:bg-[#0c4f80]"
      >
        Download Report
      </button>
    </div>


    <div>
    {renderCategory1Total() ? (
      renderCategory1Total()
    ):(
      <>
             <div>
      {fetchedData && <ScoresTable scores={fetchedData.scores} totalMarks={totalMarks} />}
    </div>

    <div className="h-auto flex flex-col items-center justify-center bg-gray-50">
  {isFetching ? (
    <DataLoader />
  ) : fetchedData ? (
    <>
  
      <div> {/* Category 1 Components */}
   {category1Scores && category1Scores.length > 0 && (
    <>
      {/* Total Marks */}
      {category1Scores.some(score => score.totalMarks > 0) && (
        <>
          <div className="h-auto w-[100%]">
            <TableComponent
          category="Category 1"
          section="Total"
          sectionKey="totalMarks"
          fetchedData={{ ...fetchedData, scores: category1Scores }}
          maxMarks={100} // Pass maximum marks for the section
          calculatePercentile={(maxMarks, studentMarks) => (studentMarks / maxMarks) * 100}
        />  

          </div>
          <div ref={barGraphRefs[0]} className="h-auto" style={{ width: 800, height: 800 }}>
            <BarGraph
              category="Category 1"
              section="Total"
              frequencyData={category2}
              sectionKey="totalMarks"
              fetchedData={fetchedData}
            />
          </div>
        </>
      )}

      {/* Section 1 */}
      {category1Scores.some(score => score.section1Marks > 0) && (
        <>
          <div className="h-auto">
            <TableComponent
              category="Category 1"
              section="Section 1"
              maxMarks={40}
              sectionKey="section1Marks"
              fetchedData={fetchedData}
              calculatePercentile={calculatePercentile}
            />
          </div>
          <div ref={barGraphRefs[1]} className="h-auto" style={{ width: 800, height: 800 }}>
            <BarGraph
              category="Category 1"
              section="Section 1"
              frequencyData={category1Section1Marks}
              sectionKey="section1Marks"
              fetchedData={fetchedData}
            />
          </div>
        </>
      )}

      {/* Section 2 */}
      {category1Scores.some(score => score.section2Marks > 0) && (
        <>
          <div className="h-auto">
            <TableComponent
              category="Category 1"
              section="Section 2"
              maxMarks={40}
              sectionKey="section2Marks"
              fetchedData={fetchedData}
              calculatePercentile={calculatePercentile}
            />
          </div>
          <div ref={barGraphRefs[2]} className="h-auto" style={{ width: 800, height: 800 }}>
            <BarGraph
              category="Category 1"
              section="Section 2"
              frequencyData={category1Section2Marks}
              sectionKey="section2Marks"
              fetchedData={fetchedData}
            />
          </div>
        </>
      )}

      {/* Section 3 */}
      {category1Scores.some(score => score.section3Marks > 0) && (
        <>
          <div className="h-auto">
            <TableComponent
              category="Category 1"
              section="Section 3"
              maxMarks={20}
              sectionKey="section3Marks"
              fetchedData={fetchedData}
              calculatePercentile={calculatePercentile}
            />
          </div>
          <div ref={barGraphRefs[3]} className="h-auto" style={{ width: 800, height: 800 }}>
            <BarGraph
              category="Category 1"
              section="Section 3"
              frequencyData={category1Section3Marks}
              sectionKey="section3Marks"
              fetchedData={fetchedData}
            />
          </div>
        </>
      )}
    </>
  )}

  {/* Category 2 Components */}
  {category2Scores && category2Scores.length > 0 && (
    <>
      {/* Total Marks */}
      {category2Scores.some(score => score.totalMarks > 0) && (
        <>
          <div className="h-auto">
            <TableComponent
              category="Category 2"
              section="Total"
              maxMarks={100}
              sectionKey="totalMarks"
              fetchedData={fetchedData}
              calculatePercentile={calculatePercentile}
            />
          </div>
          <div ref={barGraphRefs[4]} className="h-auto" style={{ width: 800, height: 800 }}>
            <BarGraph
              category="Category 2"
              section="Total"
              frequencyData={category2}
              sectionKey="totalMarks"
              fetchedData={fetchedData}
            />
          </div>
        </>
      )}

      {/* Section 1 */}
      {category2Scores.some(score => score.section1Marks > 0) && (
        <>
          <div className="h-auto">
            <TableComponent
              category="Category 2"
              section="Section 1"
              maxMarks={40}
              sectionKey="section1Marks"
              fetchedData={fetchedData}
              calculatePercentile={calculatePercentile}
            />
          </div>
          <div ref={barGraphRefs[5]} className="h-auto" style={{ width: 800, height: 800 }}>
            <BarGraph
              category="Category 2"
              section="Section 1"
              frequencyData={category2Section1Marks}
              sectionKey="section1Marks"
              fetchedData={fetchedData}
            />
          </div>
        </>
      )}

      {/* Section 2 */}
      {category2Scores.some(score => score.section2Marks > 0) && (
        <>
          <div className="h-auto">
            <TableComponent
              category="Category 2"
              section="Section 2"
              maxMarks={40}
              sectionKey="section2Marks"
              fetchedData={fetchedData}
              calculatePercentile={calculatePercentile}
            />
          </div>
          <div ref={barGraphRefs[6]} className="h-auto" style={{ width: 800, height: 800 }}>
            <BarGraph
              category="Category 2"
              section="Section 2"
              frequencyData={category2Section2Marks}
              sectionKey="section2Marks"
              fetchedData={fetchedData}
            />
          </div>
        </>
      )}

      {/* Section 3 */}
      {category2Scores.some(score => score.section3Marks > 0) && (
        <>
          <div className="h-auto">
            <TableComponent
              category="Category 2"
              section="Section 3"
              maxMarks={20}
              sectionKey="section3Marks"
              fetchedData={fetchedData}
              calculatePercentile={calculatePercentile}
            />
          </div>
          <div ref={barGraphRefs[7]} className="h-auto" style={{ width: 800, height: 800 }}>
            <BarGraph
              category="Category 2"
              section="Section 3"
              frequencyData={category2Section3Marks}
              sectionKey="section3Marks"
              fetchedData={fetchedData}
            />
          </div>
        </>
      )}
    </>
  )}</div>
    </>
  ) : (
    <div>N</div>
  )}
</div>
      </>
      
    )}
    </div>
    </div>
  );
};

export default Dashboard;