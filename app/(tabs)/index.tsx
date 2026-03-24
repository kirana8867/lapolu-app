import { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, ActivityIndicator, Linking, Alert, Modal,
  KeyboardAvoidingView, Platform, Animated
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const COLORS = {
  primary: '#48426D',
  secondary: '#5A5482',
  gold: '#F0C38E',
  cream: '#FEF6EC',
  cream2: '#FDEBD0',
  white: '#FFFFFF',
  ink: '#1A1530',
  ink2: '#3A3360',
  ink3: '#7A7298',
  border: '#EDD9C0',
  green: '#1A7A4A',
  greenBg: '#E8F5EE',
  red: '#C0392B',
  redBg: '#FDECEA',
  orange: '#E67E22',
  orangeBg: '#FEF0E7',
};

const LANGUAGES = ['English','Hindi','Tamil','Telugu','Kannada','Malayalam','Marathi','Bengali'];

const TOPICS = [
  {label:'BNS / IPC Criminal', value:'BNS Bharatiya Nyaya Sanhita 2023 criminal law'},
  {label:'Consumer Rights', value:'Consumer Protection Act 2019'},
  {label:'Property Law', value:'property and land disputes Transfer of Property Act'},
  {label:'Labour Law', value:'labour and employment law'},
  {label:'Family Law', value:'family law Hindu Marriage Act'},
  {label:'RTI', value:'RTI Right to Information Act 2005'},
  {label:'Cyber Law', value:'cyber crime IT Act 2000'},
  {label:'Constitution', value:'fundamental rights Indian Constitution'},
];

const LEGAL_DATA = {
  privacy: {
    title: 'Privacy Policy',
    content: `Last updated: March 2025\n\nLAPOLU Indian Market is committed to protecting your privacy under the Digital Personal Data Protection Act 2023 and the IT Act 2000.\n\nINFORMATION WE COLLECT\nMobile numbers for OTP login, legal queries, language preferences, device info. Your API key is stored only in your browser, never on our servers.\n\nHOW WE USE IT\nTo provide AI legal responses, improve the platform. We never sell your data.\n\nDATA SECURITY\nAll data encrypted via SSL.\n\nYOUR RIGHTS\nAccess, correct, erase your data. Withdraw consent. File complaint with Data Protection Board of India.\n\nContact: help@lapolu.com`
  },
  terms: {
    title: 'Terms and Conditions',
    content: `Governing Law: India\nLast updated: March 2025\n\nBy using LAPOLU, you agree to these terms.\n\n1. ACCEPTANCE\nYou confirm you are 18+ and agree to be legally bound.\n\n2. NATURE OF SERVICE\nLAPOLU provides general legal information only, not legal advice. No attorney-client relationship is created. Always consult a Bar Council advocate.\n\n3. SUBSCRIPTION\nLAPOLU PRO is billed at Rs.299/month. Cancel anytime.\n\n4. USER OBLIGATIONS\nDo not use for unlawful purposes. Do not submit false information.\n\n5. GOVERNING LAW\nIndian law. Disputes in Indian courts.\n\nContact: help@lapolu.com`
  },
  disclaimer: {
    title: 'Legal Disclaimer',
    content: `Please read this disclaimer carefully before using LAPOLU.\n\nNOT LEGAL ADVICE\nAll information from LAPOLU is for general educational purposes only. It is not legal advice. No attorney-client relationship is formed.\n\nAI LIMITATIONS\nAI can make errors and may not reflect current amendments to BNS, BNSS and BSA. Always verify with a qualified advocate before taking legal action.\n\nNO GUARANTEE\nLAPOLU makes no guarantees about legal outcomes.\n\nEMERGENCIES\nIn emergencies, contact police, courts or legal aid immediately.\n\nBy using LAPOLU, you acknowledge and agree to this disclaimer.`
  },
  refund: {
    title: 'Refund Policy',
    content: `Applicable to LAPOLU PRO Subscription\nEffective: March 2025\n\nSUBSCRIPTION BILLING\nBilled at Rs.299/month. Subscription auto-renews monthly.\n\nREFUND ELIGIBILITY\n- Technical failure on LAPOLU platform\n- Duplicate charges due to payment errors\n- Unauthorized transaction reported within 24 hours\n\nNON-REFUNDABLE\n- Completed subscription months\n- Partial month cancellations\n\nHOW TO REQUEST\nEmail help@lapolu.com within 7 days. Refunds in 5 to 7 business days.\n\nContact: help@lapolu.com`
  },
  advocate: {
    title: 'Advocate Terms',
    content: `For advocates registered on LAPOLU.\n\n1. ELIGIBILITY\nMust hold valid LLB. Be enrolled with Bar Council of India or State Bar Council.\n\n2. PLATFORM ROLE\nLAPOLU is a technology intermediary only. You are an independent professional.\n\n3. CODE OF CONDUCT\nComply with Bar Council of India Rules, Advocates Act 1961.\n\n4. CONFIDENTIALITY\nMaintain strict client confidentiality.\n\n5. TERMINATION\nEither party may terminate with 7 days notice.\n\nContact: help@lapolu.com`
  }
};

// ─── PRO FEATURES CONFIG ───────────────────────────────────────────────────
// Each feature now has an `action` key that maps to a screen/function
const PRO_FEATURES = [
  { icon: '🤖', title: 'Smart AI Legal Advisor', desc: 'AI asks follow-up questions & gives step-by-step guidance', action: 'smartAI' },
  { icon: '🗺️', title: 'Legal Roadmap', desc: 'Get a clear action plan: Step 1 → Step 2 → Step 3', action: 'roadmap' },
  { icon: '⚠️', title: 'Risk Detector', desc: 'Paste agreement text, AI finds risks & missing clauses', action: 'riskDetector' },
  { icon: '📊', title: 'Legal Safety Score', desc: 'AI scores your legal risk level from 1-10', action: 'safetyScore' },
  { icon: '📄', title: 'Document Engine', desc: 'Generate filled legal documents', action: 'docEngine' },
  { icon: '🔔', title: 'Legal Reminders', desc: 'Reminders for rent, agreements, court deadlines', action: 'reminders' },
  { icon: '📁', title: 'Personal Legal Dashboard', desc: 'Track all your problems, documents & steps', action: 'dashboard' },
  { icon: '📚', title: 'Premium Document Library', desc: 'Access all legal templates & business agreements', action: 'docLibrary' },
  { icon: '⚖️', title: 'When to Call a Lawyer', desc: 'AI tells you exactly when you need professional help', action: 'lawyerAdvice' },
  { icon: '🚀', title: 'Priority AI Access', desc: 'Faster, better AI responses over free users', action: 'priorityAI' },
];

// ─── DOCUMENT LIBRARY ─────────────────────────────────────────────────────
const DOC_LIBRARY = [
  { icon: '🏠', title: 'Rent Agreement', desc: 'Standard residential rent agreement (11 months)' },
  { icon: '💼', title: 'Employment Contract', desc: 'Offer letter & employment terms' },
  { icon: '🤝', title: 'Partnership Deed', desc: 'Business partnership agreement' },
  { icon: '📜', title: 'Legal Notice', desc: 'General purpose legal notice template' },
  { icon: '🔒', title: 'NDA Agreement', desc: 'Non-disclosure / confidentiality agreement' },
  { icon: '🏢', title: 'Lease Deed', desc: 'Commercial property lease deed' },
  { icon: '💸', title: 'Loan Agreement', desc: 'Personal loan agreement between individuals' },
  { icon: '📋', title: 'Will / Testament', desc: 'Simple last will and testament' },
  { icon: '🚗', title: 'Vehicle Sale Deed', desc: 'Sale agreement for motor vehicles' },
  { icon: '👨‍👩‍👧', title: 'Divorce MOU', desc: 'Mutual consent divorce memorandum' },
];

export default function HomeScreen() {
  const [lang, setLang] = useState('English');
  const [topic, setTopic] = useState(TOPICS[0].value);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showApiInput, setShowApiInput] = useState(false);
  const [activeTab, setActiveTab] = useState('ai');
  const [isPro, setIsPro] = useState(false);
  const [showProModal, setShowProModal] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [rtiStep, setRtiStep] = useState(1);
  const [rtiForm, setRtiForm] = useState({name:'',mobile:'',address:'',state:'',dept:'',info:'',purpose:''});
  const [rtiLetter, setRtiLetter] = useState('');
  const [rtiLoading, setRtiLoading] = useState(false);
  const [legalModal, setLegalModal] = useState(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // ─── PRO FEATURE SCREENS ──────────────────────────────────────────────────
  const [proScreen, setProScreen] = useState(null); // null = show PRO tab list

  // Risk Detector
  const [riskText, setRiskText] = useState('');
  const [riskResult, setRiskResult] = useState(null);
  const [riskLoading, setRiskLoading] = useState(false);

  // Document Engine
  const [docType, setDocType] = useState('Rent Agreement');
  const [docForm, setDocForm] = useState({party1:'', party2:'', date:'', details:''});
  const [docResult, setDocResult] = useState('');
  const [docLoading, setDocLoading] = useState(false);

  // Reminders
  const [reminders, setReminders] = useState([
    {id:1, title:'Rent Agreement Renewal', date:'15 Apr 2025', done:false},
    {id:2, title:'RTI Response Deadline', date:'30 Apr 2025', done:false},
  ]);
  const [newRemTitle, setNewRemTitle] = useState('');
  const [newRemDate, setNewRemDate] = useState('');

  // Dashboard - saved cases
  const [savedCases, setSavedCases] = useState([]);

  // Lawyer Advice
  const [lawyerQ, setLawyerQ] = useState('');
  const [lawyerResult, setLawyerResult] = useState(null);
  const [lawyerLoading, setLawyerLoading] = useState(false);

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }).start();
    const t = setTimeout(() => setShowWelcome(false), 3000);
    return () => clearTimeout(t);
  }, []);

  // ─── GUARD: require PRO + API key ────────────────────────────────────────
  const requireProAndKey = () => {
    if (!isPro) { setShowProModal(true); return false; }
    if (!apiKey.trim()) { setShowApiInput(true); Alert.alert('Enter your Anthropic API key first.'); return false; }
    return true;
  };

  // ─── CALL ANTHROPIC API ──────────────────────────────────────────────────
  const callAI = async (systemPrompt, userPrompt, maxTokens = 2000) => {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {'Content-Type':'application/json','x-api-key':apiKey,'anthropic-version':'2023-06-01'},
      body: JSON.stringify({model:'claude-sonnet-4-20250514', max_tokens: maxTokens, system: systemPrompt, messages:[{role:'user',content:userPrompt}]})
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error.message);
    return data.content.map(b => b.text || '').join('');
  };

  // ─── SMART AI / ROADMAP / SCORE (main Ask AI) ────────────────────────────
  const askAI = async () => {
    if (!question.trim()) { Alert.alert('Please explain your legal problem.'); return; }
    if (!apiKey.trim()) { setShowApiInput(true); Alert.alert('Please enter your Anthropic API key first.'); return; }
    setLoading(true); setAnswer(null);

    const sys = isPro
      ? `You are LAPOLU, an expert Indian Legal AI Advisor.\nUPDATED LAWS (1 July 2024): IPC replaced by BNS, CrPC by BNSS, Evidence Act by BSA.\nFor incidents after 1 July 2024 cite BNS/BNSS/BSA. Before cite IPC/CrPC.\nOther laws: Constitution, Consumer Protection Act 2019, RTI Act 2005, IT Act 2000, Hindu Marriage Act, DPDPA 2023.\n\nYou MUST respond in this EXACT JSON format (no markdown, pure JSON):\n{\n  "answer": "Clear direct legal explanation here",\n  "followup": "One important follow-up question to understand the situation better",\n  "roadmap": ["Step 1: ...", "Step 2: ...", "Step 3: ...", "Step 4: ..."],\n  "score": 7,\n  "scoreLabel": "High Risk",\n  "lawyerNeeded": "YES",\n  "lawyerReason": "Why lawyer is or is not needed"\n}\nScore is 1-10 (10 = most risky). Language: ${lang}. Topic: ${topic}`
      : `You are LAPOLU, a helpful Indian legal AI assistant.\nUPDATED LAWS (1 July 2024): IPC replaced by BNS, CrPC by BNSS, Evidence Act by BSA.\nFor incidents after 1 July 2024 cite BNS/BNSS/BSA. Before that cite IPC/CrPC.\nOther laws: Constitution, Consumer Protection Act 2019, RTI Act 2005, IT Act 2000, Hindu Marriage Act, DPDPA 2023.\nFormat: 1) Direct answer 2) Relevant law and sections 3) Practical next steps 4) Recommend Bar Council advocate if needed.\nLanguage: ${lang}. Topic: ${topic}`;

    try {
      const raw = await callAI(sys, question);
      if (isPro) {
        try {
          const parsed = JSON.parse(raw);
          setAnswer({ type: 'pro', ...parsed });
          // Auto-save to dashboard
          setSavedCases(prev => [{
            id: Date.now(),
            question: question.slice(0, 60) + (question.length > 60 ? '...' : ''),
            topic,
            score: parsed.score,
            scoreLabel: parsed.scoreLabel,
            date: new Date().toLocaleDateString('en-IN'),
          }, ...prev].slice(0, 10));
        } catch {
          setAnswer({ type: 'basic', text: raw });
        }
      } else {
        setAnswer({ type: 'basic', text: raw });
      }
    } catch(e) {
      setAnswer({ type: 'error', text: 'Error: ' + (e.message || 'Check your API key and try again.') });
    }
    setLoading(false);
  };

  // ─── RISK DETECTOR ───────────────────────────────────────────────────────
  const runRiskDetector = async () => {
    if (!requireProAndKey()) return;
    if (!riskText.trim()) { Alert.alert('Please paste your agreement text.'); return; }
    setRiskLoading(true); setRiskResult(null);
    try {
      const sys = `You are a senior Indian legal expert. Analyze the given agreement/contract and identify risks. Respond ONLY in this JSON format:\n{\n  "risks": ["Risk 1 description", "Risk 2 description"],\n  "missing": ["Missing clause 1", "Missing clause 2"],\n  "score": 6,\n  "verdict": "Moderate Risk - Review before signing",\n  "suggestion": "Key overall recommendation"\n}`;
      const raw = await callAI(sys, `Analyze this agreement:\n\n${riskText}`);
      const parsed = JSON.parse(raw.replace(/```json|```/g,'').trim());
      setRiskResult(parsed);
    } catch(e) {
      Alert.alert('Error: ' + (e.message || 'Try again.'));
    }
    setRiskLoading(false);
  };

  // ─── DOCUMENT ENGINE ─────────────────────────────────────────────────────
  const generateDoc = async () => {
    if (!requireProAndKey()) return;
    if (!docForm.party1 || !docForm.party2) { Alert.alert('Please fill Party 1 and Party 2 names.'); return; }
    setDocLoading(true); setDocResult('');
    try {
      const sys = `You are a legal document drafting expert for India. Generate a complete formal ${docType} in plain text. Include all standard clauses as per Indian law. Output only the document text.`;
      const prompt = `Generate a ${docType} with these details:\nParty 1: ${docForm.party1}\nParty 2: ${docForm.party2}\nDate: ${docForm.date || new Date().toLocaleDateString('en-IN')}\nAdditional Details: ${docForm.details || 'Standard terms apply'}`;
      const raw = await callAI(sys, prompt, 2000);
      setDocResult(raw);
    } catch(e) {
      Alert.alert('Error: ' + (e.message || 'Try again.'));
    }
    setDocLoading(false);
  };

  // ─── LAWYER ADVICE ───────────────────────────────────────────────────────
  const askLawyerAdvice = async () => {
    if (!requireProAndKey()) return;
    if (!lawyerQ.trim()) { Alert.alert('Please describe your situation.'); return; }
    setLawyerLoading(true); setLawyerResult(null);
    try {
      const sys = `You are a senior Indian legal advisor. Assess whether the user needs a professional lawyer. Respond ONLY in JSON:\n{\n  "needed": "YES" or "NO" or "MAYBE",\n  "urgency": "Immediate" or "Within a week" or "Not urgent",\n  "reason": "Detailed explanation",\n  "alternatives": ["Alternative 1 if no lawyer needed", "Alternative 2"],\n  "lawyerType": "What type of lawyer to hire (criminal, civil, family, etc.)"\n}`;
      const raw = await callAI(sys, lawyerQ);
      const parsed = JSON.parse(raw.replace(/```json|```/g,'').trim());
      setLawyerResult(parsed);
    } catch(e) {
      Alert.alert('Error: ' + (e.message || 'Try again.'));
    }
    setLawyerLoading(false);
  };

  // ─── GENERATE RTI ────────────────────────────────────────────────────────
  const generateRTI = async () => {
    const {name,mobile,address,state,dept,info} = rtiForm;
    if (!name||!mobile||!address||!state||!dept||!info) { Alert.alert('Please fill all required fields.'); return; }
    if (!apiKey.trim()) { setShowApiInput(true); Alert.alert('Please enter your API key first.'); return; }
    setRtiLoading(true);
    const today = new Date();
    const dateStr = today.getDate()+'/'+(today.getMonth()+1)+'/'+today.getFullYear();
    const prompt = `Write a formal RTI application under Right to Information Act 2005.\nApplicant: ${name}\nMobile: ${mobile}\nAddress: ${address}\nState: ${state}\nDepartment: ${dept}\nInformation needed: ${info}${rtiForm.purpose?'\nPurpose: '+rtiForm.purpose:''}\nDate: ${dateStr}\nWrite complete formal RTI letter. Output only the letter.`;
    try {
      const raw = await callAI('You are an expert in RTI applications for India.', prompt, 1500);
      setRtiLetter(raw);
      setRtiStep(3);
    } catch(e) { Alert.alert('Error: '+(e.message||'Try again.')); }
    setRtiLoading(false);
  };

  // ─── HELPERS ─────────────────────────────────────────────────────────────
  const getRiskColor = (score) => {
    if (score <= 3) return COLORS.green;
    if (score <= 6) return COLORS.orange;
    return COLORS.red;
  };
  const getRiskBg = (score) => {
    if (score <= 3) return COLORS.greenBg;
    if (score <= 6) return COLORS.orangeBg;
    return COLORS.redBg;
  };

  // ─── HANDLE PRO FEATURE TAP ──────────────────────────────────────────────
  const handleProFeatureTap = (action) => {
    if (!isPro) { setShowProModal(true); return; }
    switch(action) {
      case 'smartAI':
      case 'roadmap':
      case 'safetyScore':
        setActiveTab('ai');
        Alert.alert('PRO Active ✅', 'Ask your question on the AI tab. You will get Roadmap + Risk Score + Smart Advisor.');
        break;
      case 'riskDetector':
        setProScreen('riskDetector');
        break;
      case 'docEngine':
        setProScreen('docEngine');
        break;
      case 'reminders':
        setProScreen('reminders');
        break;
      case 'dashboard':
        setProScreen('dashboard');
        break;
      case 'docLibrary':
        setProScreen('docLibrary');
        break;
      case 'lawyerAdvice':
        setProScreen('lawyerAdvice');
        break;
      case 'priorityAI':
        Alert.alert('🚀 Priority AI Active', 'You are already using Priority AI Access. Your queries are processed with the best model (claude-sonnet-4).');
        break;
    }
  };

  // ─── WELCOME SCREEN ──────────────────────────────────────────────────────
  if (showWelcome) {
    return (
      <SafeAreaView style={s.safe}>
        <Animated.View style={[s.welcomeScreen, {opacity: fadeAnim}]}>
          <View style={s.welcomeLogo}><Text style={s.welcomeLogoText}>L</Text></View>
          <Text style={s.welcomeTitle}>LAPOLU</Text>
          <Text style={s.welcomeSub}>Your Legal Assistant</Text>
          <ActivityIndicator color={COLORS.gold} style={{marginTop: 40}} size="large"/>
        </Animated.View>
      </SafeAreaView>
    );
  }

  // ─── PRO FEATURE SCREENS ──────────────────────────────────────────────────
  const renderProScreen = () => {
    // ── RISK DETECTOR ──
    if (proScreen === 'riskDetector') {
      return (
        <ScrollView style={s.scroll}>
          <View style={s.section}>
            <TouchableOpacity onPress={() => setProScreen(null)} style={s.backBtn}>
              <Text style={s.backBtnText}>← Back</Text>
            </TouchableOpacity>
            <Text style={s.proScreenTitle}>⚠️ Risk Detector</Text>
            <Text style={s.proScreenSub}>Paste any agreement or contract. AI will find risks and missing clauses.</Text>
            <TextInput
              style={[s.rtiInput, {height: 160, marginBottom: 12}]}
              value={riskText}
              onChangeText={setRiskText}
              placeholder="Paste your agreement text here..."
              placeholderTextColor={COLORS.ink3}
              multiline
            />
            <TouchableOpacity style={s.rtiGenBtn} onPress={runRiskDetector} disabled={riskLoading}>
              {riskLoading ? <ActivityIndicator color="#fff"/> : <Text style={s.rtiGenBtnText}>Analyse Agreement</Text>}
            </TouchableOpacity>

            {riskResult && (
              <View style={{marginTop: 16}}>
                {/* Verdict */}
                <View style={[s.scoreBox, {backgroundColor: getRiskBg(riskResult.score), marginBottom: 12}]}>
                  <View style={s.scoreRow}>
                    <Text style={s.scoreTitle}>📊 Risk Score</Text>
                    <View style={[s.scoreBadge, {backgroundColor: getRiskColor(riskResult.score)}]}>
                      <Text style={s.scoreBadgeText}>{riskResult.score}/10</Text>
                    </View>
                  </View>
                  <Text style={[s.scoreLabel, {color: getRiskColor(riskResult.score)}]}>{riskResult.verdict}</Text>
                  <View style={s.scoreBar}>
                    <View style={[s.scoreBarFill, {width:`${riskResult.score*10}%`, backgroundColor: getRiskColor(riskResult.score)}]}/>
                  </View>
                </View>

                {/* Risks found */}
                <View style={[s.answerBox, {marginBottom: 12}]}>
                  <Text style={[s.answerTitle, {color: COLORS.red, marginBottom: 10}]}>🔴 Risks Found</Text>
                  {riskResult.risks.map((r, i) => (
                    <View key={i} style={{flexDirection:'row', marginBottom: 8, gap: 8}}>
                      <Text style={{color: COLORS.red, fontWeight:'700'}}>•</Text>
                      <Text style={{flex:1, fontSize:13, color: COLORS.ink2, lineHeight:20}}>{r}</Text>
                    </View>
                  ))}
                </View>

                {/* Missing clauses */}
                <View style={[s.answerBox, {marginBottom: 12}]}>
                  <Text style={[s.answerTitle, {color: COLORS.orange, marginBottom: 10}]}>⚠️ Missing Clauses</Text>
                  {riskResult.missing.map((m, i) => (
                    <View key={i} style={{flexDirection:'row', marginBottom: 8, gap: 8}}>
                      <Text style={{color: COLORS.orange, fontWeight:'700'}}>•</Text>
                      <Text style={{flex:1, fontSize:13, color: COLORS.ink2, lineHeight:20}}>{m}</Text>
                    </View>
                  ))}
                </View>

                {/* Suggestion */}
                <View style={[s.answerBox, {backgroundColor: COLORS.greenBg, borderColor: COLORS.green}]}>
                  <Text style={[s.answerTitle, {color: COLORS.green, marginBottom: 6}]}>✅ Recommendation</Text>
                  <Text style={{fontSize:13, color: COLORS.ink2, lineHeight:20}}>{riskResult.suggestion}</Text>
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      );
    }

    // ── DOCUMENT ENGINE ──
    if (proScreen === 'docEngine') {
      const docTypes = ['Rent Agreement','Employment Contract','Partnership Deed','Legal Notice','NDA Agreement','Loan Agreement'];
      return (
        <ScrollView style={s.scroll}>
          <View style={s.section}>
            <TouchableOpacity onPress={() => { setProScreen(null); setDocResult(''); }} style={s.backBtn}>
              <Text style={s.backBtnText}>← Back</Text>
            </TouchableOpacity>
            <Text style={s.proScreenTitle}>📄 Document Engine</Text>
            <Text style={s.proScreenSub}>Generate professional legal documents instantly.</Text>

            <Text style={s.sectionLabel}>Document Type</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.chipRow}>
              {docTypes.map(d => (
                <TouchableOpacity key={d} style={[s.chip, docType===d && s.chipActive]} onPress={() => setDocType(d)}>
                  <Text style={[s.chipText, docType===d && s.chipTextActive]}>{d}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {[
              {key:'party1', label:'Party 1 / Your Name', placeholder:'Full name'},
              {key:'party2', label:'Party 2 / Other Party Name', placeholder:'Full name'},
              {key:'date', label:'Agreement Date', placeholder:'e.g. 01/04/2025'},
              {key:'details', label:'Key Details (optional)', placeholder:'e.g. Rent Rs.15000/month, 2BHK flat...'},
            ].map(f => (
              <View key={f.key} style={s.rtiField}>
                <Text style={s.rtiLabel}>{f.label}</Text>
                <TextInput style={[s.rtiInput, f.key==='details'&&{height:80}]} value={docForm[f.key]} onChangeText={v=>setDocForm({...docForm,[f.key]:v})} placeholder={f.placeholder} placeholderTextColor={COLORS.ink3} multiline={f.key==='details'}/>
              </View>
            ))}

            <TouchableOpacity style={s.rtiGenBtn} onPress={generateDoc} disabled={docLoading}>
              {docLoading ? <ActivityIndicator color="#fff"/> : <Text style={s.rtiGenBtnText}>Generate Document</Text>}
            </TouchableOpacity>

            {docResult ? (
              <View style={{marginTop:16}}>
                <Text style={s.rtiReady}>✓ Document Ready!</Text>
                <ScrollView style={s.rtiDraft} nestedScrollEnabled>
                  <Text style={s.rtiDraftText}>{docResult}</Text>
                </ScrollView>
                <TouchableOpacity style={s.rtiEditBtn} onPress={() => setDocResult('')}>
                  <Text style={s.rtiEditBtnText}>Generate New</Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
        </ScrollView>
      );
    }

    // ── REMINDERS ──
    if (proScreen === 'reminders') {
      return (
        <ScrollView style={s.scroll}>
          <View style={s.section}>
            <TouchableOpacity onPress={() => setProScreen(null)} style={s.backBtn}>
              <Text style={s.backBtnText}>← Back</Text>
            </TouchableOpacity>
            <Text style={s.proScreenTitle}>🔔 Legal Reminders</Text>
            <Text style={s.proScreenSub}>Set reminders for court dates, rent, agreements and deadlines.</Text>

            {/* Add new reminder */}
            <View style={[s.answerBox, {marginBottom: 16}]}>
              <Text style={[s.sectionLabel, {marginTop: 0}]}>Add New Reminder</Text>
              <TextInput style={[s.rtiInput, {marginBottom:8}]} value={newRemTitle} onChangeText={setNewRemTitle} placeholder="e.g. Court hearing - Session Court" placeholderTextColor={COLORS.ink3}/>
              <TextInput style={[s.rtiInput, {marginBottom:10}]} value={newRemDate} onChangeText={setNewRemDate} placeholder="Date e.g. 15 May 2025" placeholderTextColor={COLORS.ink3}/>
              <TouchableOpacity style={s.rtiGenBtn} onPress={() => {
                if (!newRemTitle || !newRemDate) { Alert.alert('Fill title and date.'); return; }
                setReminders(prev => [{id:Date.now(), title:newRemTitle, date:newRemDate, done:false}, ...prev]);
                setNewRemTitle(''); setNewRemDate('');
              }}>
                <Text style={s.rtiGenBtnText}>Add Reminder</Text>
              </TouchableOpacity>
            </View>

            {reminders.map(rem => (
              <View key={rem.id} style={[s.quickCard, rem.done && {opacity:0.5}]}>
                <View style={{flex:1}}>
                  <Text style={[s.quickText, {fontWeight:'600', color: COLORS.ink}]}>{rem.title}</Text>
                  <Text style={{fontSize:12, color: COLORS.ink3, marginTop:2}}>📅 {rem.date}</Text>
                </View>
                <TouchableOpacity onPress={() => setReminders(prev => prev.map(r => r.id===rem.id ? {...r, done:!r.done} : r))} style={{marginRight:10}}>
                  <Text style={{fontSize:20}}>{rem.done ? '✅' : '⬜'}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setReminders(prev => prev.filter(r => r.id !== rem.id))}>
                  <Text style={{fontSize:18, color: COLORS.red}}>🗑️</Text>
                </TouchableOpacity>
              </View>
            ))}
            {reminders.length === 0 && <Text style={{color: COLORS.ink3, textAlign:'center', marginTop:20}}>No reminders yet. Add one above.</Text>}
          </View>
        </ScrollView>
      );
    }

    // ── DASHBOARD ──
    if (proScreen === 'dashboard') {
      return (
        <ScrollView style={s.scroll}>
          <View style={s.section}>
            <TouchableOpacity onPress={() => setProScreen(null)} style={s.backBtn}>
              <Text style={s.backBtnText}>← Back</Text>
            </TouchableOpacity>
            <Text style={s.proScreenTitle}>📁 Personal Legal Dashboard</Text>
            <Text style={s.proScreenSub}>All your cases and queries are saved here automatically.</Text>

            {savedCases.length === 0 ? (
              <View style={[s.answerBox, {alignItems:'center', paddingVertical:30}]}>
                <Text style={{fontSize:40, marginBottom:12}}>📂</Text>
                <Text style={{fontSize:14, color: COLORS.ink2, textAlign:'center'}}>No cases yet.</Text>
                <Text style={{fontSize:12, color: COLORS.ink3, textAlign:'center', marginTop:6}}>Ask a question on the AI tab and it will appear here.</Text>
                <TouchableOpacity style={[s.rtiGenBtn, {marginTop:16, paddingHorizontal:20}]} onPress={() => setActiveTab('ai')}>
                  <Text style={s.rtiGenBtnText}>Go to Ask AI</Text>
                </TouchableOpacity>
              </View>
            ) : savedCases.map(c => (
              <View key={c.id} style={[s.quickCard, {flexDirection:'column', alignItems:'flex-start'}]}>
                <Text style={{fontSize:13, fontWeight:'700', color: COLORS.ink, marginBottom:4}}>{c.question}</Text>
                <View style={{flexDirection:'row', gap:8, flexWrap:'wrap', marginTop:4}}>
                  <View style={s.tag}><Text style={s.tagText}>{c.topic.split(' ')[0]}</Text></View>
                  {c.score && <View style={[s.tag, {backgroundColor: getRiskBg(c.score), borderColor: getRiskColor(c.score)}]}>
                    <Text style={[s.tagText, {color: getRiskColor(c.score)}]}>Risk: {c.score}/10</Text>
                  </View>}
                  <View style={s.tag}><Text style={s.tagText}>📅 {c.date}</Text></View>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      );
    }

    // ── DOCUMENT LIBRARY ──
    if (proScreen === 'docLibrary') {
      return (
        <ScrollView style={s.scroll}>
          <View style={s.section}>
            <TouchableOpacity onPress={() => setProScreen(null)} style={s.backBtn}>
              <Text style={s.backBtnText}>← Back</Text>
            </TouchableOpacity>
            <Text style={s.proScreenTitle}>📚 Document Library</Text>
            <Text style={s.proScreenSub}>Tap any template to generate it using the Document Engine.</Text>

            {DOC_LIBRARY.map((d, i) => (
              <TouchableOpacity key={i} style={s.quickCard} onPress={() => { setDocType(d.title); setProScreen('docEngine'); }}>
                <Text style={{fontSize:24, marginRight:12}}>{d.icon}</Text>
                <View style={{flex:1}}>
                  <Text style={{fontSize:13, fontWeight:'700', color: COLORS.ink}}>{d.title}</Text>
                  <Text style={{fontSize:11, color: COLORS.ink3, marginTop:2}}>{d.desc}</Text>
                </View>
                <Text style={s.quickArrow}>→</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      );
    }

    // ── LAWYER ADVICE ──
    if (proScreen === 'lawyerAdvice') {
      return (
        <ScrollView style={s.scroll}>
          <View style={s.section}>
            <TouchableOpacity onPress={() => { setProScreen(null); setLawyerResult(null); }} style={s.backBtn}>
              <Text style={s.backBtnText}>← Back</Text>
            </TouchableOpacity>
            <Text style={s.proScreenTitle}>⚖️ When to Call a Lawyer</Text>
            <Text style={s.proScreenSub}>Describe your situation. AI tells you if you need a lawyer and what type.</Text>

            <TextInput
              style={[s.rtiInput, {height:120, marginBottom:12}]}
              value={lawyerQ}
              onChangeText={setLawyerQ}
              placeholder="Describe your legal situation in detail..."
              placeholderTextColor={COLORS.ink3}
              multiline
            />
            <TouchableOpacity style={s.rtiGenBtn} onPress={askLawyerAdvice} disabled={lawyerLoading}>
              {lawyerLoading ? <ActivityIndicator color="#fff"/> : <Text style={s.rtiGenBtnText}>Get Advice</Text>}
            </TouchableOpacity>

            {lawyerResult && (
              <View style={{marginTop:16}}>
                {/* Verdict */}
                <View style={[s.lawyerBox, {
                  backgroundColor: lawyerResult.needed==='YES' ? COLORS.redBg : lawyerResult.needed==='MAYBE' ? COLORS.orangeBg : COLORS.greenBg,
                  marginBottom:12
                }]}>
                  <Text style={s.lawyerBoxTitle}>
                    {lawyerResult.needed==='YES' ? '🔴 Lawyer Needed' : lawyerResult.needed==='MAYBE' ? '🟡 Possibly Needed' : '🟢 May Not Need a Lawyer'}
                  </Text>
                  <Text style={[s.lawyerBoxText, {marginBottom:8}]}>{lawyerResult.reason}</Text>
                  <View style={s.tag}><Text style={s.tagText}>⏰ Urgency: {lawyerResult.urgency}</Text></View>
                  {lawyerResult.lawyerType ? <Text style={[s.lawyerBoxText, {marginTop:8, fontWeight:'600'}]}>Type: {lawyerResult.lawyerType}</Text> : null}
                </View>

                {/* Alternatives */}
                {lawyerResult.alternatives && lawyerResult.alternatives.length > 0 && (
                  <View style={s.answerBox}>
                    <Text style={[s.answerTitle, {marginBottom:10}]}>💡 Alternatives</Text>
                    {lawyerResult.alternatives.map((a, i) => (
                      <View key={i} style={{flexDirection:'row', marginBottom:8, gap:8}}>
                        <Text style={{color: COLORS.primary, fontWeight:'700'}}>•</Text>
                        <Text style={{flex:1, fontSize:13, color: COLORS.ink2, lineHeight:20}}>{a}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            )}
          </View>
        </ScrollView>
      );
    }

    return null;
  };

  // ─── MAIN APP ────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={s.safe}>

      {/* HEADER */}
      <View style={s.header}>
        <View style={s.logoBox}><Text style={s.logoText}>L</Text></View>
        <View style={{flex:1}}>
          <Text style={s.appName}>LAPOLU</Text>
          <Text style={s.appSub}>Your Legal Assistant</Text>
        </View>
        {isPro
          ? <View style={s.proBadge}><Text style={s.proBadgeText}>⭐ PRO</Text></View>
          : <TouchableOpacity style={s.proBtn} onPress={() => setShowProModal(true)}>
              <Text style={s.proBtnText}>Go PRO ₹299</Text>
            </TouchableOpacity>
        }
        <TouchableOpacity style={s.keyBtn} onPress={() => setShowApiInput(!showApiInput)}>
          <Text style={s.keyBtnText}>🔑</Text>
        </TouchableOpacity>
      </View>

      {/* API KEY INPUT */}
      {showApiInput && (
        <View style={s.apiBox}>
          <Text style={s.apiLabel}>Enter Anthropic API Key</Text>
          <TextInput style={s.apiInput} value={apiKey} onChangeText={setApiKey} placeholder="sk-ant-api03-..." secureTextEntry placeholderTextColor={COLORS.ink3}/>
          <TouchableOpacity style={s.apiSave} onPress={() => setShowApiInput(false)}>
            <Text style={s.apiSaveText}>Save Key</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* TABS */}
      <View style={s.tabs}>
        {[{id:'ai',label:'⚖️ Ask AI'},{id:'rti',label:'📋 File RTI'},{id:'pro',label:'⭐ PRO'}].map(tab => (
          <TouchableOpacity key={tab.id} style={[s.tab, activeTab===tab.id && s.tabActive]} onPress={() => { setActiveTab(tab.id); setProScreen(null); }}>
            <Text style={[s.tabText, activeTab===tab.id && s.tabTextActive]}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS==='ios'?'padding':undefined}>

        {/* ── PRO FEATURE SUB-SCREENS ── */}
        {activeTab === 'pro' && proScreen ? renderProScreen() : (

          <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>

            {/* ── ASK AI TAB ── */}
            {activeTab === 'ai' && (
              <View style={s.section}>

                {!isPro && (
                  <TouchableOpacity style={s.proBanner} onPress={() => setShowProModal(true)}>
                    <Text style={s.proBannerText}>⭐ Upgrade to PRO for Smart AI + Legal Roadmap + Risk Score</Text>
                    <Text style={s.proBannerBtn}>₹299/mo →</Text>
                  </TouchableOpacity>
                )}

                <Text style={s.sectionLabel}>Legal Area</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.chipRow}>
                  {TOPICS.map(t => (
                    <TouchableOpacity key={t.value} style={[s.chip, topic===t.value && s.chipActive]} onPress={() => setTopic(t.value)}>
                      <Text style={[s.chipText, topic===t.value && s.chipTextActive]}>{t.label}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                <Text style={s.sectionLabel}>Language</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.chipRow}>
                  {LANGUAGES.map(l => (
                    <TouchableOpacity key={l} style={[s.chip, lang===l && s.chipActive]} onPress={() => setLang(l)}>
                      <Text style={[s.chipText, lang===l && s.chipTextActive]}>{l}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                <View style={s.inputBox}>
                  <TextInput
                    style={s.textArea}
                    value={question}
                    onChangeText={setQuestion}
                    placeholder="Explain your legal problem..."
                    placeholderTextColor={COLORS.ink3}
                    multiline
                    numberOfLines={4}
                  />
                  <TouchableOpacity style={s.askBtn} onPress={askAI} disabled={loading}>
                    {loading ? <ActivityIndicator color={COLORS.white}/> : <Text style={s.askBtnText}>Ask LAPOLU{isPro ? ' (PRO)' : ''}</Text>}
                  </TouchableOpacity>
                </View>

                {/* BASIC ANSWER */}
                {answer && answer.type === 'basic' && (
                  <View style={s.answerBox}>
                    <Text style={s.answerTitle}>⚖️ LAPOLU Legal Analysis</Text>
                    <Text style={s.answerSub}>Based on Indian Law (BNS/BNSS/BSA)</Text>
                    <Text style={s.answerText}>{answer.text}</Text>
                    <View style={s.tagRow}>
                      {['BNS/IPC','BNSS/CrPC','Constitution','BSA 2023'].map(t => (
                        <View key={t} style={s.tag}><Text style={s.tagText}>{t}</Text></View>
                      ))}
                    </View>
                    <Text style={s.disclaimer}>General legal information only. Not legal advice. Consult a Bar Council advocate.</Text>
                    <TouchableOpacity style={s.upgradeHint} onPress={() => setShowProModal(true)}>
                      <Text style={s.upgradeHintText}>⭐ Upgrade to PRO for Legal Roadmap + Risk Score + Smart Advisor</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {/* PRO ANSWER */}
                {answer && answer.type === 'pro' && (
                  <View>
                    <View style={s.answerBox}>
                      <Text style={s.answerTitle}>⚖️ LAPOLU Legal Analysis</Text>
                      <Text style={s.answerSub}>Based on Indian Law (BNS/BNSS/BSA) · PRO</Text>
                      <Text style={s.answerText}>{answer.answer}</Text>
                      <View style={s.tagRow}>
                        {['BNS/IPC','BNSS/CrPC','Constitution','BSA 2023'].map(t => (
                          <View key={t} style={s.tag}><Text style={s.tagText}>{t}</Text></View>
                        ))}
                      </View>
                      <Text style={s.disclaimer}>General legal information only. Not legal advice.</Text>
                    </View>

                    {answer.followup && (
                      <View style={s.followupBox}>
                        <Text style={s.followupLabel}>🤖 LAPOLU asks:</Text>
                        <Text style={s.followupText}>{answer.followup}</Text>
                        <TextInput
                          style={s.followupInput}
                          placeholder="Your answer..."
                          placeholderTextColor={COLORS.ink3}
                          onChangeText={v => setQuestion(question + '\n' + v)}
                          multiline
                        />
                      </View>
                    )}

                    {answer.score && (
                      <View style={[s.scoreBox, {backgroundColor: getRiskBg(answer.score)}]}>
                        <View style={s.scoreRow}>
                          <Text style={s.scoreTitle}>📊 Legal Safety Score</Text>
                          <View style={[s.scoreBadge, {backgroundColor: getRiskColor(answer.score)}]}>
                            <Text style={s.scoreBadgeText}>{answer.score}/10</Text>
                          </View>
                        </View>
                        <Text style={[s.scoreLabel, {color: getRiskColor(answer.score)}]}>{answer.scoreLabel}</Text>
                        <View style={s.scoreBar}>
                          <View style={[s.scoreBarFill, {width:`${answer.score*10}%`, backgroundColor: getRiskColor(answer.score)}]}/>
                        </View>
                      </View>
                    )}

                    {answer.roadmap && answer.roadmap.length > 0 && (
                      <View style={s.roadmapBox}>
                        <Text style={s.roadmapTitle}>🗺️ Your Legal Roadmap</Text>
                        {answer.roadmap.map((step, i) => (
                          <View key={i} style={s.roadmapStep}>
                            <View style={s.roadmapDot}><Text style={s.roadmapDotText}>{i+1}</Text></View>
                            <Text style={s.roadmapStepText}>{step.replace(/^Step \d+:?\s*/i,'')}</Text>
                          </View>
                        ))}
                      </View>
                    )}

                    {answer.lawyerNeeded && (
                      <View style={[s.lawyerBox, {backgroundColor: answer.lawyerNeeded==='YES' ? COLORS.redBg : COLORS.greenBg}]}>
                        <Text style={s.lawyerBoxTitle}>
                          {answer.lawyerNeeded === 'YES' ? '🔴 Lawyer Recommended' : '🟢 You May Handle This'}
                        </Text>
                        <Text style={s.lawyerBoxText}>{answer.lawyerReason}</Text>
                      </View>
                    )}
                  </View>
                )}

                {answer && answer.type === 'error' && (
                  <View style={[s.answerBox, {borderColor: COLORS.red, backgroundColor: COLORS.redBg}]}>
                    <Text style={{color: COLORS.red, fontSize:13}}>{answer.text}</Text>
                  </View>
                )}

                {/* QUICK QUERIES */}
                <Text style={s.sectionLabel}>Quick Queries</Text>
                {[
                  'What are my rights if arrested in India under BNSS?',
                  'How to file FIR or e-FIR in India?',
                  'What are tenant rights in India?',
                  'Consumer rights for defective product?',
                  'How to file RTI application?'
                ].map(q => (
                  <TouchableOpacity key={q} style={s.quickCard} onPress={() => setQuestion(q)}>
                    <Text style={s.quickText}>{q}</Text>
                    <Text style={s.quickArrow}>→</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* ── RTI TAB ── */}
            {activeTab === 'rti' && (
              <View style={s.section}>
                <Text style={s.rtiTitle}>File RTI Application</Text>
                <Text style={s.rtiSub}>Fill your details. LAPOLU AI generates a complete RTI letter.</Text>
                {rtiStep === 1 && (
                  <View>
                    {[
                      {key:'name',label:'Full Name',placeholder:'Your full name'},
                      {key:'mobile',label:'Mobile Number',placeholder:'10-digit number',keyboardType:'phone-pad'},
                      {key:'address',label:'Your Address',placeholder:'Full address with PIN code'},
                      {key:'state',label:'State',placeholder:'e.g. Karnataka'},
                      {key:'dept',label:'Department / Authority',placeholder:'e.g. Municipal Corporation'},
                      {key:'info',label:'What information do you want?',placeholder:'Describe clearly...',multiline:true},
                      {key:'purpose',label:'Purpose (optional)',placeholder:'e.g. To verify my application status'},
                    ].map(field => (
                      <View key={field.key} style={s.rtiField}>
                        <Text style={s.rtiLabel}>{field.label}</Text>
                        <TextInput style={[s.rtiInput,field.multiline&&{height:80}]} value={rtiForm[field.key]} onChangeText={v=>setRtiForm({...rtiForm,[field.key]:v})} placeholder={field.placeholder} placeholderTextColor={COLORS.ink3} keyboardType={field.keyboardType||'default'} multiline={field.multiline}/>
                      </View>
                    ))}
                    <TouchableOpacity style={s.rtiGenBtn} onPress={generateRTI} disabled={rtiLoading}>
                      {rtiLoading?<ActivityIndicator color={COLORS.white}/>:<Text style={s.rtiGenBtnText}>Generate RTI Application</Text>}
                    </TouchableOpacity>
                  </View>
                )}
                {rtiStep === 3 && (
                  <View>
                    <Text style={s.rtiReady}>✓ RTI Application Ready!</Text>
                    <ScrollView style={s.rtiDraft} nestedScrollEnabled>
                      <Text style={s.rtiDraftText}>{rtiLetter}</Text>
                    </ScrollView>
                    <TouchableOpacity style={s.rtiPortalBtn} onPress={() => Linking.openURL('https://rtionline.gov.in')}>
                      <Text style={s.rtiPortalBtnText}>Submit on rtionline.gov.in</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={s.rtiEditBtn} onPress={() => setRtiStep(1)}>
                      <Text style={s.rtiEditBtnText}>Edit Details</Text>
                    </TouchableOpacity>
                    <Text style={s.rtiTip}>Tip: Open the portal, create a free account, select your department and paste this letter.</Text>
                  </View>
                )}
              </View>
            )}

            {/* ── PRO TAB ── */}
            {activeTab === 'pro' && (
              <View style={s.section}>
                <View style={s.proHero}>
                  <Text style={s.proHeroTitle}>⭐ LAPOLU PRO</Text>
                  <Text style={s.proHeroPrice}>₹299 / month</Text>
                  <Text style={s.proHeroSub}>India's Smartest Legal AI Assistant</Text>
                  {!isPro && (
                    <TouchableOpacity style={s.proHeroBtn} onPress={() => setShowProModal(true)}>
                      <Text style={s.proHeroBtnText}>Upgrade to PRO →</Text>
                    </TouchableOpacity>
                  )}
                  {isPro && (
                    <View style={s.proActiveBox}>
                      <Text style={s.proActiveText}>✅ You are on LAPOLU PRO!</Text>
                    </View>
                  )}
                </View>

                {/* PRO FEATURE CARDS — now all tappable */}
                <Text style={s.sectionLabel}>Your PRO Features</Text>
                {PRO_FEATURES.map((f, i) => (
                  <TouchableOpacity
                    key={i}
                    style={[s.proFeatureCard, isPro && {borderColor: COLORS.primary, borderWidth: 1.5}]}
                    onPress={() => handleProFeatureTap(f.action)}
                    activeOpacity={0.7}
                  >
                    <Text style={s.proFeatureIcon}>{f.icon}</Text>
                    <View style={{flex:1}}>
                      <Text style={s.proFeatureTitle}>{f.title}</Text>
                      <Text style={s.proFeatureDesc}>{f.desc}</Text>
                    </View>
                    <Text style={isPro ? {color: COLORS.primary, fontSize:18, fontWeight:'700'} : {color: COLORS.ink3, fontSize:14}}>
                      {isPro ? '→' : '🔒'}
                    </Text>
                  </TouchableOpacity>
                ))}

                {/* Compare table */}
                <View style={s.proCompare}>
                  <Text style={s.proCompareTitle}>Free vs PRO</Text>
                  {[
                    ['Basic AI answers', '✅', '✅'],
                    ['Smart follow-up questions', '❌', '✅'],
                    ['Legal Roadmap', '❌', '✅'],
                    ['Legal Safety Score', '❌', '✅'],
                    ['Risk Detector', '❌', '✅'],
                    ['Document Engine', '❌', '✅'],
                    ['Legal Reminders', '❌', '✅'],
                    ['Priority AI Access', '❌', '✅'],
                  ].map(([feat, free, pro], i) => (
                    <View key={i} style={[s.compareRow, i%2===0 && {backgroundColor:'#F8F4FF'}]}>
                      <Text style={s.compareFeature}>{feat}</Text>
                      <Text style={s.compareVal}>{free}</Text>
                      <Text style={s.compareVal}>{pro}</Text>
                    </View>
                  ))}
                  <View style={s.compareHeader}>
                    <Text style={[s.compareFeature,{fontWeight:'700'}]}>Feature</Text>
                    <Text style={[s.compareVal,{fontWeight:'700'}]}>Free</Text>
                    <Text style={[s.compareVal,{fontWeight:'700',color:COLORS.primary}]}>PRO</Text>
                  </View>
                </View>
              </View>
            )}

            {/* FOOTER */}
            <View style={s.footer}>
              <Text style={s.footerText}>LAPOLU Indian Legal AI</Text>
              <Text style={s.footerSub}>General information only. Not legal advice.</Text>
              <Text style={s.footerContact}>help@lapolu.com</Text>
              <View style={s.footerBtns}>
                {['privacy','terms','disclaimer','refund','advocate'].map(key => (
                  <TouchableOpacity key={key} style={s.footerBtn} onPress={() => setLegalModal(key)}>
                    <Text style={s.footerBtnText}>{LEGAL_DATA[key].title}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

          </ScrollView>
        )}
      </KeyboardAvoidingView>

      {/* LEGAL MODALS — fixed: using proper <Modal> */}
      <Modal visible={!!legalModal} animationType="fade" transparent onRequestClose={() => setLegalModal(null)}>
        <View style={s.modalOverlay}>
          <View style={s.modalBox}>
            <View style={s.modalHead}>
              <Text style={s.modalTitle}>{legalModal ? LEGAL_DATA[legalModal].title : ''}</Text>
              <TouchableOpacity onPress={() => setLegalModal(null)}>
                <Text style={s.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={s.modalBody}>
              <Text style={s.modalText}>{legalModal ? LEGAL_DATA[legalModal].content : ''}</Text>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* PRO UPGRADE MODAL */}
      <Modal visible={showProModal} animationType="slide" transparent onRequestClose={() => setShowProModal(false)}>
        <View style={s.modalOverlay}>
          <View style={s.proModal}>
            <View style={s.proModalHead}>
              <Text style={s.proModalTitle}>⭐ LAPOLU PRO</Text>
              <TouchableOpacity onPress={() => setShowProModal(false)}>
                <Text style={s.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={{maxHeight: 400}}>
              <Text style={s.proModalPrice}>₹299 / month</Text>
              <Text style={s.proModalSub}>Get India's most powerful Legal AI</Text>
              {PRO_FEATURES.slice(0,6).map((f, i) => (
                <View key={i} style={s.proModalFeature}>
                  <Text style={s.proModalFeatureIcon}>{f.icon}</Text>
                  <Text style={s.proModalFeatureText}>{f.title}</Text>
                </View>
              ))}
            </ScrollView>
            <TouchableOpacity style={s.proModalBtn} onPress={() => { setIsPro(true); setShowProModal(false); Alert.alert('Welcome to LAPOLU PRO! 🎉', 'All 10 PRO features are now unlocked. Tap any feature to use it.'); }}>
              <Text style={s.proModalBtnText}>Activate PRO — ₹299/month</Text>
            </TouchableOpacity>
            <Text style={s.proModalNote}>Payment integration coming soon. Tap to demo PRO features.</Text>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:{flex:1,backgroundColor:'#FEF6EC'},

  welcomeScreen:{flex:1,backgroundColor:'#48426D',alignItems:'center',justifyContent:'center'},
  welcomeLogo:{width:80,height:80,backgroundColor:'rgba(255,255,255,0.2)',borderRadius:24,alignItems:'center',justifyContent:'center',marginBottom:16},
  welcomeLogoText:{color:'#fff',fontSize:40,fontWeight:'900'},
  welcomeTitle:{color:'#fff',fontSize:36,fontWeight:'800',letterSpacing:4},
  welcomeSub:{color:'#F0C38E',fontSize:16,marginTop:8,letterSpacing:1},

  header:{backgroundColor:'#48426D',flexDirection:'row',alignItems:'center',padding:14,gap:10},
  logoBox:{width:36,height:36,backgroundColor:'rgba(255,255,255,0.2)',borderRadius:10,alignItems:'center',justifyContent:'center'},
  logoText:{color:'#fff',fontSize:17,fontWeight:'800'},
  appName:{color:'#fff',fontSize:18,fontWeight:'700',letterSpacing:1},
  appSub:{color:'rgba(255,255,255,0.7)',fontSize:10},
  proBtn:{backgroundColor:'#F0C38E',borderRadius:8,paddingHorizontal:10,paddingVertical:5},
  proBtnText:{color:'#2E2A47',fontSize:11,fontWeight:'800'},
  proBadge:{backgroundColor:'rgba(240,195,142,0.3)',borderRadius:8,paddingHorizontal:10,paddingVertical:5,borderWidth:1,borderColor:'#F0C38E'},
  proBadgeText:{color:'#F0C38E',fontSize:11,fontWeight:'700'},
  keyBtn:{backgroundColor:'rgba(255,255,255,0.15)',borderRadius:8,paddingHorizontal:10,paddingVertical:6,borderWidth:1,borderColor:'rgba(255,255,255,0.3)'},
  keyBtnText:{color:'#fff',fontSize:14},

  apiBox:{backgroundColor:'#fff',padding:16,borderBottomWidth:1,borderColor:'#EDD9C0'},
  apiLabel:{fontSize:12,fontWeight:'600',color:'#48426D',marginBottom:8},
  apiInput:{borderWidth:1.5,borderColor:'#EDD9C0',borderRadius:8,padding:10,fontSize:13,color:'#1A1530',backgroundColor:'#FEF6EC',marginBottom:8},
  apiSave:{backgroundColor:'#48426D',borderRadius:8,padding:10,alignItems:'center'},
  apiSaveText:{color:'#fff',fontSize:13,fontWeight:'600'},

  tabs:{flexDirection:'row',backgroundColor:'#fff',borderBottomWidth:1,borderColor:'#EDD9C0'},
  tab:{flex:1,paddingVertical:12,alignItems:'center'},
  tabActive:{borderBottomWidth:2,borderColor:'#48426D'},
  tabText:{fontSize:12,color:'#7A7298',fontWeight:'500'},
  tabTextActive:{color:'#48426D',fontWeight:'700'},

  scroll:{flex:1},
  section:{padding:16},
  sectionLabel:{fontSize:10,fontWeight:'700',letterSpacing:2,textTransform:'uppercase',color:'#48426D',marginBottom:10,marginTop:4,opacity:0.75},
  chipRow:{marginBottom:14},
  chip:{borderWidth:1.5,borderColor:'#EDD9C0',borderRadius:20,paddingHorizontal:13,paddingVertical:5,marginRight:7,backgroundColor:'#fff'},
  chipActive:{backgroundColor:'#48426D',borderColor:'#48426D'},
  chipText:{fontSize:12,color:'#7A7298',fontWeight:'500'},
  chipTextActive:{color:'#fff'},

  proBanner:{backgroundColor:'#F8F4FF',borderWidth:1.5,borderColor:'#48426D',borderRadius:12,padding:12,marginBottom:16,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},
  proBannerText:{flex:1,fontSize:12,color:'#48426D',fontWeight:'600'},
  proBannerBtn:{color:'#F0C38E',fontSize:13,fontWeight:'800',backgroundColor:'#48426D',paddingHorizontal:10,paddingVertical:4,borderRadius:6,marginLeft:8},

  inputBox:{backgroundColor:'#fff',borderWidth:1.5,borderColor:'#EDD9C0',borderRadius:14,padding:14,marginBottom:14},
  textArea:{fontSize:14,color:'#1A1530',minHeight:100,textAlignVertical:'top'},
  askBtn:{backgroundColor:'#48426D',borderRadius:9,padding:12,alignItems:'center',marginTop:10},
  askBtnText:{color:'#fff',fontSize:13,fontWeight:'700'},

  answerBox:{backgroundColor:'#fff',borderWidth:1.5,borderColor:'#EDD9C0',borderRadius:14,padding:16,marginBottom:14},
  answerTitle:{fontSize:16,color:'#48426D',fontWeight:'700'},
  answerSub:{fontSize:11,color:'#7A7298',marginBottom:10,marginTop:2},
  answerText:{fontSize:14,color:'#3A3360',lineHeight:22},
  tagRow:{flexDirection:'row',flexWrap:'wrap',gap:6,marginTop:12},
  tag:{backgroundColor:'rgba(240,195,142,0.2)',borderRadius:5,paddingHorizontal:9,paddingVertical:3,borderWidth:1,borderColor:'rgba(240,195,142,0.4)'},
  tagText:{fontSize:10,color:'#48426D',fontWeight:'600'},
  disclaimer:{fontSize:11,color:'#7A7298',marginTop:12,lineHeight:16},
  upgradeHint:{backgroundColor:'#F8F4FF',borderRadius:8,padding:10,marginTop:10,borderWidth:1,borderColor:'#C5B8E8'},
  upgradeHintText:{fontSize:11,color:'#48426D',fontWeight:'600',textAlign:'center'},

  followupBox:{backgroundColor:'#F8F4FF',borderWidth:1.5,borderColor:'#C5B8E8',borderRadius:14,padding:14,marginBottom:14},
  followupLabel:{fontSize:11,fontWeight:'700',color:'#48426D',marginBottom:6,letterSpacing:1},
  followupText:{fontSize:14,color:'#3A3360',marginBottom:10,lineHeight:20},
  followupInput:{backgroundColor:'#fff',borderWidth:1,borderColor:'#C5B8E8',borderRadius:8,padding:10,fontSize:13,color:'#1A1530',minHeight:60},

  scoreBox:{borderRadius:14,padding:16,marginBottom:14,borderWidth:1.5,borderColor:'rgba(0,0,0,0.08)'},
  scoreRow:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:6},
  scoreTitle:{fontSize:14,fontWeight:'700',color:'#1A1530'},
  scoreBadge:{borderRadius:20,paddingHorizontal:12,paddingVertical:4},
  scoreBadgeText:{color:'#fff',fontSize:16,fontWeight:'800'},
  scoreLabel:{fontSize:13,fontWeight:'600',marginBottom:10},
  scoreBar:{backgroundColor:'rgba(0,0,0,0.1)',borderRadius:10,height:8,overflow:'hidden'},
  scoreBarFill:{height:8,borderRadius:10},

  roadmapBox:{backgroundColor:'#fff',borderWidth:1.5,borderColor:'#EDD9C0',borderRadius:14,padding:16,marginBottom:14},
  roadmapTitle:{fontSize:15,fontWeight:'700',color:'#48426D',marginBottom:14},
  roadmapStep:{flexDirection:'row',alignItems:'flex-start',marginBottom:12,gap:10},
  roadmapDot:{width:26,height:26,borderRadius:13,backgroundColor:'#48426D',alignItems:'center',justifyContent:'center'},
  roadmapDotText:{color:'#fff',fontSize:12,fontWeight:'700'},
  roadmapStepText:{flex:1,fontSize:13,color:'#3A3360',lineHeight:20},

  lawyerBox:{borderRadius:14,padding:14,marginBottom:14,borderWidth:1.5,borderColor:'rgba(0,0,0,0.08)'},
  lawyerBoxTitle:{fontSize:14,fontWeight:'700',color:'#1A1530',marginBottom:6},
  lawyerBoxText:{fontSize:13,color:'#3A3360',lineHeight:20},

  quickCard:{backgroundColor:'#fff',borderWidth:1.5,borderColor:'#EDD9C0',borderRadius:10,padding:13,marginBottom:8,flexDirection:'row',alignItems:'center'},
  quickText:{flex:1,fontSize:13,color:'#3A3360'},
  quickArrow:{color:'#48426D',fontSize:16,fontWeight:'700'},

  rtiTitle:{fontSize:20,fontWeight:'700',color:'#48426D',marginBottom:4},
  rtiSub:{fontSize:13,color:'#7A7298',marginBottom:16,lineHeight:18},
  rtiField:{marginBottom:13},
  rtiLabel:{fontSize:12,fontWeight:'600',color:'#48426D',marginBottom:4},
  rtiInput:{backgroundColor:'#FEF6EC',borderWidth:1.5,borderColor:'#EDD9C0',borderRadius:9,padding:10,fontSize:13,color:'#1A1530'},
  rtiGenBtn:{backgroundColor:'#48426D',borderRadius:10,padding:13,alignItems:'center',marginTop:6},
  rtiGenBtnText:{color:'#fff',fontSize:13,fontWeight:'700'},
  rtiReady:{fontSize:14,fontWeight:'700',color:'#1A7A4A',marginBottom:8},
  rtiDraft:{backgroundColor:'#FEF6EC',borderWidth:1,borderColor:'#EDD9C0',borderRadius:10,padding:14,maxHeight:280,marginBottom:10},
  rtiDraftText:{fontSize:12,color:'#3A3360',lineHeight:20},
  rtiPortalBtn:{backgroundColor:'#1A7A4A',borderRadius:10,padding:13,alignItems:'center',marginBottom:8},
  rtiPortalBtnText:{color:'#fff',fontSize:13,fontWeight:'700'},
  rtiEditBtn:{backgroundColor:'#fff',borderWidth:1.5,borderColor:'#EDD9C0',borderRadius:10,padding:11,alignItems:'center',marginBottom:10},
  rtiEditBtnText:{color:'#48426D',fontSize:13,fontWeight:'600'},
  rtiTip:{fontSize:11,color:'#7A7298',lineHeight:16,backgroundColor:'#FDEBD0',padding:10,borderRadius:8},

  proHero:{backgroundColor:'#48426D',borderRadius:16,padding:24,alignItems:'center',marginBottom:20},
  proHeroTitle:{color:'#F0C38E',fontSize:24,fontWeight:'800',letterSpacing:2},
  proHeroPrice:{color:'#fff',fontSize:32,fontWeight:'900',marginTop:4},
  proHeroSub:{color:'rgba(255,255,255,0.7)',fontSize:13,marginTop:4,marginBottom:16},
  proHeroBtn:{backgroundColor:'#F0C38E',borderRadius:10,paddingHorizontal:24,paddingVertical:12},
  proHeroBtnText:{color:'#2E2A47',fontSize:15,fontWeight:'800'},
  proActiveBox:{backgroundColor:'rgba(240,195,142,0.2)',borderRadius:10,paddingHorizontal:20,paddingVertical:10,borderWidth:1,borderColor:'#F0C38E'},
  proActiveText:{color:'#F0C38E',fontSize:14,fontWeight:'700'},
  proFeatureCard:{backgroundColor:'#fff',borderWidth:1.5,borderColor:'#EDD9C0',borderRadius:12,padding:14,marginBottom:10,flexDirection:'row',alignItems:'center',gap:12},
  proFeatureIcon:{fontSize:24},
  proFeatureTitle:{fontSize:14,fontWeight:'700',color:'#1A1530',marginBottom:2},
  proFeatureDesc:{fontSize:12,color:'#7A7298',lineHeight:17},
  proFeatureCheck:{color:'#1A7A4A',fontSize:18,fontWeight:'700'},
  proCompare:{backgroundColor:'#fff',borderWidth:1.5,borderColor:'#EDD9C0',borderRadius:14,overflow:'hidden',marginTop:8},
  proCompareTitle:{fontSize:14,fontWeight:'700',color:'#48426D',padding:14,borderBottomWidth:1,borderColor:'#EDD9C0'},
  compareRow:{flexDirection:'row',paddingVertical:10,paddingHorizontal:14},
  compareHeader:{flexDirection:'row',paddingVertical:10,paddingHorizontal:14,backgroundColor:'#F8F4FF',borderTopWidth:1,borderColor:'#EDD9C0'},
  compareFeature:{flex:2,fontSize:12,color:'#3A3360'},
  compareVal:{flex:1,fontSize:13,textAlign:'center'},

  // PRO Screen styles
  backBtn:{marginBottom:16},
  backBtnText:{fontSize:14,color:'#48426D',fontWeight:'600'},
  proScreenTitle:{fontSize:22,fontWeight:'800',color:'#48426D',marginBottom:6},
  proScreenSub:{fontSize:13,color:'#7A7298',marginBottom:20,lineHeight:18},

  footer:{backgroundColor:'#48426D',padding:24,alignItems:'center',marginTop:8},
  footerText:{color:'#fff',fontSize:14,fontWeight:'700'},
  footerSub:{color:'rgba(255,255,255,0.6)',fontSize:11,marginTop:4},
  footerContact:{color:'#F0C38E',fontSize:11,marginTop:4},
  footerBtns:{flexDirection:'row',flexWrap:'wrap',justifyContent:'center',gap:6,marginTop:14,paddingTop:14,borderTopWidth:1,borderTopColor:'rgba(255,255,255,0.15)'},
  footerBtn:{borderWidth:1,borderColor:'rgba(255,255,255,0.3)',borderRadius:6,paddingHorizontal:10,paddingVertical:5},
  footerBtnText:{color:'rgba(255,255,255,0.7)',fontSize:10},

  modalOverlay:{flex:1,backgroundColor:'rgba(0,0,0,0.7)',justifyContent:'center',alignItems:'center'},
  modalBox:{backgroundColor:'#fff',borderRadius:16,width:'90%',maxHeight:'80%',overflow:'hidden'},
  modalHead:{backgroundColor:'#48426D',padding:16,flexDirection:'row',justifyContent:'space-between',alignItems:'center'},
  modalTitle:{color:'#fff',fontSize:17,fontWeight:'700'},
  modalClose:{color:'#fff',fontSize:22,fontWeight:'300',paddingHorizontal:8},
  modalBody:{padding:20},
  modalText:{fontSize:13,color:'#3A3360',lineHeight:22},

  proModal:{backgroundColor:'#fff',borderRadius:20,width:'92%',overflow:'hidden'},
  proModalHead:{backgroundColor:'#48426D',padding:16,flexDirection:'row',justifyContent:'space-between',alignItems:'center'},
  proModalTitle:{color:'#F0C38E',fontSize:20,fontWeight:'800'},
  proModalPrice:{fontSize:28,fontWeight:'900',color:'#48426D',textAlign:'center',paddingTop:16},
  proModalSub:{fontSize:13,color:'#7A7298',textAlign:'center',marginBottom:16,paddingHorizontal:16},
  proModalFeature:{flexDirection:'row',alignItems:'center',paddingHorizontal:20,paddingVertical:10,borderBottomWidth:1,borderColor:'#EDD9C0',gap:12},
  proModalFeatureIcon:{fontSize:20},
  proModalFeatureText:{fontSize:13,color:'#1A1530',fontWeight:'600'},
  proModalBtn:{backgroundColor:'#48426D',margin:16,borderRadius:12,padding:16,alignItems:'center'},
  proModalBtnText:{color:'#F0C38E',fontSize:16,fontWeight:'800'},
  proModalNote:{fontSize:10,color:'#7A7298',textAlign:'center',paddingBottom:16,paddingHorizontal:16},
});
