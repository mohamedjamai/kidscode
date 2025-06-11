// Shared in-memory store for submissions when database is not available

import { writeFileSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';

// Debug flag - set to true to enable detailed logging
const DEBUG_MODE = false;

// Simple file-based persistence for development
const STORE_FILE = join(process.cwd(), 'temp_mockstore.json');

// Simple ID counter - starts at 1 and increments
let nextSubmissionId = 1;

interface MockSubmission {
  id: number;
  student_name: string;
  lesson_id: number;
  lesson_title: string;
  lesson_type: string;
  difficulty_name: string;
  html_code: string;
  css_code: string;
  javascript_code: string;
  preview_screenshot?: string;
  submitted_at: string;
  grade: number | null;
  feedback: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
}

// Load existing data on module load
let mockSubmissionsStore: MockSubmission[] = [];

function loadFromFile() {
  try {
    if (existsSync(STORE_FILE)) {
      const data = JSON.parse(readFileSync(STORE_FILE, 'utf8'));
      mockSubmissionsStore = data.submissions || [];
      nextSubmissionId = data.nextId || 1;
      if (DEBUG_MODE) {
        console.log(`📂 Loaded ${mockSubmissionsStore.length} submissions from file, next ID: ${nextSubmissionId}`);
      }
    }
  } catch (error) {
    console.warn('Failed to load mock store from file:', error);
    mockSubmissionsStore = [];
    nextSubmissionId = 1;
  }
}

function saveToFile() {
  try {
    const data = {
      submissions: mockSubmissionsStore,
      nextId: nextSubmissionId,
      timestamp: new Date().toISOString()
    };
    writeFileSync(STORE_FILE, JSON.stringify(data, null, 2));
    if (DEBUG_MODE) {
      console.log(`💾 Saved ${mockSubmissionsStore.length} submissions to file`);
    }
  } catch (error) {
    console.warn('Failed to save mock store to file:', error);
  }
}

// Load on startup
loadFromFile();

export const mockStore = {
  getAllSubmissions: (): MockSubmission[] => {
    // Debug logging when enabled
    if (DEBUG_MODE) {
      console.log(`📦 MockStore.getAllSubmissions called - found ${mockSubmissionsStore.length} submissions`);
      console.log(`📦 MockStore IDs:`, mockSubmissionsStore.map(s => s.id));
    }
    return mockSubmissionsStore.sort((a, b) => 
      new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime()
    );
  },

  getSubmissionById: (id: number): MockSubmission | undefined => {
    if (DEBUG_MODE) {
      console.log(`📦 MockStore.getSubmissionById called with ID: ${id} (type: ${typeof id})`);
      console.log(`📦 MockStore searching in ${mockSubmissionsStore.length} submissions`);
    }
    const found = mockSubmissionsStore.find(s => s.id === id);
    if (DEBUG_MODE) {
      console.log(`📦 MockStore.getSubmissionById result:`, found ? `FOUND - ${found.student_name}` : 'NOT FOUND');
    }
    return found;
  },

  addSubmission: (submission: Omit<MockSubmission, 'id'>): number => {
    const newId = nextSubmissionId++;
    const newSubmission: MockSubmission = {
      ...submission,
      id: newId,
      submitted_at: new Date().toISOString() // Always use current timestamp for new submissions
    };
    
    mockSubmissionsStore.push(newSubmission);
    saveToFile(); // Persist to file
    
    if (DEBUG_MODE) {
      console.log(`📦 Mock submission added: ID ${newId} for ${submission.student_name}`);
      console.log(`✅ Total submissions: ${mockSubmissionsStore.length}`);
    }
    
    return newId;
  },

  updateSubmission: (id: number, updates: Partial<MockSubmission>): boolean => {
    const index = mockSubmissionsStore.findIndex(s => s.id === id);
    if (index !== -1) {
      mockSubmissionsStore[index] = {
        ...mockSubmissionsStore[index],
        ...updates
      };
      saveToFile(); // Persist to file
      
      if (DEBUG_MODE) {
        console.log(`✏️ Review saved for submission ${id}: Grade ${updates.grade}, Feedback: ${updates.feedback}`);
      }
      return true;
    }
    if (DEBUG_MODE) {
      console.log(`❌ MockStore: Submission ${id} not found for update`);
    }
    return false;
  },

  getLessonInfo: (lessonId: number) => {
    const lessonTypeMap: { [key: number]: { title: string, type: string, difficulty: string } } = {
      1: { title: "Introduction to HTML", type: "html", difficulty: "Beginner" },
      2: { title: "CSS Styling Basics", type: "css", difficulty: "Beginner" },
      3: { title: "JavaScript Basics", type: "javascript", difficulty: "Beginner" }
    };
    
    return lessonTypeMap[lessonId] || { 
      title: `Lesson ${lessonId}`, 
      type: "html", 
      difficulty: "Beginner" 
    };
  },

  clearAllSubmissions: (): boolean => {
    const previousCount = mockSubmissionsStore.length;
    mockSubmissionsStore.length = 0; // Clear the array
    nextSubmissionId = 1; // Reset ID counter to start fresh
    saveToFile(); // Persist to file
    
    console.log(`🗑️ Cleared ${previousCount} submissions, ID counter reset to 1`);
    return true;
  }
};

export type { MockSubmission }; 