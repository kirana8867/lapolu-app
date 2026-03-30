import { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, ActivityIndicator, Linking, Alert, Modal,
  KeyboardAvoidingView, Platform, Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const C = {
  bg:'#0F0D1A', surface:'#1A1728', surface2:'#231F35', surface3:'#2D2845',
  purple:'#7C6FCD', purpleL:'#9B8FE0', purpleD:'#4A3F8A',
  gold:'#D4A847', goldL:'#F0C86A',
  textP:'#F2EFFF', textS:'#A89EC9', textT:'#6B6090',
  green:'#2ECC71', greenBg:'#0D2B1A',
  red:'#E74C3C', redBg:'#2B0D0D',
  orange:'#E67E22', orangeBg:'#2B1A0D',
  border:'#2D2845', borderL:'#3D3560', white:'#FFFFFF',
};

const LANGUAGES=['English','Hindi','Tamil','Telugu','Kannada','Malayalam','Marathi','Bengali'];
const TOPICS=[
  {label:'Criminal — BNS',value:'BNS Bharatiya Nyaya Sanhita 2023 criminal law'},
  {label:'Consumer Rights',value:'Consumer Protection Act 2019'},
  {label:'Property & Land',value:'property and land disputes Transfer of Property Act'},
  {label:'Labour Law',value:'labour and employment law'},
  {label:'Family Law',value:'family law Hindu Marriage Act'},
  {label:'RTI',value:'RTI Right to Information Act 2005'},
  {label:'Cyber Law',value:'cyber crime IT Act 2000'},
  {label:'Constitution',value:'fundamental rights Indian Constitution'},
];

const LEGAL_DATA={
  privacy:{title:'Privacy Policy',content:'Last updated: March 2025\n\nLAPOLU Indian Market is committed to protecting your privacy under the Digital Personal Data Protection Act 2023 and the IT Act 2000.\n\nINFORMATION WE COLLECT\nMobile numbers for OTP login, legal queries, language preferences, device info. Your API key is stored only in your browser, never on our servers.\n\nHOW WE USE IT\nTo provide AI legal responses, improve the platform. We never sell your data.\n\nDATA SECURITY\nAll data encrypted via SSL.\n\nYOUR RIGHTS\nAccess, correct, erase your data. Withdraw consent. File complaint with Data Protection Board of India.\n\nContact: help@lapolu.com'},
  terms:{title:'Terms & Conditions',content:'Governing Law: India\nLast updated: March 2025\n\nBy using LAPOLU, you agree to these terms.\n\n1. ACCEPTANCE\nYou confirm you are 18+ and agree to be legally bound.\n\n2. NATURE OF SERVICE\nLAPOLU provides general legal information only, not legal advice. No attorney-client relationship is created.\n\n3. SUBSCRIPTION\nLAPOLU PRO is billed at Rs.299/month. Cancel anytime.\n\n4. GOVERNING LAW\nIndian law. Disputes in Indian courts.\n\nContact: help@lapolu.com'},
  disclaimer:{title:'Legal Disclaimer',content:'NOT LEGAL ADVICE\nAll information from LAPOLU is for general educational purposes only. It is not legal advice. No attorney-client relationship is formed.\n\nAI LIMITATIONS\nAI can make errors. Always verify with a qualified advocate before taking legal action.\n\nEMERGENCIES\nIn emergencies, contact police or courts immediately.\n\nBy using LAPOLU, you acknowledge this disclaimer.'},
  refund:{title:'Refund Policy',content:'SUBSCRIPTION BILLING\nBilled at Rs.299/month. Auto-renews monthly.\n\nREFUND ELIGIBILITY\n- Technical failure on LAPOLU platform\n- Duplicate charges due to payment errors\n- Unauthorized transaction reported within 24 hours\n\nNON-REFUNDABLE\n- Completed subscription months\n- Partial month cancellations\n\nEmail help@lapolu.com within 7 days.'},
  advocate:{title:'Advocate Terms',content:'For advocates registered on LAPOLU.\n\n1. Must hold valid LLB enrolled with Bar Council of India.\n2. LAPOLU is a technology intermediary only.\n3. Comply with Bar Council of India Rules and Advocates Act 1961.\n4. Rate: Rs.21 per minute. Weekly payouts via NEFT.\n5. Maintain strict client confidentiality.\n6. Either party may terminate with 7 days notice.\n\nContact: help@lapolu.com'},
};

const PRO_FEATURES=[
  {title:'Smart AI Legal Advisor',desc:'Follow-up questions and step-by-step guidance',action:'smartAI'},
  {title:'Legal Roadmap',desc:'Clear action plan for your situation',action:'roadmap'},
  {title:'Risk Detector',desc:'Paste any agreement — AI finds hidden risks',action:'riskDetector'},
  {title:'Legal Safety Score',desc:'Risk rating from 1 to 10 with explanation',action:'safetyScore'},
  {title:'Document Engine',desc:'Generate any legal document instantly',action:'docEngine'},
  {title:'Legal Reminders',desc:'Deadlines for rent, agreements, court dates',action:'reminders'},
  {title:'Legal Dashboard',desc:'Track all your cases and documents',action:'dashboard'},
  {title:'Document Library',desc:'All legal templates and agreements',action:'docLibrary'},
  {title:'When to Call a Lawyer',desc:'AI tells you exactly when you need help',action:'lawyerAdvice'},
  {title:'Priority AI Access',desc:'Fastest responses with best Claude model',action:'priorityAI'},
];

const DOC_LIBRARY=[
  {title:'Rent Agreement',subtitle:'Residential · 11 months',fields:[
    {key:'landlord',label:'Landlord Full Name',ph:'e.g. Ramesh Kumar'},
    {key:'tenant',label:'Tenant Full Name',ph:'e.g. Priya Sharma'},
    {key:'property',label:'Property Address',ph:'Full address with PIN code'},
    {key:'rent',label:'Monthly Rent (Rs.)',ph:'e.g. 15000',num:true},
    {key:'deposit',label:'Security Deposit (Rs.)',ph:'e.g. 45000',num:true},
    {key:'startDate',label:'Start Date',ph:'e.g. 01/04/2025'},
  ]},
  {title:'Employment Contract',subtitle:'Offer Letter',fields:[
    {key:'company',label:'Company Name',ph:'e.g. ABC Technologies Pvt Ltd'},
    {key:'employee',label:'Employee Full Name',ph:'e.g. Suresh Patel'},
    {key:'designation',label:'Designation',ph:'e.g. Software Engineer'},
    {key:'salary',label:'Monthly Salary (Rs.)',ph:'e.g. 50000',num:true},
    {key:'startDate',label:'Joining Date',ph:'e.g. 01/05/2025'},
    {key:'location',label:'Work Location',ph:'e.g. Bengaluru, Karnataka'},
  ]},
  {title:'Partnership Deed',subtitle:'Business Agreement',fields:[
    {key:'partner1',label:'Partner 1 Name',ph:'e.g. Rajesh Kumar'},
    {key:'partner2',label:'Partner 2 Name',ph:'e.g. Anita Singh'},
    {key:'businessName',label:'Firm Name',ph:'e.g. Kumar and Singh Enterprises'},
    {key:'capital1',label:'Partner 1 Capital (Rs.)',ph:'e.g. 500000',num:true},
    {key:'capital2',label:'Partner 2 Capital (Rs.)',ph:'e.g. 500000',num:true},
    {key:'profitShare',label:'Profit Sharing Ratio',ph:'e.g. 50:50'},
  ]},
  {title:'Legal Notice',subtitle:'General Purpose',fields:[
    {key:'sender',label:'Your Full Name',ph:'e.g. Ramesh Kumar'},
    {key:'senderAddr',label:'Your Address',ph:'Full address with PIN'},
    {key:'recipient',label:'Recipient Name',ph:'e.g. XYZ Company'},
    {key:'recipientAddr',label:'Recipient Address',ph:'Full address'},
    {key:'subject',label:'Subject of Notice',ph:'e.g. Recovery of dues'},
    {key:'details',label:'Details of Grievance',ph:'Describe the issue clearly...',multi:true},
  ]},
  {title:'NDA Agreement',subtitle:'Confidentiality',fields:[
    {key:'party1',label:'Disclosing Party',ph:'e.g. ABC Technologies Pvt Ltd'},
    {key:'party2',label:'Receiving Party',ph:'e.g. Freelancer Name'},
    {key:'purpose',label:'Purpose of Disclosure',ph:'e.g. Software development project'},
    {key:'duration',label:'Confidentiality Duration',ph:'e.g. 2 years from signing'},
    {key:'date',label:'Agreement Date',ph:'e.g. 01/04/2025'},
  ]},
  {title:'Loan Agreement',subtitle:'Personal Loan',fields:[
    {key:'lender',label:'Lender Full Name',ph:'e.g. Suresh Kumar'},
    {key:'borrower',label:'Borrower Full Name',ph:'e.g. Priya Sharma'},
    {key:'amount',label:'Loan Amount (Rs.)',ph:'e.g. 100000',num:true},
    {key:'interest',label:'Interest Rate (% p.a.)',ph:'e.g. 12',num:true},
    {key:'repayDate',label:'Repayment Date',ph:'e.g. 01/04/2026'},
    {key:'date',label:'Agreement Date',ph:'e.g. 01/04/2025'},
  ]},
  {title:'Lease Deed',subtitle:'Commercial Property',fields:[
    {key:'lessor',label:'Lessor (Owner) Name',ph:'e.g. Mahesh Properties Pvt Ltd'},
    {key:'lessee',label:'Lessee (Tenant) Name',ph:'e.g. Startup India Pvt Ltd'},
    {key:'property',label:'Property Description',ph:'e.g. Office No. 302, MG Road'},
    {key:'rent',label:'Monthly Rent (Rs.)',ph:'e.g. 50000',num:true},
    {key:'duration',label:'Lease Duration',ph:'e.g. 3 years from 01/04/2025'},
    {key:'deposit',label:'Security Deposit (Rs.)',ph:'e.g. 150000',num:true},
  ]},
  {title:'Vehicle Sale Deed',subtitle:'Motor Vehicle',fields:[
    {key:'seller',label:'Seller Full Name',ph:'e.g. Ramesh Kumar'},
    {key:'buyer',label:'Buyer Full Name',ph:'e.g. Suresh Patel'},
    {key:'vehicle',label:'Vehicle Description',ph:'e.g. Maruti Swift, 2020, White'},
    {key:'regNo',label:'Registration Number',ph:'e.g. KA 01 AB 1234'},
    {key:'amount',label:'Sale Amount (Rs.)',ph:'e.g. 500000',num:true},
    {key:'date',label:'Sale Date',ph:'e.g. 01/04/2025'},
  ]},
  {title:'Will & Testament',subtitle:'Estate Planning',fields:[
    {key:'testator',label:'Your Full Name',ph:'e.g. Ramesh Kumar'},
    {key:'address',label:'Your Address',ph:'Full address'},
    {key:'beneficiary1',label:'Primary Beneficiary',ph:'e.g. Priya Kumar (Wife)'},
    {key:'beneficiary2',label:'Secondary Beneficiary',ph:'e.g. Rohan Kumar (Son)'},
    {key:'executor',label:'Executor Name',ph:'Person who carries out your wishes'},
    {key:'assets',label:'Description of Assets',ph:'e.g. House, Bank accounts, Gold...',multi:true},
  ]},
  {title:'Divorce MOU',subtitle:'Mutual Consent',fields:[
    {key:'husband',label:'Husband Full Name',ph:'e.g. Ramesh Kumar'},
    {key:'wife',label:'Wife Full Name',ph:'e.g. Priya Kumar'},
    {key:'marriageDate',label:'Date of Marriage',ph:'e.g. 15/06/2018'},
    {key:'custody',label:'Child Custody Arrangement',ph:'e.g. Joint custody'},
    {key:'alimony',label:'Alimony Amount',ph:'e.g. Rs.10000/month or None'},
    {key:'date',label:'MOU Date',ph:'e.g. 01/04/2025'},
  ]},
];

export default function HomeScreen(){
  const[lang,setLang]=useState('English');
  const[topic,setTopic]=useState(TOPICS[0].value);
  const[question,setQuestion]=useState('');
  const[answer,setAnswer]=useState(null);
  const[loading,setLoading]=useState(false);
  const[apiKey,setApiKey]=useState('');
  const[showApiInput,setShowApiInput]=useState(false);
  const[activeTab,setActiveTab]=useState('ai');
  const[isPro,setIsPro]=useState(false);
  const[showProModal,setShowProModal]=useState(false);
  const[showWelcome,setShowWelcome]=useState(true);
  const[legalModal,setLegalModal]=useState(null);
  const[proScreen,setProScreen]=useState(null);
  const fadeAnim=useRef(new Animated.Value(0)).current;
  const[attachments,setAttachments]=useState([]);
  const[isListening,setIsListening]=useState(false);
  const[rtiStep,setRtiStep]=useState(1);
  const[rtiForm,setRtiForm]=useState({name:'',mobile:'',address:'',state:'',dept:'',info:'',purpose:''});
  const[rtiLetter,setRtiLetter]=useState('');
  const[rtiLoading,setRtiLoading]=useState(false);
  const[riskText,setRiskText]=useState('');
  const[riskResult,setRiskResult]=useState(null);
  const[riskLoading,setRiskLoading]=useState(false);
  const[selectedDoc,setSelectedDoc]=useState(null);
  const[docFields,setDocFields]=useState({});
  const[docResult,setDocResult]=useState('');
  const[docLoading,setDocLoading]=useState(false);
  const[reminders,setReminders]=useState([{id:1,title:'Rent Agreement Renewal',date:'15 Apr 2025',done:false},{id:2,title:'RTI Response Deadline',date:'30 Apr 2025',done:false}]);
  const[newRemTitle,setNewRemTitle]=useState('');
  const[newRemDate,setNewRemDate]=useState('');
  const[savedCases,setSavedCases]=useState([]);
  const[lawyerQ,setLawyerQ]=useState('');
  const[lawyerResult,setLawyerResult]=useState(null);
  const[lawyerLoading,setLawyerLoading]=useState(false);

  useEffect(()=>{
    Animated.timing(fadeAnim,{toValue:1,duration:1000,useNativeDriver:true}).start();
    const t=setTimeout(()=>setShowWelcome(false),3000);
    return()=>clearTimeout(t);
  },[]);

  const requirePro=()=>{if(!isPro){setShowProModal(true);return false;}return true;};
  const requireKey=()=>{if(!apiKey.trim()){setShowApiInput(true);Alert.alert('Enter your Anthropic API key first.');return false;}return true;};

  const callAI=async(sys,prompt,maxTokens=2000)=>{
    const res=await fetch('https://api.anthropic.com/v1/messages',{
      method:'POST',
      headers:{'Content-Type':'application/json','x-api-key':apiKey,'anthropic-version':'2023-06-01'},
      body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:maxTokens,system:sys,messages:[{role:'user',content:prompt}]})
    });
    const d=await res.json();
    if(d.error)throw new Error(d.error.message);
    return d.content.map(b=>b.text||'').join('');
  };

  const askAI=async()=>{
    if(!question.trim()&&attachments.length===0){Alert.alert('Please ask a legal question.');return;}
    if(!requireKey())return;
    setLoading(true);setAnswer(null);
    const attNote=attachments.length>0?'\n\nUser has attached '+attachments.length+' file(s): '+attachments.map(a=>a.name).join(', ')+'. Acknowledge these in your response.'  :'';
    const sys=isPro
      ?'You are LAPOLU, an expert Indian Legal AI Advisor.\nUPDATED LAWS (1 July 2024): IPC replaced by BNS, CrPC by BNSS, Evidence Act by BSA.\nFor incidents after 1 July 2024 cite BNS/BNSS/BSA. Before cite IPC/CrPC.\nOther laws: Constitution, Consumer Protection Act 2019, RTI Act 2005, IT Act 2000, Hindu Marriage Act, DPDPA 2023.\n\nRespond ONLY in this JSON format (no markdown):\n{"answer":"Clear legal explanation","followup":"One follow-up question","roadmap":["Step 1: ...","Step 2: ...","Step 3: ..."],"score":7,"scoreLabel":"High Risk","lawyerNeeded":"YES","lawyerReason":"Why lawyer is needed"}\nScore is 1-10. Language: '+lang+'. Topic: '+topic
      :'You are LAPOLU, a helpful Indian legal AI assistant.\nUPDATED LAWS (1 July 2024): IPC replaced by BNS, CrPC by BNSS, Evidence Act by BSA.\nFor incidents after 1 July 2024 cite BNS/BNSS/BSA. Before cite IPC/CrPC.\nOther laws: Constitution, Consumer Protection Act 2019, RTI Act 2005, IT Act 2000, Hindu Marriage Act, DPDPA 2023.\nFormat: 1) Direct answer 2) Law and sections 3) Practical next steps 4) Recommend Bar Council advocate if needed.\nLanguage: '+lang+'. Topic: '+topic;
    try{
      const raw=await callAI(sys,(question||'Please analyse the attached documents.')+attNote);
      if(isPro){
        try{
          const parsed=JSON.parse(raw);
          setAnswer({type:'pro',...parsed});
          setSavedCases(p=>[{id:Date.now(),question:(question||'Document analysis').slice(0,60),topic,score:parsed.score,scoreLabel:parsed.scoreLabel,date:new Date().toLocaleDateString('en-IN')},...p].slice(0,10));
        }catch{setAnswer({type:'basic',text:raw});}
      }else{setAnswer({type:'basic',text:raw});}
    }catch(e){setAnswer({type:'error',text:'Error: '+(e.message||'Check your API key.')});}
    setLoading(false);
  };

  const toggleVoice=()=>{
    if(isListening){setIsListening(false);}
    else{
      setIsListening(true);
      Alert.alert('Voice Input','Voice input is active. Speak your legal question now.\n\n(Full voice recognition requires Speech Recognition API support on your device.)');
      setTimeout(()=>setIsListening(false),5000);
    }
  };

  const handleAttachment=()=>{
    Alert.alert('Attach File','Choose the type of file to attach',[
      {text:'Photo / Image',onPress:()=>addAtt('image','legal_document.jpg')},
      {text:'PDF Document',onPress:()=>addAtt('pdf','agreement.pdf')},
      {text:'Text / Word File',onPress:()=>addAtt('doc','notice.docx')},
      {text:'Cancel',style:'cancel'},
    ]);
  };

  const addAtt=(type,name)=>{
    setAttachments(p=>[...p,{id:Date.now(),type,name,size:'245 KB'}]);
    Alert.alert('Attached',name+' has been attached to your question.');
  };

  const removeAtt=(id)=>setAttachments(p=>p.filter(a=>a.id!==id));
  const getRiskColor=(s)=>s<=3?C.green:s<=6?C.orange:C.red;
  const getRiskBg=(s)=>s<=3?C.greenBg:s<=6?C.orangeBg:C.redBg;

  const handleProTap=(action)=>{
    if(!requirePro())return;
    switch(action){
      case 'smartAI':case 'roadmap':case 'safetyScore':setActiveTab('ai');Alert.alert('PRO Active','Ask your question on the AI tab to get Roadmap, Risk Score and Smart Advisor.');break;
      case 'riskDetector':setProScreen('riskDetector');break;
      case 'docEngine':case 'docLibrary':setProScreen('docLibrary');break;
      case 'reminders':setProScreen('reminders');break;
      case 'dashboard':setProScreen('dashboard');break;
      case 'lawyerAdvice':setProScreen('lawyerAdvice');break;
      case 'priorityAI':Alert.alert('Priority AI','You have Priority AI Access with the best Claude model.');break;
    }
  };

  const runRiskDetector=async()=>{
    if(!requirePro()||!requireKey())return;
    if(!riskText.trim()){Alert.alert('Paste your agreement text first.');return;}
    setRiskLoading(true);setRiskResult(null);
    try{
      const raw=await callAI('You are a senior Indian legal expert. Analyse the agreement and respond ONLY in JSON:\n{"risks":["Risk 1","Risk 2"],"missing":["Clause 1","Clause 2"],"score":6,"verdict":"Moderate Risk","suggestion":"Key recommendation"}','Analyse this agreement:\n\n'+riskText);
      setRiskResult(JSON.parse(raw.replace(/```json|```/g,'').trim()));
    }catch(e){Alert.alert('Error: '+(e.message||'Try again.'));}
    setRiskLoading(false);
  };

  const generateDoc=async()=>{
    if(!requirePro()||!requireKey()||!selectedDoc)return;
    const firstTwo=selectedDoc.fields.slice(0,2).filter(f=>!docFields[f.key]);
    if(firstTwo.length>0){Alert.alert('Please fill '+firstTwo.map(f=>f.label).join(' and '));return;}
    setDocLoading(true);setDocResult('');
    try{
      const details=selectedDoc.fields.map(f=>f.label+': '+(docFields[f.key]||'Not specified')).join('\n');
      const raw=await callAI('You are a legal document drafting expert for India. Generate a complete formal '+selectedDoc.title+' in plain text with all standard clauses as per Indian law. Output only the document.','Generate a '+selectedDoc.title+':\n'+details+'\nDate: '+new Date().toLocaleDateString('en-IN'),2500);
      setDocResult(raw);
    }catch(e){Alert.alert('Error: '+(e.message||'Try again.'));}
    setDocLoading(false);
  };

  const generateRTI=async()=>{
    const{name,mobile,address,state,dept,info}=rtiForm;
    if(!name||!mobile||!address||!state||!dept||!info){Alert.alert('Please fill all required fields.');return;}
    if(!requireKey())return;
    setRtiLoading(true);
    const d=new Date();
    try{
      const raw=await callAI('You are an expert in RTI applications for India.','Write a formal RTI application under Right to Information Act 2005.\nApplicant: '+name+'\nMobile: '+mobile+'\nAddress: '+address+'\nState: '+state+'\nDepartment: '+dept+'\nInformation needed: '+info+(rtiForm.purpose?'\nPurpose: '+rtiForm.purpose:'')+'\nDate: '+d.getDate()+'/'+(d.getMonth()+1)+'/'+d.getFullYear()+'\nOutput only the letter text.',1500);
      setRtiLetter(raw);setRtiStep(3);
    }catch(e){Alert.alert('Error: '+(e.message||'Try again.'));}
    setRtiLoading(false);
  };

  const askLawyerAdvice=async()=>{
    if(!requirePro()||!requireKey())return;
    if(!lawyerQ.trim()){Alert.alert('Describe your situation first.');return;}
    setLawyerLoading(true);setLawyerResult(null);
    try{
      const raw=await callAI('You are a senior Indian legal advisor. Respond ONLY in JSON:\n{"needed":"YES","urgency":"Immediate","reason":"Explanation","alternatives":["Alt 1","Alt 2"],"lawyerType":"Type of lawyer needed"}',lawyerQ);
      setLawyerResult(JSON.parse(raw.replace(/```json|```/g,'').trim()));
    }catch(e){Alert.alert('Error: '+(e.message||'Try again.'));}
    setLawyerLoading(false);
  };

  if(showWelcome)return(
    <SafeAreaView style={{flex:1,backgroundColor:C.bg}}>
      <Animated.View style={[st.welcome,{opacity:fadeAnim}]}>
        <View style={st.welcomeRing}><View style={st.welcomeLogo}><Text style={st.welcomeL}>L</Text></View></View>
        <Text style={st.welcomeTitle}>LAPOLU</Text>
        <Text style={st.welcomeSub}>Legal Intelligence for Every Indian</Text>
        <View style={st.welcomeDots}>
          {[0,1,2].map(i=><View key={i} style={[st.welcomeDot,i===1&&{backgroundColor:C.gold,width:20}]}/>)}
        </View>
      </Animated.View>
    </SafeAreaView>
  );

  const renderProScreen=()=>{
    if(proScreen==='riskDetector')return(
      <ScrollView style={st.scroll} contentContainerStyle={{padding:20}}>
        <TouchableOpacity onPress={()=>setProScreen(null)} style={st.backRow}><Text style={st.backArrow}>←</Text><Text style={st.backLabel}>Back</Text></TouchableOpacity>
        <Text style={st.screenH}>Risk Detector</Text>
        <Text style={st.screenSub}>Paste any agreement. AI finds hidden risks and missing clauses.</Text>
        <TextInput style={[st.input,{height:160,marginBottom:14}]} value={riskText} onChangeText={setRiskText} placeholder="Paste your agreement text here..." placeholderTextColor={C.textT} multiline/>
        <TouchableOpacity style={st.btn} onPress={runRiskDetector} disabled={riskLoading}>
          {riskLoading?<ActivityIndicator color={C.bg}/>:<Text style={st.btnText}>Analyse Agreement</Text>}
        </TouchableOpacity>
        {riskResult&&(
          <View style={{marginTop:20}}>
            <View style={[st.card,{borderLeftWidth:4,borderLeftColor:getRiskColor(riskResult.score),marginBottom:14}]}>
              <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
                <Text style={st.cardLabel}>RISK SCORE</Text>
                <View style={[st.scorePill,{backgroundColor:getRiskColor(riskResult.score)}]}><Text style={st.scorePillText}>{riskResult.score}/10</Text></View>
              </View>
              <Text style={[st.cardValue,{color:getRiskColor(riskResult.score)}]}>{riskResult.verdict}</Text>
              <View style={st.scoreTrack}><View style={[st.scoreBar,{width:riskResult.score*10+'%',backgroundColor:getRiskColor(riskResult.score)}]}/></View>
            </View>
            <View style={[st.card,{marginBottom:14}]}>
              <Text style={[st.cardLabel,{color:C.red,marginBottom:10}]}>RISKS FOUND</Text>
              {riskResult.risks.map((r,i)=><View key={i} style={st.bulletRow}><View style={[st.bullet,{backgroundColor:C.red}]}/><Text style={st.bulletText}>{r}</Text></View>)}
            </View>
            <View style={[st.card,{marginBottom:14}]}>
              <Text style={[st.cardLabel,{color:C.orange,marginBottom:10}]}>MISSING CLAUSES</Text>
              {riskResult.missing.map((m,i)=><View key={i} style={st.bulletRow}><View style={[st.bullet,{backgroundColor:C.orange}]}/><Text style={st.bulletText}>{m}</Text></View>)}
            </View>
            <View style={[st.card,{borderLeftWidth:4,borderLeftColor:C.green}]}>
              <Text style={[st.cardLabel,{color:C.green,marginBottom:8}]}>RECOMMENDATION</Text>
              <Text style={st.bodyText}>{riskResult.suggestion}</Text>
            </View>
          </View>
        )}
      </ScrollView>
    );

    if(proScreen==='docLibrary')return(
      <ScrollView style={st.scroll} contentContainerStyle={{padding:20}}>
        <TouchableOpacity onPress={()=>{setProScreen(null);setSelectedDoc(null);setDocResult('');}} style={st.backRow}><Text style={st.backArrow}>←</Text><Text style={st.backLabel}>Back</Text></TouchableOpacity>
        <Text style={st.screenH}>Document Library</Text>
        <Text style={st.screenSub}>Select a document to generate. Fill in the details and get a ready-to-use legal document.</Text>
        {DOC_LIBRARY.map((doc,i)=>(
          <TouchableOpacity key={i} style={st.docRow} onPress={()=>{setSelectedDoc(doc);setDocFields({});setDocResult('');setProScreen('docForm');}}>
            <View style={st.docRowNum}><Text style={st.docRowNumText}>{String(i+1).padStart(2,'0')}</Text></View>
            <View style={{flex:1}}>
              <Text style={st.docRowTitle}>{doc.title}</Text>
              <Text style={st.docRowSub}>{doc.subtitle}</Text>
            </View>
            <Text style={st.docRowArrow}>→</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );

    if(proScreen==='docForm'&&selectedDoc)return(
      <ScrollView style={st.scroll} contentContainerStyle={{padding:20}}>
        <TouchableOpacity onPress={()=>{setProScreen('docLibrary');setDocResult('');}} style={st.backRow}><Text style={st.backArrow}>←</Text><Text style={st.backLabel}>Document Library</Text></TouchableOpacity>
        <View style={st.docFormHead}>
          <Text style={st.docFormSub}>{selectedDoc.subtitle}</Text>
          <Text style={st.docFormTitle}>{selectedDoc.title}</Text>
        </View>
        {!docResult?(
          <View>
            <Text style={[st.screenSub,{marginBottom:20}]}>Fill in the details below to generate your document.</Text>
            {selectedDoc.fields.map(f=>(
              <View key={f.key} style={st.fieldGroup}>
                <Text style={st.fieldLabel}>{f.label}</Text>
                <TextInput style={[st.input,f.multi&&{height:80,textAlignVertical:'top'}]} value={docFields[f.key]||''} onChangeText={v=>setDocFields({...docFields,[f.key]:v})} placeholder={f.ph} placeholderTextColor={C.textT} multiline={f.multi} keyboardType={f.num?'numeric':'default'}/>
              </View>
            ))}
            <TouchableOpacity style={st.btn} onPress={generateDoc} disabled={docLoading}>
              {docLoading?<ActivityIndicator color={C.bg}/>:<Text style={st.btnText}>Generate {selectedDoc.title}</Text>}
            </TouchableOpacity>
          </View>
        ):(
          <View>
            <View style={st.docReadyTag}><Text style={st.docReadyTagText}>Document Ready</Text></View>
            <Text style={[st.screenSub,{marginBottom:14}]}>Review your document. Copy and paste into Google Docs or Word to edit and print.</Text>
            <ScrollView style={st.docPreview} nestedScrollEnabled><Text style={st.docPreviewText}>{docResult}</Text></ScrollView>
            <TouchableOpacity style={st.btn} onPress={()=>Alert.alert('How to Use','Copy the text above and paste it in Google Docs or Microsoft Word to edit, format and print your document.')}><Text style={st.btnText}>How to Use This Document</Text></TouchableOpacity>
            <TouchableOpacity style={[st.btnOutline,{marginTop:10}]} onPress={()=>setDocResult('')}><Text style={st.btnOutlineText}>Edit and Regenerate</Text></TouchableOpacity>
            <TouchableOpacity style={[st.btnOutline,{marginTop:8}]} onPress={()=>{setProScreen('docLibrary');setDocResult('');setSelectedDoc(null);}}><Text style={st.btnOutlineText}>Generate Another Document</Text></TouchableOpacity>
            <Text style={st.tipText}>This document is AI-generated. For important matters, have a lawyer review before signing.</Text>
          </View>
        )}
      </ScrollView>
    );

    if(proScreen==='reminders')return(
      <ScrollView style={st.scroll} contentContainerStyle={{padding:20}}>
        <TouchableOpacity onPress={()=>setProScreen(null)} style={st.backRow}><Text style={st.backArrow}>←</Text><Text style={st.backLabel}>Back</Text></TouchableOpacity>
        <Text style={st.screenH}>Legal Reminders</Text>
        <Text style={st.screenSub}>Track court dates, rent renewals, agreement deadlines.</Text>
        <View style={[st.card,{marginBottom:20}]}>
          <Text style={[st.cardLabel,{marginBottom:12}]}>ADD REMINDER</Text>
          <TextInput style={[st.input,{marginBottom:10}]} value={newRemTitle} onChangeText={setNewRemTitle} placeholder="e.g. Court hearing — Session Court" placeholderTextColor={C.textT}/>
          <TextInput style={[st.input,{marginBottom:12}]} value={newRemDate} onChangeText={setNewRemDate} placeholder="Date e.g. 15 May 2025" placeholderTextColor={C.textT}/>
          <TouchableOpacity style={st.btn} onPress={()=>{if(!newRemTitle||!newRemDate){Alert.alert('Fill title and date.');return;}setReminders(p=>[{id:Date.now(),title:newRemTitle,date:newRemDate,done:false},...p]);setNewRemTitle('');setNewRemDate('');}}><Text style={st.btnText}>Add Reminder</Text></TouchableOpacity>
        </View>
        {reminders.map(r=>(
          <View key={r.id} style={[st.card,{flexDirection:'row',alignItems:'center',marginBottom:10,opacity:r.done?0.5:1}]}>
            <TouchableOpacity onPress={()=>setReminders(p=>p.map(x=>x.id===r.id?{...x,done:!x.done}:x))} style={{marginRight:12}}>
              <View style={[st.checkbox,r.done&&{backgroundColor:C.purple,borderColor:C.purple}]}>{r.done&&<Text style={{color:'#fff',fontSize:11,fontWeight:'700'}}>v</Text>}</View>
            </TouchableOpacity>
            <View style={{flex:1}}>
              <Text style={[st.bodyText,{fontWeight:'600'}]}>{r.title}</Text>
              <Text style={[st.smallText,{marginTop:2}]}>{r.date}</Text>
            </View>
            <TouchableOpacity onPress={()=>setReminders(p=>p.filter(x=>x.id!==r.id))}><Text style={{color:C.red,fontSize:20,fontWeight:'300'}}>x</Text></TouchableOpacity>
          </View>
        ))}
        {reminders.length===0&&<Text style={[st.screenSub,{textAlign:'center',marginTop:20}]}>No reminders. Add one above.</Text>}
      </ScrollView>
    );

    if(proScreen==='dashboard')return(
      <ScrollView style={st.scroll} contentContainerStyle={{padding:20}}>
        <TouchableOpacity onPress={()=>setProScreen(null)} style={st.backRow}><Text style={st.backArrow}>←</Text><Text style={st.backLabel}>Back</Text></TouchableOpacity>
        <Text style={st.screenH}>Legal Dashboard</Text>
        <Text style={st.screenSub}>All your queries are saved automatically when using PRO AI.</Text>
        {savedCases.length===0
          ?<View style={[st.card,{alignItems:'center',paddingVertical:40}]}><Text style={[st.bodyText,{marginBottom:6}]}>No cases yet.</Text><Text style={st.smallText}>Ask a question on the AI tab to start.</Text><TouchableOpacity style={[st.btn,{marginTop:16}]} onPress={()=>setActiveTab('ai')}><Text style={st.btnText}>Go to Ask AI</Text></TouchableOpacity></View>
          :savedCases.map(c=>(
            <View key={c.id} style={[st.card,{marginBottom:10}]}>
              <Text style={[st.bodyText,{fontWeight:'600',marginBottom:8}]}>{c.question}</Text>
              <View style={{flexDirection:'row',gap:8,flexWrap:'wrap'}}>
                <View style={st.tag}><Text style={st.tagText}>{c.topic.split(' ')[0]}</Text></View>
                {c.score&&<View style={[st.tag,{borderColor:getRiskColor(c.score)}]}><Text style={[st.tagText,{color:getRiskColor(c.score)}]}>Risk {c.score}/10</Text></View>}
                <View style={st.tag}><Text style={st.tagText}>{c.date}</Text></View>
              </View>
            </View>
          ))
        }
      </ScrollView>
    );

    if(proScreen==='lawyerAdvice')return(
      <ScrollView style={st.scroll} contentContainerStyle={{padding:20}}>
        <TouchableOpacity onPress={()=>{setProScreen(null);setLawyerResult(null);}} style={st.backRow}><Text style={st.backArrow}>←</Text><Text style={st.backLabel}>Back</Text></TouchableOpacity>
        <Text style={st.screenH}>Do You Need a Lawyer?</Text>
        <Text style={st.screenSub}>Describe your situation. AI tells you whether you need professional help.</Text>
        <TextInput style={[st.input,{height:120,marginBottom:14}]} value={lawyerQ} onChangeText={setLawyerQ} placeholder="Describe your legal situation in detail..." placeholderTextColor={C.textT} multiline/>
        <TouchableOpacity style={st.btn} onPress={askLawyerAdvice} disabled={lawyerLoading}>
          {lawyerLoading?<ActivityIndicator color={C.bg}/>:<Text style={st.btnText}>Get Assessment</Text>}
        </TouchableOpacity>
        {lawyerResult&&(
          <View style={{marginTop:20}}>
            <View style={[st.card,{borderLeftWidth:4,borderLeftColor:lawyerResult.needed==='YES'?C.red:lawyerResult.needed==='MAYBE'?C.orange:C.green,marginBottom:14}]}>
              <Text style={[st.cardLabel,{color:lawyerResult.needed==='YES'?C.red:lawyerResult.needed==='MAYBE'?C.orange:C.green,marginBottom:6}]}>
                {lawyerResult.needed==='YES'?'LAWYER REQUIRED':lawyerResult.needed==='MAYBE'?'POSSIBLY REQUIRED':'LAWYER NOT REQUIRED'}
              </Text>
              <Text style={[st.bodyText,{marginBottom:10}]}>{lawyerResult.reason}</Text>
              <View style={st.tag}><Text style={st.tagText}>Urgency: {lawyerResult.urgency}</Text></View>
              {lawyerResult.lawyerType&&<Text style={[st.smallText,{marginTop:8}]}>Type: {lawyerResult.lawyerType}</Text>}
            </View>
            {lawyerResult.alternatives&&lawyerResult.alternatives.length>0&&(
              <View style={st.card}>
                <Text style={[st.cardLabel,{marginBottom:10}]}>ALTERNATIVES</Text>
                {lawyerResult.alternatives.map((a,i)=><View key={i} style={st.bulletRow}><View style={st.bullet}/><Text style={st.bulletText}>{a}</Text></View>)}
              </View>
            )}
          </View>
        )}
      </ScrollView>
    );
    return null;
  };

  return(
    <SafeAreaView style={st.safe}>
      <View style={st.header}>
        <View style={st.headerLogo}><Text style={st.headerL}>L</Text></View>
        <View style={{flex:1}}>
          <Text style={st.headerTitle}>LAPOLU</Text>
          <Text style={st.headerSub}>Legal Intelligence</Text>
        </View>
        {isPro
          ?<View style={st.proPill}><Text style={st.proPillText}>PRO</Text></View>
          :<TouchableOpacity style={st.upgradeBtn} onPress={()=>setShowProModal(true)}><Text style={st.upgradeBtnText}>Upgrade</Text></TouchableOpacity>
        }
        <TouchableOpacity style={st.keyIcon} onPress={()=>setShowApiInput(!showApiInput)}>
          <Text style={st.keyIconText}>o</Text>
        </TouchableOpacity>
      </View>

      {showApiInput&&(
        <View style={st.apiBar}>
          <Text style={st.apiBarLabel}>ANTHROPIC API KEY</Text>
          <TextInput style={st.apiBarInput} value={apiKey} onChangeText={setApiKey} placeholder="sk-ant-api03-..." secureTextEntry placeholderTextColor={C.textT}/>
          <TouchableOpacity style={st.apiBarBtn} onPress={()=>setShowApiInput(false)}><Text style={st.apiBarBtnText}>Save</Text></TouchableOpacity>
        </View>
      )}

      <View style={st.tabBar}>
        {[{id:'ai',label:'Ask AI'},{id:'rti',label:'File RTI'},{id:'pro',label:'PRO'}].map(tab=>(
          <TouchableOpacity key={tab.id} style={[st.tabItem,activeTab===tab.id&&st.tabItemActive]} onPress={()=>{setActiveTab(tab.id);setProScreen(null);}}>
            <Text style={[st.tabLabel,activeTab===tab.id&&st.tabLabelActive]}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS==='ios'?'padding':undefined}>
        {activeTab==='pro'&&proScreen?renderProScreen():(
          <ScrollView style={st.scroll} showsVerticalScrollIndicator={false}>

            {activeTab==='ai'&&(
              <View style={st.page}>
                {!isPro&&(
                  <TouchableOpacity style={st.proTeaser} onPress={()=>setShowProModal(true)}>
                    <View><Text style={st.proTeaserTitle}>Upgrade to PRO</Text><Text style={st.proTeaserSub}>Roadmap · Risk Score · Smart Advisor</Text></View>
                    <View style={st.proTeaserBtn}><Text style={st.proTeaserBtnText}>Rs.299</Text></View>
                  </TouchableOpacity>
                )}

                <Text style={st.sectionLabel}>LEGAL AREA</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom:20}}>
                  {TOPICS.map(t=>(
                    <TouchableOpacity key={t.value} style={[st.chip,topic===t.value&&st.chipOn]} onPress={()=>setTopic(t.value)}>
                      <Text style={[st.chipText,topic===t.value&&st.chipTextOn]}>{t.label}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                <Text style={st.sectionLabel}>LANGUAGE</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom:20}}>
                  {LANGUAGES.map(l=>(
                    <TouchableOpacity key={l} style={[st.chip,lang===l&&st.chipOn]} onPress={()=>setLang(l)}>
                      <Text style={[st.chipText,lang===l&&st.chipTextOn]}>{l}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                {attachments.length>0&&(
                  <View style={st.attList}>
                    {attachments.map(a=>(
                      <View key={a.id} style={st.attItem}>
                        <View style={st.attItemIcon}><Text style={st.attItemIconText}>{a.type==='image'?'IMG':a.type==='pdf'?'PDF':'DOC'}</Text></View>
                        <View style={{flex:1}}><Text style={st.attItemName} numberOfLines={1}>{a.name}</Text><Text style={st.attItemSize}>{a.size}</Text></View>
                        <TouchableOpacity onPress={()=>removeAtt(a.id)}><Text style={{color:C.red,fontSize:20,fontWeight:'300'}}>x</Text></TouchableOpacity>
                      </View>
                    ))}
                  </View>
                )}

                <View style={st.inputBox}>
                  <TextInput style={st.textArea} value={question} onChangeText={setQuestion} placeholder="Describe your legal situation or question..." placeholderTextColor={C.textT} multiline numberOfLines={5}/>
                  <View style={st.inputActions}>
                    <View style={{flexDirection:'row',gap:8}}>
                      <TouchableOpacity style={[st.iconBtn,isListening&&st.iconBtnActive]} onPress={toggleVoice}>
                        <Text style={[st.iconBtnText,isListening&&{color:C.red}]}>{isListening?'*':'mic'}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={st.iconBtn} onPress={handleAttachment}>
                        <Text style={st.iconBtnText}>+</Text>
                      </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={st.sendBtn} onPress={askAI} disabled={loading}>
                      {loading?<ActivityIndicator color={C.bg} size="small"/>:<Text style={st.sendBtnText}>{'Ask LAPOLU'+(isPro?' PRO':'')}</Text>}
                    </TouchableOpacity>
                  </View>
                  {isListening&&<Text style={st.listeningText}>Listening... speak your question</Text>}
                </View>

                {answer&&answer.type==='basic'&&(
                  <View style={st.answerCard}>
                    <View style={st.answerCardHead}>
                      <Text style={st.answerCardTitle}>Legal Analysis</Text>
                      <View style={st.answerCardBadge}><Text style={st.answerCardBadgeText}>BNS BNSS BSA</Text></View>
                    </View>
                    <Text style={st.answerText}>{answer.text}</Text>
                    <Text style={st.disclaimerText}>General legal information only — not legal advice. Consult a Bar Council advocate.</Text>
                    {!isPro&&<TouchableOpacity style={st.upgradeHint} onPress={()=>setShowProModal(true)}><Text style={st.upgradeHintText}>Get Legal Roadmap and Risk Score with PRO</Text></TouchableOpacity>}
                  </View>
                )}

                {answer&&answer.type==='pro'&&(
                  <View>
                    <View style={st.answerCard}>
                      <View style={st.answerCardHead}>
                        <Text style={st.answerCardTitle}>Legal Analysis</Text>
                        <View style={[st.answerCardBadge,{backgroundColor:C.purpleD}]}><Text style={st.answerCardBadgeText}>PRO</Text></View>
                      </View>
                      <Text style={st.answerText}>{answer.answer}</Text>
                      <Text style={st.disclaimerText}>General legal information only — not legal advice.</Text>
                    </View>
                    {answer.followup&&(
                      <View style={st.followCard}>
                        <Text style={st.followLabel}>LAPOLU ASKS</Text>
                        <Text style={st.followQ}>{answer.followup}</Text>
                        <TextInput style={st.followInput} placeholder="Your answer..." placeholderTextColor={C.textT} onChangeText={v=>setQuestion(q=>q+'\n'+v)} multiline/>
                      </View>
                    )}
                    {answer.score&&(
                      <View style={[st.card,{borderLeftWidth:4,borderLeftColor:getRiskColor(answer.score),marginBottom:14}]}>
                        <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
                          <Text style={st.cardLabel}>LEGAL SAFETY SCORE</Text>
                          <View style={[st.scorePill,{backgroundColor:getRiskColor(answer.score)}]}><Text style={st.scorePillText}>{answer.score}/10</Text></View>
                        </View>
                        <Text style={[st.cardValue,{color:getRiskColor(answer.score),marginBottom:10}]}>{answer.scoreLabel}</Text>
                        <View style={st.scoreTrack}><View style={[st.scoreBar,{width:answer.score*10+'%',backgroundColor:getRiskColor(answer.score)}]}/></View>
                      </View>
                    )}
                    {answer.roadmap&&answer.roadmap.length>0&&(
                      <View style={[st.card,{marginBottom:14}]}>
                        <Text style={[st.cardLabel,{marginBottom:16}]}>YOUR LEGAL ROADMAP</Text>
                        {answer.roadmap.map((step,i)=>(
                          <View key={i} style={st.roadStep}>
                            <View style={st.roadDot}><Text style={st.roadDotText}>{i+1}</Text></View>
                            <Text style={st.roadText}>{step.replace(/^Step \d+:?\s*/i,'')}</Text>
                          </View>
                        ))}
                      </View>
                    )}
                    {answer.lawyerNeeded&&(
                      <View style={[st.card,{borderLeftWidth:4,borderLeftColor:answer.lawyerNeeded==='YES'?C.red:C.green,marginBottom:14}]}>
                        <Text style={[st.cardLabel,{color:answer.lawyerNeeded==='YES'?C.red:C.green,marginBottom:6}]}>{answer.lawyerNeeded==='YES'?'LAWYER RECOMMENDED':'YOU MAY HANDLE THIS'}</Text>
                        <Text style={st.bodyText}>{answer.lawyerReason}</Text>
                      </View>
                    )}
                  </View>
                )}

                {answer&&answer.type==='error'&&(
                  <View style={[st.card,{borderLeftWidth:4,borderLeftColor:C.red}]}><Text style={{color:C.red,fontSize:13,lineHeight:20}}>{answer.text}</Text></View>
                )}

                <Text style={[st.sectionLabel,{marginTop:4}]}>QUICK QUERIES</Text>
                {['What are my rights if arrested under BNSS?','How to file FIR or e-FIR in India?','What are tenant rights and eviction laws?','Consumer rights for defective product?','How to file an RTI application?'].map(q=>(
                  <TouchableOpacity key={q} style={st.quickRow} onPress={()=>setQuestion(q)}>
                    <Text style={st.quickText}>{q}</Text>
                    <Text style={st.quickArrow}>-&gt;</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {activeTab==='rti'&&(
              <View style={st.page}>
                <Text style={st.screenH}>File RTI Application</Text>
                <Text style={st.screenSub}>Fill in your details. LAPOLU AI generates a complete formal RTI letter under the Right to Information Act 2005.</Text>
                {rtiStep===1&&(
                  <View>
                    {[{key:'name',label:'Full Name',ph:'Your full name'},{key:'mobile',label:'Mobile Number',ph:'10-digit number',num:true},{key:'address',label:'Your Address',ph:'Full address with PIN code'},{key:'state',label:'State',ph:'e.g. Karnataka'},{key:'dept',label:'Department / Authority',ph:'e.g. Municipal Corporation'},{key:'info',label:'Information Requested',ph:'Describe clearly what you are seeking...',multi:true},{key:'purpose',label:'Purpose (optional)',ph:'e.g. To verify status of my application'}].map(f=>(
                      <View key={f.key} style={st.fieldGroup}>
                        <Text style={st.fieldLabel}>{f.label}</Text>
                        <TextInput style={[st.input,f.multi&&{height:80,textAlignVertical:'top'}]} value={rtiForm[f.key]} onChangeText={v=>setRtiForm({...rtiForm,[f.key]:v})} placeholder={f.ph} placeholderTextColor={C.textT} multiline={f.multi} keyboardType={f.num?'phone-pad':'default'}/>
                      </View>
                    ))}
                    <TouchableOpacity style={st.btn} onPress={generateRTI} disabled={rtiLoading}>{rtiLoading?<ActivityIndicator color={C.bg}/>:<Text style={st.btnText}>Generate RTI Letter</Text>}</TouchableOpacity>
                  </View>
                )}
                {rtiStep===3&&(
                  <View>
                    <View style={st.docReadyTag}><Text style={st.docReadyTagText}>RTI Application Ready</Text></View>
                    <ScrollView style={st.docPreview} nestedScrollEnabled><Text style={st.docPreviewText}>{rtiLetter}</Text></ScrollView>
                    <TouchableOpacity style={st.btn} onPress={()=>Linking.openURL('https://rtionline.gov.in')}><Text style={st.btnText}>Submit on rtionline.gov.in</Text></TouchableOpacity>
                    <TouchableOpacity style={[st.btnOutline,{marginTop:10}]} onPress={()=>setRtiStep(1)}><Text style={st.btnOutlineText}>Edit Details</Text></TouchableOpacity>
                    <Text style={st.tipText}>Open the official RTI portal, create a free account, select your department and paste this letter in the request field.</Text>
                  </View>
                )}
              </View>
            )}

            {activeTab==='pro'&&(
              <View style={st.page}>
                <View style={st.proHero}>
                  <Text style={st.proHeroEye}>LAPOLU PRO</Text>
                  <Text style={st.proHeroPrice}>Rs.299</Text>
                  <Text style={st.proHeroPer}>per month</Text>
                  <Text style={st.proHeroCaption}>India's most powerful Legal AI. Cancel anytime.</Text>
                  {!isPro?<TouchableOpacity style={st.proHeroBtn} onPress={()=>setShowProModal(true)}><Text style={st.proHeroBtnText}>Upgrade Now</Text></TouchableOpacity>
                    :<View style={st.proHeroActive}><Text style={st.proHeroActiveText}>Active Subscription</Text></View>}
                </View>

                <Text style={st.sectionLabel}>FEATURES</Text>
                {PRO_FEATURES.map((f,i)=>(
                  <TouchableOpacity key={i} style={[st.proFeature,isPro&&{borderLeftWidth:2,borderLeftColor:C.purple}]} onPress={()=>handleProTap(f.action)}>
                    <View style={st.proFeatureNum}><Text style={st.proFeatureNumText}>{String(i+1).padStart(2,'0')}</Text></View>
                    <View style={{flex:1}}>
                      <Text style={st.proFeatureTitle}>{f.title}</Text>
                      <Text style={st.proFeatureDesc}>{f.desc}</Text>
                    </View>
                    <Text style={isPro?st.proFeatureArrow:st.proFeatureLock}>{isPro?'->':'-'}</Text>
                  </TouchableOpacity>
                ))}

                <View style={st.compareBox}>
                  <View style={st.compareHead}>
                    <Text style={[st.compareCell,{flex:2,color:C.textS}]}>Feature</Text>
                    <Text style={[st.compareCell,{color:C.textT}]}>Free</Text>
                    <Text style={[st.compareCell,{color:C.gold}]}>PRO</Text>
                  </View>
                  {[['Basic AI answers','Yes','Yes'],['Smart follow-up','No','Yes'],['Legal Roadmap','No','Yes'],['Safety Score','No','Yes'],['Risk Detector','No','Yes'],['Document Engine','No','Yes'],['Priority AI','No','Yes']].map(([feat,free,pro],i)=>(
                    <View key={i} style={[st.compareRow,i%2===1&&{backgroundColor:C.surface2}]}>
                      <Text style={[st.compareCell,{flex:2,color:C.textS,fontSize:12}]}>{feat}</Text>
                      <Text style={[st.compareCell,{color:free==='Yes'?C.green:C.textT}]}>{free}</Text>
                      <Text style={[st.compareCell,{color:pro==='Yes'?C.green:C.textT,fontWeight:'700'}]}>{pro}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            <View style={st.footer}>
              <View style={st.footerLogo}><Text style={st.footerL}>L</Text></View>
              <Text style={st.footerTitle}>LAPOLU</Text>
              <Text style={st.footerSub}>Legal Intelligence for Every Indian</Text>
              <Text style={st.footerEmail}>help@lapolu.com</Text>
              <View style={st.footerLinks}>
                {['privacy','terms','disclaimer','refund','advocate'].map(key=>(
                  <TouchableOpacity key={key} style={st.footerLink} onPress={()=>setLegalModal(key)}>
                    <Text style={st.footerLinkText}>{LEGAL_DATA[key].title}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={st.footerNote}>General legal information only. Not legal advice.</Text>
            </View>

          </ScrollView>
        )}
      </KeyboardAvoidingView>

      <Modal visible={!!legalModal} animationType="slide" transparent onRequestClose={()=>setLegalModal(null)}>
        <View style={st.modalOverlay}>
          <View style={st.modalSheet}>
            <View style={st.modalHandle}/>
            <View style={st.modalSheetHead}>
              <Text style={st.modalSheetTitle}>{legalModal?LEGAL_DATA[legalModal].title:''}</Text>
              <TouchableOpacity onPress={()=>setLegalModal(null)}><Text style={{color:C.textS,fontSize:24,fontWeight:'300'}}>x</Text></TouchableOpacity>
            </View>
            <ScrollView style={{padding:20}}>
              <Text style={st.modalSheetBody}>{legalModal?LEGAL_DATA[legalModal].content:''}</Text>
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal visible={showProModal} animationType="slide" transparent onRequestClose={()=>setShowProModal(false)}>
        <View style={st.modalOverlay}>
          <View style={st.proSheet}>
            <View style={st.modalHandle}/>
            <View style={st.proSheetHead}>
              <View><Text style={st.proSheetEye}>LAPOLU PRO</Text><Text style={st.proSheetPrice}>Rs.299 <Text style={st.proSheetPer}>/ month</Text></Text></View>
              <TouchableOpacity onPress={()=>setShowProModal(false)}><Text style={{color:C.textS,fontSize:24,fontWeight:'300'}}>x</Text></TouchableOpacity>
            </View>
            <ScrollView style={{maxHeight:360,paddingHorizontal:24}}>
              <Text style={[st.smallText,{marginBottom:16}]}>Cancel anytime. No questions asked.</Text>
              {PRO_FEATURES.slice(0,6).map((f,i)=>(
                <View key={i} style={st.proSheetFeature}>
                  <View style={st.proSheetDot}/>
                  <Text style={st.proSheetFeatureText}>{f.title}</Text>
                </View>
              ))}
              <Text style={[st.smallText,{marginTop:8,marginBottom:8}]}>And 4 more features...</Text>
            </ScrollView>
            <View style={{padding:20}}>
              <TouchableOpacity style={st.proSheetBtn} onPress={()=>{setIsPro(true);setShowProModal(false);Alert.alert('Welcome to LAPOLU PRO','All 10 PRO features are now unlocked.');}}>
                <Text style={st.proSheetBtnText}>Activate PRO - Rs.299/month</Text>
              </TouchableOpacity>
              <Text style={st.proSheetNote}>Recurring monthly subscription. Payment via UPI, Card or Net Banking. Cancel anytime from settings.</Text>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const st=StyleSheet.create({
  safe:{flex:1,backgroundColor:C.bg},
  welcome:{flex:1,backgroundColor:C.bg,alignItems:'center',justifyContent:'center'},
  welcomeRing:{width:100,height:100,borderRadius:50,borderWidth:1,borderColor:C.border,alignItems:'center',justifyContent:'center',marginBottom:24},
  welcomeLogo:{width:72,height:72,borderRadius:36,backgroundColor:C.surface2,alignItems:'center',justifyContent:'center'},
  welcomeL:{color:C.gold,fontSize:36,fontWeight:'900'},
  welcomeTitle:{color:C.textP,fontSize:28,fontWeight:'800',letterSpacing:6,marginBottom:8},
  welcomeSub:{color:C.textT,fontSize:13,letterSpacing:1},
  welcomeDots:{flexDirection:'row',gap:8,marginTop:40},
  welcomeDot:{width:8,height:8,borderRadius:4,backgroundColor:C.surface3},
  header:{backgroundColor:C.surface,flexDirection:'row',alignItems:'center',paddingHorizontal:20,paddingVertical:14,borderBottomWidth:1,borderBottomColor:C.border},
  headerLogo:{width:36,height:36,borderRadius:10,backgroundColor:C.surface2,borderWidth:1,borderColor:C.border,alignItems:'center',justifyContent:'center',marginRight:12},
  headerL:{color:C.gold,fontSize:18,fontWeight:'900'},
  headerTitle:{color:C.textP,fontSize:17,fontWeight:'700',letterSpacing:1},
  headerSub:{color:C.textT,fontSize:10,letterSpacing:0.5,marginTop:1},
  proPill:{backgroundColor:C.purpleD,borderRadius:6,paddingHorizontal:10,paddingVertical:4,marginRight:8,borderWidth:1,borderColor:C.purple},
  proPillText:{color:C.gold,fontSize:10,fontWeight:'800',letterSpacing:1},
  upgradeBtn:{backgroundColor:C.gold,borderRadius:7,paddingHorizontal:12,paddingVertical:5,marginRight:8},
  upgradeBtnText:{color:C.bg,fontSize:11,fontWeight:'800'},
  keyIcon:{width:34,height:34,borderRadius:8,backgroundColor:C.surface2,borderWidth:1,borderColor:C.border,alignItems:'center',justifyContent:'center'},
  keyIconText:{color:C.textS,fontSize:14,fontWeight:'700'},
  apiBar:{backgroundColor:C.surface,padding:16,borderBottomWidth:1,borderBottomColor:C.border},
  apiBarLabel:{color:C.textT,fontSize:10,fontWeight:'700',letterSpacing:2,marginBottom:8},
  apiBarInput:{backgroundColor:C.surface2,borderWidth:1,borderColor:C.border,borderRadius:8,padding:10,fontSize:13,color:C.textP,marginBottom:10},
  apiBarBtn:{backgroundColor:C.purple,borderRadius:8,padding:10,alignItems:'center'},
  apiBarBtnText:{color:C.white,fontSize:13,fontWeight:'700'},
  tabBar:{flexDirection:'row',backgroundColor:C.surface,borderBottomWidth:1,borderBottomColor:C.border},
  tabItem:{flex:1,paddingVertical:13,alignItems:'center'},
  tabItemActive:{borderBottomWidth:2,borderBottomColor:C.purple},
  tabLabel:{fontSize:12,color:C.textT,fontWeight:'500',letterSpacing:0.5},
  tabLabelActive:{color:C.purple,fontWeight:'700'},
  scroll:{flex:1},
  page:{padding:20},
  sectionLabel:{fontSize:10,fontWeight:'700',letterSpacing:2,color:C.textT,marginBottom:12,marginTop:4},
  chip:{borderWidth:1,borderColor:C.border,borderRadius:20,paddingHorizontal:14,paddingVertical:6,marginRight:8,backgroundColor:C.surface},
  chipOn:{backgroundColor:C.purple,borderColor:C.purple},
  chipText:{fontSize:12,color:C.textS,fontWeight:'500'},
  chipTextOn:{color:C.white,fontWeight:'600'},
  proTeaser:{backgroundColor:C.surface2,borderWidth:1,borderColor:C.purpleD,borderRadius:12,padding:14,marginBottom:20,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},
  proTeaserTitle:{color:C.textP,fontSize:13,fontWeight:'700',marginBottom:2},
  proTeaserSub:{color:C.textT,fontSize:11},
  proTeaserBtn:{backgroundColor:C.gold,borderRadius:7,paddingHorizontal:14,paddingVertical:6},
  proTeaserBtnText:{color:C.bg,fontSize:12,fontWeight:'800'},
  attList:{marginBottom:14},
  attItem:{flexDirection:'row',alignItems:'center',gap:10,backgroundColor:C.surface2,borderRadius:10,padding:12,marginBottom:8,borderWidth:1,borderColor:C.border},
  attItemIcon:{width:36,height:36,borderRadius:8,backgroundColor:C.purpleD,alignItems:'center',justifyContent:'center'},
  attItemIconText:{color:C.gold,fontSize:9,fontWeight:'800',letterSpacing:0.5},
  attItemName:{color:C.textP,fontSize:13,fontWeight:'500'},
  attItemSize:{color:C.textT,fontSize:11,marginTop:1},
  inputBox:{backgroundColor:C.surface,borderWidth:1,borderColor:C.border,borderRadius:16,padding:16,marginBottom:20},
  textArea:{fontSize:14,color:C.textP,minHeight:110,textAlignVertical:'top',lineHeight:22},
  inputActions:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:12,paddingTop:12,borderTopWidth:1,borderTopColor:C.border},
  iconBtn:{width:40,height:40,borderRadius:20,backgroundColor:C.surface2,borderWidth:1,borderColor:C.border,alignItems:'center',justifyContent:'center'},
  iconBtnActive:{borderColor:C.red,backgroundColor:C.redBg},
  iconBtnText:{color:C.textS,fontSize:13,fontWeight:'600'},
  sendBtn:{backgroundColor:C.purple,borderRadius:10,paddingHorizontal:20,paddingVertical:10,minWidth:120,alignItems:'center'},
  sendBtnText:{color:C.white,fontSize:13,fontWeight:'700'},
  listeningText:{color:C.red,fontSize:11,marginTop:8,textAlign:'center'},
  answerCard:{backgroundColor:C.surface,borderWidth:1,borderColor:C.border,borderRadius:16,padding:18,marginBottom:14},
  answerCardHead:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:12},
  answerCardTitle:{color:C.textP,fontSize:14,fontWeight:'700',letterSpacing:0.5},
  answerCardBadge:{backgroundColor:C.surface2,borderRadius:6,paddingHorizontal:8,paddingVertical:3},
  answerCardBadgeText:{color:C.textT,fontSize:10,fontWeight:'600',letterSpacing:1},
  answerText:{color:C.textS,fontSize:14,lineHeight:22},
  disclaimerText:{color:C.textT,fontSize:11,marginTop:12,lineHeight:17},
  upgradeHint:{backgroundColor:C.surface2,borderRadius:8,padding:10,marginTop:12,borderWidth:1,borderColor:C.purpleD},
  upgradeHintText:{color:C.purple,fontSize:11,fontWeight:'600',textAlign:'center'},
  followCard:{backgroundColor:C.surface2,borderWidth:1,borderColor:C.purpleD,borderRadius:14,padding:14,marginBottom:14},
  followLabel:{color:C.purple,fontSize:10,fontWeight:'700',letterSpacing:2,marginBottom:8},
  followQ:{color:C.textP,fontSize:14,lineHeight:21,marginBottom:12},
  followInput:{backgroundColor:C.surface,borderWidth:1,borderColor:C.border,borderRadius:8,padding:10,fontSize:13,color:C.textP,minHeight:60},
  card:{backgroundColor:C.surface,borderWidth:1,borderColor:C.border,borderRadius:14,padding:16,marginBottom:14},
  cardLabel:{color:C.textT,fontSize:10,fontWeight:'700',letterSpacing:2},
  cardValue:{fontSize:14,fontWeight:'600',marginBottom:4},
  scorePill:{borderRadius:20,paddingHorizontal:12,paddingVertical:4},
  scorePillText:{color:C.white,fontSize:15,fontWeight:'800'},
  scoreTrack:{backgroundColor:C.surface2,borderRadius:6,height:6,overflow:'hidden'},
  scoreBar:{height:6,borderRadius:6},
  roadStep:{flexDirection:'row',alignItems:'flex-start',gap:12,marginBottom:14},
  roadDot:{width:24,height:24,borderRadius:12,backgroundColor:C.purple,alignItems:'center',justifyContent:'center',flexShrink:0},
  roadDotText:{color:C.white,fontSize:11,fontWeight:'700'},
  roadText:{flex:1,color:C.textS,fontSize:13,lineHeight:20,paddingTop:2},
  bulletRow:{flexDirection:'row',gap:10,marginBottom:8,alignItems:'flex-start'},
  bullet:{width:6,height:6,borderRadius:3,backgroundColor:C.purple,marginTop:6,flexShrink:0},
  bulletText:{flex:1,color:C.textS,fontSize:13,lineHeight:20},
  quickRow:{backgroundColor:C.surface,borderWidth:1,borderColor:C.border,borderRadius:10,padding:14,marginBottom:8,flexDirection:'row',alignItems:'center'},
  quickText:{flex:1,color:C.textS,fontSize:13,lineHeight:19},
  quickArrow:{color:C.purple,fontSize:14,fontWeight:'700'},
  screenH:{color:C.textP,fontSize:22,fontWeight:'800',marginBottom:6,letterSpacing:-0.3},
  screenSub:{color:C.textT,fontSize:13,lineHeight:19,marginBottom:20},
  fieldGroup:{marginBottom:14},
  fieldLabel:{color:C.textS,fontSize:11,fontWeight:'600',letterSpacing:0.5,marginBottom:6},
  input:{backgroundColor:C.surface,borderWidth:1,borderColor:C.border,borderRadius:10,padding:12,fontSize:13,color:C.textP},
  btn:{backgroundColor:C.purple,borderRadius:12,padding:14,alignItems:'center'},
  btnText:{color:C.white,fontSize:14,fontWeight:'700'},
  btnOutline:{backgroundColor:'transparent',borderWidth:1,borderColor:C.border,borderRadius:12,padding:13,alignItems:'center'},
  btnOutlineText:{color:C.textS,fontSize:13,fontWeight:'600'},
  tipText:{color:C.textT,fontSize:11,lineHeight:17,marginTop:12,padding:12,backgroundColor:C.surface2,borderRadius:8},
  backRow:{flexDirection:'row',alignItems:'center',gap:6,marginBottom:20},
  backArrow:{color:C.purple,fontSize:18,fontWeight:'700'},
  backLabel:{color:C.purple,fontSize:13,fontWeight:'600'},
  docRow:{backgroundColor:C.surface,borderWidth:1,borderColor:C.border,borderRadius:12,padding:16,marginBottom:10,flexDirection:'row',alignItems:'center',gap:14},
  docRowNum:{width:36,height:36,borderRadius:8,backgroundColor:C.surface2,borderWidth:1,borderColor:C.border,alignItems:'center',justifyContent:'center'},
  docRowNumText:{color:C.textT,fontSize:11,fontWeight:'700',letterSpacing:1},
  docRowTitle:{color:C.textP,fontSize:14,fontWeight:'700',marginBottom:2},
  docRowSub:{color:C.textT,fontSize:11,letterSpacing:0.5},
  docRowArrow:{color:C.purple,fontSize:18,fontWeight:'700'},
  docFormHead:{backgroundColor:C.surface,borderWidth:1,borderColor:C.border,borderRadius:14,padding:18,marginBottom:20},
  docFormSub:{color:C.purple,fontSize:10,fontWeight:'700',letterSpacing:2,marginBottom:4},
  docFormTitle:{color:C.textP,fontSize:20,fontWeight:'800'},
  docReadyTag:{backgroundColor:C.greenBg,borderRadius:8,paddingHorizontal:12,paddingVertical:7,alignSelf:'flex-start',marginBottom:10,borderWidth:1,borderColor:C.green},
  docReadyTagText:{color:C.green,fontSize:11,fontWeight:'700',letterSpacing:0.5},
  docPreview:{backgroundColor:C.surface,borderWidth:1,borderColor:C.border,borderRadius:12,padding:16,maxHeight:300,marginBottom:14},
  docPreviewText:{color:C.textS,fontSize:12,lineHeight:20},
  proHero:{backgroundColor:C.surface,borderWidth:1,borderColor:C.border,borderRadius:20,padding:28,alignItems:'center',marginBottom:24},
  proHeroEye:{color:C.purple,fontSize:11,fontWeight:'700',letterSpacing:3,marginBottom:12},
  proHeroPrice:{color:C.textP,fontSize:40,fontWeight:'900',letterSpacing:-1},
  proHeroPer:{color:C.textT,fontSize:13,marginBottom:8},
  proHeroCaption:{color:C.textT,fontSize:12,textAlign:'center',marginBottom:20},
  proHeroBtn:{backgroundColor:C.gold,borderRadius:12,paddingHorizontal:32,paddingVertical:14},
  proHeroBtnText:{color:C.bg,fontSize:15,fontWeight:'800'},
  proHeroActive:{backgroundColor:C.surface2,borderRadius:10,paddingHorizontal:18,paddingVertical:9,borderWidth:1,borderColor:C.purple},
  proHeroActiveText:{color:C.purple,fontSize:13,fontWeight:'600'},
  proFeature:{backgroundColor:C.surface,borderWidth:1,borderColor:C.border,borderRadius:12,padding:14,marginBottom:8,flexDirection:'row',alignItems:'center',gap:12},
  proFeatureNum:{width:32,height:32,borderRadius:8,backgroundColor:C.surface2,alignItems:'center',justifyContent:'center'},
  proFeatureNumText:{color:C.textT,fontSize:10,fontWeight:'700',letterSpacing:1},
  proFeatureTitle:{color:C.textP,fontSize:13,fontWeight:'700',marginBottom:2},
  proFeatureDesc:{color:C.textT,fontSize:11,lineHeight:16},
  proFeatureArrow:{color:C.purple,fontSize:16,fontWeight:'700'},
  proFeatureLock:{color:C.textT,fontSize:13},
  compareBox:{backgroundColor:C.surface,borderWidth:1,borderColor:C.border,borderRadius:14,overflow:'hidden',marginTop:8},
  compareHead:{flexDirection:'row',padding:14,borderBottomWidth:1,borderBottomColor:C.border,backgroundColor:C.surface2},
  compareRow:{flexDirection:'row',padding:12,paddingHorizontal:14},
  compareCell:{flex:1,fontSize:12,color:C.textS,textAlign:'center',fontWeight:'500'},
  footer:{backgroundColor:C.surface,padding:28,alignItems:'center',borderTopWidth:1,borderTopColor:C.border,marginTop:8},
  footerLogo:{width:44,height:44,borderRadius:12,backgroundColor:C.surface2,borderWidth:1,borderColor:C.border,alignItems:'center',justifyContent:'center',marginBottom:10},
  footerL:{color:C.gold,fontSize:22,fontWeight:'900'},
  footerTitle:{color:C.textP,fontSize:16,fontWeight:'800',letterSpacing:2,marginBottom:4},
  footerSub:{color:C.textT,fontSize:12,marginBottom:4},
  footerEmail:{color:C.purple,fontSize:11,marginBottom:16},
  footerLinks:{flexDirection:'row',flexWrap:'wrap',justifyContent:'center',gap:6,marginBottom:12},
  footerLink:{borderWidth:1,borderColor:C.border,borderRadius:6,paddingHorizontal:10,paddingVertical:5},
  footerLinkText:{color:C.textT,fontSize:10},
  footerNote:{color:C.textT,fontSize:10,textAlign:'center'},
  modalOverlay:{flex:1,backgroundColor:'rgba(0,0,0,0.75)',justifyContent:'flex-end'},
  modalSheet:{backgroundColor:C.surface,borderTopLeftRadius:24,borderTopRightRadius:24,maxHeight:'85%',overflow:'hidden'},
  modalHandle:{width:40,height:4,borderRadius:2,backgroundColor:C.border,alignSelf:'center',marginTop:12,marginBottom:4},
  modalSheetHead:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',padding:20,borderBottomWidth:1,borderBottomColor:C.border},
  modalSheetTitle:{color:C.textP,fontSize:17,fontWeight:'700'},
  modalSheetBody:{color:C.textS,fontSize:13,lineHeight:22},
  proSheet:{backgroundColor:C.surface,borderTopLeftRadius:24,borderTopRightRadius:24,overflow:'hidden'},
  proSheetHead:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',padding:24,paddingBottom:16},
  proSheetEye:{color:C.purple,fontSize:10,fontWeight:'700',letterSpacing:2,marginBottom:4},
  proSheetPrice:{color:C.textP,fontSize:28,fontWeight:'900'},
  proSheetPer:{color:C.textT,fontSize:14,fontWeight:'400'},
  proSheetFeature:{flexDirection:'row',alignItems:'center',gap:12,paddingVertical:9,borderBottomWidth:1,borderBottomColor:C.border},
  proSheetDot:{width:6,height:6,borderRadius:3,backgroundColor:C.purple},
  proSheetFeatureText:{color:C.textS,fontSize:13,fontWeight:'500'},
  proSheetBtn:{backgroundColor:C.purple,borderRadius:14,padding:16,alignItems:'center'},
  proSheetBtnText:{color:C.white,fontSize:15,fontWeight:'800'},
  proSheetNote:{color:C.textT,fontSize:10,textAlign:'center',marginTop:10,lineHeight:15},
  bodyText:{color:C.textS,fontSize:13,lineHeight:20},
  smallText:{color:C.textT,fontSize:11,lineHeight:17},
  tag:{borderWidth:1,borderColor:C.border,borderRadius:6,paddingHorizontal:8,paddingVertical:3},
  tagText:{color:C.textT,fontSize:10,fontWeight:'600'},
  checkbox:{width:22,height:22,borderRadius:6,borderWidth:1.5,borderColor:C.border,alignItems:'center',justifyContent:'center'},
});
