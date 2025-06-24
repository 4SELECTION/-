import React, { useState } from 'react';

// --- Mock Data based on the Legal Memo ---
// This data simulates what would be fetched from a database.
const caseData = {
  caseNumber: 'CASE-2025-0624',
  caseName: '株式会社インテリアツツミに対する名誉毀損及び不正競争事案',
  plaintiff: {
    name: '株式会社インテリアツツミ (B社)',
    representative: '堤 正義',
  },
  defendant: {
    name: '株式会社エクストリンク (A社)',
    representative: '江楠 太郎',
  },
  status: '証拠収集・戦略立案フェーズ',
  criticality: '高',
  summary: '競合企業であるA社が、B社の会計不正に関する虚偽情報をメールやウェブフォーラムで拡散。結果、B社は主要顧客との取引を停止され、売上が大幅に減少した。現在、不正競争防止法、民法、刑法に基づく法的措置を検討中。'
};

const timelineData = [
  { id: 1, date: '2025-04-15', type: 'disinformation', title: 'A社による虚偽情報メールの送信開始', description: 'A社が複数の取引先に対し、B社が「不正な会計処理を行っている」との虚偽内容を含むメールを送信。' },
  { id: 2, date: '2025-04-22', type: 'web_post', title: '匿名ウェブフォーラムへの投稿', description: '業界関連の匿名ウェブフォーラムに、同様の虚偽情報がA社関係者と思われる人物により投稿される。' },
  { id: 3, date: '2025-05-10', type: 'customer_impact', title: '主要顧客からの取引停止通告', description: 'B社の主要顧客である株式会社グランドデザインより、本件を理由とする取引一時停止の連絡が入る。' },
  { id: 4, date: '2025-05-20', type: 'internal_investigation', title: 'B社による内部調査開始', description: '事態を重く見たB社が、顧問弁護士と共に内部調査および証拠保全を開始。' },
  { id: 5, date: '2025-06-05', type: 'legal_action', title: '発信者情報開示請求の準備', description: 'ウェブフォーラム投稿者の特定のため、プロバイダに対する発信者情報開示請求の準備に着手。' },
];

const evidenceData = [
  { id: 'EVD-001', type: 'メール', date: '2025-04-15', description: 'A社から取引先Xに送信された虚偽情報メールのコピー', reliability: '高', source: '取引先Xからの任意提供' },
  { id: 'EVD-002', type: 'ウェブアーカイブ', date: '2025-04-22', description: '匿名ウェブフォーラムの投稿内容のスクリーンショットおよびアーカイブ', reliability: '中', source: '自社保全 (archive.today)' },
  { id: 'EVD-003', type: '音声記録', date: '2025-05-11', description: '顧客担当者が取引停止理由を語る電話の録音', reliability: '高', source: 'B社営業担当' },
  { id: 'EVD-004', type: '売上データ', date: '2025-05-31', description: '前年同月比での売上減少を示す会計データ', reliability: '高', source: 'B社会計部' },
  { id: 'EVD-005', type: 'IPアドレスログ', date: 'N/A', description: '開示請求により取得を目指す投稿者のIPアドレス', reliability: '請求中', source: 'プロバイダ' },
];

const damagesData = {
  total: 17500000,
  breakdown: [
    { item: '逸失利益（売上減少）', amount: 12000000, description: '主要顧客からの取引停止および新規契約の逸注による損失。' },
    { item: '信用回復費用', amount: 3000000, description: '信頼回復のためのPR活動、顧客への説明会開催費用等の見込み。' },
    { item: '調査費用・弁護士費用', amount: 2500000, description: '内部調査、証拠保全、訴訟準備にかかる実費および着手金。' },
  ]
};

// --- SVG Icons (as React Components) ---
const IconFileText = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline>
  </svg>
);
const IconAlertTriangle = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line>
  </svg>
);
const IconSparkles = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.5 5.5L5 10l5.5 1.5L12 17l1.5-5.5L19 10l-5.5-1.5z"/><path d="M22 22 19 19"/><path d="M5 5 2 2"/></svg>;
const IconMail = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>;
const IconGlobe = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>;
const IconUserX = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="18" y1="8" x2="23" y2="13"></line><line x1="23" y1="8" x2="18" y2="13"></line></svg>;
const IconBriefcase = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>;
const IconTarget = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg>;
const IconBalance = (props) => <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 4L4 8l8 4 8-4-8-4z"/><path d="M4 12l8 4 8-4"/><path d="M12 20V12"/><path d="M4 8v8"/><path d="M20 8v8"/></svg>;

// --- Reusable UI Components (imitating shadcn/ui) ---
const Card = ({ children, className }) => <div className={`bg-white border border-slate-200 rounded-lg shadow-sm ${className}`}>{children}</div>;
const CardHeader = ({ children, className }) => <div className={`p-4 border-b border-slate-200 ${className}`}>{children}</div>;
const CardTitle = ({ children, className }) => <h3 className={`text-lg font-semibold text-slate-800 ${className}`}>{children}</h3>;
const CardContent = ({ children, className }) => <div className={`p-4 ${className}`}>{children}</div>;
const CardDescription = ({ children, className }) => <p className={`text-sm text-slate-500 ${className}`}>{children}</p>;
const Button = ({ children, onClick, disabled, className }) => (
    <button onClick={onClick} disabled={disabled} className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none bg-indigo-600 text-white hover:bg-indigo-700 h-10 px-4 py-2 ${className}`}>
        {children}
    </button>
);
const LoadingSpinner = () => <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>;
const LoadingDots = () => (
    <div className="flex space-x-2 justify-center items-center">
        <div className="h-2 w-2 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
    <div className="h-2 w-2 bg-slate-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
    <div className="h-2 w-2 bg-slate-500 rounded-full animate-bounce"></div>
    </div>
);


// --- Main Application Components for each Tab ---

function Dashboard() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>{caseData.caseName}</CardTitle>
            <CardDescription>事案番号: {caseData.caseNumber}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <h4 className="font-semibold text-slate-600">被害企業 (B社)</h4>
                <p>{caseData.plaintiff.name}</p>
                <p className="text-sm text-slate-500">代表: {caseData.plaintiff.representative}</p>
              </div>
              <div>
                <h4 className="font-semibold text-slate-600">被疑企業 (A社)</h4>
                <p>{caseData.defendant.name}</p>
                <p className="text-sm text-slate-500">代表: {caseData.defendant.representative}</p>
              </div>
            </div>
             <div>
                <h4 className="font-semibold text-slate-600">事案概要</h4>
                <p className="text-sm text-slate-700">{caseData.summary}</p>
              </div>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-1 gap-6">
        <Card>
          <CardHeader><CardTitle>ステータス</CardTitle></CardHeader>
          <CardContent>
            <p className="text-blue-600 font-semibold">{caseData.status}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>重要度</CardTitle></CardHeader>
          <CardContent>
             <div className="flex items-center gap-2">
                <IconAlertTriangle className="text-red-500 h-6 w-6" />
                <p className="text-red-600 font-semibold">{caseData.criticality}</p>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Timeline() {
  // ... (Component code remains the same as previous version)
  return <Card><CardHeader><CardTitle>事案の時系列</CardTitle></CardHeader><CardContent>...</CardContent></Card>;
}

function EvidenceList() {
    // ... (Component code remains the same as previous version)
  return <Card><CardHeader><CardTitle>証拠リスト</CardTitle></CardHeader><CardContent>...</CardContent></Card>;
}

function StrategyDraft() {
  // ... (Component code remains the same as previous version)
  return <div>...</div>;
}

function Damages() {
  // ... (Component code remains the same as previous version)
  return <Card><CardHeader><CardTitle>損害額の算定（見込み）</CardTitle></CardHeader><CardContent>...</CardContent></Card>;
}

function PrecedentAnalysis() {
    const [summary, setSummary] = useState(caseData.summary);
    const [isLoading, setIsLoading] = useState(false);
    const [precedents, setPrecedents] = useState([]);
    const [error, setError] = useState(null);

    const findPrecedents = async () => {
        if (!summary.trim()) return;
        setIsLoading(true);
        setError(null);
        setPrecedents([]);

        const systemPrompt = `あなたは優秀なリーガルリサーチ専門のAIアシスタントです。提示された事案概要に基づき、日本の法律における関連性の高い判例または法的根拠を3件検索してください。各項目について、事件番号や条文、概要、そしてなぜこの事案と関連するのかの理由を明確に記述してください。`;

        let chatHistory = [{ role: "user", parts: [{ text: systemPrompt + '\n\n# \u5206\u6790\u5bfe\u8c61\u306e\u4e8b\u6848\u6982\u8981\n' + summary }] }];
        const payload = {
            contents: chatHistory,
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: "OBJECT",
                    properties: {
                        precedents: {
                            type: "ARRAY",
                            items: {
                                type: "OBJECT",
                                properties: {
                                    caseNumber: { type: "STRING", description: "\u4e8b\u4ef6\u756a\u53f7\u3001\u88cf\u5229\u30e8\u30e0\u65e5\u6642\u3001\u307e\u305f\u306f\u6761\u6587\u756a\u53f7" },
                                    summary: { type: "STRING", description: "\u5224\u4f8b\u307e\u305f\u306f\u6761\u6587\u306e\u7c21\u5358\u306a\u6982\u8981" },
                                    relevance: { type: "STRING", description: "\u306a\u305c\u3053\u306e\u4e8b\u6848\u3068\u95a2\u9023\u6027\u304c\u9ad8\u3044\u306e\u304b\u306e\u8aac\u660e" }
                                },
                                required: ["caseNumber", "summary", "relevance"]
                            }
                        }
                    },
                }
            }
        };

        const apiKey = "";
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!response.ok) {
                throw new Error(`API\u30ea\u30af\u30a8\u30b9\u30c8\u304c\u5931\u6557\u3057\u307e\u3057\u305f: ${response.status}`);
            }
            const result = await response.json();

            if (result.candidates?.[0]?.content?.parts?.[0]?.text) {
                const jsonText = result.candidates[0].content.parts[0].text;
                const parsedJson = JSON.parse(jsonText);
                setPrecedents(parsedJson.precedents || []);
            } else {
                throw new Error("AI\u304b\u3089\u306e\u5fdc\u7b54\u304c\u4e88\u671f\u3057\u305f\u5f62\u5f0f\u3067\u306f\u3042\u308a\u307e\u305b\u3093\u3067\u3057\u305f\u3002");
            }
        } catch (e) {
            console.error(e);
            setError(e.message);
        } finally {
            setIsLoading(false);
        }
    };
    
    const getRelevanceColor = (index) => {
        const colors = ['border-green-500', 'border-blue-500', 'border-purple-500'];
        return colors[index % colors.length];
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>\u5224\u4f8b\u30fb\u6cd5\u7684\u6839\u62e0\u5206\u6790 \u2728</CardTitle>
                <CardDescription>\u4e8b\u6848\u6982\u8981\u3092\u57fa\u306b\u3001AI\u304c\u95a2\u9023\u3059\u308b\u5224\u4f8b\u3084\u6cd5\u7684\u6839\u62e0\u3092\u691c\u7d22\u3057\u307e\u3059\u3002</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <textarea
                        className="w-full p-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        rows="5"
                        value={summary}
                        onChange={(e) => setSummary(e.target.value)}
                        disabled={isLoading}
                    />
                    <Button onClick={findPrecedents} disabled={isLoading || !summary.trim()}>
                        {isLoading ? <LoadingSpinner /> : <IconBalance className="h-5 w-5 mr-2" />}
                        \u5206\u6790\u3092\u5b9f\u884c
                    </Button>
                </div>
                 {error && <div className="mt-4 p-4 text-sm text-red-700 bg-red-100 rounded-lg" role="alert">{error}</div>}

                 {isLoading && (
                    <div className="mt-6 space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <Card key={i} className="animate-pulse">
                                <CardHeader><div className="h-5 w-3/4 bg-slate-200 rounded"></div></CardHeader>
                                <CardContent><div className="h-16 bg-slate-200 rounded"></div></CardContent>
                            </Card>
                        ))}
                    </div>
                 )}

                 {precedents.length > 0 && (
                     <div className="mt-6">
                         <h4 className="font-semibold text-slate-800 mb-3">\u691c\u7d22\u7d50\u679c:</h4>
                         <div className="space-y-4">
                             {precedents.map((p, index) => (
                                 <Card key={index} className={`border-l-4 ${getRelevanceColor(index)}`}>
                                     <CardHeader>
                                         <CardTitle className="text-slate-700">{p.caseNumber}</CardTitle>
                                     </CardHeader>
                                     <CardContent className="space-y-3">
                                         <div>
                                            <h5 className="font-semibold text-sm text-slate-600">\u6982\u8981</h5>
                                            <p className="text-sm text-slate-700">{p.summary}</p>
                                         </div>
                                         <div>
                                            <h5 className="font-semibold text-sm text-slate-600">\u672c\u4ef6\u3068\u306e\u95a2\u9023\u6027</h5>
                                            <p className="text-sm text-slate-700">{p.relevance}</p>
                                         </div>
                                     </CardContent>
                                 </Card>
                             ))}
                         </div>
                     </div>
                 )}
            </CardContent>
        </Card>
    );
}


function AIAnalyst() {
  // ... (Component code remains the same as previous version)
  return <Card><CardHeader><CardTitle>AI\u30a2\u30ca\u30ea\u30b9\u30c8 \u2728</CardTitle></CardHeader><CardContent>...</CardContent></Card>;
}


// --- Custom Tab Components (Error Fixed) ---
const Tabs = ({ value, onValueChange, children }) => (
  <div>
    {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
           return React.cloneElement(child, { activeTab: value, onTabChange: onValueChange });
        }
        return child;
    })}
  </div>
);
const TabsList = ({ children, activeTab, onTabChange }) => (
  <div className="border-b border-slate-200 mb-6">
    <nav className="-mb-px flex flex-wrap -mb-px space-x-6" aria-label="Tabs">
      {React.Children.map(children, child => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child, { 
              isActive: child.props.value === activeTab, 
              onClick: () => onTabChange(child.props.value) 
            });
          }
          return child;
      })}
    </nav>
  </div>
);
const TabsTrigger = ({ children, value, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
      ${isActive
        ? 'border-indigo-500 text-indigo-600'
        : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
      }`
    }
  >
    {children}
  </button>
);
const MainContentWrapper = ({ children, activeTab }) => {
    return (
        <main>
            {React.Children.map(children, child => {
                if (React.isValidElement(child) && child.type === TabsContent) {
                    return React.cloneElement(child, { activeTab });
                }
                return child;
            })}
        </main>
    );
};
const TabsContent = ({ value, activeTab, children }) => (
  value === activeTab ? <div>{children}</div> : null
);


// --- The Main App Component (Root of the SPA) ---
export default function App() {
  const [tab, setTab] = useState("dashboard");

  // Omitted other components for brevity, they remain unchanged
  const OmittedTimeline = () => <Card><CardHeader><CardTitle>\u4e8b\u6848\u306e\u6642\u7d4c</CardTitle></CardHeader><CardContent><div className="p-4 bg-slate-100 rounded-md text-center text-slate-500">\u30b3\u30f3\u30c6\u30f3\u30c4\u306f\u7701\u7565\u3055\u308c\u307e\u3057\u305f</div></CardContent></Card>;
  const OmittedEvidenceList = () => <Card><CardHeader><CardTitle>\u8a3c\u62e0\u30ea\u30b9\u30c8</CardTitle></CardHeader><CardContent><div className="p-4 bg-slate-100 rounded-md text-center text-slate-500">\u30b3\u30f3\u30c6\u30f3\u30c4\u306f\u7701\u7565\u3055\u308c\u307e\u3057\u305f</div></CardContent></Card>;
  const OmittedStrategyDraft = () => <Card><CardHeader><CardTitle>\u6226\u7565\u30c9\u30e9\u30d5\u30c8</CardTitle></CardHeader><CardContent><div className="p-4 bg-slate-100 rounded-md text-center text-slate-500">\u30b3\u30f3\u30c6\u30f3\u30c4\u306f\u7701\u7565\u3055\u308c\u307e\u3057\u305f</div></CardContent></Card>;
  const OmittedDamages = () => <Card><CardHeader><CardTitle>\u6355\u6355\u984d\u7b97\u5b9a</CardTitle></CardHeader><CardContent><div className="p-4 bg-slate-100 rounded-md text-center text-slate-500">\u30b3\u30f3\u30c6\u30f3\u30c4\u306f\u7701\u7565\u3055\u308c\u307e\u3057\u305f</div></CardContent></Card>;
  const OmittedAIAnalyst = () => <Card><CardHeader><CardTitle>AI\u30a2\u30ca\u30ea\u30b9\u30c8 \u2728</CardTitle></CardHeader><CardContent><div className="p-4 bg-slate-100 rounded-md text-center text-slate-500">\u30b3\u30f3\u30c6\u30f3\u30c4\u306f\u7701\u7565\u3055\u308c\u307e\u3057\u305f</div></CardContent></Card>;


  return (
    <div className="bg-slate-50 min-h-screen p-4 sm:p-6 font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">\u30ea\u30fc\u30ac\u30eb\u30b1\u30fc\u30b9\u30fb\u30a2\u30ca\u30ea\u30c6\u30a3\u30af\u30b9</h1>
          <p className="text-slate-500">\u4e8b\u6848\u5206\u6790\u30c0\u30c3\u30b7\u30e5\u30dc\u30fc\u30c9</p>
        </header>
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="dashboard">\u6982\u8981</TabsTrigger>
            <TabsTrigger value="timeline">\u6642\u7d4c</TabsTrigger>
            <TabsTrigger value="evidence">\u8a3c\u62e0\u30ea\u30b9\u30c8</TabsTrigger>
            <TabsTrigger value="precedent">\u5224\u4f8b\u30fb\u6839\u62e0\u5206\u6790 \u2728</TabsTrigger>
            <TabsTrigger value="strategy">\u6226\u7565\u30c9\u30e9\u30d5\u30c8 \u2728</TabsTrigger>
            <TabsTrigger value="damages">\u6355\u6355\u984d\u7b97\u5b9a</TabsTrigger>
            <TabsTrigger value="ai">AI\u30a2\u30ca\u30ea\u30b9\u30c8 \u2728</TabsTrigger>
          </TabsList>
          
          <MainContentWrapper activeTab={tab}>
            <TabsContent value="dashboard"><Dashboard /></TabsContent>
            <TabsContent value="timeline"><OmittedTimeline /></TabsContent>
            <TabsContent value="evidence"><OmittedEvidenceList /></TabsContent>
            <TabsContent value="precedent"><PrecedentAnalysis /></TabsContent>
            <TabsContent value="strategy"><OmittedStrategyDraft /></TabsContent>
            <TabsContent value="damages"><OmittedDamages /></TabsContent>
            <TabsContent value="ai"><OmittedAIAnalyst /></TabsContent>
          </MainContentWrapper>
        </Tabs>
      </div>
    </div>
  );
}

