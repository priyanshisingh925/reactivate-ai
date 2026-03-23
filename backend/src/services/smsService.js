export const SMS_TEMPLATES = {
  Hindi: {
    sms: "प्रिय {name} जी, आपका खाता {id} पिछले {months} महीनों से निष्क्रिय है। शेष राशि ₹{balance} सुरक्षित है। पुनः सक्रिय करें: 1800-XXX-XXXX या {branch} शाखा जाएं। — ReActivate AI",
    sms_en: "Dear {name}, your account {id} has been dormant for {months} months. Balance ₹{balance} is safe. Call 1800-XXX-XXXX or visit {branch} to reactivate. — ReActivate AI",
    email_subject: "आपका खाता निष्क्रिय है — अभी पुनः सक्रिय करें",
    email_body: "प्रिय {name} जी,\n\nआपका खाता {id} {months} महीनों से निष्क्रिय है। RBI दिशानिर्देश: 10 वर्ष बाद DEAF फंड में स्थानांतरण।\n\nशेष राशि: ₹{balance}\n\nपुनः सक्रिय करें:\n• 1800-XXX-XXXX\n• {branch} शाखा\n\nधन्यवाद, ReActivate AI",
    ivr: "प्रिय {name}, खाता {id} निष्क्रिय है। पुनः सक्रिय करने के लिए 1 दबाएं।",
    script: "Devanagari", speakers: "528M",
  },
  Tamil: {
    sms: "அன்புள்ள {name}, உங்கள் கணக்கு {id} {months} மாதங்களாக செயலற்றுள்ளது. இருப்பு ₹{balance} பாதுகாப்பாக உள்ளது. மீண்டும் செயல்படுத்த: 1800-XXX-XXXX அல்லது {branch}. — ReActivate AI",
    sms_en: "Dear {name}, your account {id} has been dormant for {months} months. Balance ₹{balance} is safe. Call 1800-XXX-XXXX or visit {branch}. — ReActivate AI",
    email_subject: "உங்கள் கணக்கு செயலற்றுள்ளது — இப்போதே மீண்டும் செயல்படுத்துங்கள்",
    email_body: "அன்புள்ள {name},\n\nகணக்கு {id} {months} மாதங்களாக செயலற்றுள்ளது. RBI வழிகாட்டுதல்: 10 ஆண்டுகளுக்குப் பிறகு DEAF நிதிக்கு மாற்றம்.\n\nதற்போதைய இருப்பு: ₹{balance}\n\nமீண்டும் செயல்படுத்த: 1800-XXX-XXXX\n{branch} கிளை\n\nநன்றி, ReActivate AI",
    ivr: "அன்புள்ள {name}, கணக்கு {id} செயலற்றுள்ளது. மீண்டும் செயல்படுத்த 1 அழுத்தவும்.",
    script: "Tamil", speakers: "75M",
  },
  Telugu: {
    sms: "ప్రియమైన {name}, మీ ఖాతా {id} {months} నెలలుగా నిష్క్రియంగా ఉంది. నిల్వ ₹{balance} సురక్షితం. పునఃసక్రియానికి: 1800-XXX-XXXX లేదా {branch}. — ReActivate AI",
    sms_en: "Dear {name}, your account {id} has been dormant for {months} months. Balance ₹{balance} is safe. Call 1800-XXX-XXXX or visit {branch}. — ReActivate AI",
    email_subject: "మీ ఖాతా నిష్క్రియంగా ఉంది — వెంటనే పునఃసక్రియం",
    email_body: "ప్రియమైన {name},\n\nఖాతా {id} {months} నెలలుగా నిష్క్రియంగా ఉంది. RBI మార్గదర్శకాలు: 10 సంవత్సరాల తర్వాత DEAF నిధికి బదిలీ.\n\nనిల్వ: ₹{balance}\n\nపునఃసక్రియానికి: 1800-XXX-XXXX\n{branch}\n\nధన్యవాదాలు, ReActivate AI",
    ivr: "ప్రియమైన {name}, ఖాతా {id} నిష్క్రియం. పునఃసక్రియానికి 1 నొక్కండి.",
    script: "Telugu", speakers: "93M",
  },
  Marathi: {
    sms: "प्रिय {name}, तुमचे खाते {id} {months} महिन्यांपासून निष्क्रिय आहे. शिल्लक ₹{balance} सुरक्षित. पुन्हा सक्रिय करा: 1800-XXX-XXXX किंवा {branch}. — ReActivate AI",
    sms_en: "Dear {name}, your account {id} has been dormant for {months} months. Balance ₹{balance} is safe. Call 1800-XXX-XXXX or visit {branch}. — ReActivate AI",
    email_subject: "तुमचे खाते निष्क्रिय — आत्ताच पुन्हा सक्रिय करा",
    email_body: "प्रिय {name},\n\nखाते {id} {months} महिन्यांपासून निष्क्रिय. RBI: 10 वर्षांनंतर DEAF निधीत हस्तांतर.\n\nशिल्लक: ₹{balance}\n\nपुन्हा सक्रिय: 1800-XXX-XXXX\n{branch}\n\nधन्यवाद, ReActivate AI",
    ivr: "प्रिय {name}, खाते {id} निष्क्रिय. पुन्हा सक्रिय करण्यासाठी 1 दाबा.",
    script: "Devanagari", speakers: "83M",
  },
  Bengali: {
    sms: "প্রিয় {name}, আপনার অ্যাকাউন্ট {id} {months} মাস ধরে নিষ্ক্রিয়। ব্যালেন্স ₹{balance} সুরক্ষিত। পুনরায় সক্রিয়: 1800-XXX-XXXX বা {branch}। — ReActivate AI",
    sms_en: "Dear {name}, your account {id} has been dormant for {months} months. Balance ₹{balance} is safe. Call 1800-XXX-XXXX or visit {branch}. — ReActivate AI",
    email_subject: "আপনার অ্যাকাউন্ট নিষ্ক্রিয় — এখনই পুনরায় সক্রিয় করুন",
    email_body: "প্রিয় {name},\n\nঅ্যাকাউন্ট {id} {months} মাস নিষ্ক্রিয়। RBI নির্দেশিকা: ১০ বছর পর DEAF তহবিলে স্থানান্তর।\n\nব্যালেন্স: ₹{balance}\n\nপুনরায় সক্রিয়: 1800-XXX-XXXX\n{branch}\n\nধন্যবাদ, ReActivate AI",
    ivr: "প্রিয় {name}, অ্যাকাউন্ট {id} নিষ্ক্রিয়। পুনরায় সক্রিয় করতে ১ চাপুন।",
    script: "Bengali", speakers: "97M",
  },
  Kannada: {
    sms: "ಆತ್ಮೀಯ {name}, ನಿಮ್ಮ ಖಾತೆ {id} {months} ತಿಂಗಳಿಂದ ನಿಷ್ಕ್ರಿಯ. ಬ್ಯಾಲೆನ್ಸ್ ₹{balance} ಸುರಕ್ಷಿತ. ಮರುಸಕ್ರಿಯ: 1800-XXX-XXXX ಅಥವಾ {branch}. — ReActivate AI",
    sms_en: "Dear {name}, your account {id} has been dormant for {months} months. Balance ₹{balance} is safe. Call 1800-XXX-XXXX or visit {branch}. — ReActivate AI",
    email_subject: "ನಿಮ್ಮ ಖಾತೆ ನಿಷ್ಕ್ರಿಯ — ಈಗಲೇ ಮರುಸಕ್ರಿಯಗೊಳಿಸಿ",
    email_body: "ಆತ್ಮೀಯ {name},\n\nಖಾತೆ {id} {months} ತಿಂಗಳಿಂದ ನಿಷ್ಕ್ರಿಯ. RBI: 10 ವರ್ಷಗಳ ನಂತರ DEAF ನಿಧಿಗೆ ವರ್ಗಾವಣೆ.\n\nಬ್ಯಾಲೆನ್ಸ್: ₹{balance}\n\nಮರುಸಕ್ರಿಯ: 1800-XXX-XXXX\n{branch}\n\nಧನ್ಯವಾದ, ReActivate AI",
    ivr: "ಆತ್ಮೀಯ {name}, ಖಾತೆ {id} ನಿಷ್ಕ್ರಿಯ. ಮರುಸಕ್ರಿಯಗೊಳಿಸಲು 1 ಒತ್ತಿರಿ.",
    script: "Kannada", speakers: "44M",
  },
  Gujarati: {
    sms: "પ્રિય {name}, તમારું ખાતું {id} {months} મહિનાથી નિષ્ક્રિય. બેલેન્સ ₹{balance} સુરક્ષિત. ફરી સક્રિય: 1800-XXX-XXXX અથવા {branch}. — ReActivate AI",
    sms_en: "Dear {name}, your account {id} has been dormant for {months} months. Balance ₹{balance} is safe. Call 1800-XXX-XXXX or visit {branch}. — ReActivate AI",
    email_subject: "તમારું ખાતું નિષ્ક્રિય — અત્યારે જ સક્રિય કરો",
    email_body: "પ્રિય {name},\n\nખાતું {id} {months} મહિનાથી નિષ્ક્રિય. RBI: 10 વર્ષ બાદ DEAF ફંડ ટ્રાન્સફર.\n\nબેલેન્સ: ₹{balance}\n\nફરી સક્રિય: 1800-XXX-XXXX\n{branch}\n\nઆભાર, ReActivate AI",
    ivr: "પ્રિય {name}, ખાતું {id} નિષ્ક્રિય. ફરી સક્રિય કરવા 1 દબાવો.",
    script: "Gujarati", speakers: "55M",
  },
};

export function fillTemplate(template, account) {
  return template
    .replace(/{name}/g, (account.name || "").split(" ")[0])
    .replace(/{id}/g, account.id)
    .replace(/{balance}/g, Number(account.balance || 0).toLocaleString("en-IN"))
    .replace(/{months}/g, account.dormancyMonths || 0)
    .replace(/{branch}/g, account.branch || "nearest branch");
}

export function generateMessages(account) {
  const tpl = SMS_TEMPLATES[account.language] || SMS_TEMPLATES.Hindi;
  const sms = fillTemplate(tpl.sms, account);
  return {
    language: account.language,
    sms,
    sms_en: fillTemplate(tpl.sms_en, account),
    email_subject: fillTemplate(tpl.email_subject, account),
    email_body: fillTemplate(tpl.email_body, account),
    ivr: fillTemplate(tpl.ivr, account),
    char_count_sms: sms.length,
    sms_segments: Math.ceil(sms.length / 160),
  };
}

export function getSupportedLanguages() {
  return Object.entries(SMS_TEMPLATES).map(([lang, t]) => ({
    language: lang, script: t.script, speakers: t.speakers,
  }));
}
