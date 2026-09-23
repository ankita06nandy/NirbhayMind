/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from "react";

export const LANGUAGES = [
  "English", "Bengali", "Hindi",
];

export const LANGUAGE_LABELS = {
  English: "English",
  Bengali: "বাংলা",
  Hindi: "हिंदी",
};

const translations = {
  English: {},
  Bengali: {
    "Your Voice. Your Well-being. Our Priority.": "আপনার কণ্ঠ। আপনার সুস্থতা। আমাদের অগ্রাধিকার।",
    "You are not alone. We are here for you.": "আপনি একা নন। আমরা আপনার পাশে আছি।",
    "Your Well-being Score": "আপনার সুস্থতার স্কোর", "View Trend": "প্রবণতা দেখুন",
    "Next Check-in": "পরবর্তী চেক-ইন", "View Schedule": "সময়সূচি দেখুন",
    "Chat with AI": "AI-এর সাথে কথা বলুন", "Voice Call (IVRS)": "ভয়েস কল (IVRS)",
    "Mood Check": "মুড চেক", "My Case": "আমার মামলা", "Alerts & Notifications": "সতর্কতা ও বিজ্ঞপ্তি",
    "Resources & Help": "সম্পদ ও সহায়তা", "Profile & Settings": "প্রোফাইল ও সেটিংস",
    "Check-in History": "চেক-ইন ইতিহাস", "Submit Check-in": "চেক-ইন জমা দিন",
    "Back to Dashboard": "ড্যাশবোর্ডে ফিরুন", "SMS Support": "SMS সহায়তা",
    "Send SMS": "SMS পাঠান", "Send": "পাঠান", "Call": "কল",
    "Hello 🌿 I'm here to listen. How are you feeling today?": "হ্যালো 🌿 আমি আপনার কথা শুনতে এখানে আছি। আজ আপনি কেমন অনুভব করছেন?",
    "Open My Case": "আমার মামলা খুলুন", "Contact Legal Support": "আইনি সহায়তার সঙ্গে যোগাযোগ করুন",
  },
  Hindi: {
    "Your Voice. Your Well-being. Our Priority.": "आपकी आवाज़। आपका स्वास्थ्य। हमारी प्राथमिकता।",
    "You are not alone. We are here for you.": "आप अकेले नहीं हैं। हम आपके साथ हैं।",
    "Your Well-being Score": "आपका स्वास्थ्य स्कोर", "View Trend": "रुझान देखें",
    "Next Check-in": "अगला चेक-इन", "View Schedule": "समय-सारणी देखें",
    "Chat with AI": "AI से बात करें", "Voice Call (IVRS)": "वॉइस कॉल (IVRS)",
    "Mood Check": "मूड चेक", "My Case": "मेरा मामला", "Alerts & Notifications": "अलर्ट और सूचनाएं",
    "Resources & Help": "संसाधन और सहायता", "Profile & Settings": "प्रोफ़ाइल और सेटिंग्स",
    "Check-in History": "चेक-इन इतिहास", "Submit Check-in": "चेक-इन जमा करें",
    "Back to Dashboard": "डैशबोर्ड पर लौटें", "SMS Support": "SMS सहायता",
    "Send SMS": "SMS भेजें", "Send": "भेजें", "Call": "कॉल",
    "Hello 🌿 I'm here to listen. How are you feeling today?": "नमस्ते 🌿 मैं आपकी बात सुनने के लिए यहां हूं। आज आप कैसा महसूस कर रहे हैं?",
    "Open My Case": "मेरा मामला खोलें", "Contact Legal Support": "कानूनी सहायता से संपर्क करें",
  },
  Tamil: {
    "Your Voice. Your Well-being. Our Priority.": "உங்கள் குரல். உங்கள் நலம். எங்கள் முன்னுரிமை.",
    "You are not alone. We are here for you.": "நீங்கள் தனியாக இல்லை. நாங்கள் உங்களுக்காக இருக்கிறோம்.",
    "Your Well-being Score": "உங்கள் நல மதிப்பெண்", "View Trend": "போக்கைக் காண்க",
    "Next Check-in": "அடுத்த செக்-இன்", "Chat with AI": "AI உடன் பேசுங்கள்",
    "Voice Call (IVRS)": "குரல் அழைப்பு (IVRS)", "Mood Check": "மனநிலை சோதனை",
    "My Case": "என் வழக்கு", "Alerts & Notifications": "எச்சரிக்கைகள் மற்றும் அறிவிப்புகள்",
    "Resources & Help": "வளங்கள் மற்றும் உதவி", "Profile & Settings": "சுயவிவரம் மற்றும் அமைப்புகள்",
    "Check-in History": "செக்-இன் வரலாறு", "Submit Check-in": "செக்-இன் சமர்ப்பிக்கவும்",
    "Back to Dashboard": "டாஷ்போர்டுக்குத் திரும்பு", "Call": "அழைக்கவும்",
  },
  Telugu: {
    "Your Voice. Your Well-being. Our Priority.": "మీ స్వరం. మీ శ్రేయస్సు. మా ప్రాధాన్యత.",
    "You are not alone. We are here for you.": "మీరు ఒంటరిగా లేరు. మేము మీ కోసం ఉన్నాము.",
    "Your Well-being Score": "మీ శ్రేయస్సు స్కోర్", "View Trend": "ధోరణిని చూడండి",
    "Next Check-in": "తదుపరి చెక్-ఇన్", "Chat with AI": "AIతో మాట్లాడండి",
    "Voice Call (IVRS)": "వాయిస్ కాల్ (IVRS)", "Mood Check": "మూడ్ చెక్",
    "My Case": "నా కేసు", "Alerts & Notifications": "హెచ్చరికలు & నోటిఫికేషన్‌లు",
    "Resources & Help": "వనరులు & సహాయం", "Profile & Settings": "ప్రొఫైల్ & సెట్టింగ్‌లు",
    "Check-in History": "చెక్-ఇన్ చరిత్ర", "Submit Check-in": "చెక్-ఇన్ సమర్పించండి",
    "Back to Dashboard": "డ్యాష్‌బోర్డ్‌కు తిరిగి వెళ్ళండి", "Call": "కాల్",
  },
  Assamese: {
    "Your Voice. Your Well-being. Our Priority.": "আপোনাৰ কণ্ঠ। আপোনাৰ সুস্থতা। আমাৰ অগ্ৰাধিকাৰ।",
    "You are not alone. We are here for you.": "আপুনি অকলশৰীয়া নহয়। আমি আপোনাৰ বাবে আছোঁ।",
    "Your Well-being Score": "আপোনাৰ সুস্থতাৰ স্ক’ৰ", "View Trend": "ধাৰা চাওক",
    "Next Check-in": "পৰৱৰ্তী চেক-ইন", "Chat with AI": "AI-ৰ সৈতে কথা পাতক",
    "Voice Call (IVRS)": "ভইচ কল (IVRS)", "Mood Check": "মুড পৰীক্ষা",
    "My Case": "মোৰ গোচৰ", "Alerts & Notifications": "সতৰ্কবাণী আৰু জাননী",
    "Resources & Help": "সম্পদ আৰু সহায়", "Profile & Settings": "প্ৰ’ফাইল আৰু ছেটিংছ",
    "Check-in History": "চেক-ইন ইতিহাস", "Submit Check-in": "চেক-ইন দাখিল কৰক",
  },
  Odia: {
    "Your Voice. Your Well-being. Our Priority.": "ଆପଣଙ୍କ ସ୍ୱର। ଆପଣଙ୍କ ସୁସ୍ଥତା। ଆମର ପ୍ରାଥମିକତା।",
    "You are not alone. We are here for you.": "ଆପଣ ଏକା ନୁହଁନ୍ତି। ଆମେ ଆପଣଙ୍କ ପାଇଁ ଅଛୁ।",
    "Your Well-being Score": "ଆପଣଙ୍କ ସୁସ୍ଥତା ସ୍କୋର", "View Trend": "ଧାରା ଦେଖନ୍ତୁ",
    "Next Check-in": "ପରବର୍ତ୍ତୀ ଚେକ୍-ଇନ୍", "Chat with AI": "AI ସହିତ କଥା ହୁଅନ୍ତୁ",
    "Voice Call (IVRS)": "ଭଏସ୍ କଲ୍ (IVRS)", "Mood Check": "ମୁଡ୍ ଚେକ୍",
    "My Case": "ମୋ ମାମଲା", "Alerts & Notifications": "ସତର୍କତା ଏବଂ ବିଜ୍ଞପ୍ତି",
    "Resources & Help": "ସମ୍ବଳ ଏବଂ ସହାୟତା", "Profile & Settings": "ପ୍ରୋଫାଇଲ୍ ଏବଂ ସେଟିଂସ୍",
    "Check-in History": "ଚେକ୍-ଇନ୍ ଇତିହାସ", "Submit Check-in": "ଚେକ୍-ଇନ୍ ଦାଖଲ କରନ୍ତୁ",
  },
  Kannada: {
    "Your Voice. Your Well-being. Our Priority.": "ನಿಮ್ಮ ಧ್ವನಿ. ನಿಮ್ಮ ಯೋಗಕ್ಷೇಮ. ನಮ್ಮ ಆದ್ಯತೆ.",
    "You are not alone. We are here for you.": "ನೀವು ಒಬ್ಬರೇ ಅಲ್ಲ. ನಾವು ನಿಮಗಾಗಿ ಇದ್ದೇವೆ.",
    "Your Well-being Score": "ನಿಮ್ಮ ಯೋಗಕ್ಷೇಮ ಸ್ಕೋರ್", "View Trend": "ಪ್ರವೃತ್ತಿ ನೋಡಿ",
    "Next Check-in": "ಮುಂದಿನ ಚೆಕ್-ಇನ್", "Chat with AI": "AI ಜೊತೆ ಮಾತನಾಡಿ",
    "Voice Call (IVRS)": "ಧ್ವನಿ ಕರೆ (IVRS)", "Mood Check": "ಮನಸ್ಥಿತಿ ಪರಿಶೀಲನೆ",
    "My Case": "ನನ್ನ ಪ್ರಕರಣ", "Alerts & Notifications": "ಎಚ್ಚರಿಕೆಗಳು ಮತ್ತು ಅಧಿಸೂಚನೆಗಳು",
    "Resources & Help": "ಸಂಪನ್ಮೂಲಗಳು ಮತ್ತು ಸಹಾಯ", "Profile & Settings": "ಪ್ರೊಫೈಲ್ ಮತ್ತು ಸೆಟ್ಟಿಂಗ್‌ಗಳು",
    "Check-in History": "ಚೆಕ್-ಇನ್ ಇತಿಹಾಸ", "Submit Check-in": "ಚೆಕ್-ಇನ್ ಸಲ್ಲಿಸಿ",
  },
  Malayalam: {
    "Your Voice. Your Well-being. Our Priority.": "നിങ്ങളുടെ ശബ്ദം. നിങ്ങളുടെ ക്ഷേമം. ഞങ്ങളുടെ മുൻഗണന.",
    "You are not alone. We are here for you.": "നിങ്ങൾ ഒറ്റയ്ക്കല്ല. ഞങ്ങൾ നിങ്ങൾക്കൊപ്പമുണ്ട്.",
    "Your Well-being Score": "നിങ്ങളുടെ ക്ഷേമ സ്കോർ", "View Trend": "ട്രെൻഡ് കാണുക",
    "Next Check-in": "അടുത്ത ചെക്ക്-ഇൻ", "Chat with AI": "AI-യോട് സംസാരിക്കുക",
    "Voice Call (IVRS)": "വോയ്സ് കോൾ (IVRS)", "Mood Check": "മൂഡ് പരിശോധന",
    "My Case": "എന്റെ കേസ്", "Alerts & Notifications": "അലേർട്ടുകളും അറിയിപ്പുകളും",
    "Resources & Help": "വിഭവങ്ങളും സഹായവും", "Profile & Settings": "പ്രൊഫൈലും ക്രമീകരണങ്ങളും",
    "Check-in History": "ചെക്ക്-ഇൻ ചരിത്രം", "Submit Check-in": "ചെക്ക്-ഇൻ സമർപ്പിക്കുക",
  },
  Marathi: {
    "Your Voice. Your Well-being. Our Priority.": "तुमचा आवाज. तुमचे कल्याण. आमचे प्राधान्य.",
    "You are not alone. We are here for you.": "तुम्ही एकटे नाही. आम्ही तुमच्यासाठी आहोत.",
    "Your Well-being Score": "तुमचा कल्याण गुण", "View Trend": "कल पाहा",
    "Next Check-in": "पुढील चेक-इन", "Chat with AI": "AI शी बोला",
    "Voice Call (IVRS)": "व्हॉइस कॉल (IVRS)", "Mood Check": "मूड तपासा",
    "My Case": "माझे प्रकरण", "Alerts & Notifications": "सूचना आणि इशारे",
    "Resources & Help": "संसाधने आणि मदत", "Profile & Settings": "प्रोफाइल आणि सेटिंग्ज",
    "Check-in History": "चेक-इन इतिहास", "Submit Check-in": "चेक-इन सादर करा",
  },
  Gujarati: {
    "Your Voice. Your Well-being. Our Priority.": "તમારો અવાજ. તમારું સ્વાસ્થ્ય. અમારી પ્રાથમિકતા.",
    "You are not alone. We are here for you.": "તમે એકલા નથી. અમે તમારી સાથે છીએ.",
    "Your Well-being Score": "તમારો સ્વાસ્થ્ય સ્કોર", "View Trend": "વલણ જુઓ",
    "Next Check-in": "આગામી ચેક-ઇન", "Chat with AI": "AI સાથે વાત કરો",
    "Voice Call (IVRS)": "વૉઇસ કૉલ (IVRS)", "Mood Check": "મૂડ તપાસ",
    "My Case": "મારો કેસ", "Alerts & Notifications": "ચેતવણીઓ અને સૂચનાઓ",
    "Resources & Help": "સંસાધનો અને મદદ", "Profile & Settings": "પ્રોફાઇલ અને સેટિંગ્સ",
    "Check-in History": "ચેક-ઇન ઇતિહાસ", "Submit Check-in": "ચેક-ઇન સબમિટ કરો",
  },
  Punjabi: {
    "Your Voice. Your Well-being. Our Priority.": "ਤੁਹਾਡੀ ਆਵਾਜ਼। ਤੁਹਾਡੀ ਤੰਦਰੁਸਤੀ। ਸਾਡੀ ਪਹਿਲ।",
    "You are not alone. We are here for you.": "ਤੁਸੀਂ ਇਕੱਲੇ ਨਹੀਂ ਹੋ। ਅਸੀਂ ਤੁਹਾਡੇ ਲਈ ਹਾਂ।",
    "Your Well-being Score": "ਤੁਹਾਡਾ ਤੰਦਰੁਸਤੀ ਸਕੋਰ", "View Trend": "ਰੁਝਾਨ ਵੇਖੋ",
    "Next Check-in": "ਅਗਲਾ ਚੈੱਕ-ਇਨ", "Chat with AI": "AI ਨਾਲ ਗੱਲ ਕਰੋ",
    "Voice Call (IVRS)": "ਵੌਇਸ ਕਾਲ (IVRS)", "Mood Check": "ਮੂਡ ਜਾਂਚ",
    "My Case": "ਮੇਰਾ ਕੇਸ", "Alerts & Notifications": "ਚੇਤਾਵਨੀਆਂ ਅਤੇ ਸੂਚਨਾਵਾਂ",
    "Resources & Help": "ਸਰੋਤ ਅਤੇ ਮਦਦ", "Profile & Settings": "ਪ੍ਰੋਫਾਈਲ ਅਤੇ ਸੈਟਿੰਗਾਂ",
    "Check-in History": "ਚੈੱਕ-ਇਨ ਇਤਿਹਾਸ", "Submit Check-in": "ਚੈੱਕ-ਇਨ ਜਮ੍ਹਾਂ ਕਰੋ",
  },
  Urdu: {
    "Your Voice. Your Well-being. Our Priority.": "آپ کی آواز۔ آپ کی فلاح۔ ہماری ترجیح۔",
    "You are not alone. We are here for you.": "آپ اکیلے نہیں ہیں۔ ہم آپ کے لیے موجود ہیں۔",
    "Your Well-being Score": "آپ کی فلاح کا اسکور", "View Trend": "رجحان دیکھیں",
    "Next Check-in": "اگلا چیک اِن", "Chat with AI": "AI سے بات کریں",
    "Voice Call (IVRS)": "وائس کال (IVRS)", "Mood Check": "موڈ چیک",
    "My Case": "میرا کیس", "Alerts & Notifications": "الرٹس اور اطلاعات",
    "Resources & Help": "وسائل اور مدد", "Profile & Settings": "پروفائل اور ترتیبات",
    "Check-in History": "چیک اِن کی تاریخ", "Submit Check-in": "چیک اِن جمع کریں",
  },
};

const sharedTranslations = {
  Bengali: {
    "Profile & Settings": "প্রোফাইল ও সেটিংস", "Your account & preferences": "আপনার অ্যাকাউন্ট ও পছন্দসমূহ",
    "Account Information": "অ্যাকাউন্টের তথ্য", "Your registered information": "আপনার নিবন্ধিত তথ্য",
    District: "জেলা", State: "রাজ্য", "Case Status": "মামলার অবস্থা", Preferences: "পছন্দসমূহ",
    "Customize your NirbhayMind experience": "আপনার NirbhayMind অভিজ্ঞতা সাজান", Language: "ভাষা", Change: "পরিবর্তন করুন",
    Notifications: "বিজ্ঞপ্তি", Appearance: "চেহারা", "Privacy & Security": "গোপনীয়তা ও নিরাপত্তা",
    "Support": "সহায়তা", "Help & FAQ": "সহায়তা ও সাধারণ প্রশ্ন", "Contact Support": "সহায়তার সঙ্গে যোগাযোগ",
    "Case & Support": "মামলা ও সহায়তা", Registered: "নিবন্ধিত", Location: "অবস্থান",
    "Case Journey": "মামলার অগ্রগতি", "Next Hearing": "পরবর্তী শুনানি", "Last Case Update": "মামলার সর্বশেষ আপডেট",
    "A safe space to talk": "কথা বলার নিরাপদ স্থান", "Type your message...": "আপনার বার্তা লিখুন...",
    "Voice Support": "ভয়েস সহায়তা", "Preferred Language": "পছন্দের ভাষা", "National Helpline": "জাতীয় হেল্পলাইন",
    "Toll Free Support": "টোল-ফ্রি সহায়তা", "This call is secure and confidential": "এই কল নিরাপদ ও গোপনীয়",
    "Loading your secure dashboard...": "আপনার নিরাপদ ড্যাশবোর্ড লোড হচ্ছে...",
    "Support & helpful information": "সহায়তা ও দরকারি তথ্য", "You are not alone.": "আপনি একা নন।",
    "Help is always available.": "সহায়তা সবসময় পাওয়া যায়।", "NHAA Support": "NHAA সহায়তা",
    "National Helpline Against Atrocities": "অত্যাচারের বিরুদ্ধে জাতীয় হেল্পলাইন",
    "You have been logged out.": "আপনি লগ আউট করেছেন।",
    "Your privacy controls are managed securely by NirbhayMind.": "আপনার গোপনীয়তা নিয়ন্ত্রণ NirbhayMind নিরাপদে পরিচালনা করে।",
    "Your account security is active.": "আপনার অ্যাকাউন্ট নিরাপত্তা সক্রিয়।",
    "Find answers to common questions": "সাধারণ প্রশ্নের উত্তর খুঁজুন",
    "Get help from the support team": "সহায়তা দলের কাছ থেকে সাহায্য নিন",
    "Not available": "পাওয়া যায়নি", In: "মধ্যে", days: "দিন", "Not scheduled": "নির্ধারিত নয়",
    "Complaint Registered": "অভিযোগ নথিভুক্ত", "Investigation": "তদন্ত", "In Progress": "চলমান",
    "Charge Sheet": "চার্জশিট", Pending: "অপেক্ষমাণ", Trial: "বিচার", "Case Resolution": "মামলার নিষ্পত্তি",
    "Currently here": "বর্তমান ধাপ", "No upcoming hearing": "কোনও আসন্ন শুনানি নেই", "from now": "এখন থেকে",
    "Your case information was last updated.": "আপনার মামলার তথ্য সর্বশেষ হালনাগাদ হয়েছে।",
    Counselling: "কাউন্সেলিং", "Talk to a counsellor": "কাউন্সেলরের সঙ্গে কথা বলুন",
    "Legal Aid": "আইনি সহায়তা", "Get legal support": "আইনি সহায়তা নিন", Protection: "সুরক্ষা",
    "Report a safety concern": "নিরাপত্তার সমস্যা জানান", Relocation: "পুনর্বাসন",
    "Request relocation support": "পুনর্বাসন সহায়তা চান", "Services available through NirbhayMind.": "NirbhayMind-এর মাধ্যমে পরিষেবা পাওয়া যায়।",
    "You don't have to navigate your case alone.": "আপনাকে একা আপনার মামলা সামলাতে হবে না।",
    "NirbhayMind is here to help you access support.": "NirbhayMind আপনাকে সহায়তা পেতে সাহায্য করতে পাশে আছে।"
    ,"Track the progress of your case.": "আপনার মামলার অগ্রগতি দেখুন।",
    "Well-being Check-in": "সুস্থতার চেক-ইন", "Complete your first Mood Check to start tracking your well-being.": "আপনার সুস্থতা ট্র্যাক করতে প্রথম মুড চেক সম্পূর্ণ করুন।",
    "Keep your information protected": "আপনার তথ্য সুরক্ষিত রাখুন", "Privacy & Data": "গোপনীয়তা ও তথ্য",
    "Manage your privacy preferences": "আপনার গোপনীয়তা পছন্দ পরিচালনা করুন", Security: "নিরাপত্তা",
    "Your account security settings": "আপনার অ্যাকাউন্টের নিরাপত্তা সেটিংস", "Need help with NirbhayMind?": "NirbhayMind-এর সাহায্য দরকার?",
    "Risk Level": "ঝুঁকির স্তর", "Your distress level may need attention.": "আপনার মানসিক চাপের মাত্রায় মনোযোগ প্রয়োজন হতে পারে।",
    "Your distress level is showing some changes.": "আপনার মানসিক চাপের মাত্রায় কিছু পরিবর্তন দেখা যাচ্ছে।",
    "Your distress level is currently stable.": "আপনার মানসিক চাপের মাত্রা বর্তমানে স্থিতিশীল।", "Keep going!": "এগিয়ে চলুন!"
  },
  Hindi: {
    "Profile & Settings": "प्रोफ़ाइल और सेटिंग्स", "Your account & preferences": "आपका खाता और पसंद",
    "Account Information": "खाता जानकारी", "Your registered information": "आपकी पंजीकृत जानकारी",
    District: "ज़िला", State: "राज्य", "Case Status": "मामले की स्थिति", Preferences: "पसंद",
    "Customize your NirbhayMind experience": "अपने NirbhayMind अनुभव को अनुकूलित करें", Language: "भाषा", Change: "बदलें",
    Notifications: "सूचनाएं", Appearance: "दिखावट", "Privacy & Security": "गोपनीयता और सुरक्षा",
    Support: "सहायता", "Help & FAQ": "सहायता और सामान्य प्रश्न", "Contact Support": "सहायता से संपर्क करें",
    "Case & Support": "मामला और सहायता", Registered: "पंजीकृत", Location: "स्थान",
    "Case Journey": "मामले की प्रगति", "Next Hearing": "अगली सुनवाई", "Last Case Update": "मामले का नवीनतम अपडेट",
    "A safe space to talk": "बात करने के लिए सुरक्षित स्थान", "Type your message...": "अपना संदेश लिखें...",
    "Voice Support": "वॉइस सहायता", "Preferred Language": "पसंदीदा भाषा", "National Helpline": "राष्ट्रीय हेल्पलाइन",
    "Toll Free Support": "टोल-फ्री सहायता", "This call is secure and confidential": "यह कॉल सुरक्षित और गोपनीय है",
    "Loading your secure dashboard...": "आपका सुरक्षित डैशबोर्ड लोड हो रहा है...",
    "Support & helpful information": "सहायता और उपयोगी जानकारी", "You are not alone.": "आप अकेले नहीं हैं।",
    "Help is always available.": "सहायता हमेशा उपलब्ध है।", "NHAA Support": "NHAA सहायता",
    "National Helpline Against Atrocities": "अत्याचार के विरुद्ध राष्ट्रीय हेल्पलाइन",
    "You have been logged out.": "आप लॉग आउट हो गए हैं।",
    "Your privacy controls are managed securely by NirbhayMind.": "आपकी गोपनीयता सेटिंग्स NirbhayMind द्वारा सुरक्षित रूप से प्रबंधित हैं।",
    "Your account security is active.": "आपके खाते की सुरक्षा सक्रिय है।",
    "Find answers to common questions": "सामान्य प्रश्नों के उत्तर खोजें",
    "Get help from the support team": "सहायता टीम से मदद लें",
    "Not available": "उपलब्ध नहीं", In: "में", days: "दिन", "Not scheduled": "निर्धारित नहीं",
    "Complaint Registered": "शिकायत दर्ज", Investigation: "जांच", "In Progress": "प्रगति पर",
    "Charge Sheet": "आरोप पत्र", Pending: "लंबित", Trial: "मुकदमा", "Case Resolution": "मामले का समाधान",
    "Currently here": "वर्तमान चरण", "No upcoming hearing": "कोई आगामी सुनवाई नहीं", "from now": "अभी से",
    "Your case information was last updated.": "आपके मामले की जानकारी अंतिम बार अपडेट की गई।",
    Counselling: "परामर्श", "Talk to a counsellor": "परामर्शदाता से बात करें",
    "Legal Aid": "कानूनी सहायता", "Get legal support": "कानूनी सहायता लें", Protection: "सुरक्षा",
    "Report a safety concern": "सुरक्षा संबंधी चिंता बताएं", Relocation: "स्थानांतरण",
    "Request relocation support": "स्थानांतरण सहायता का अनुरोध करें", "Services available through NirbhayMind.": "NirbhayMind के माध्यम से सेवाएं उपलब्ध हैं।",
    "You don't have to navigate your case alone.": "आपको अपना मामला अकेले नहीं संभालना है।",
    "NirbhayMind is here to help you access support.": "NirbhayMind आपको सहायता प्राप्त करने में मदद करने के लिए यहां है।"
    ,"Track the progress of your case.": "अपने मामले की प्रगति देखें।",
    "Well-being Check-in": "स्वास्थ्य चेक-इन", "Complete your first Mood Check to start tracking your well-being.": "अपना स्वास्थ्य ट्रैक करने के लिए पहला मूड चेक पूरा करें।",
    "Keep your information protected": "अपनी जानकारी सुरक्षित रखें", "Privacy & Data": "गोपनीयता और डेटा",
    "Manage your privacy preferences": "अपनी गोपनीयता पसंद प्रबंधित करें", Security: "सुरक्षा",
    "Your account security settings": "आपके खाते की सुरक्षा सेटिंग्स", "Need help with NirbhayMind?": "NirbhayMind से मदद चाहिए?",
    "Risk Level": "जोखिम स्तर", "Your distress level may need attention.": "आपके तनाव के स्तर पर ध्यान देने की आवश्यकता हो सकती है।",
    "Your distress level is showing some changes.": "आपके तनाव के स्तर में कुछ बदलाव दिख रहे हैं।",
    "Your distress level is currently stable.": "आपका तनाव स्तर अभी स्थिर है।", "Keep going!": "आगे बढ़ते रहें!"
  }
};

// Keep the complete interface localized even when a newly added copy key has
// not yet received a polished regional translation. The marker is intentional:
// it prevents silently showing English in a selected language.
const localeFallbackLabels = {
  Assamese: "অসমীয়াত",
  Odia: "ଓଡ଼ିଆରେ",
  Tamil: "தமிழில்",
  Telugu: "తెలుగులో",
  Kannada: "ಕನ್ನಡದಲ್ಲಿ",
  Malayalam: "മലയാളത്തിൽ",
  Marathi: "मराठीत",
  Gujarati: "ગુજરાતીમાં",
  Punjabi: "ਪੰਜਾਬੀ ਵਿੱਚ",
  Urdu: "اردو میں",
};

const commonInterfaceTranslations = {
  Assamese: {
    "Profile & Settings": "প্ৰ’ফাইল আৰু ছেটিংছ", "Account Information": "একাউণ্টৰ তথ্য",
    Preferences: "পছন্দসমূহ", Language: "ভাষা", Change: "সলনি কৰক",
    Notifications: "জাননীসমূহ", Appearance: "আবিৰ্ভাৱ", Support: "সহায়",
    "Case & Support": "গোচৰ আৰু সহায়", "Case Journey": "গোচৰৰ অগ্ৰগতি",
    "Next Hearing": "পৰৱৰ্তী শুনানি", "A safe space to talk": "কথা পাতিবলৈ নিৰাপদ স্থান",
    "Type your message...": "আপোনাৰ বাৰ্তা লিখক...", "Voice Support": "ভইচ সহায়",
    "Preferred Language": "পছন্দৰ ভাষা", "National Helpline": "ৰাষ্ট্ৰীয় হেল্পলাইন",
    "Toll Free Support": "টোল-ফ্ৰী সহায়", "Risk Level": "ঝুঁকিৰ স্তৰ",
  },
  Odia: {
    "Profile & Settings": "ପ୍ରୋଫାଇଲ୍ ଏବଂ ସେଟିଂସ୍", "Account Information": "ଆକାଉଣ୍ଟ ସୂଚନା",
    Preferences: "ପସନ୍ଦ", Language: "ଭାଷା", Change: "ପରିବର୍ତ୍ତନ",
    Notifications: "ବିଜ୍ଞପ୍ତି", Appearance: "ଦୃଶ୍ୟ", Support: "ସହାୟତା",
    "Case & Support": "ମାମଲା ଏବଂ ସହାୟତା", "Case Journey": "ମାମଲାର ପ୍ରଗତି",
    "Next Hearing": "ପରବର୍ତ୍ତୀ ଶୁଣାଣି", "A safe space to talk": "କଥା ହେବା ପାଇଁ ନିରାପଦ ସ୍ଥାନ",
    "Type your message...": "ଆପଣଙ୍କ ବାର୍ତ୍ତା ଲେଖନ୍ତୁ...", "Voice Support": "ଭଏସ୍ ସହାୟତା",
    "Preferred Language": "ପସନ୍ଦର ଭାଷା", "National Helpline": "ଜାତୀୟ ହେଲ୍ପଲାଇନ୍",
    "Toll Free Support": "ଟୋଲ୍-ଫ୍ରି ସହାୟତା", "Risk Level": "ବିପଦ ସ୍ତର",
  },
  Tamil: {
    "Profile & Settings": "சுயவிவரம் மற்றும் அமைப்புகள்", "Account Information": "கணக்கு தகவல்",
    Preferences: "விருப்பங்கள்", Language: "மொழி", Change: "மாற்று",
    Notifications: "அறிவிப்புகள்", Appearance: "தோற்றம்", Support: "ஆதரவு",
    "Case & Support": "வழக்கு மற்றும் ஆதரவு", "Case Journey": "வழக்கின் முன்னேற்றம்",
    "Next Hearing": "அடுத்த விசாரணை", "A safe space to talk": "பேசுவதற்கான பாதுகாப்பான இடம்",
    "Type your message...": "உங்கள் செய்தியை எழுதுங்கள்...", "Voice Support": "குரல் ஆதரவு",
    "Preferred Language": "விருப்ப மொழி", "National Helpline": "தேசிய உதவி எண்",
    "Toll Free Support": "கட்டணமில்லா ஆதரவு", "Risk Level": "ஆபத்து நிலை",
  },
  Telugu: {
    "Profile & Settings": "ప్రొఫైల్ మరియు సెట్టింగ్‌లు", "Account Information": "ఖాతా సమాచారం",
    Preferences: "ప్రాధాన్యతలు", Language: "భాష", Change: "మార్చండి",
    Notifications: "నోటిఫికేషన్‌లు", Appearance: "రూపం", Support: "సహాయం",
    "Case & Support": "కేసు మరియు సహాయం", "Case Journey": "కేసు పురోగతి",
    "Next Hearing": "తదుపరి విచారణ", "A safe space to talk": "మాట్లాడేందుకు సురక్షితమైన స్థలం",
    "Type your message...": "మీ సందేశాన్ని టైప్ చేయండి...", "Voice Support": "వాయిస్ సహాయం",
    "Preferred Language": "ఇష్టమైన భాష", "National Helpline": "జాతీయ హెల్ప్‌లైన్",
    "Toll Free Support": "టోల్ ఫ్రీ సహాయం", "Risk Level": "ప్రమాద స్థాయి",
  },
  Kannada: {
    "Profile & Settings": "ಪ್ರೊಫೈಲ್ ಮತ್ತು ಸೆಟ್ಟಿಂಗ್‌ಗಳು", "Account Information": "ಖಾತೆ ಮಾಹಿತಿ",
    Preferences: "ಆದ್ಯತೆಗಳು", Language: "ಭಾಷೆ", Change: "ಬದಲಾಯಿಸಿ",
    Notifications: "ಅಧಿಸೂಚನೆಗಳು", Appearance: "ನೋಟ", Support: "ಬೆಂಬಲ",
    "Case & Support": "ಪ್ರಕರಣ ಮತ್ತು ಬೆಂಬಲ", "Case Journey": "ಪ್ರಕರಣದ ಪ್ರಗತಿ",
    "Next Hearing": "ಮುಂದಿನ ವಿಚಾರಣೆ", "A safe space to talk": "ಮಾತನಾಡಲು ಸುರಕ್ಷಿತ ಸ್ಥಳ",
    "Type your message...": "ನಿಮ್ಮ ಸಂದೇಶವನ್ನು ಟೈಪ್ ಮಾಡಿ...", "Voice Support": "ಧ್ವನಿ ಬೆಂಬಲ",
    "Preferred Language": "ಆದ್ಯತೆಯ ಭಾಷೆ", "National Helpline": "ರಾಷ್ಟ್ರೀಯ ಸಹಾಯವಾಣಿ",
    "Toll Free Support": "ಟೋಲ್ ಫ್ರೀ ಬೆಂಬಲ", "Risk Level": "ಅಪಾಯದ ಮಟ್ಟ",
  },
  Malayalam: {
    "Profile & Settings": "പ്രൊഫൈലും ക്രമീകരണങ്ങളും", "Account Information": "അക്കൗണ്ട് വിവരങ്ങൾ",
    Preferences: "മുൻഗണനകൾ", Language: "ഭാഷ", Change: "മാറ്റുക",
    Notifications: "അറിയിപ്പുകൾ", Appearance: "രൂപം", Support: "പിന്തുണ",
    "Case & Support": "കേസും പിന്തുണയും", "Case Journey": "കേസിന്റെ പുരോഗതി",
    "Next Hearing": "അടുത്ത ഹിയറിംഗ്", "A safe space to talk": "സംസാരിക്കാൻ സുരക്ഷിതമായ ഇടം",
    "Type your message...": "നിങ്ങളുടെ സന്ദേശം ടൈപ്പ് ചെയ്യുക...", "Voice Support": "വോയ്സ് പിന്തുണ",
    "Preferred Language": "ഇഷ്ടപ്പെട്ട ഭാഷ", "National Helpline": "ദേശീയ ഹെൽപ്പ്‌ലൈൻ",
    "Toll Free Support": "ടോൾ ഫ്രീ പിന്തുണ", "Risk Level": "അപകട നില",
  },
  Marathi: {
    "Profile & Settings": "प्रोफाइल आणि सेटिंग्ज", "Account Information": "खाते माहिती",
    Preferences: "प्राधान्ये", Language: "भाषा", Change: "बदला",
    Notifications: "सूचना", Appearance: "दिसणे", Support: "मदत",
    "Case & Support": "प्रकरण आणि मदत", "Case Journey": "प्रकरणाची प्रगती",
    "Next Hearing": "पुढील सुनावणी", "A safe space to talk": "बोलण्यासाठी सुरक्षित जागा",
    "Type your message...": "तुमचा संदेश लिहा...", "Voice Support": "व्हॉइस मदत",
    "Preferred Language": "पसंतीची भाषा", "National Helpline": "राष्ट्रीय हेल्पलाइन",
    "Toll Free Support": "टोल-फ्री मदत", "Risk Level": "जोखीम पातळी",
  },
  Gujarati: {
    "Profile & Settings": "પ્રોફાઇલ અને સેટિંગ્સ", "Account Information": "ખાતા માહિતી",
    Preferences: "પસંદગીઓ", Language: "ભાષા", Change: "બદલો",
    Notifications: "સૂચનાઓ", Appearance: "દેખાવ", Support: "સહાય",
    "Case & Support": "કેસ અને સહાય", "Case Journey": "કેસની પ્રગતિ",
    "Next Hearing": "આગામી સુનાવણી", "A safe space to talk": "વાત કરવા માટે સુરક્ષિત જગ્યા",
    "Type your message...": "તમારો સંદેશ લખો...", "Voice Support": "વૉઇસ સહાય",
    "Preferred Language": "પસંદગીની ભાષા", "National Helpline": "રાષ્ટ્રીય હેલ્પલાઇન",
    "Toll Free Support": "ટોલ-ફ્રી સહાય", "Risk Level": "જોખમ સ્તર",
  },
  Punjabi: {
    "Profile & Settings": "ਪ੍ਰੋਫਾਈਲ ਅਤੇ ਸੈਟਿੰਗਾਂ", "Account Information": "ਖਾਤਾ ਜਾਣਕਾਰੀ",
    Preferences: "ਪਸੰਦਾਂ", Language: "ਭਾਸ਼ਾ", Change: "ਬਦਲੋ",
    Notifications: "ਸੂਚਨਾਵਾਂ", Appearance: "ਦਿੱਖ", Support: "ਮਦਦ",
    "Case & Support": "ਕੇਸ ਅਤੇ ਮਦਦ", "Case Journey": "ਕੇਸ ਦੀ ਤਰੱਕੀ",
    "Next Hearing": "ਅਗਲੀ ਸੁਣਵਾਈ", "A safe space to talk": "ਗੱਲ ਕਰਨ ਲਈ ਸੁਰੱਖਿਅਤ ਥਾਂ",
    "Type your message...": "ਆਪਣਾ ਸੁਨੇਹਾ ਲਿਖੋ...", "Voice Support": "ਵੌਇਸ ਮਦਦ",
    "Preferred Language": "ਪਸੰਦੀਦਾ ਭਾਸ਼ਾ", "National Helpline": "ਰਾਸ਼ਟਰੀ ਹੈਲਪਲਾਈਨ",
    "Toll Free Support": "ਟੋਲ-ਫ੍ਰੀ ਮਦਦ", "Risk Level": "ਜੋਖਮ ਪੱਧਰ",
  },
  Urdu: {
    "Profile & Settings": "پروفائل اور ترتیبات", "Account Information": "اکاؤنٹ کی معلومات",
    Preferences: "ترجیحات", Language: "زبان", Change: "تبدیل کریں",
    Notifications: "اطلاعات", Appearance: "ظاہری شکل", Support: "مدد",
    "Case & Support": "کیس اور مدد", "Case Journey": "کیس کی پیش رفت",
    "Next Hearing": "اگلی سماعت", "A safe space to talk": "بات کرنے کے لیے محفوظ جگہ",
    "Type your message...": "اپنا پیغام لکھیں...", "Voice Support": "وائس سپورٹ",
    "Preferred Language": "پسندیدہ زبان", "National Helpline": "قومی ہیلپ لائن",
    "Toll Free Support": "ٹول فری مدد", "Risk Level": "خطرے کی سطح",
  },
};

const I18nContext = createContext(null);

export function I18nProvider({ children, initialLanguage = "English" }) {
  const [language, setLanguageState] = useState(() => {
    try {
      const saved = localStorage.getItem("nirbhaymind_language") || initialLanguage;
      return LANGUAGES.includes(saved)
        ? saved
        : Object.entries(LANGUAGE_LABELS).find(([, label]) => label === saved)?.[0] || "English";
    } catch {
      return initialLanguage;
    }
  });
  const setLanguage = (nextLanguage) => {
    const canonical = LANGUAGES.includes(nextLanguage)
      ? nextLanguage
      : Object.entries(LANGUAGE_LABELS).find(([, label]) => label === nextLanguage)?.[0] || "English";
    setLanguageState(canonical);
    try {
      localStorage.setItem("nirbhaymind_language", canonical);
    } catch {
      // The UI still works when browser storage is unavailable.
    }
  };
  const value = useMemo(() => ({
    language,
    setLanguage,
    t: (key, variables = {}) => {
      let text = translations[language]?.[key]
        || sharedTranslations[language]?.[key]
        || commonInterfaceTranslations[language]?.[key]
        || (language === "English" ? key : `${localeFallbackLabels[language]}: ${key}`);
      Object.entries(variables).forEach(([name, value]) => {
        text = text.replace(`{{${name}}}`, value);
      });
      return text;
    },
    data: (value) => {
      const key = String(value ?? "");
      const dataLabels = {
        Bengali: {
          Investigation: "তদন্ত", High: "উচ্চ", Moderate: "মাঝারি",
          Critical: "গুরুতর", Pending: "অপেক্ষমাণ", Ongoing: "চলমান", Approved: "অনুমোদিত",
          Disbursed: "প্রদান করা হয়েছে", Active: "সক্রিয়", Yes: "হ্যাঁ", No: "না",
          Rural: "গ্রামীণ", Urban: "শহুরে", Weekly: "সাপ্তাহিক", "Bi-weekly": "দ্বি-সাপ্তাহিক",
          Fear: "ভয়", "Sexual Assault": "যৌন নির্যাতন", "Physical Assault": "শারীরিক নির্যাতন",
          Female: "মহিলা", Male: "পুরুষ", "Registered User": "নিবন্ধিত ব্যবহারকারী",
          "Complaint Registered": "অভিযোগ নথিভুক্ত", "In Progress": "চলমান", Trial: "বিচার",
          "Charge Sheet": "চার্জশিট", "Case Resolution": "মামলার নিষ্পত্তি",
          Kolkata: "কলকাতা", "West Bengal": "পশ্চিমবঙ্গ",
          "Very Low": "খুব কম", Low: "কম", Okay: "ঠিক আছে", Good: "ভালো", "Very Good": "খুব ভালো",
          Poor: "খারাপ", Average: "গড়", "Very Poor": "খুব খারাপ", "Very High": "খুব বেশি"
        },
        Hindi: {
          Investigation: "जांच", High: "उच्च", Moderate: "मध्यम",
          Critical: "गंभीर", Pending: "लंबित", Ongoing: "जारी", Approved: "स्वीकृत",
          Disbursed: "वितरित", Active: "सक्रिय", Yes: "हां", No: "नहीं",
          Rural: "ग्रामीण", Urban: "शहरी", Weekly: "साप्ताहिक", "Bi-weekly": "द्वि-साप्ताहिक",
          Fear: "डर", "Sexual Assault": "यौन हमला", "Physical Assault": "शारीरिक हमला",
          Female: "महिला", Male: "पुरुष", "Registered User": "पंजीकृत उपयोगकर्ता",
          "Complaint Registered": "शिकायत दर्ज", "In Progress": "प्रगति पर", Trial: "मुकदमा",
          "Charge Sheet": "आरोप पत्र", "Case Resolution": "मामले का समाधान",
          Kolkata: "कोलकाता", "West Bengal": "पश्चिम बंगाल",
          "Very Low": "बहुत कम", Low: "कम", Okay: "ठीक", Good: "अच्छा", "Very Good": "बहुत अच्छा",
          Poor: "खराब", Average: "औसत", "Very Poor": "बहुत खराब", "Very High": "बहुत अधिक"
        }
      };
      return dataLabels[language]?.[key] || key;
    },
  }), [language]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) throw new Error("useI18n must be used inside I18nProvider");
  return context;
}
