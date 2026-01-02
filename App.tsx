import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Film, MessageSquare, Compass, Layout, Send, Loader2, PlayCircle, Sparkles } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";

// 1. 配置 AI
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY || "");

// 2. 主应用组件
function App() {
  const [activeTab, setActiveTab] = useState('MENTOR');

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      <aside className="w-20 lg:w-64 bg-slate-900 border-r border-slate-800 flex flex-col py-6 px-4">
        <div className="mb-8 flex items-center gap-3 px-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg"><Film size={20} className="text-white"/></div>
          <h1 className="hidden lg:block text-xl font-bold">CineMentor</h1>
        </div>
        <nav className="flex-1 space-y-2">
          <button onClick={() => setActiveTab('MENTOR')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'MENTOR' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}><MessageSquare size={20} /> <span className="hidden lg:block">AI 总监</span></button>
          <button onClick={() => setActiveTab('STUDIO')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'STUDIO' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}><Layout size={20} /> <span className="hidden lg:block">提案工作室</span></button>
          <button onClick={() => setActiveTab('LEARN')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'LEARN' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}><Compass size={20} /> <span className="hidden lg:block">职业路径</span></button>
        </nav>
      </aside>
      <main className="flex-1 p-4 lg:p-8 overflow-hidden relative">
        {activeTab === 'MENTOR' ? <ChatInterface /> : activeTab === 'STUDIO' ? <ConceptStudio /> : <LearningPath />}
      </main>
    </div>
  );
}

// 3. 子组件 (AI 聊天)
function ChatInterface() {
  const [messages, setMessages] = useState([{ role: 'model', content: "我是你的剪辑总监。记住，好剪辑是看不见的。今天有什么技术或艺术上的难题？" }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSend() {
    if (!input.trim() || !API_KEY) return;
    const newMsgs = [...messages, { role: 'user', content: input }];
    setMessages(newMsgs); setInput(''); setLoading(true);
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent("你是一位好莱坞资深剪辑总监，请用中文犀利地回答：" + input);
      setMessages([...newMsgs, { role: 'model', content: result.response.text() }]);
    } catch (e) { setMessages([...newMsgs, { role: 'model', content: "API报错，请检查 Key 或网络。" }]); }
    setLoading(false);
  }

  return (
    <div className="flex flex-col h-full bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`p-4 rounded-2xl max-w-[85%] text-sm ${m.role === 'user' ? 'bg-indigo-600' : 'bg-slate-800 border border-slate-700'}`}>{m.content}</div>
          </div>
        ))}
      </div>
      <div className="p-4 bg-slate-950 flex gap-2">
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} placeholder="向总监提问..." className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 outline-none" />
        <button onClick={handleSend} disabled={loading} className="p-4 bg-indigo-600 rounded-xl">{loading ? <Loader2 className="animate-spin" size={20}/> : <Send size={20}/>}</button>
      </div>
    </div>
  );
}

// 4. 其他简单占位组件
function ConceptStudio() { return <div className="text-center py-20"><Sparkles size={48} className="mx-auto text-indigo-500 mb-4"/><h2 className="text-3xl font-bold">提案生成器</h2><p className="text-slate-400">输入需求，生成好莱坞级 Pitch Deck。</p></div>; }
function LearningPath() { return <div className="space-y-4"><h2 className="text-2xl font-bold">职业路径</h2><div className="bg-slate-900 p-6 rounded-xl border border-slate-800">L1: 叙事逻辑与隐形剪辑 (已解锁)</div></div>; }

// 5. ⚠️ 最核心的启动代码 (如果没有这一段，页面就是白的)
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
