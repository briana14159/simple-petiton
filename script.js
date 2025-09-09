// script.js — minimal client logic
document.getElementById('year').textContent = new Date().getFullYear();

const findBtn = document.getElementById('find-rep');
const zipInput = document.getElementById('zip');
const emailPreview = document.getElementById('email-preview');
const repEmailSpan = document.getElementById('rep-email');
const emailBody = document.getElementById('email-body');
const openMail = document.getElementById('open-mail');
const copyScriptBtn = document.getElementById('copy-script');
const callScriptEl = document.getElementById('call-script');

findBtn.addEventListener('click', async () => {
  const zip = (zipInput.value || '').trim();
  if (!zip) { alert('Enter a ZIP code first'); return; }

  // Use official house.gov find-by-zip tool — construct a URL the user can open in new tab.
  // We will also attempt to fetch a representative's contact page (best-effort).
  const houseLookup = `https://www.house.gov/representatives/find-your-representative#searchresults`;
  // Show email preview with instructions (we cannot reliably fetch an email cross-origin)
  repEmailSpan.textContent = 'your-rep@house.gov (open official page)';
  emailBody.textContent = `Dear Representative,\n\nI am a constituent from ZIP ${zip}. I urge you to oppose unconditional U.S. military funding to Israel and to support measures that condition aid on humanitarian protections, civilian safety, and accountability. Please tell me how you will vote on legislation that affects foreign military assistance.\n\nSincerely,\n[your name]`;
  openMail.href = `mailto:?subject=${encodeURIComponent('Reconsider U.S. military aid to Israel')}&body=${encodeURIComponent(emailBody.textContent)}`;
  emailPreview.setAttribute('aria-hidden', 'false');

  // Provide an instructional popup linking to the official lookup:
  if (confirm('Open the official House "Find your representative" page for ZIP lookup? (recommended)')) {
    window.open(`https://www.house.gov/representatives/find-your-representative?zip=${encodeURIComponent(zip)}`, '_blank');
  }
});

// copy call script
copyScriptBtn.addEventListener('click', () => {
  const text = callScriptEl.textContent;
  navigator.clipboard?.writeText(text).then(()=> alert('Call script copied to clipboard'), ()=> alert('Copy failed — select and copy manually'));
});

// petition form: show a small confirmation
const petitionForm = document.getElementById('petition-form');
petitionForm.addEventListener('submit', (e)=>{
  // allow default to submit to configured endpoint; show friendly confirmation UI
  setTimeout(()=> alert('Thank you — your signature was submitted.'), 500);
});
