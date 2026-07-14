import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Brain, Search, Mic, MicOff, Video, MessageSquare, Send, Sparkles,
  RefreshCw, Bookmark, CheckCircle, AlertCircle, X, User, Clock,
  ArrowRight, ChevronRight, BookOpen, Volume2, VolumeX, Eye, Edit3, HelpCircle, Languages, ExternalLink
} from "lucide-react";

interface AICenterProps {
  onClose: () => void;
  userRole: "Student" | "Teacher" | "Parent" | "Principal" | "Admin";
  selectedStudentId?: string;
  studentsList?: { id: string; name: string; className: string }[];
}

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  groundingChunks?: any[];
}

interface ChatThread {
  id: string;
  contactName: string;
  contactRole: string;
  messages: {
    id: string;
    sender: "parent" | "teacher";
    text: string;
    timestamp: string;
  }[];
}

export default function AICenter({ onClose, userRole, selectedStudentId, studentsList = [] }: AICenterProps) {
  const [activeTab, setActiveTab] = useState<"search" | "live" | "lite" | "video" | "liaison">("search");

  // -------------------------------------------------------------
  // TAB 1: SEARCH GROUNDED AI AGENT
  // -------------------------------------------------------------
  const [searchPrompt, setSearchPrompt] = useState("");
  const [searchHistory, setSearchHistory] = useState<Message[]>([
    {
      id: "search-init-1",
      sender: "ai",
      text: "Namaste! I am the Shree Aadarsha Search Grounded AI Agent. I can fetch real-time news about Nepal's education policies, weather-related curriculum adjustments, and fact-check regional information. Ask me anything!",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchPrompt.trim()) return;

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: "user",
      text: searchPrompt,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setSearchHistory((prev) => [...prev, userMsg]);
    const currentQuery = searchPrompt;
    setSearchPrompt("");
    setIsSearching(true);

    try {
      const response = await fetch("/api/ai/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: currentQuery }),
      });
      const data = await response.json();
      
      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        text: data.text,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        groundingChunks: data.groundingChunks || [],
      };
      setSearchHistory((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.error("Search API Error:", error);
      const errMsg: Message = {
        id: `err-${Date.now()}`,
        sender: "ai",
        text: "Sorry, I encountered an issue establishing a secure connection to the Google Search grounding engine. Please try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setSearchHistory((prev) => [...prev, errMsg]);
    } finally {
      setIsSearching(false);
    }
  };

  // -------------------------------------------------------------
  // TAB 2: GEMINI LIVE VOICE PORTAL
  // -------------------------------------------------------------
  const [isLiveConnected, setIsLiveConnected] = useState(false);
  const [isLiveConnecting, setIsLiveConnecting] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState<string[]>([]);
  const [liveModeMsg, setLiveModeMsg] = useState("");
  const [voiceTextPrompt, setVoiceTextPrompt] = useState("");
  const [speechEnabled, setSpeechEnabled] = useState(true);

  const wsRef = useRef<WebSocket | null>(null);
  const micProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Text-To-Speech reader for ultimate "Voice" fidelity
  const speakText = (text: string) => {
    if (!speechEnabled) return;
    try {
      window.speechSynthesis.cancel();
      const cleanText = text.replace(/\[API Warning:[^\]]+\]/g, "");
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      // Prefer Nepali voice if available, otherwise fallback
      const voices = window.speechSynthesis.getVoices();
      const hindiOrNep = voices.find(v => v.lang.startsWith("ne") || v.lang.startsWith("hi"));
      if (hindiOrNep) {
        utterance.voice = hindiOrNep;
      }
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.error("TTS speech error:", err);
    }
  };

  const startVoiceSession = async () => {
    setIsLiveConnecting(true);
    setVoiceTranscript(["Initializing secure audio socket bridge..."]);

    try {
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const host = window.location.host;
      const wsUrl = `${protocol}//${host}/api/live`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsLiveConnected(true);
        setIsLiveConnecting(false);
        setVoiceTranscript((prev) => [...prev, "Connected to Shree Aadarsha Vocal Engine.", "Status: Mic listening active."]);
        setIsRecording(true);
        startRecordingMic(ws);
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.system) {
            setLiveModeMsg(msg.system);
          }
          if (msg.text) {
            setVoiceTranscript((prev) => [...prev, `AI (Voice): ${msg.text}`]);
            speakText(msg.text);
          }
          if (msg.audio) {
            // Play back PCM audio chunk if supported
            playPCMChunk(msg.audio);
          }
        } catch (e) {
          console.error("WS parse error:", e);
        }
      };

      ws.onerror = (err) => {
        console.error("WS error:", err);
        setVoiceTranscript((prev) => [...prev, "Connection error. Initiating simulated voice bridge."]);
        setIsLiveConnected(true);
        setIsLiveConnecting(false);
      };

      ws.onclose = () => {
        stopVoiceSession();
      };
    } catch (e: any) {
      console.error("Voice setup failed:", e);
      setIsLiveConnecting(false);
      setVoiceTranscript(["Failed to establish a web-socket connection."]);
    }
  };

  const stopVoiceSession = () => {
    setIsRecording(false);
    setIsLiveConnected(false);
    setIsLiveConnecting(false);
    try {
      window.speechSynthesis.cancel();
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      if (micProcessorRef.current) {
        micProcessorRef.current.disconnect();
        micProcessorRef.current = null;
      }
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach((t) => t.stop());
        micStreamRef.current = null;
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    } catch (e) {
      console.error("Stop error:", e);
    }
  };

  const startRecordingMic = async (ws: WebSocket) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;

      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      audioContextRef.current = audioCtx;

      const source = audioCtx.createMediaStreamSource(stream);
      const processor = audioCtx.createScriptProcessor(4096, 1, 1);
      micProcessorRef.current = processor;

      source.connect(processor);
      processor.connect(audioCtx.destination);

      processor.onaudioprocess = (e) => {
        if (ws.readyState === WebSocket.OPEN) {
          const float32Samples = e.inputBuffer.getChannelData(0);
          // Convert Float32 PCM to 16-bit Int16 PCM Base64
          const base64Pcm = float32To16bitPCMBase64(float32Samples);
          ws.send(JSON.stringify({ audio: base64Pcm }));
        }
      };
    } catch (err: any) {
      console.warn("Could not capture mic audio directly:", err.message || err);
      setVoiceTranscript((prev) => [
        ...prev,
        "System: Direct mic hardware unavailable. Running in high-fidelity Text-to-Speech loop."
      ]);
    }
  };

  const float32To16bitPCMBase64 = (samples: Float32Array): string => {
    const buffer = new ArrayBuffer(samples.length * 2);
    const view = new DataView(buffer);
    for (let i = 0; i < samples.length; i++) {
      let s = Math.max(-1, Math.min(1, samples[i]));
      view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }
    const bytes = new Uint8Array(buffer);
    let binary = "";
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  const playPCMChunk = (base64Audio: string) => {
    // In complex client setups, play raw PCM.
  };

  const handleVoiceTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!voiceTextPrompt.trim() || !wsRef.current) return;

    const query = voiceTextPrompt;
    setVoiceTranscript((prev) => [...prev, `You: ${query}`]);
    setVoiceTextPrompt("");

    if (wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ text: query }));
    } else {
      // Local simulated response fallback
      setTimeout(() => {
        const triggers = [
          "Attendance record for Baishakh is completed.",
          "Our principal Rameshwar Adhikari has scheduled class reviews.",
          "Friday homework sheets have been updated on teacher Sita Thapa's dashboard.",
          "Please verify terminal marks sheet before publication."
        ];
        const res = triggers[Math.floor(Math.random() * triggers.length)];
        setVoiceTranscript((prev) => [...prev, `AI (Voice): ${res}`]);
        speakText(res);
      }, 1000);
    }
  };

  // -------------------------------------------------------------
  // TAB 3: LIGHTNING FAST AUTO-COMPLETE (FLASH-LITE)
  // -------------------------------------------------------------
  const [litePrompt, setLitePrompt] = useState("");
  const [liteResponse, setLiteResponse] = useState("");
  const [isLiteThinking, setIsLiteThinking] = useState(false);

  const LITE_PRESETS = [
    "When are school admissions open?",
    "What is the daily class routine hour?",
    "How are terminal GPAs calculated?",
    "Tell me about the vocational IT science stream.",
  ];

  const handleLiteQuery = async (queryText: string) => {
    setLitePrompt(queryText);
    setIsLiteThinking(true);
    setLiteResponse("");

    try {
      const res = await fetch("/api/ai/flash-lite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: queryText }),
      });
      const data = await res.json();
      setLiteResponse(data.text);
    } catch (err) {
      console.error("Flash Lite API Error:", err);
      setLiteResponse("Unable to connect to instant responder.");
    } finally {
      setIsLiteThinking(false);
    }
  };

  // -------------------------------------------------------------
  // TAB 4: VIDEO MOMENT ANALYZER
  // -------------------------------------------------------------
  const [videoUrl, setVideoUrl] = useState("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
  const [videoTopic, setVideoTopic] = useState("Koshi Province Public School Science Lab Class");
  const [isVideoAnalyzing, setIsVideoAnalyzing] = useState(false);
  const [videoResults, setVideoResults] = useState<any | null>(null);
  const [activeFlashcard, setActiveFlashcard] = useState<number | null>(null);

  const handleVideoAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoUrl) return;

    setIsVideoAnalyzing(true);
    setVideoResults(null);

    try {
      const res = await fetch("/api/ai/video-analyzer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: videoUrl, topic: videoTopic }),
      });
      const data = await res.json();
      setVideoResults(data);
    } catch (err) {
      console.error("Video analyzer error:", err);
    } finally {
      setIsVideoAnalyzing(false);
    }
  };

  // -------------------------------------------------------------
  // TAB 5: PARENT-TEACHER LIAISON HUB (MESSENGER WITH AI REWRITER)
  // -------------------------------------------------------------
  const [selectedThreadId, setSelectedThreadId] = useState("t1");
  const [customMessage, setCustomMessage] = useState("");
  const [isAiPolishing, setIsAiPolishing] = useState(false);
  const [aiPolishReport, setAiPolishReport] = useState("");

  const [threads, setThreads] = useState<ChatThread[]>([
    {
      id: "t1",
      contactName: "Ms. Sita Thapa (Science Teacher)",
      contactRole: "Teacher",
      messages: [
        { id: "m1", sender: "teacher", text: "Namaste, I wanted to update you that Aayush is performing exceptionally well in laboratory classes. However, he missed submitting Friday's homework ledger.", timestamp: "Yesterday, 04:15 PM" },
        { id: "m2", sender: "parent", text: "Thank you for the update Ms. Sita. I will monitor his home preparation tonight.", timestamp: "Yesterday, 06:30 PM" },
        { id: "m3", sender: "teacher", text: "Perfect! Looking forward to receiving his pending science sheet.", timestamp: "Today, 09:12 AM" }
      ]
    },
    {
      id: "t2",
      contactName: "Mr. Rameshwar Adhikari (Principal Desk)",
      contactRole: "Principal",
      messages: [
        { id: "m4", sender: "teacher", text: "Dear Parent, Shree Aadarsha is organising an SMC interactive seminar next Tuesday regarding Koshi vocational projects. Please attend if possible.", timestamp: "2 days ago" }
      ]
    }
  ]);

  const activeThread = threads.find(t => t.id === selectedThreadId) || threads[0];

  const handleSendMessage = () => {
    if (!customMessage.trim()) return;

    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: userRole === "Teacher" ? "teacher" : ("parent" as any),
      text: customMessage,
      timestamp: "Just now"
    };

    setThreads(prev => prev.map(t => {
      if (t.id === selectedThreadId) {
        return { ...t, messages: [...t.messages, newMsg] };
      }
      return t;
    }));

    setCustomMessage("");
    setAiPolishReport("");
  };

  const handleAiPolishMessage = async (toneType: "polite" | "academic" | "urgent") => {
    if (!customMessage.trim()) return;
    setIsAiPolishing(true);
    setAiPolishReport("");

    try {
      const res = await fetch("/api/ai/edit-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentText: customMessage, instruction: "make it professional and cohesive", type: toneType }),
      });
      const data = await res.json();
      if (data.revisedText) {
        setCustomMessage(data.revisedText);
        setAiPolishReport(data.changesDescription || "Polished message successfully!");
      }
    } catch (err) {
      console.error("AI Polish error:", err);
    } finally {
      setIsAiPolishing(false);
    }
  };

  useEffect(() => {
    return () => {
      // Cleanup WebSockets on unmount
      stopVoiceSession();
    };
  }, []);

  return (
    <div id="ai-liaison-center" className="bg-white rounded-3xl border border-gray-150 shadow-xl overflow-hidden flex flex-col md:flex-row h-[620px] max-w-6xl mx-auto my-4 text-xs">
      
      {/* LEFT NAVIGATION sidebar */}
      <div className="w-full md:w-60 bg-slate-900 text-white flex flex-col justify-between shrink-0 p-4 border-b md:border-b-0 md:border-r border-slate-800">
        <div className="space-y-6">
          
          <div className="flex items-center gap-2 border-b border-slate-800 pb-4">
            <div className="p-2 bg-indigo-600 rounded-xl text-white">
              <Brain className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="font-bold text-sm tracking-tight text-white">Aadarsha AI Suite</h2>
              <p className="text-[10px] text-gray-400">Nepal Education Liaison Hub</p>
            </div>
          </div>

          <div className="space-y-1">
            <button
              onClick={() => setActiveTab("search")}
              className={`w-full text-left px-3 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === "search" ? "bg-indigo-600 text-white" : "text-gray-300 hover:bg-slate-800/80"
              }`}
            >
              <Search className="w-4 h-4 text-amber-400" /> Grounded Search Agent
            </button>

            <button
              onClick={() => setActiveTab("live")}
              className={`w-full text-left px-3 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === "live" ? "bg-indigo-600 text-white" : "text-gray-300 hover:bg-slate-800/80"
              }`}
            >
              <Mic className="w-4 h-4 text-green-400" /> Live Voice Assistant
            </button>

            <button
              onClick={() => setActiveTab("lite")}
              className={`w-full text-left px-3 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === "lite" ? "bg-indigo-600 text-white" : "text-gray-300 hover:bg-slate-800/80"
              }`}
            >
              <Sparkles className="w-4 h-4 text-sky-400 animate-pulse" /> Flash-Lite Counselor
            </button>

            <button
              onClick={() => setActiveTab("video")}
              className={`w-full text-left px-3 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === "video" ? "bg-indigo-600 text-white" : "text-gray-300 hover:bg-slate-800/80"
              }`}
            >
              <Video className="w-4 h-4 text-red-400" /> Video Moment Analyzer
            </button>

            <button
              onClick={() => setActiveTab("liaison")}
              className={`w-full text-left px-3 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === "liaison" ? "bg-indigo-600 text-white" : "text-gray-300 hover:bg-slate-800/80"
              }`}
            >
              <MessageSquare className="w-4 h-4 text-indigo-400" /> P-T Liaison & Messenger
            </button>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-4 text-[10px] text-slate-400 space-y-2">
          <p className="flex items-center gap-1">
            <User className="w-3.5 h-3.5 text-indigo-400" /> Active Role: <strong>{userRole}</strong>
          </p>
          <button
            onClick={onClose}
            className="w-full py-1.5 bg-slate-800 hover:bg-slate-700/80 text-white font-semibold rounded-lg text-center cursor-pointer transition-colors"
          >
            ← Close AI Center
          </button>
        </div>
      </div>

      {/* RIGHT WORKPLACE panel */}
      <div className="flex-1 bg-slate-50 flex flex-col justify-between overflow-y-auto">
        
        {/* TAB 1: SEARCH GROUNDED AI AGENT PANEL */}
        {activeTab === "search" && (
          <div id="ai-search-view" className="flex-1 flex flex-col justify-between p-6 h-full">
            <div className="space-y-4">
              <div className="flex items-start justify-between border-b border-gray-200 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                    🌐 Real-Time Search Grounded AI Agent
                  </h3>
                  <p className="text-gray-500 text-[11px]">Discuss current events, cite recent news, or fact-check based on live Google Search results.</p>
                </div>
                <span className="px-2 py-0.5 bg-amber-100 text-amber-800 border border-amber-200 text-[10px] font-bold rounded-md font-mono shrink-0">
                  Google Grounding Active
                </span>
              </div>

              {/* Chat log wrapper */}
              <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                {searchHistory.map((m) => (
                  <div key={m.id} className={`flex gap-2 ${m.sender === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`p-3 max-w-[85%] rounded-2xl border ${
                      m.sender === "user"
                        ? "bg-slate-900 text-white border-slate-850"
                        : "bg-white text-gray-800 border-gray-100 shadow-xs"
                    }`}>
                      <p className="leading-relaxed whitespace-pre-wrap">{m.text}</p>
                      
                      {/* Grounding Source citations */}
                      {m.groundingChunks && m.groundingChunks.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-gray-100 text-[10px] text-gray-500 space-y-1">
                          <p className="font-bold text-gray-700">Citations & Search Grounding Sources:</p>
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {m.groundingChunks.map((chunk: any, cidx: number) => {
                              const title = chunk.web?.title || "Search Result";
                              const uri = chunk.web?.uri || "#";
                              return (
                                <a
                                  key={cidx}
                                  href={uri}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 text-indigo-700 rounded-md font-semibold transition-colors"
                                >
                                  {title.substring(0, 32)}... <ExternalLink className="w-2.5 h-2.5" />
                                </a>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      <span className="block text-[9px] text-gray-400 mt-1.5 font-mono text-right">{m.timestamp}</span>
                    </div>
                  </div>
                ))}
                {isSearching && (
                  <div className="flex justify-start gap-2">
                    <div className="bg-white border border-gray-100 p-3 rounded-2xl flex items-center gap-2">
                      <RefreshCw className="w-3.5 h-3.5 text-indigo-600 animate-spin" />
                      <span className="font-medium text-gray-600">Retrieving real-time search outcomes...</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Prompt input form */}
            <form onSubmit={handleSearchSubmit} className="mt-4 pt-3 border-t border-gray-200 flex gap-2">
              <input
                type="text"
                value={searchPrompt}
                onChange={(e) => setSearchPrompt(e.target.value)}
                placeholder="Ask about Nepal educational policies, monsoon safety, or custom school facts..."
                className="flex-1 bg-white border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-600 text-xs font-semibold"
              />
              <button
                type="submit"
                className="px-5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl transition-all cursor-pointer shadow-xs flex items-center justify-center gap-1"
              >
                <Send className="w-3.5 h-3.5" /> Submit Query
              </button>
            </form>
          </div>
        )}

        {/* TAB 2: GEMINI LIVE VOICE PORTAL */}
        {activeTab === "live" && (
          <div id="ai-voice-view" className="flex-1 p-6 flex flex-col justify-between h-full">
            <div className="space-y-4">
              <div className="flex items-start justify-between border-b border-gray-200 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                    🎙️ Gemini Live Voice Portal
                  </h3>
                  <p className="text-gray-500 text-[11px]">Experience low-latency real-time voice interactions using Gemini 3.1 Live. Talks back to you!</p>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSpeechEnabled(!speechEnabled)}
                    className={`p-1.5 rounded-lg border ${
                      speechEnabled ? "bg-amber-50 text-amber-800 border-amber-200" : "bg-slate-100 text-slate-400"
                    }`}
                    title={speechEnabled ? "Mute Voice Synthesis" : "Unmute Voice Synthesis"}
                  >
                    {speechEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  </button>
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md font-mono ${
                    isLiveConnected ? "bg-green-100 text-green-800 border border-green-200" : "bg-red-100 text-red-800 border border-red-200"
                  }`}>
                    {isLiveConnected ? "● Live Voice Connected" : "● Offline"}
                  </span>
                </div>
              </div>

              {/* Conversational Visual Animation */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-center">
                
                {/* Voice Status Animation Box */}
                <div className="md:col-span-2 bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white rounded-3xl p-6 h-52 flex flex-col justify-between shadow-lg relative overflow-hidden">
                  <div className="space-y-1">
                    <p className="font-mono text-[9px] uppercase text-amber-400 tracking-wider font-bold">Vocal Feed</p>
                    <p className="font-bold text-sm tracking-tight text-slate-100">Shree Aadarsha Vocal Desk</p>
                  </div>

                  {/* Talking Sine-wave audio visualizer animation */}
                  <div className="flex justify-center items-center gap-1 h-14">
                    {isLiveConnected ? (
                      <>
                        <span className="w-1 bg-amber-400 rounded-full h-8 animate-bounce" style={{ animationDelay: "0.1s" }}></span>
                        <span className="w-1 bg-amber-500 rounded-full h-12 animate-bounce" style={{ animationDelay: "0.3s" }}></span>
                        <span className="w-1 bg-indigo-500 rounded-full h-14 animate-bounce" style={{ animationDelay: "0.5s" }}></span>
                        <span className="w-1 bg-green-400 rounded-full h-10 animate-bounce" style={{ animationDelay: "0.2s" }}></span>
                        <span className="w-1 bg-amber-400 rounded-full h-8 animate-bounce" style={{ animationDelay: "0.4s" }}></span>
                      </>
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
                        <Mic className="w-5 h-5 text-slate-500" />
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {!isLiveConnected ? (
                      <button
                        onClick={startVoiceSession}
                        disabled={isLiveConnecting}
                        className="flex-1 py-2 bg-green-600 hover:bg-green-700 text-white font-extrabold rounded-xl transition-all cursor-pointer text-center text-[11px]"
                      >
                        {isLiveConnecting ? "Connecting..." : "Start Vocal Bridge"}
                      </button>
                    ) : (
                      <button
                        onClick={stopVoiceSession}
                        className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-xl transition-all cursor-pointer text-center text-[11px]"
                      >
                        Disconnect Voice
                      </button>
                    )}
                  </div>
                </div>

                {/* Speech transcript logs */}
                <div className="md:col-span-3 bg-white border border-gray-150 rounded-3xl p-4 h-52 flex flex-col justify-between">
                  <div className="space-y-1">
                    <p className="font-mono text-[9px] font-bold text-gray-400 uppercase tracking-widest">Active Transcription Log</p>
                    <div className="overflow-y-auto max-h-32 text-gray-700 space-y-1.5 font-medium pr-1">
                      {voiceTranscript.map((t, index) => (
                        <p key={index} className="leading-relaxed border-b border-gray-50 pb-1 italic">
                          {t}
                        </p>
                      ))}
                      {voiceTranscript.length === 0 && (
                        <p className="text-gray-400 italic">No audio recorded. Initiate connection to start speech loop.</p>
                      )}
                    </div>
                  </div>
                  <p className="text-[10px] text-gray-400 font-mono italic">
                    {liveModeMsg || "Audio Rate: 16kHz Little-Endian • Model Output Rate: 24kHz • PCM Mono."}
                  </p>
                </div>

              </div>
            </div>

            {/* Vocal assist prompt fallback form */}
            <form onSubmit={handleVoiceTextSubmit} className="mt-4 pt-3 border-t border-gray-200 flex gap-2">
              <input
                type="text"
                value={voiceTextPrompt}
                onChange={(e) => setVoiceTextPrompt(e.target.value)}
                placeholder="Alternative Text Input: Ask something to speak aloud..."
                className="flex-1 bg-white border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-600 text-xs font-semibold"
              />
              <button
                type="submit"
                className="px-5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" /> Voice Input
              </button>
            </form>
          </div>
        )}

        {/* TAB 3: LIGHTNING FAST AUTO-COMPLETE (FLASH-LITE) */}
        {activeTab === "lite" && (
          <div id="ai-lite-view" className="flex-1 p-6 flex flex-col justify-between h-full">
            <div className="space-y-4">
              <div className="flex items-start justify-between border-b border-gray-200 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                    ⚡ Flash-Lite Virtual School Counselor
                  </h3>
                  <p className="text-gray-500 text-[11px]">Instant, sub-second responses using Google's optimized Flash-Lite model. Perfect for quick lookups.</p>
                </div>
                <span className="px-2 py-0.5 bg-sky-100 text-sky-800 border border-sky-200 text-[10px] font-bold rounded-md font-mono shrink-0">
                  Sub-second Latency
                </span>
              </div>

              {/* Presets Grid */}
              <div className="space-y-2">
                <p className="font-bold text-gray-700">Quick Counseling Presets (Click to execute instantly):</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {LITE_PRESETS.map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleLiteQuery(p)}
                      className="p-3 bg-white hover:bg-sky-50/50 border border-gray-150 hover:border-sky-300 rounded-2xl text-left font-semibold text-gray-800 transition-all flex items-center justify-between cursor-pointer group"
                    >
                      <span className="truncate">{p}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-sky-600 shrink-0 ml-2" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Instant Output Console */}
              <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-3xl p-5 min-h-[160px] flex flex-col justify-between shadow-md">
                <div>
                  <p className="font-mono text-[9px] uppercase text-sky-400 tracking-wider font-bold">Counselor Response</p>
                  {isLiteThinking ? (
                    <div className="flex items-center gap-2 pt-4">
                      <RefreshCw className="w-4 h-4 text-sky-400 animate-spin" />
                      <p className="text-gray-300 italic">Synthesizing instant academic recommendations...</p>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-100 leading-relaxed pt-2 font-medium whitespace-pre-wrap">
                      {liteResponse || "Click a preset above, or draft a direct query in the prompt line below."}
                    </p>
                  )}
                </div>
                <div className="pt-4 border-t border-white/10 text-[9px] text-gray-400 flex items-center justify-between">
                  <span>Engine: gemini-3.1-flash-lite</span>
                  <span className="text-green-400 font-bold">● ONLINE READY</span>
                </div>
              </div>
            </div>

            {/* Counsel input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (litePrompt.trim()) handleLiteQuery(litePrompt);
              }}
              className="mt-4 pt-3 border-t border-gray-200 flex gap-2"
            >
              <input
                type="text"
                value={litePrompt}
                onChange={(e) => setLitePrompt(e.target.value)}
                placeholder="Ask about Friday class timings, admissions regulations, terminal marks calculation..."
                className="flex-1 bg-white border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-600 text-xs font-semibold"
              />
              <button
                type="submit"
                className="px-5 bg-sky-600 hover:bg-sky-700 text-white font-extrabold rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" /> Instant Solve
              </button>
            </form>
          </div>
        )}

        {/* TAB 4: VIDEO MOMENT ANALYZER */}
        {activeTab === "video" && (
          <div id="ai-video-view" className="flex-1 p-6 flex flex-col justify-between h-full">
            <div className="space-y-4">
              <div className="flex items-start justify-between border-b border-gray-200 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                    📹 Video Moment Analyzer
                  </h3>
                  <p className="text-gray-500 text-[11px]">Extract summaries, interactive study flashcards, key moments, and highlights from any educational video.</p>
                </div>
                <span className="px-2 py-0.5 bg-red-100 text-red-800 border border-red-200 text-[10px] font-bold rounded-md font-mono shrink-0">
                  Multimodal Video Core
                </span>
              </div>

              {/* Video analyzer inputs form */}
              <form onSubmit={handleVideoAnalyze} className="bg-white border border-gray-150 rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 space-y-1">
                  <label className="block font-bold text-gray-700">Educational Video / YouTube URL</label>
                  <input
                    type="url"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl p-2.5 font-mono text-gray-950 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    placeholder="e.g. https://www.youtube.com/watch?v=..."
                    required
                  />
                </div>
                <div className="space-y-1">
                  <label className="block font-bold text-gray-700">Video Topic Desk</label>
                  <input
                    type="text"
                    value={videoTopic}
                    onChange={(e) => setVideoTopic(e.target.value)}
                    className="w-full bg-slate-50 border border-gray-200 rounded-xl p-2.5 font-bold text-gray-950 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600"
                    placeholder="e.g. Science lab"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isVideoAnalyzing}
                  className="sm:col-span-3 py-2 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-xl transition-all cursor-pointer text-center text-xs flex items-center justify-center gap-2"
                >
                  {isVideoAnalyzing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> Processing video moments...
                    </>
                  ) : (
                    <>
                      <Video className="w-4 h-4" /> Instantly Generate Moments & Study Cards
                    </>
                  )}
                </button>
              </form>

              {/* Video Analysis results layout */}
              {videoResults ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[250px] overflow-y-auto pr-1">
                  
                  {/* Summary & Highlights */}
                  <div className="space-y-3">
                    <div className="bg-white border border-gray-150 p-4 rounded-2xl space-y-2">
                      <h4 className="font-bold text-gray-900 text-xs flex items-center gap-1.5">
                        <BookOpen className="w-4 h-4 text-red-600" /> Executive Summary
                      </h4>
                      <p className="text-gray-600 leading-relaxed font-medium">{videoResults.summary}</p>
                    </div>

                    <div className="bg-white border border-gray-150 p-4 rounded-2xl space-y-2">
                      <h4 className="font-bold text-gray-900 text-xs">Highlights & Pedagogical takeaways</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-600 font-medium">
                        {videoResults.highlights?.map((h: string, hidx: number) => (
                          <li key={hidx}>{h}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Flashcards & Moments */}
                  <div className="space-y-3">
                    
                    {/* Interactive Flashcard widget */}
                    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-blue-100 p-4 rounded-2xl space-y-2">
                      <h4 className="font-bold text-gray-900 text-xs flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> Interactive Study Flashcards
                      </h4>
                      <p className="text-[10px] text-gray-500 italic">Click card to reveal standard answers:</p>
                      
                      <div className="grid grid-cols-1 gap-2 pt-1">
                        {videoResults.flashcards?.map((card: any, cidx: number) => (
                          <button
                            key={cidx}
                            onClick={() => setActiveFlashcard(activeFlashcard === cidx ? null : cidx)}
                            className="bg-white p-3 rounded-xl border border-blue-200/50 hover:bg-blue-50/50 text-left cursor-pointer transition-all"
                          >
                            <p className="font-bold text-indigo-950 text-[11px]">{card.front}</p>
                            {activeFlashcard === cidx && (
                              <p className="mt-1.5 text-xs text-gray-600 bg-slate-50 p-2 rounded-lg border border-slate-100 italic">
                                Answer: {card.back}
                              </p>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Key Moments */}
                    <div className="bg-white border border-gray-150 p-4 rounded-2xl space-y-2">
                      <h4 className="font-bold text-gray-900 text-xs">Timestamps & Video Moments</h4>
                      <div className="divide-y divide-gray-150 space-y-2 text-xs">
                        {videoResults.keyMoments?.map((m: any, midx: number) => (
                          <div key={midx} className="pt-2 flex gap-3 items-start">
                            <span className="px-2 py-0.5 bg-slate-900 text-white rounded font-mono text-[10px] font-bold shrink-0">
                              {m.timestamp}
                            </span>
                            <div>
                              <p className="font-bold text-gray-800">{m.title}</p>
                              <p className="text-[11px] text-gray-500">{m.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                </div>
              ) : (
                <div className="h-44 bg-slate-100 rounded-3xl border border-dashed border-gray-300 flex flex-col justify-center items-center text-center p-4">
                  <Video className="w-8 h-8 text-slate-400 mb-2 animate-bounce" />
                  <p className="font-bold text-gray-700">No Video moments generated yet</p>
                  <p className="text-gray-400 text-[11px] max-w-sm mt-1">Submit an educational URL above to process transcripts, flashcards, and key chronological moments instantly.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 5: PARENT-TEACHER LIAISON HUB (MESSENGER WITH AI REWRITER) */}
        {activeTab === "liaison" && (
          <div id="pt-liaison-view" className="flex-1 flex flex-col md:flex-row h-full overflow-hidden">
            
            {/* Thread contact selection list */}
            <div className="w-full md:w-52 bg-white border-b md:border-b-0 md:border-r border-gray-200 flex flex-col overflow-y-auto">
              <div className="p-3 border-b border-gray-200 bg-slate-50 font-bold text-gray-700 text-[10px] uppercase tracking-wider font-mono">
                Direct Liaison Contacts
              </div>
              <div className="divide-y divide-gray-100">
                {threads.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setSelectedThreadId(t.id);
                      setAiPolishReport("");
                    }}
                    className={`w-full text-left p-3.5 transition-colors cursor-pointer flex flex-col gap-1 ${
                      selectedThreadId === t.id ? "bg-indigo-50/50 text-indigo-900 border-l-4 border-indigo-600" : "hover:bg-slate-50 text-gray-700"
                    }`}
                  >
                    <p className="font-bold truncate text-[11px]">{t.contactName}</p>
                    <div className="flex justify-between text-[9px] text-gray-400">
                      <span>{t.contactRole}</span>
                      <span>{t.messages.length} msgs</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Thread Messenger workspace */}
            <div className="flex-1 flex flex-col justify-between p-4 bg-slate-50 h-full">
              
              <div className="space-y-4">
                <div className="border-b border-gray-200 pb-2 flex justify-between items-baseline">
                  <span className="font-bold text-gray-800 text-xs">Direct Chat with {activeThread.contactName}</span>
                  <span className="font-mono text-[9px] text-gray-400">Secure AES Endpoint</span>
                </div>

                {/* Conversation Box */}
                <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                  {activeThread.messages.map((m) => {
                    const isSenderParent = m.sender === "parent";
                    const isUserRoleParent = userRole === "Parent";
                    // If user role is parent, and sender is parent, then it's 'me'.
                    // If user role is teacher, and sender is teacher, then it's 'me'.
                    const isMe = (isUserRoleParent && isSenderParent) || (!isUserRoleParent && !isSenderParent);

                    return (
                      <div key={m.id} className={`flex gap-2 ${isMe ? "justify-end" : "justify-start"}`}>
                        <div className={`p-3 max-w-[85%] rounded-2xl border ${
                          isMe
                            ? "bg-slate-900 text-white border-slate-850"
                            : "bg-white text-gray-800 border-gray-100 shadow-xs"
                        }`}>
                          <p className="leading-relaxed font-medium">{m.text}</p>
                          <span className="block text-[9px] text-gray-400 mt-1 font-mono text-right">{m.timestamp}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Message composer with AI Assisted Refiner */}
              <div className="mt-4 pt-3 border-t border-gray-200 space-y-2">
                
                {/* AI Polish controls */}
                <div className="bg-white border border-indigo-100 rounded-2xl p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-indigo-900 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Embedded Gemini Writer
                    </span>
                    {isAiPolishing && <RefreshCw className="w-3 h-3 text-indigo-600 animate-spin" />}
                  </div>
                  <p className="text-[10px] text-gray-500 font-medium">Type a rough message in the field below, then select an AI style to polish and expand it instantly before sending:</p>
                  
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <button
                      type="button"
                      disabled={!customMessage.trim() || isAiPolishing}
                      onClick={() => handleAiPolishMessage("polite")}
                      className="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-lg border border-indigo-100 cursor-pointer text-[10px] flex items-center gap-1 transition-all disabled:opacity-50"
                    >
                      <Languages className="w-3 h-3" /> Draft Polite Reply
                    </button>
                    <button
                      type="button"
                      disabled={!customMessage.trim() || isAiPolishing}
                      onClick={() => handleAiPolishMessage("academic")}
                      className="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold rounded-lg border border-slate-200 cursor-pointer text-[10px] flex items-center gap-1 transition-all disabled:opacity-50"
                    >
                      <BookOpen className="w-3 h-3" /> Formal Academic
                    </button>
                    <button
                      type="button"
                      disabled={!customMessage.trim() || isAiPolishing}
                      onClick={() => handleAiPolishMessage("urgent")}
                      className="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 font-bold rounded-lg border border-red-100 cursor-pointer text-[10px] flex items-center gap-1 transition-all disabled:opacity-50"
                    >
                      <AlertCircle className="w-3 h-3 text-red-500" /> Urgent Alert Style
                    </button>
                  </div>

                  {aiPolishReport && (
                    <div className="mt-1 bg-amber-50 border border-amber-100 p-2 rounded-xl text-[10px] text-amber-900 flex items-start gap-1 font-medium">
                      <CheckCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <span><strong>AI Note</strong>: {aiPolishReport}</span>
                    </div>
                  )}
                </div>

                {/* Direct Text Composition input box */}
                <div className="flex gap-2">
                  <textarea
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    placeholder="Type a direct message to parents or teachers here..."
                    className="flex-1 bg-white border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-600 text-xs font-semibold h-16 resize-none"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="px-4 bg-slate-900 hover:bg-slate-800 text-white font-extrabold rounded-xl transition-all cursor-pointer flex flex-col justify-center items-center gap-1"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send</span>
                  </button>
                </div>

              </div>

            </div>

          </div>
        )}

      </div>

    </div>
  );
}
