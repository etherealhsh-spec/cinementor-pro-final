import React, { useState, useRef, useEffect } from 'react';
import { Film, MessageSquare, Compass, Layout, Send, Loader2, PlayCircle, Bot, User, Sparkles, Palette, Music } from 'lucide-react';
import { GoogleGenAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenAI(API_KEY || "");

export default function App() {
  const [activeTab, setActiveTab] = useState('MENTOR');

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      <aside className="w-20 lg:w-64 bg-slate-900 border-r border-slate-800 flex flex-col py-6 px-4">
        <div className="mb-8 flex items-center gap-3 px-2">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center"><Film size={20} /></div>
          <h1 className="hidden lg:block text-xl font-bold">CineMentor</h1>
        </div>
        <nav className="flex-1 space-y-2">
          <button onClick={() => setActiveTab('MENTOR')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl ${activeTab === 'MENTOR' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}><MessageSquare size={20} /> <span className="hidden lg:block">AI 总监</span></button>
          <button onClick={() => setActiveTab('STUDIO')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl ${activeTab === 'STUDIO' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}><Layout size={20} /> <span className="hidden lg:block">提案工作室</span></button>
          <button onClick={() => setActiveTab('LEARN')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl ${activeTab === 'LEARN' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}><Compass size={20} /> <span className="hidden lg:block">职业路径</span></button>
        </nav>
      </aside>
      <main className="flex-1 p-4 lg:p-8 overflow-hidden">
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
    } catch (e) { setMessages([...newMsgs, { role: 'model', content: "API Key无效或连接超时。" }]); }
    setLoading(false);
  }

  return (
    <div className="flex flex-col h-full bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`p-4 rounded-2xl max-w-[85%] text-sm ${m.role === 'user' ? 'bg-indigo-600' : 'bg-slate-800 border border-slate-700 text-slate-200'}`}>{m.content}</div>
          </div>
        ))}
      </div>
      <div className="p-4 bg-slate-950 flex gap-2">
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} placeholder="询问调色、剪辑节奏或特效..." className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 outline-none focus:ring-2 ring-indigo-500" />
        <button onClick={handleSend} disabled={loading} className="p-4 bg-indigo-600 rounded-xl hover:bg-indigo-500 transition-colors">{loading ? <Loader2 className="animate-spin" size={20}/> : <Send size={20}/>}</button>
      </div>
    </div>
  );
}

function ConceptStudio() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
      <div className="p-6 bg-indigo-600/10 rounded-full text-indigo-500"><Sparkles size={48}/></div>
      <h2 className="text-3xl font-bold">商业提案生成器</h2>
      <p className="text-slate-400 max-w-md">输入你的视频主题，AI 将为你生成包含脚本大纲、LUT建议和BGM参考的完整 Pitch Deck。</p>
      <div className="flex gap-2 w-full max-w-lg">
        <input className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-4" placeholder="例如：赛博朋克风格的汽车广告" />
        <button className="bg-indigo-600 px-8 py-4 rounded-xl font-bold">生成提案</button>
      </div>
    </div>
  );
}

function LearningPath() {
  const modules = [
    { title: "L1: 叙事逻辑与隐形剪辑", status: "已解锁" },
    { title: "L2: 达芬奇色彩科学深度应用", status: "进行中" },
    { title: "L3: 商业提案与接单溢价技巧", status: "待锁定" }
  ];
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold mb-8">职业接单之路</h2>
      {modules.map((m, i) => (
        <div key={i} className="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex justify-between items-center hover:border-indigo-500 transition-all cursor-pointer group">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-slate-950 rounded-lg group-hover:text-indigo-400"><PlayCircle size={24}/></div>
            <div><h3 className="font-bold text-lg">{m.title}</h3><p className="text-slate-500 text-sm">专业进阶课题</p></div>
          </div>
          <span className="text-xs font-bold px-3 py-1 bg-slate-950 rounded-full text-indigo-400 border border-slate-800">{m.status}</span>
        </div>
      ))}
    </div>
  );
}
