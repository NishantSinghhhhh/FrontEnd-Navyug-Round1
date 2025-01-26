import { useEffect, useState } from 'react';
import Header from './Dashboard/Header';
import { useAuth } from '../context/AuthContext';
import { schoolRankingData } from "../data/schoolRanking.ts";
import { creds } from "../data/creds.ts";
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import pdfTemplate from '../assets/Round 1 participants.pdf';
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar.tsx';
import Footer from './Footer.tsx';
import DataLoader from './DataLoader.tsx';

interface UserScore {
  username: string;
  studentName: string;
  category: string;
  totalMarks: number;
  section1Marks: number;
  section2Marks: number;
  section3Marks: number;
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
  rank: number;
}

const ECertificate = () => {
  const { username } = useAuth();
  const [schoolName, setSchoolName] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [fetchedData, setFetchedData] = useState<BackendResponse | null>(null);
  const [schoolRanking, setSchoolRanking] = useState<SchoolRankingData | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to a specific route when the page is loaded or refreshed
    navigate('/ECertificate'); // Change '/Dashboard' to the desired route
  }, [navigate]);

  useEffect(() => {
    if (!username) return;

    const user = creds.find((cred) => cred.username === username);
    if (user) {
      setSchoolName(user.schoolName);
      const matchingSchool = schoolRankingData.find(
        (school) => school.school === user.schoolName
      );
      if (matchingSchool) setSchoolRanking(matchingSchool);
      
    }
  }, [username]);

  const numbersInUsername = username?.match(/\d+/g)?.join("") || "No numbers found";
  console.log("Numbers in UserName: ", numbersInUsername);

  const handleFetchDetails = async () => {
    if (!schoolName || schoolName.trim() === "") {
      alert("School name is not valid.");
      return;
    }
    console.log(schoolRanking)
    setIsFetching(true);
    try {
      const response = await fetch("https://backend-navyug-round1-result-2.onrender.com/result/schoolName", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: schoolName }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: BackendResponse = await response.json();

      const updatedScores = data.scores
        .map((score) => {
          const matchingUser = data.userInfo.find((user) => user.username === score.username);
          const category = matchingUser?.setid.startsWith("67") ? "Category 1" : "Category 2";
          return {
            ...score,
            studentName: matchingUser?.student || "Unknown",
            category,
          };
        })
        // Sort by `studentName` in alphabetical order
        .sort((a, b) => a.studentName.localeCompare(b.studentName));

      setFetchedData({ ...data, scores: updatedScores });
    } catch (error) {
      alert("Failed to fetch details.");
    } finally {
      setIsFetching(false);
    }
  };

  const generateCertificate = async (studentName: string, uniqueNumber: string) => {
    const templateResponse = await fetch(pdfTemplate);
    const templateBuffer = await templateResponse.arrayBuffer();

    const pdfDoc = await PDFDocument.load(templateBuffer);
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const { width, height } = firstPage.getSize();

    const fontSize = 24;
    const textWidth = helveticaFont.widthOfTextAtSize(studentName, fontSize);
    const x = (width - textWidth) / 2;
    const y = height / 2 + 3;

    firstPage.drawText(studentName, {
      x,
      y,
      size: fontSize,
      font: helveticaFont,
      color: rgb(0, 0, 0),
    });

    const numberFontSize = 18;
    const numberX = 665;
    const numberY = 22;

    firstPage.drawText(uniqueNumber, {
      x: numberX,
      y: numberY,
      size: numberFontSize,
      font: helveticaFont,
      color: rgb(1, 0, 0),
    });

    return await pdfDoc.save();
  };

  const handleDownloadAll = async () => {
    if (!fetchedData || fetchedData.scores.length === 0) {
      alert("No data to generate certificates.");
      return;
    }

    const zip = new JSZip();

    for (let index = 0; index < fetchedData.scores.length; index++) {
      const score = fetchedData.scores[index];
      const uniqueNumber = `${username?.match(/\d+/g)?.join("") || "000"}${index + 1}`;
      const pdfBytes = await generateCertificate(score.studentName, uniqueNumber);

      zip.file(`Certificate_${score.studentName.replace(/\s+/g, "_")}.pdf`, pdfBytes);
    }

    zip.generateAsync({ type: "blob" }).then((content) => {
      saveAs(content, "Certificates.zip");
    });
  };

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <div className="shadow-lg bg-gray-50 flex-grow">
          <Header />
          <div className="flex items-center mt-[2rem] justify-center bg-gray-50">
            <Navbar />
          </div>
          <div className="bg-gray-50">
            <div className="flex items-center justify-center gap-[80px] p-4 mt-[4rem]">
              <button
                onClick={handleFetchDetails}
                disabled={isFetching}
                className="p-2 bg-[#4494cc] text-white rounded disabled:bg-gray-400"
              >
                {isFetching ? "Loading..." : "Fetch Data"}
              </button>
  
              <button
                onClick={handleDownloadAll}
                disabled={!fetchedData || fetchedData.scores.length === 0}
                className="p-2 bg-[#4494cc] text-white rounded disabled:bg-gray-400"
              >
                Download Certificates
              </button>
            </div>
  
            {/* Loader while fetching data */}
            {isFetching && (
              <div className="flex items-center justify-center p-4 mt-8 h-[300px] font-bold text-2xl text-black">
                <DataLoader />
              </div>
            )}
  
            <div className="flex items-center justify-center mt-[3rem]">
              {!fetchedData && (
                <>
                  <div className="text-black w-[80%] flex flex-col justify-center items-center text-left">
                    <div className="mb-4 flex text-[18px] justify-center items-center text-left">
                      Over 800 students participated in Round 1 of the quiz, showcasing their immense enthusiasm and dedication toward academic excellence. Each participant has worked hard to prove their skills and push their limits. This incredible participation is a testament to the competitive spirit and passion for learning that our community holds. Your involvement in this event is more than just a number—it’s a reflection of your drive, ambition, and the future leaders we are cultivating. Keep pushing forward!
                    </div>
  
                    <div className="text-[18px] text-black">
                      Additionally, 50 APS (Academic Performance Scholars) also participated, setting a high benchmark for excellence. Their determination and commitment to mastering challenging concepts are truly inspiring.
                    </div>
                  </div>
                </>
              )}
            </div>
  
            {/* User Scores with Generate Certificate button for each student */}
            {fetchedData && fetchedData.scores.length > 0 && !isFetching && (
              <div className="p-4 mt-8 h-[300px] font-bold text-2xl text-black flex items-center justify-center">
                Data is now fetched, you may download the certificates
              </div>
            )}
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
  
}
export default ECertificate;
