// Shared in-memory store for submissions when database is not available
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

let mockSubmissionsStore: MockSubmission[] = [
  {
    id: 1,
    student_name: "Emma Johnson",
    lesson_id: 1,
    lesson_title: "Introduction to HTML",
    lesson_type: "html",
    difficulty_name: "Beginner",
    html_code: `<!DOCTYPE html>
<html>
<head>
    <title>My First Website</title>
</head>
<body>
    <h1>Hello World!</h1>
    <p>This is my first webpage! I'm learning HTML.</p>
    <h2>About Me</h2>
    <p>My name is Emma and I love coding!</p>
</body>
</html>`,
    css_code: `h1 {
    color: blue;
    text-align: center;
}

p {
    color: green;
    font-size: 16px;
}`,
    javascript_code: `console.log("Hello from Emma's webpage!");`,
    submitted_at: "2025-01-05T10:30:00Z",
    grade: 95,
    feedback: "Excellent work! Great use of HTML elements and structure.",
    reviewed_by: "Ms. Smith",
    reviewed_at: "2025-01-05T15:45:00Z"
  },
  {
    id: 2,
    student_name: "Alex Chen",
    lesson_id: 2,
    lesson_title: "CSS Styling Basics",
    lesson_type: "css",
    difficulty_name: "Beginner",
    html_code: `<!DOCTYPE html>
<html>
<head>
    <title>Colorful Page</title>
</head>
<body>
    <h1>Welcome to my colorful page</h1>
    <p class="highlight">This paragraph has special styling!</p>
    <div class="box">This is a styled box</div>
</body>
</html>`,
    css_code: `body {
    background-color: lightblue;
    font-family: Arial, sans-serif;
}

h1 {
    color: darkblue;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

.highlight {
    background-color: yellow;
    padding: 10px;
    border-radius: 5px;
}

.box {
    background-color: lightgreen;
    padding: 20px;
    margin: 10px;
    border: 2px solid green;
    border-radius: 10px;
}`,
    javascript_code: ``,
    submitted_at: "2025-01-05T14:20:00Z",
    grade: null,
    feedback: null,
    reviewed_by: null,
    reviewed_at: null
  },
  {
    id: 3,
    student_name: "Test Student",
    lesson_id: 1,
    lesson_title: "Introduction to HTML",
    lesson_type: "html",
    difficulty_name: "Beginner",
    html_code: `<!DOCTYPE html>
<html>
<head>
    <title>My Test Webpage</title>
</head>
<body>
    <h1>Hello from Test Student!</h1>
    <p>This is a test submission to verify the system works.</p>
    <p>I just submitted this work!</p>
</body>
</html>`,
    css_code: `h1 {
    color: purple;
    text-align: center;
}

p {
    color: blue;
    font-family: Arial, sans-serif;
}`,
    javascript_code: `console.log("Test submission working!");`,
    submitted_at: new Date().toISOString(),
    grade: null,
    feedback: null,
    reviewed_by: null,
    reviewed_at: null
  }
];

export const mockStore = {
  getAllSubmissions: (): MockSubmission[] => {
    console.log(`📦 MockStore: Returning ${mockSubmissionsStore.length} submissions`);
    return mockSubmissionsStore.sort((a, b) => 
      new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime()
    );
  },

  getSubmissionById: (id: number): MockSubmission | undefined => {
    return mockSubmissionsStore.find(s => s.id === id);
  },

  addSubmission: (submission: Omit<MockSubmission, 'id'>): number => {
    const newId = Math.max(...mockSubmissionsStore.map(s => s.id), 0) + 1;
    const newSubmission: MockSubmission = {
      ...submission,
      id: newId
    };
    mockSubmissionsStore.push(newSubmission);
    console.log(`📝 MockStore: Added new submission ${newId} for ${submission.student_name}`);
    console.log(`📊 MockStore: Total submissions now: ${mockSubmissionsStore.length}`);
    return newId;
  },

  updateSubmission: (id: number, updates: Partial<MockSubmission>): boolean => {
    const index = mockSubmissionsStore.findIndex(s => s.id === id);
    if (index !== -1) {
      mockSubmissionsStore[index] = {
        ...mockSubmissionsStore[index],
        ...updates
      };
      console.log(`✏️ MockStore: Updated submission ${id}`);
      return true;
    }
    console.log(`❌ MockStore: Submission ${id} not found for update`);
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
  }
};

export type { MockSubmission }; 