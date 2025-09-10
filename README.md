# Stop US Funding to Israel — Static Site

## What this package contains
- `index.html` — responsive landing page
- `styles.css` — styling
- `script.js` — client-side logic
- `privacy.md` — privacy note (optional)

## Deploy
Two quick options:
1. **GitHub Pages**
   - Create a new GitHub repo, push these files to `main`, enable Pages in repo settings (root).
2. **Netlify**
   - Drag & drop the folder in Netlify Drop or connect the GitHub repo.

## Forms and Petitions
- The petition form currently posts to Formspree (`action="https://formspree.io/f/your-form-id"`). Replace `your-form-id` with your Formspree form ID, or swap the `action` to an ActionNetwork or backend endpoint.
-Embed the Action Network Petition by replacing the placeholder <form> in index.html with Action Network’s iframe embed. Replace your-petition-slug with the actual slug from Action Network’s URL. Adjust height="800" if the petition is cut off or leaves too much white space. Delete or comment out the old <form id="petition-form"> ... </form> block from before. You don’t need script.js petition code anymore — Action Network handles submissions, confirmation, and emails.
-Optimal Customization: You can override the iframe background with CSS:

iframe {
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 6px 18px rgba(9,30,66,.04);
}

-or You can also embed multiple petitions (if you run different campaigns) by adding multiple iframes on different sections.
-If you have your Action Network petition link, you can paste in the exact iframe code with your slug already filled in, so your site is fully wired.
-On Change.org you will:
1.Create a new petition.
2.Paste the title into the “Petition title” box.
3.Paste the petition text above into the description.
4.Set the target (President + Congress).
5.Upload a compelling image (like a U.S. flag with “Fund Communities Not War”).

## Notes & Legal
- This site is for lawful civic advocacy. Do **not** use targeted demographic persuasion or micro-targeting.
- Replace logos, domain, and analytics as needed. Consider HTTPS and privacy best practices.

## Citations
See the `index.html` sources section for links to official data (CFR, Congress, ForeignAssistance.gov).
