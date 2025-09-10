// script.js
document.getElementById('year').textContent = new Date().getFullYear();

// Simple SVG logo injection (replace with your chosen SVG - see logos section)
const logoHolder = document.getElementById('svg-logo');
logoHolder.innerHTML = `<svg width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><rect width="48" height="48" rx="8" fill="#083d77"/><text x="24" y="30" font-size="18" text-anchor="middle" fill="#fff" font-family="sans-serif">SF</text></svg>`;

// Tone copy map
const TONES = {
  informational: {
    head: "Hold Congress accountable: end unconditional military aid",
    sub: "Use verified facts and lawful civic channels to ask Congress to reassess U.S. military funding to Israel.",
    emailSubject: "Reconsider U.S. military aid to Israel",
    emailBody: (zip)=>`Dear Representative,\n\nI am a constituent from ZIP ${zip || '[ZIP]'}. I urge you to reconsider U.S. military assistance to Israel and to support measures that condition aid on humanitarian protections, civilian safety, and accountability. Please inform me how you will vote on legislation affecting foreign military assistance.\n\nSincerely,\n[your name]`
  },
  urgent: {
    head: "Act Now — Demand Congress stop unconditional funding",
    sub: "Immediate action is needed. Contact your representatives and call for an immediate review of U.S. military funding to Israel.",
    emailSubject: "Urgent: Stop U.S. military funding to Israel",
    emailBody: (zip)=>`Dear Representative,\n\nThis is urgent. As a constituent from ZIP ${zip || '[ZIP]'}, I demand you oppose continued U.S. military funding to Israel until strict humanitarian conditions, civilian protections, and independent accountability measures are in place. Please state how you will act.\n\nSincerely,\n[your name]`
  },
  grassroots: {
    head: "People-powered demand: rethink US funding",
    sub: "Join others in asking Congress to condition aid on civilian protection and accountability.",
    emailSubject: "Please reconsider U.S. military aid to Israel",
    emailBody: (zip)=>`Dear Representative,\n\nI’m a constituent from ZIP ${zip || '[ZIP]'} and I join many others in requesting that you reconsider U.S. military assistance to Israel and support measures prioritizing civilian protection and accountability. Thank you for your consideration.\n\nSincerely,\n[your name]`
  }
};

const toneSelect = document.getElementById('tone');
const heroHead = document.getElementById('hero-head');
const heroSub = document.getElementById('hero-sub');
const callScript = document.getElementById('call-script');
const emailBodyPre = document.getElementById('email-body');
const emailSubjectEl = document.getElementById('email-subject');

// Initialize tone
function setTone(t){
  const data = TONES[t];
  heroHead.textContent = data.head;
  heroSub.textContent = data.sub;
  emailSubjectEl.textContent = data.emailSubject;
  callScript.textContent = data.emailBody('').replace(/\n/g,' ');
  // for empty ZIP initially
  emailBodyPre.textContent = data.emailBody('');
}
setTone('informational');

toneSelect.addEventListener('change', ()=> setTone(toneSelect.value));

// Find rep & compose email
const findBtn = document.getElementById('find-rep');
const zipInput = document.getElementById('zip');
const emailPreview = document.getElementById('email-preview');
const repEmailSpan = document.getElementById('rep-email');
const openMail = document.getElementById('open-mail');

findBtn.addEventListener('click', () => {
  const zip = (zipInput.value || '').trim();
  if(!zip){ alert('Enter a ZIP code first'); return; }
  // Update email preview with chosen tone
  const tone = toneSelect.value;
  const body = TONES[tone].emailBody(zip);
  emailBodyPre.textContent = body;
  repEmailSpan.textContent = 'Open the official House/Senate page (click OK)';
  openMail.href = `mailto:?subject=${encodeURIComponent(TONES[tone].emailSubject)}&body=${encodeURIComponent(body)}`;
  emailPreview.setAttribute('aria-hidden','false');

  if(confirm('Open the official House "Find your representative" page (recommended)?')){
    window.open(`https://www.house.gov/representatives/find-your-representative?zip=${encodeURIComponent(zip)}`,'_blank');
  }
});

// copy call script
document.getElementById('copy-script').addEventListener('click', ()=>{
  const txt = callScript.textContent;
  navigator.clipboard?.writeText(txt).then(()=> alert('Call script copied'), ()=> alert('Copy failed — select and copy manually'));
});

// Petition backend chooser
const petitionType = document.getElementById('petition-type');
const petitionForm = document.getElementById('petition-form');
const petitionInstructions = document.getElementById('petition-instructions');

petitionType.addEventListener('change', ()=> {
  const t = petitionType.value;
  // default to Formspree
  if(t === 'formspree'){
    petitionForm.action = 'https://formspree.io/f/your-form-id'; // replace
    petitionForm.method = 'POST';
  } else if(t === 'actionnetwork'){
    // We'll capture submit via JS and POST to ActionNetwork API or open widget
    petitionForm.action = '#';
    petitionForm.method = 'POST';
  } else if(t === 'google-sheets'){
    petitionForm.action = 'https://script.google.com/macros/s/YOUR_DEPLOYED_SCRIPT_ID/exec'; // replace after deploying Apps Script
    petitionForm.method = 'POST';
  } else if(t === 'server-endpoint'){
    petitionForm.action = '/.netlify/functions/submitSignature'; // example Netlify function
    petitionForm.method = 'POST';
  }
});

// Submit handler for ActionNetwork (best-effort JS example)
petitionForm.addEventListener('submit', async (e) => {
  const t = petitionType.value;
  if(t === 'actionnetwork'){
    e.preventDefault();
    // Replace these IDs with your ActionNetwork form/campaign ids if using API
    const ACTIONNETWORK_API_URL = 'https://actionnetwork.org/api/v2/forms/YOUR_FORM_ID/submissions';
    // This endpoint normally requires server-side API key; client-side calls are not recommended for security.
    // Instead, set up a server endpoint that holds your API key and forwards submissions.
    alert('ActionNetwork selected — for security you should forward submissions through a server-side endpoint that holds your ActionNetwork API key. See README.');
    return;
  }
  // For other types, allow default form submit to configured action.
});
// Load petition content
fetch('content/petition.md')
  .then(res => res.text())
  .then(text => {
    // Parse frontmatter (YAML at top of markdown)
    const frontmatterMatch = /^---([\s\S]*?)---/.exec(text);
    let body = text;

    if (frontmatterMatch) {
      const yaml = frontmatterMatch[1].trim();
      body = text.replace(frontmatterMatch[0], '').trim();

      // crude YAML parsing (only key: value per line)
      const data = {};
      yaml.split('\n').forEach(line => {
        const [key, ...rest] = line.split(':');
        if (key && rest) data[key.trim()] = rest.join(':').trim().replace(/"/g, '');
      });

      document.getElementById('petition-title').textContent = data.title || '';
      document.getElementById('petition-subtitle').textContent = data.subtitle || '';
      document.getElementById('petition-button').textContent = data.button || 'Sign Petition';
    }

    document.getElementById('petition-body').innerHTML = marked.parse(body); // requires marked.js
  });

// Load design settings
fetch('content/design.json')
  .then(res => res.json())
  .then(design => {
    const styleEl = document.getElementById('dynamic-styles');
    styleEl.innerHTML = `
      body {
        font-family: ${design.font || 'Arial, sans-serif'};
        background-color: ${design.primary_color || '#ffffff'};
      }
      h1, h2, button {
        color: ${design.secondary_color || '#000000'};
      }
      button {
        background-color: ${design.primary_color || '#0066cc'};
        color: #fff;
        padding: 0.5em 1em;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }
    `;

    if (design.logo) {
      const header = document.querySelector('header');
      if (header) {
        header.innerHTML = `<img src="${design.logo}" alt="Logo" style="max-height:50px;">` + header.innerHTML;
      }
    }
  });

