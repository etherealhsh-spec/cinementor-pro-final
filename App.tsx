import React, { useState, useRef, useEffect } from 'react';
import { Film, MessageSquare, Compass, Layout, Send, Loader2, PlayCircle, Bot, User, Sparkles, Palette, Music } from 'lucide-react';
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY || "");

export default function App() {
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
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/20 via-transparent to-transparent opacity-50 pointer-events-none"></div>
        {activeTab === 'MENTOR' ? <ChatInterface /> : activeTab === 'STUDIO' ? <ConceptStudio /> : <LearningPath />}
      </main>
    </div>
  );
}

function ChatInterface() {
  const [messages, setMessages] = useState([{ role: 'model', content: "我是你的剪辑总监。记住，好剪辑是看不见的。今天有什么技术或艺术上的难题？" }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSend() {
    if (!input.trim() || !API_KEY) return;
    const newMsgs = [...messages, { role: 'user', content: input }];
    setMessages(newMsgs); setInput(''); setLoading(true);
    try {
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        systemInstruction: "你是一位好莱坞资深剪辑总监，推崇Walter Murch。语气专业犀利，回答后必须带一个【导演挑战】提问。" 
      });
      const result = await model.generateContent(input);
      setMessages([...newMsgs, { role: 'model', content: result.response.text() }]);
    } catch (e) { setMessages([...newMsgs, { role: 'model', content: "API Key无效或连接超时。请确保在Vercel中配置了正确的VITE_GEMINI_API_KEY。" }]); }
    setLoading(false);
  }

  return (
    <div className="flex flex-col h-full bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl relative z-10">
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`p-4 rounded-2xl max-w-[85%] text-sm leading-relaxed ${m.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-slate-800 border border-slate-700 text-slate-200'}`}>{m.content}</div>
          </div>
        ))}
      </div>
      <div className="p-4 bg-slate-950/50 backdrop-blur-md flex gap-2">
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} placeholder="询问调色、剪辑节奏或特效..." className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 outline-none focus:ring-2 ring-indigo-500 transition-all text-white placeholder-slate-500" />
        <button onClick={handleSend} disabled={loading} className="p-4 bg-indigo-600 rounded-xl hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20">{loading ? <Loader2 className="animate-spin" size={20}/> : <Send size={20}/>}</button>
      </div>
    </div>
  );
}

function ConceptStudio() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center space-y-6 animate-in fade-in duration-700">
      <div className="p-6 bg-indigo-600/10 rounded-full text-indigo-500 shadow-inner"><Sparkles size={48}/></div>
      <h2 className="text-4xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">商业提案生成器</h2>
      <p className="text-slate-400 max-w-md text-lg">输入你的视频主题，AI 将为你生成包含脚本大纲、LUT建议和BGM参考的完整策划案。</p>
      <div className="flex gap-2 w-full max-w-lg mt-4">
        <input className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-4 focus:ring-2 ring-indigo-500 outline-none" placeholder="例如：赛博朋克风格的汽车广告" />
        <button className="bg-indigo-600 px-8 py-4 rounded-xl font-bold hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20">生成</button>
      </div>
    </div>
  );
}

function LearningPath() {
  const modules = [
    { title: "L1: 叙事逻辑与隐形剪辑", status: "已解锁", desc: "掌握剪辑的节奏感与情绪驱动点" },
    { title: "L2: 达芬奇色彩科学深度应用", status: "进行中", desc: "从一级调色到商业级风格化" },
    { title: "L3: 商业提案与接单溢价技巧", status: "待锁定", desc: "如何让你的作品在甲方市场更有竞争力" }
  ];
  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-3xl font-bold mb-8">职业接单之路</h2>
      {modules.map((m, i) => (
        <div key={i} className="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex justify-between items-center hover:border-indigo-500 transition-all cursor-pointer group hover:bg-slate-800/50">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-slate-950 rounded-lg group-hover:text-indigo-400 transition-colors"><PlayCircle size={24}/></div>
            <div><h3 className="font-bold text-lg">{m.title}</h3><p className="text-slate-500 text-sm">{m.desc}</p></div>
          </div>
          <span className="text-xs font-bold px-3 py-1 bg-slate-950 rounded-full text-indigo-400 border border-slate-800">{m.status}</span>
        </div>
      ))}
    </div>
  );
}
