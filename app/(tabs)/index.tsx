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
const PRO_FEATURES = [
  { icon: '🤖', title: 'Smart AI Legal Advisor', desc: 'AI asks follow-up questions & gives step-by-step guidance' },
  { icon: '🗺️', title: 'Legal Roadmap', desc: 'Get a clear action plan: Step 1 → Step 2 → Step 3' },
  { icon: '⚠️', title: 'Risk Detector', desc: 'Upload agreements, AI finds risks & missing clauses' },
  { icon: '📊', title: 'Legal Safety Score', desc: 'AI scores your legal risk level from 1-10' },
  { icon: '📄', title: 'Document Engine', desc: 'Generate & download filled legal documents (.docx)' },
  { icon: '🔔', title: 'Legal Reminders', desc: 'Reminders for rent, agreements, court deadlines' },
  { icon: '📁', title: 'Personal Legal Dashboard', desc: 'Track all your problems, documents & steps' },
  { icon: '📚', title: 'Premium Document Library', desc: 'Access all legal templates & business agreements' },
  { icon: '⚖️', title: 'When to Call a Lawyer', desc: 'AI tells you exactly when you need professional help' },
  { icon: '🚀', title: 'Priority AI Access', desc: 'Faster, better AI responses over free users' },
];

export default function HomeScreen() {
  const [lang, setLang] = useState('English');
  const [topic, setTopic] = useState(TOPICS[0].value);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState(null); // { text, roadmap, score, lawyerNeeded }
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

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }).start();
    const t = setTimeout(() => setShowWelcome(false), 3000);
    return () => clearTimeout(t);
  }, []);

  // ─── SMART AI (PRO) ──────────────────────────────────────────────────────
  const askAI = async () => {
    if (!question.trim()) { Alert.alert('Please explain your legal problem.'); return; }
    if (!apiKey.trim()) { setShowApiInput(true); Alert.alert('Please enter your Anthropic API key first.'); return; }
    setLoading(true); setAnswer(null);

    const isProUser = isPro;

    const sys = isProUser
      ? `You are LAPOLU, an expert Indian Legal AI Advisor.\nUPDATED LAWS (1 July 2024): IPC replaced by BNS, CrPC by BNSS, Evidence Act by BSA.\nFor incidents after 1 July 2024 cite BNS/BNSS/BSA. Before cite IPC/CrPC.\nOther laws: Constitution, Consumer Protection Act 2019, RTI Act 2005, IT Act 2000, Hindu Marriage Act, DPDPA 2023.\n\nYou MUST respond in this EXACT JSON format (no markdown, pure JSON):\n{\n  "answer": "Clear direct legal explanation here",\n  "followup": "One important follow-up question to understand the situation better",\n  "roadmap": ["Step 1: ...", "Step 2: ...", "Step 3: ...", "Step 4: ..."],\n  "score": 7,\n  "scoreLabel": "High Risk",\n  "lawyerNeeded": "YES",\n  "lawyerReason": "Why lawyer is or is not needed"\n}\nScore is 1-10 (10 = most risky). Language: ${lang}. Topic: ${topic}`
      : `You are LAPOLU, a helpful Indian legal AI assistant.\nUPDATED LAWS (1 July 2024): IPC replaced by BNS, CrPC by BNSS, Evidence Act by BSA.\nFor incidents after 1 July 2024 cite BNS/BNSS/BSA. Before that cite IPC/CrPC.\nOther laws: Constitution, Consumer Protection Act 2019, RTI Act 2005, IT Act 2000, Hindu Marriage Act, DPDPA 2023.\nFormat: 1) Direct answer 2) Relevant law and sections 3) Practical next steps 4) Recommend Bar Council advocate if needed.\nLanguage: ${lang}. Topic: ${topic}`;

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {'Content-Type':'application/json','x-api-key':apiKey,'anthropic-version':'2023-06-01'},
        body: JSON.stringify({model:'claude-sonnet-4-20250514', max_tokens:2000, system:sys, messages:[{role:'user',content:question}]})
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error.message);
      const raw = data.content.map(b => b.text||'').join('');

      if (isProUser) {
        try {
          const parsed = JSON.parse(raw);
          setAnswer({ type: 'pro', ...parsed });
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

  const generateRTI = async () => {
    const {name,mobile,address,state,dept,info} = rtiForm;
    if (!name||!mobile||!address||!state||!dept||!info) { Alert.alert('Please fill all required fields.'); return; }
    if (!apiKey.trim()) { setShowApiInput(true); Alert.alert('Please enter your API key first.'); return; }
    setRtiLoading(true);
    const today = new Date();
    const dateStr = today.getDate()+'/'+(today.getMonth()+1)+'/'+today.getFullYear();
    const prompt = `Write a formal RTI application under Right to Information Act 2005.\nApplicant: ${name}\nMobile: ${mobile}\nAddress: ${address}\nState: ${state}\nDepartment: ${dept}\nInformation needed: ${info}${rtiForm.purpose?'\nPurpose: '+rtiForm.purpose:''}\nDate: ${dateStr}\nWrite complete formal RTI letter. Output only the letter.`;
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method:'POST',
        headers:{'Content-Type':'application/json','x-api-key':apiKey,'anthropic-version':'2023-06-01'},
        body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:1500,messages:[{role:'user',content:prompt}]})
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error.message);
      setRtiLetter(data.content.map(b=>b.text||'').join(''));
      setRtiStep(3);
    } catch(e) { Alert.alert('Error: '+(e.message||'Try again.')); }
    setRtiLoading(false);
  };

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
          <TouchableOpacity key={tab.id} style={[s.tab, activeTab===tab.id && s.tabActive]} onPress={() => setActiveTab(tab.id)}>
            <Text style={[s.tabText, activeTab===tab.id && s.tabTextActive]}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS==='ios'?'padding':undefined}>
        <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>

          {/* ── ASK AI TAB ── */}
          {activeTab === 'ai' && (
            <View style={s.section}>

              {/* FREE vs PRO banner */}
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

              {/* QUESTION BOX */}
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
                  {loading ? <ActivityIndicator color={COLORS.white}/> : <Text style={s.askBtnText}>Ask LAPOLU</Text>}
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
                  {/* Main Answer */}
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

                  {/* Follow-up Question */}
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

                  {/* Legal Safety Score */}
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
                        <View style={[s.scoreBarFill, {width: `${answer.score * 10}%`, backgroundColor: getRiskColor(answer.score)}]}/>
                      </View>
                    </View>
                  )}

                  {/* Legal Roadmap */}
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

                  {/* When to Call Lawyer */}
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

              {PRO_FEATURES.map((f, i) => (
                <View key={i} style={s.proFeatureCard}>
                  <Text style={s.proFeatureIcon}>{f.icon}</Text>
                  <View style={{flex:1}}>
                    <Text style={s.proFeatureTitle}>{f.title}</Text>
                    <Text style={s.proFeatureDesc}>{f.desc}</Text>
                  </View>
                  <Text style={s.proFeatureCheck}>✓</Text>
                </View>
              ))}

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
      </KeyboardAvoidingView>

      {/* LEGAL MODALS */}
      {legalModal && (
        <View style={s.modalOverlay}>
          <View style={s.modalBox}>
            <View style={s.modalHead}>
              <Text style={s.modalTitle}>{LEGAL_DATA[legalModal].title}</Text>
              <TouchableOpacity onPress={() => setLegalModal(null)}>
                <Text style={s.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={s.modalBody}>
              <Text style={s.modalText}>{LEGAL_DATA[legalModal].content}</Text>
            </ScrollView>
          </View>
        </View>
      )}

      {/* PRO UPGRADE MODAL */}
      <Modal visible={showProModal} animationType="slide" transparent>
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
            {/* For demo — toggle PRO on/off */}
            <TouchableOpacity style={s.proModalBtn} onPress={() => { setIsPro(true); setShowProModal(false); Alert.alert('Welcome to LAPOLU PRO! 🎉', 'All PRO features are now unlocked.'); }}>
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

  // Welcome
  welcomeScreen:{flex:1,backgroundColor:'#48426D',alignItems:'center',justifyContent:'center'},
  welcomeLogo:{width:80,height:80,backgroundColor:'rgba(255,255,255,0.2)',borderRadius:24,alignItems:'center',justifyContent:'center',marginBottom:16},
  welcomeLogoText:{color:'#fff',fontSize:40,fontWeight:'900'},
  welcomeTitle:{color:'#fff',fontSize:36,fontWeight:'800',letterSpacing:4},
  welcomeSub:{color:'#F0C38E',fontSize:16,marginTop:8,letterSpacing:1},

  // Header
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

  // API Box
  apiBox:{backgroundColor:'#fff',padding:16,borderBottomWidth:1,borderColor:'#EDD9C0'},
  apiLabel:{fontSize:12,fontWeight:'600',color:'#48426D',marginBottom:8},
  apiInput:{borderWidth:1.5,borderColor:'#EDD9C0',borderRadius:8,padding:10,fontSize:13,color:'#1A1530',backgroundColor:'#FEF6EC',marginBottom:8},
  apiSave:{backgroundColor:'#48426D',borderRadius:8,padding:10,alignItems:'center'},
  apiSaveText:{color:'#fff',fontSize:13,fontWeight:'600'},

  // Tabs
  tabs:{flexDirection:'row',backgroundColor:'#fff',borderBottomWidth:1,borderColor:'#EDD9C0'},
  tab:{flex:1,paddingVertical:12,alignItems:'center'},
  tabActive:{borderBottomWidth:2,borderColor:'#48426D'},
  tabText:{fontSize:12,color:'#7A7298',fontWeight:'500'},
  tabTextActive:{color:'#48426D',fontWeight:'700'},

  // General
  scroll:{flex:1},
  section:{padding:16},
  sectionLabel:{fontSize:10,fontWeight:'700',letterSpacing:2,textTransform:'uppercase',color:'#48426D',marginBottom:10,marginTop:4,opacity:0.75},
  chipRow:{marginBottom:14},
  chip:{borderWidth:1.5,borderColor:'#EDD9C0',borderRadius:20,paddingHorizontal:13,paddingVertical:5,marginRight:7,backgroundColor:'#fff'},
  chipActive:{backgroundColor:'#48426D',borderColor:'#48426D'},
  chipText:{fontSize:12,color:'#7A7298',fontWeight:'500'},
  chipTextActive:{color:'#fff'},

  // PRO Banner
  proBanner:{backgroundColor:'#F8F4FF',borderWidth:1.5,borderColor:'#48426D',borderRadius:12,padding:12,marginBottom:16,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},
  proBannerText:{flex:1,fontSize:12,color:'#48426D',fontWeight:'600'},
  proBannerBtn:{color:'#F0C38E',fontSize:13,fontWeight:'800',backgroundColor:'#48426D',paddingHorizontal:10,paddingVertical:4,borderRadius:6,marginLeft:8},

  // Input
  inputBox:{backgroundColor:'#fff',borderWidth:1.5,borderColor:'#EDD9C0',borderRadius:14,padding:14,marginBottom:14},
  textArea:{fontSize:14,color:'#1A1530',minHeight:100,textAlignVertical:'top'},
  askBtn:{backgroundColor:'#48426D',borderRadius:9,padding:12,alignItems:'center',marginTop:10},
  askBtnText:{color:'#fff',fontSize:13,fontWeight:'700'},

  // Answer
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

  // Follow-up
  followupBox:{backgroundColor:'#F8F4FF',borderWidth:1.5,borderColor:'#C5B8E8',borderRadius:14,padding:14,marginBottom:14},
  followupLabel:{fontSize:11,fontWeight:'700',color:'#48426D',marginBottom:6,letterSpacing:1},
  followupText:{fontSize:14,color:'#3A3360',marginBottom:10,lineHeight:20},
  followupInput:{backgroundColor:'#fff',borderWidth:1,borderColor:'#C5B8E8',borderRadius:8,padding:10,fontSize:13,color:'#1A1530',minHeight:60},

  // Score
  scoreBox:{borderRadius:14,padding:16,marginBottom:14,borderWidth:1.5,borderColor:'rgba(0,0,0,0.08)'},
  scoreRow:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:6},
  scoreTitle:{fontSize:14,fontWeight:'700',color:'#1A1530'},
  scoreBadge:{borderRadius:20,paddingHorizontal:12,paddingVertical:4},
  scoreBadgeText:{color:'#fff',fontSize:16,fontWeight:'800'},
  scoreLabel:{fontSize:13,fontWeight:'600',marginBottom:10},
  scoreBar:{backgroundColor:'rgba(0,0,0,0.1)',borderRadius:10,height:8,overflow:'hidden'},
  scoreBarFill:{height:8,borderRadius:10},

  // Roadmap
  roadmapBox:{backgroundColor:'#fff',borderWidth:1.5,borderColor:'#EDD9C0',borderRadius:14,padding:16,marginBottom:14},
  roadmapTitle:{fontSize:15,fontWeight:'700',color:'#48426D',marginBottom:14},
  roadmapStep:{flexDirection:'row',alignItems:'flex-start',marginBottom:12,gap:10},
  roadmapDot:{width:26,height:26,borderRadius:13,backgroundColor:'#48426D',alignItems:'center',justifyContent:'center'},
  roadmapDotText:{color:'#fff',fontSize:12,fontWeight:'700'},
  roadmapStepText:{flex:1,fontSize:13,color:'#3A3360',lineHeight:20},

  // Lawyer needed box
  lawyerBox:{borderRadius:14,padding:14,marginBottom:14,borderWidth:1.5,borderColor:'rgba(0,0,0,0.08)'},
  lawyerBoxTitle:{fontSize:14,fontWeight:'700',color:'#1A1530',marginBottom:6},
  lawyerBoxText:{fontSize:13,color:'#3A3360',lineHeight:20},

  // Quick cards
  quickCard:{backgroundColor:'#fff',borderWidth:1.5,borderColor:'#EDD9C0',borderRadius:10,padding:13,marginBottom:8,flexDirection:'row',alignItems:'center'},
  quickText:{flex:1,fontSize:13,color:'#3A3360'},
  quickArrow:{color:'#48426D',fontSize:16,fontWeight:'700'},

  // RTI
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

  // PRO Tab
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

  // Footer
  footer:{backgroundColor:'#48426D',padding:24,alignItems:'center',marginTop:8},
  footerText:{color:'#fff',fontSize:14,fontWeight:'700'},
  footerSub:{color:'rgba(255,255,255,0.6)',fontSize:11,marginTop:4},
  footerContact:{color:'#F0C38E',fontSize:11,marginTop:4},
  footerBtns:{flexDirection:'row',flexWrap:'wrap',justifyContent:'center',gap:6,marginTop:14,paddingTop:14,borderTopWidth:1,borderTopColor:'rgba(255,255,255,0.15)'},
  footerBtn:{borderWidth:1,borderColor:'rgba(255,255,255,0.3)',borderRadius:6,paddingHorizontal:10,paddingVertical:5},
  footerBtnText:{color:'rgba(255,255,255,0.7)',fontSize:10},

  // Modals
  modalOverlay:{position:'absolute',top:0,left:0,right:0,bottom:0,backgroundColor:'rgba(0,0,0,0.7)',justifyContent:'center',alignItems:'center',zIndex:999},
  modalBox:{backgroundColor:'#fff',borderRadius:16,width:'90%',maxHeight:'80%',overflow:'hidden'},
  modalHead:{backgroundColor:'#48426D',padding:16,flexDirection:'row',justifyContent:'space-between',alignItems:'center'},
  modalTitle:{color:'#fff',fontSize:17,fontWeight:'700'},
  modalClose:{color:'#fff',fontSize:22,fontWeight:'300',paddingHorizontal:8},
  modalBody:{padding:20},
  modalText:{fontSize:13,color:'#3A3360',lineHeight:22},

  // PRO Modal
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
