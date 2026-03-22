import { useState, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, ActivityIndicator, Linking, Alert,
  KeyboardAvoidingView, Platform
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

const LAWYERS = [
  {id:'RK', name:'Adv. Rajesh Kumar', spec:'Criminal & BNS', court:'Delhi HC', rating:'4.9', reviews:'312', color:'#8B3A22', bg:'#FDF0E8'},
  {id:'PS', name:'Adv. Priya Sharma', spec:'Family & Property', court:'Bombay HC', rating:'4.8', reviews:'198', color:'#6B3A9A', bg:'#F0EAF8'},
  {id:'AM', name:'Adv. Arjun Menon', spec:'Consumer & Labour', court:'Madras HC', rating:'5.0', reviews:'421', color:'#1A7A4A', bg:'#E8F5EE'},
  {id:'NK', name:'Adv. Neha Kapoor', spec:'Cyber & IT Law', court:'Supreme Court', rating:'4.9', reviews:'267', color:'#1A3A8A', bg:'#E8EEF8'},
];

const LEGAL_DATA = {
  privacy: {
    title: 'Privacy Policy',
    content: `Last updated: March 2025\n\nLAPOLU Indian Market is committed to protecting your privacy under the Digital Personal Data Protection Act 2023 and the IT Act 2000.\n\nINFORMATION WE COLLECT\nMobile numbers for OTP login, legal queries, language preferences, device info. Your API key is stored only in your browser, never on our servers.\n\nHOW WE USE IT\nTo provide AI legal responses, facilitate lawyer consultations, improve the platform. We never sell your data.\n\nDATA SECURITY\nAll data encrypted via SSL. Session billing stored for 90 days for dispute resolution only.\n\nYOUR RIGHTS\nAccess, correct, erase your data. Withdraw consent. File complaint with Data Protection Board of India.\n\nContact: help@lapolu.com`
  },
  terms: {
    title: 'Terms and Conditions',
    content: `Governing Law: India\nLast updated: March 2025\n\nBy using LAPOLU, you agree to these terms.\n\n1. ACCEPTANCE\nYou confirm you are 18+ and agree to be legally bound.\n\n2. NATURE OF SERVICE\nLAPOLU provides general legal information only, not legal advice. No attorney-client relationship is created. Always consult a Bar Council advocate.\n\n3. LAWYER CONNECT\nAdvocates are independent professionals. Billed at Rs.21 per minute. LAPOLU is an intermediary only.\n\n4. USER OBLIGATIONS\nDo not use for unlawful purposes. Do not submit false information.\n\n5. GOVERNING LAW\nIndian law. Disputes in Indian courts.\n\nContact: help@lapolu.com`
  },
  disclaimer: {
    title: 'Legal Disclaimer',
    content: `Please read this disclaimer carefully before using LAPOLU.\n\nNOT LEGAL ADVICE\nAll information from LAPOLU is for general educational purposes only. It is not legal advice. No attorney-client relationship is formed.\n\nAI LIMITATIONS\nAI can make errors and may not reflect current amendments to BNS, BNSS and BSA. Always verify with a qualified advocate before taking legal action.\n\nNO GUARANTEE\nLAPOLU makes no guarantees about legal outcomes. Results depend on specific facts of each case.\n\nADVOCATE INDEPENDENCE\nAdvocates on LAPOLU are independent professionals registered with the Bar Council of India.\n\nEMERGENCIES\nIn emergencies, contact police, courts or legal aid immediately. Do not rely solely on this app.\n\nBy using LAPOLU, you acknowledge and agree to this disclaimer.`
  },
  refund: {
    title: 'Refund Policy',
    content: `Applicable to Lawyer Connect\nEffective: March 2025\n\nBILLING\nBilled at Rs.21 per minute from session start to end. Partial minutes are billed as full minutes.\n\nREFUND ELIGIBILITY\n- Technical failure on LAPOLU platform\n- Advocate failed to join within 2 minutes\n- Duplicate charges due to payment errors\n- Unauthorized transaction reported within 24 hours\n\nNON-REFUNDABLE\n- Completed sessions regardless of satisfaction\n- Sessions ended by you after receiving advice\n- Connectivity issues on your end\n\nHOW TO REQUEST\nEmail help@lapolu.com within 7 days with session details. Refunds in 5 to 7 business days.\n\nContact: help@lapolu.com`
  },
  advocate: {
    title: 'Advocate Terms',
    content: `For advocates registered on LAPOLU.\n\n1. ELIGIBILITY\nMust hold valid LLB. Be enrolled with Bar Council of India or State Bar Council. Hold valid Certificate of Practice. Not be under suspension.\n\n2. PLATFORM ROLE\nLAPOLU is a technology intermediary only. You are an independent professional solely responsible for the legal advice you provide.\n\n3. CODE OF CONDUCT\nComply with Bar Council of India Rules, Advocates Act 1961, LAPOLU community standards. Violations lead to immediate removal.\n\n4. FEES AND PAYOUTS\nRate: Rs.21 per minute. LAPOLU retains platform commission. Weekly payouts via NEFT. GST is your responsibility.\n\n5. CONFIDENTIALITY\nMaintain strict client confidentiality.\n\n6. TERMINATION\nEither party may terminate with 7 days notice.\n\nContact: help@lapolu.com`
  }
};


export default function HomeScreen() {
  const [lang, setLang] = useState('English');
  const [topic, setTopic] = useState(TOPICS[0].value);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showApiInput, setShowApiInput] = useState(false);
  const [activeTab, setActiveTab] = useState('ai');
  const [selectedLawyer, setSelectedLawyer] = useState(null);
  const [sessionActive, setSessionActive] = useState(false);
  const [sessionSecs, setSessionSecs] = useState(0);
  const [rtiStep, setRtiStep] = useState(1);
  const [rtiForm, setRtiForm] = useState({name:'',mobile:'',address:'',state:'',dept:'',info:'',purpose:''});
  const [rtiLetter, setRtiLetter] = useState('');
  const [rtiLoading, setRtiLoading] = useState(false);
  const timerRef = useRef(null);
  const [legalModal, setLegalModal] = useState(null);

  const askAI = async () => {
    if (!question.trim()) { Alert.alert('Please enter a legal question.'); return; }
    if (!apiKey.trim()) { setShowApiInput(true); Alert.alert('Please enter your Anthropic API key first.'); return; }
    setLoading(true); setAnswer('');
    const sys = `You are LAPOLU, a helpful Indian legal AI assistant.\nUPDATED LAWS (1 July 2024): IPC replaced by BNS, CrPC by BNSS, Evidence Act by BSA.\nFor incidents after 1 July 2024 cite BNS/BNSS/BSA. Before that cite IPC/CrPC.\nOther laws: Constitution, Consumer Protection Act 2019, RTI Act 2005, IT Act 2000, Hindu Marriage Act, DPDPA 2023.\nFormat: 1) Direct answer 2) Law and sections 3) Practical steps 4) Recommend Bar Council advocate.\nLanguage: ${lang}\nTopic: ${topic}`;
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {'Content-Type':'application/json','x-api-key':apiKey,'anthropic-version':'2023-06-01'},
        body: JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:2000,system:sys,messages:[{role:'user',content:question}]})
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error.message);
      setAnswer(data.content.map(b => b.text||'').join(''));
    } catch(e) {
      setAnswer('Error: ' + (e.message || 'Check your API key and try again.'));
    }
    setLoading(false);
  };

  const startSession = (lawyer) => {
    setSelectedLawyer(lawyer);
    setSessionActive(true);
    setSessionSecs(0);
    timerRef.current = setInterval(() => setSessionSecs(s => s + 1), 1000);
  };

  const endSession = () => {
    clearInterval(timerRef.current);
    const mins = Math.ceil(sessionSecs / 60);
    const cost = mins * 21;
    Alert.alert('Session Ended', `Duration: ${Math.floor(sessionSecs/60)}:${String(sessionSecs%60).padStart(2,'0')}\nTotal: Rs.${cost}`, [{text:'OK', onPress:()=>{setSessionActive(false);setSelectedLawyer(null);setSessionSecs(0);}}]);
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

  const formatTime = (secs) => `${Math.floor(secs/60)}:${String(secs%60).padStart(2,'0')}`;

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.header}>
        <View style={s.logoBox}><Text style={s.logoText}>L</Text></View>
        <View>
          <Text style={s.appName}>LAPOLU</Text>
          <Text style={s.appSub}>Indian Legal AI</Text>
        </View>
        <TouchableOpacity style={s.keyBtn} onPress={() => setShowApiInput(!showApiInput)}>
          <Text style={s.keyBtnText}>API Key</Text>
        </TouchableOpacity>
      </View>

      {showApiInput && (
        <View style={s.apiBox}>
          <Text style={s.apiLabel}>Enter Anthropic API Key</Text>
          <TextInput style={s.apiInput} value={apiKey} onChangeText={setApiKey} placeholder="sk-ant-api03-..." secureTextEntry placeholderTextColor={COLORS.ink3}/>
          <TouchableOpacity style={s.apiSave} onPress={() => setShowApiInput(false)}>
            <Text style={s.apiSaveText}>Save Key</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={s.tabs}>
        {[{id:'ai',label:'Ask AI'},{id:'lawyers',label:'Lawyers'},{id:'rti',label:'File RTI'}].map(tab => (
          <TouchableOpacity key={tab.id} style={[s.tab, activeTab===tab.id && s.tabActive]} onPress={() => setActiveTab(tab.id)}>
            <Text style={[s.tabText, activeTab===tab.id && s.tabTextActive]}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS==='ios'?'padding':undefined}>
        <ScrollView style={s.scroll} showsVerticalScrollIndicator={false}>

          {activeTab === 'ai' && (
            <View style={s.section}>
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
                <TextInput style={s.textArea} value={question} onChangeText={setQuestion} placeholder="Ask your legal question in any language..." placeholderTextColor={COLORS.ink3} multiline numberOfLines={4}/>
                <TouchableOpacity style={s.askBtn} onPress={askAI} disabled={loading}>
                  {loading ? <ActivityIndicator color={COLORS.white}/> : <Text style={s.askBtnText}>Ask LAPOLU</Text>}
                </TouchableOpacity>
              </View>
              {answer !== '' && (
                <View style={s.answerBox}>
                  <Text style={s.answerTitle}>LAPOLU Legal Analysis</Text>
                  <Text style={s.answerSub}>Based on Indian Law (BNS/BNSS/BSA)</Text>
                  <Text style={s.answerText}>{answer}</Text>
                  <View style={s.tagRow}>
                    {['BNS/IPC','BNSS/CrPC','Constitution','BSA 2023'].map(t => (
                      <View key={t} style={s.tag}><Text style={s.tagText}>{t}</Text></View>
                    ))}
                  </View>
                  <Text style={s.disclaimer}>General legal information only. Not legal advice. Consult a Bar Council advocate.</Text>
                </View>
              )}
              <Text style={s.sectionLabel}>Quick Queries</Text>
              {['What are my rights if arrested in India under BNSS?','How to file FIR or e-FIR in India?','What are tenant rights in India?','Consumer rights for defective product?','How to file RTI application?'].map(q => (
                <TouchableOpacity key={q} style={s.quickCard} onPress={() => setQuestion(q)}>
                  <Text style={s.quickText}>{q}</Text>
                  <Text style={s.quickArrow}>→</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {activeTab === 'lawyers' && (
            <View style={s.section}>
              <View style={s.lawyerHeader}>
                <Text style={s.lawyerHeaderTitle}>Connect to a Lawyer</Text>
                <Text style={s.lawyerHeaderSub}>Verified Bar Council advocates</Text>
                <View style={s.ratePill}><Text style={s.ratePillText}>Rs.21 / min</Text></View>
              </View>
              {sessionActive && selectedLawyer && (
                <View style={s.sessionBox}>
                  <View style={s.sessionTop}>
                    <View style={[s.sessAv, {backgroundColor:selectedLawyer.bg}]}>
                      <Text style={[s.sessAvText,{color:selectedLawyer.color}]}>{selectedLawyer.id}</Text>
                    </View>
                    <View style={{flex:1}}>
                      <Text style={s.sessName}>{selectedLawyer.name}</Text>
                      <Text style={s.sessSpec}>{selectedLawyer.spec}</Text>
                    </View>
                    <View style={s.liveBadge}><Text style={s.liveText}>● Live</Text></View>
                  </View>
                  <View style={s.meterRow}>
                    <View style={s.meter}><Text style={s.meterLabel}>Duration</Text><Text style={s.meterVal}>{formatTime(sessionSecs)}</Text></View>
                    <View style={s.meter}><Text style={s.meterLabel}>Rate/min</Text><Text style={s.meterVal}>Rs.21</Text></View>
                    <View style={s.meter}><Text style={s.meterLabel}>Total</Text><Text style={[s.meterVal,{color:COLORS.green}]}>Rs.{Math.round((sessionSecs/60)*21)}</Text></View>
                  </View>
                  <TouchableOpacity style={s.endBtn} onPress={endSession}>
                    <Text style={s.endBtnText}>End Session</Text>
                  </TouchableOpacity>
                  <Text style={s.sessNote}>Billed at Rs.21/min. Payment at session end.</Text>
                </View>
              )}
              {LAWYERS.map(lawyer => (
                <View key={lawyer.id} style={s.lawyerCard}>
                  <View style={s.lawyerTop}>
                    <View style={[s.lawyerAv,{backgroundColor:lawyer.bg}]}>
                      <Text style={[s.lawyerAvText,{color:lawyer.color}]}>{lawyer.id}</Text>
                    </View>
                    <View style={{flex:1}}>
                      <Text style={s.lawyerName}>{lawyer.name}</Text>
                      <Text style={s.lawyerSpec}>{lawyer.spec}</Text>
                    </View>
                  </View>
                  <View style={s.lawyerMeta}>
                    <View style={s.onlinePill}><Text style={s.onlineText}>● Online</Text></View>
                    <View style={s.metaPill}><Text style={s.metaText}>{lawyer.court}</Text></View>
                  </View>
                  <Text style={s.stars}>★★★★★ {lawyer.rating} · {lawyer.reviews} reviews</Text>
                  <TouchableOpacity style={s.connectBtn} onPress={() => !sessionActive && startSession(lawyer)}>
                    <Text style={s.connectBtnText}>Connect — Rs.21/min</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

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

          {legalModal && (
            <View style={s.modalOverlay}>
              <View style={s.modalBox}>
                <View style={s.modalHead}>
                  <Text style={s.modalTitle}>{LEGAL_DATA[legalModal].title}</Text>
                  <TouchableOpacity onPress={() => setLegalModal(null)}>
                    <Text style={s.modalClose}>x</Text>
                  </TouchableOpacity>
                </View>
                <ScrollView style={s.modalBody}>
                  <Text style={s.modalText}>{LEGAL_DATA[legalModal].content}</Text>
                </ScrollView>
              </View>
            </View>
          )}

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe:{flex:1,backgroundColor:'#FEF6EC'},
  header:{backgroundColor:'#48426D',flexDirection:'row',alignItems:'center',padding:16,gap:12},
  logoBox:{width:38,height:38,backgroundColor:'rgba(255,255,255,0.2)',borderRadius:10,alignItems:'center',justifyContent:'center'},
  logoText:{color:'#fff',fontSize:18,fontWeight:'800'},
  appName:{color:'#fff',fontSize:20,fontWeight:'700',letterSpacing:1},
  appSub:{color:'rgba(255,255,255,0.7)',fontSize:10,letterSpacing:1},
  keyBtn:{marginLeft:'auto',backgroundColor:'rgba(255,255,255,0.15)',borderRadius:8,paddingHorizontal:12,paddingVertical:6,borderWidth:1,borderColor:'rgba(255,255,255,0.3)'},
  keyBtnText:{color:'#fff',fontSize:11,fontWeight:'600'},
  apiBox:{backgroundColor:'#fff',padding:16,borderBottomWidth:1,borderColor:'#EDD9C0'},
  apiLabel:{fontSize:12,fontWeight:'600',color:'#48426D',marginBottom:8},
  apiInput:{borderWidth:1.5,borderColor:'#EDD9C0',borderRadius:8,padding:10,fontSize:13,color:'#1A1530',backgroundColor:'#FEF6EC',marginBottom:8},
  apiSave:{backgroundColor:'#48426D',borderRadius:8,padding:10,alignItems:'center'},
  apiSaveText:{color:'#fff',fontSize:13,fontWeight:'600'},
  tabs:{flexDirection:'row',backgroundColor:'#fff',borderBottomWidth:1,borderColor:'#EDD9C0'},
  tab:{flex:1,paddingVertical:13,alignItems:'center'},
  tabActive:{borderBottomWidth:2,borderColor:'#48426D'},
  tabText:{fontSize:13,color:'#7A7298',fontWeight:'500'},
  tabTextActive:{color:'#48426D',fontWeight:'700'},
  scroll:{flex:1},
  section:{padding:16},
  sectionLabel:{fontSize:10,fontWeight:'700',letterSpacing:2,textTransform:'uppercase',color:'#48426D',marginBottom:10,marginTop:4,opacity:0.75},
  chipRow:{marginBottom:14},
  chip:{borderWidth:1.5,borderColor:'#EDD9C0',borderRadius:20,paddingHorizontal:13,paddingVertical:5,marginRight:7,backgroundColor:'#fff'},
  chipActive:{backgroundColor:'#48426D',borderColor:'#48426D'},
  chipText:{fontSize:12,color:'#7A7298',fontWeight:'500'},
  chipTextActive:{color:'#fff'},
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
  quickCard:{backgroundColor:'#fff',borderWidth:1.5,borderColor:'#EDD9C0',borderRadius:10,padding:13,marginBottom:8,flexDirection:'row',alignItems:'center'},
  quickText:{flex:1,fontSize:13,color:'#3A3360'},
  quickArrow:{color:'#48426D',fontSize:16,fontWeight:'700'},
  lawyerHeader:{backgroundColor:'#48426D',borderRadius:14,padding:18,marginBottom:14},
  lawyerHeaderTitle:{color:'#fff',fontSize:18,fontWeight:'700'},
  lawyerHeaderSub:{color:'rgba(255,255,255,0.7)',fontSize:11,marginTop:2},
  ratePill:{backgroundColor:'#F0C38E',borderRadius:8,paddingHorizontal:14,paddingVertical:6,alignSelf:'flex-start',marginTop:10},
  ratePillText:{color:'#2E2A47',fontSize:15,fontWeight:'700'},
  sessionBox:{backgroundColor:'#fff',borderWidth:1.5,borderColor:'#EDD9C0',borderRadius:14,padding:16,marginBottom:14},
  sessionTop:{flexDirection:'row',alignItems:'center',gap:12,marginBottom:14},
  sessAv:{width:46,height:46,borderRadius:12,alignItems:'center',justifyContent:'center'},
  sessAvText:{fontSize:16,fontWeight:'700'},
  sessName:{fontSize:15,fontWeight:'700',color:'#1A1530'},
  sessSpec:{fontSize:11,color:'#7A7298'},
  liveBadge:{backgroundColor:'#E8F5EE',borderRadius:20,paddingHorizontal:10,paddingVertical:4},
  liveText:{color:'#1A7A4A',fontSize:11,fontWeight:'600'},
  meterRow:{flexDirection:'row',gap:8,marginBottom:14},
  meter:{flex:1,backgroundColor:'#FDEBD0',borderRadius:10,padding:12,alignItems:'center'},
  meterLabel:{fontSize:9,color:'#7A7298',letterSpacing:1,textTransform:'uppercase',marginBottom:4},
  meterVal:{fontSize:20,fontWeight:'700',color:'#48426D'},
  endBtn:{backgroundColor:'#fff',borderWidth:1.5,borderColor:'#48426D',borderRadius:9,padding:10,alignItems:'center',marginBottom:8},
  endBtnText:{color:'#48426D',fontSize:13,fontWeight:'600'},
  sessNote:{fontSize:10,color:'#7A7298',textAlign:'center',lineHeight:15},
  lawyerCard:{backgroundColor:'#fff',borderWidth:1.5,borderColor:'#EDD9C0',borderRadius:14,padding:16,marginBottom:12},
  lawyerTop:{flexDirection:'row',alignItems:'center',gap:11,marginBottom:10},
  lawyerAv:{width:44,height:44,borderRadius:11,alignItems:'center',justifyContent:'center'},
  lawyerAvText:{fontSize:15,fontWeight:'700'},
  lawyerName:{fontSize:14,fontWeight:'600',color:'#1A1530'},
  lawyerSpec:{fontSize:11,color:'#7A7298',marginTop:1},
  lawyerMeta:{flexDirection:'row',gap:6,marginBottom:8},
  onlinePill:{backgroundColor:'#E8F5EE',borderRadius:10,paddingHorizontal:8,paddingVertical:2},
  onlineText:{color:'#1A7A4A',fontSize:10,fontWeight:'600'},
  metaPill:{backgroundColor:'#FDEBD0',borderRadius:10,paddingHorizontal:8,paddingVertical:2},
  metaText:{color:'#7A7298',fontSize:10},
  stars:{fontSize:12,color:'#F0C38E',marginBottom:10},
  connectBtn:{backgroundColor:'#48426D',borderRadius:9,padding:10,alignItems:'center'},
  connectBtnText:{color:'#fff',fontSize:13,fontWeight:'600'},
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
  footer:{backgroundColor:'#48426D',padding:24,alignItems:'center',marginTop:8},
  footerText:{color:'#fff',fontSize:14,fontWeight:'700'},
  footerSub:{color:'rgba(255,255,255,0.6)',fontSize:11,marginTop:4},
  footerContact:{color:'#F0C38E',fontSize:11,marginTop:4},
  footerBtns:{flexDirection:'row',flexWrap:'wrap',justifyContent:'center',gap:6,marginTop:14,paddingTop:14,borderTopWidth:1,borderTopColor:'rgba(255,255,255,0.15)'},
  footerBtn:{borderWidth:1,borderColor:'rgba(255,255,255,0.3)',borderRadius:6,paddingHorizontal:10,paddingVertical:5},
  footerBtnText:{color:'rgba(255,255,255,0.7)',fontSize:10},
  modalOverlay:{position:'absolute',top:0,left:0,right:0,bottom:0,backgroundColor:'rgba(0,0,0,0.7)',justifyContent:'center',alignItems:'center',zIndex:999},
  modalBox:{backgroundColor:'#fff',borderRadius:16,width:'90%',maxHeight:'80%',overflow:'hidden'},
  modalHead:{backgroundColor:'#48426D',padding:16,flexDirection:'row',justifyContent:'space-between',alignItems:'center'},
  modalTitle:{color:'#fff',fontSize:17,fontWeight:'700',fontFamily:'serif'},
  modalClose:{color:'#fff',fontSize:22,fontWeight:'300'},
  modalBody:{padding:20},
  modalText:{fontSize:13,color:'#3A3360',lineHeight:22},
  modalSection:{fontSize:14,color:'#48426D',fontWeight:'700',marginTop:14,marginBottom:4},
  footerBtns:{flexDirection:'row',flexWrap:'wrap',justifyContent:'center',gap:6,marginTop:14,paddingTop:14,borderTopWidth:1,borderTopColor:'rgba(255,255,255,0.15)'},
  footerBtn:{borderWidth:1,borderColor:'rgba(255,255,255,0.3)',borderRadius:6,paddingHorizontal:10,paddingVertical:5},
  footerBtnText:{color:'rgba(255,255,255,0.7)',fontSize:10},
  modalOverlay:{position:'absolute',top:0,left:0,right:0,bottom:0,backgroundColor:'rgba(0,0,0,0.7)',justifyContent:'center',alignItems:'center',zIndex:999},
  modalBox:{backgroundColor:'#fff',borderRadius:16,width:'90%',maxHeight:'80%',overflow:'hidden'},
  modalHead:{backgroundColor:'#48426D',padding:16,flexDirection:'row',justifyContent:'space-between',alignItems:'center'},
  modalTitle:{color:'#fff',fontSize:17,fontWeight:'700',fontFamily:'serif'},
  modalClose:{color:'#fff',fontSize:22,fontWeight:'300'},
  modalBody:{padding:20},
  modalText:{fontSize:13,color:'#3A3360',lineHeight:22},
  modalSection:{fontSize:14,color:'#48426D',fontWeight:'700',marginTop:14,marginBottom:4},
  footerBtns:{flexDirection:'row',flexWrap:'wrap',justifyContent:'center',gap:6,marginTop:14,paddingTop:14,borderTopWidth:1,borderTopColor:'rgba(255,255,255,0.15)'},
  footerBtn:{borderWidth:1,borderColor:'rgba(255,255,255,0.3)',borderRadius:6,paddingHorizontal:10,paddingVertical:5},
  footerBtnText:{color:'rgba(255,255,255,0.7)',fontSize:10},
  modalOverlay:{position:'absolute',top:0,left:0,right:0,bottom:0,backgroundColor:'rgba(0,0,0,0.7)',justifyContent:'center',alignItems:'center',zIndex:999},
  modalBox:{backgroundColor:'#fff',borderRadius:16,width:'90%',maxHeight:'80%',overflow:'hidden'},
  modalHead:{backgroundColor:'#48426D',padding:16,flexDirection:'row',justifyContent:'space-between',alignItems:'center'},
  modalTitle:{color:'#fff',fontSize:17,fontWeight:'700',fontFamily:'serif'},
  modalClose:{color:'#fff',fontSize:22,fontWeight:'300'},
  modalBody:{padding:20},
  modalText:{fontSize:13,color:'#3A3360',lineHeight:22},
  modalSection:{fontSize:14,color:'#48426D',fontWeight:'700',marginTop:14,marginBottom:4},
});