import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import '@uiw/react-markdown-preview/markdown.css';
import { LessonType } from '@/lib/constants';

const MDPreview = dynamic(
  () => import('@uiw/react-markdown-preview').then((mod) => mod.default),
  { ssr: false }
);

interface LessonLayoutProps {
  title: string;
  explanation: string;
  exercise: string;
  expectedOutput: string;
  type: LessonType;
}

export default function LessonLayout({
  title,
  explanation,
  exercise,
  expectedOutput,
  type,
}: LessonLayoutProps) {
  const [code, setCode] = useState('');
  const [output, setOutput] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [activeTab, setActiveTab] = useState<'content' | 'instructions' | 'editor'>('content');

  const handleRunCode = () => {
    if (type === LessonType.HTML) {
      const normalizedCode = code.replace(/\s+/g, '').toLowerCase();
      const normalizedExpected = expectedOutput.replace(/\s+/g, '').toLowerCase();
      setIsCorrect(normalizedCode === normalizedExpected);
      setOutput(code);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 p-8">
      {/* Header with fun background */}
      <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 transform hover:scale-[1.02] transition-transform duration-300 border-4 border-blue-200">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
          {title}
        </h1>
        <div className="flex flex-wrap gap-4">
          <TabButton
            active={activeTab === 'content'}
            onClick={() => setActiveTab('content')}
            icon="📚"
            label="Lessen Content"
            color="blue"
          />
          <TabButton
            active={activeTab === 'instructions'}
            onClick={() => setActiveTab('instructions')}
            icon="📝"
            label="Instructions"
            color="green"
          />
          <TabButton
            active={activeTab === 'editor'}
            onClick={() => setActiveTab('editor')}
            icon="💻"
            label="Code Editor"
            color="purple"
          />
        </div>
      </div>

      {/* Main Content with new layout */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
        {/* Left Panel - 3 columns on xl */}
        <div className="xl:col-span-3 space-y-6">
          <div className="transition-all duration-300 transform">
            {activeTab === 'content' && (
              <ContentPanel content={explanation} />
            )}
            {activeTab === 'instructions' && (
              <InstructionsPanel content={exercise} />
            )}
            {activeTab === 'editor' && (
              <EditorPanel
                code={code}
                setCode={setCode}
                onRun={handleRunCode}
              />
            )}
          </div>
        </div>

        {/* Right Panel - Output - 2 columns on xl */}
        <div className="xl:col-span-2">
          <div className="bg-white rounded-3xl shadow-xl p-8 border-4 border-purple-200 sticky top-8">
            <div className="flex items-center mb-6">
              <div className="relative">
                <span className="text-4xl">🖥️</span>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <h2 className="text-2xl font-bold ml-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Output
              </h2>
            </div>
            <div className="bg-gray-50 rounded-2xl p-6 min-h-[500px] border-2 border-gray-100">
              {output ? (
                <div className="space-y-6">
                  <div className={`p-6 rounded-2xl transform transition-all duration-300 ${
                    isCorrect 
                      ? 'bg-green-100 border-4 border-green-300 scale-105'
                      : 'bg-red-100 border-4 border-red-300'
                  }`}>
                    {isCorrect ? (
                      <div className="flex items-center space-x-4">
                        <div className="text-4xl animate-bounce">🎉</div>
                        <div>
                          <h3 className="font-bold text-green-700 text-xl mb-1">
                            Geweldig gedaan!
                          </h3>
                          <p className="text-green-600">
                            Je code werkt perfect! Je bent een echte programmeur! 🌟
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-4">
                        <div className="text-4xl animate-pulse">💪</div>
                        <div>
                          <h3 className="font-bold text-red-700 text-xl mb-1">
                            Bijna daar!
                          </h3>
                          <p className="text-red-600">
                            Je bent op de goede weg! Probeer het nog een keer! 🚀
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  {type === LessonType.HTML && (
                    <div className="border-4 border-gray-200 rounded-2xl overflow-hidden shadow-inner">
                      <div className="bg-gray-100 p-3 border-b-2 border-gray-200">
                        <div className="flex space-x-2">
                          <div className="w-3 h-3 rounded-full bg-red-400"></div>
                          <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                          <div className="w-3 h-3 rounded-full bg-green-400"></div>
                        </div>
                      </div>
                      <iframe
                        srcDoc={output}
                        className="w-full h-[400px] border-0 bg-white"
                        title="output"
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-[500px] space-y-6">
                  <div className="text-6xl animate-bounce">👨‍💻</div>
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-gray-700 mb-2">
                      Klaar om te beginnen?
                    </h3>
                    <p className="text-gray-600">
                      Klik op de "Run Code" knop om je code uit te voeren!
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Component for tab buttons with color variants
function TabButton({ active, onClick, icon, label, color }: { 
  active: boolean; 
  onClick: () => void; 
  icon: string;
  label: string;
  color: 'blue' | 'green' | 'purple';
}) {
  const colorStyles = {
    blue: 'hover:bg-blue-50 active:bg-blue-100',
    green: 'hover:bg-green-50 active:bg-green-100',
    purple: 'hover:bg-purple-50 active:bg-purple-100',
  };

  const activeStyles = {
    blue: 'bg-blue-100 text-blue-700 shadow-blue-200',
    green: 'bg-green-100 text-green-700 shadow-green-200',
    purple: 'bg-purple-100 text-purple-700 shadow-purple-200',
  };

  return (
    <button
      onClick={onClick}
      className={`flex items-center space-x-3 px-8 py-4 rounded-2xl transition-all duration-300 ${
        active
          ? `${activeStyles[color]} shadow-lg transform scale-105`
          : `bg-white text-gray-600 shadow-md ${colorStyles[color]}`
      }`}
    >
      <span className="text-2xl">{icon}</span>
      <span className="font-bold text-lg">{label}</span>
    </button>
  );
}

// Component for content panel
function ContentPanel({ content }: { content: string }) {
  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 border-4 border-blue-200">
      <div className="flex items-center mb-6">
        <span className="text-4xl">📚</span>
        <h2 className="text-2xl font-bold ml-4 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
          Lessen Content
        </h2>
      </div>
      <div className="prose prose-lg max-w-none">
        <MDPreview source={content} />
      </div>
    </div>
  );
}

// Component for instructions panel
function InstructionsPanel({ content }: { content: string }) {
  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 border-4 border-green-200">
      <div className="flex items-center mb-6">
        <span className="text-4xl">📝</span>
        <h2 className="text-2xl font-bold ml-4 bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
          Instructions
        </h2>
      </div>
      <div className="prose prose-lg max-w-none">
        <MDPreview source={content} />
      </div>
    </div>
  );
}

// Component for code editor panel
function EditorPanel({ 
  code, 
  setCode, 
  onRun 
}: { 
  code: string; 
  setCode: (code: string) => void; 
  onRun: () => void;
}) {
  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 border-4 border-purple-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <span className="text-4xl">💻</span>
          <h2 className="text-2xl font-bold ml-4 bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
            Code Editor
          </h2>
        </div>
        <button
          onClick={onRun}
          className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-2xl flex items-center space-x-3 
                   shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95"
        >
          <span className="text-2xl">▶️</span>
          <span className="font-bold text-lg">Run Code</span>
        </button>
      </div>
      <div className="bg-gray-900 rounded-2xl p-6 shadow-inner">
        <div className="bg-gray-800 rounded-xl p-4">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-[500px] bg-gray-800 text-white font-mono text-lg p-4 rounded-lg focus:outline-none focus:ring-4 focus:ring-purple-500/50
                     resize-none"
            placeholder="Schrijf hier je code..."
            style={{ caretColor: '#a855f7' }}
          />
        </div>
      </div>
    </div>
  );
} 