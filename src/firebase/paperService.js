// src/firebase/paperService.js
import { collection, addDoc, serverTimestamp, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "./config";

// ==========================================
// 1. DÀNH CHO USER (Từ Bước 1)
// ==========================================

// Hàm thêm bài báo mới
export const createResearchPaper = async (paperData, userId) => {
  try {
    const docRef = await addDoc(collection(db, "research_papers"), {
      title: paperData.title,
      doi: paperData.doi || "",
      publicationYear: paperData.publicationYear || "",
      paperLink: paperData.paperLink || "",
      abstract: paperData.abstract || "",
      keywords: paperData.keywords 
        ? paperData.keywords.split(",").map(kw => kw.trim()) 
        : [],
      userId: userId,               
      status: "pending",            
      createdAt: serverTimestamp()  
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Lỗi khi gửi bài báo: ", error);
    return { success: false, error: error.message };
  }
};

// ==========================================
// 2. DÀNH CHO ADMIN (Từ Bước 3)
// ==========================================

// Hàm lấy danh sách bài báo chờ duyệt
export const getPendingPapers = async () => {
  try {
    const q = query(collection(db, "research_papers"), where("status", "==", "pending"));
    const querySnapshot = await getDocs(q);
    const papers = [];
    querySnapshot.forEach((doc) => {
      papers.push({ id: doc.id, ...doc.data() });
    });
    return papers;
  } catch (error) {
    console.error("Lỗi khi lấy danh sách bài viết: ", error);
    return [];
  }
};

// Hàm cập nhật trạng thái bài báo (Duyệt / Từ chối)
export const updatePaperStatus = async (paperId, newStatus) => {
  try {
    const paperRef = doc(db, "research_papers", paperId);
    await updateDoc(paperRef, {
      status: newStatus 
    });
    return { success: true };
  } catch (error) {
    console.error("Lỗi khi cập nhật trạng thái: ", error);
    return { success: false, error: error.message };
  }
};