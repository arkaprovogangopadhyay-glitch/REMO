# Job Matcher & Tailored Resume Bot

A 100% client-side, privacy-first web app for matching your resume against any job description, spotting missing ATS keywords, comparing multiple roles, and generating a clean tailored resume in **PDF** or **DOCX** format.

## Features
- **Local Resume Upload:** Drag and drop `.pdf`, `.docx`, `.txt`, or `.md` resumes (up to 10 MB) or paste text directly.
- **Instant Match & ATS Gap Check:** Computes an overall match score, 4-dimension breakdown, matched vs. missing keyword chips, and a compact actionable edit checklist.
- **Tailored CV Studio:** Toggle which missing keywords to include, edit your tailored CV with a **Live Match Score** tracker, and export as `Tailored_Resume.pdf` or `Tailored_Resume.docx`.
- **Multi-Role Comparison:** Compare scores across multiple pasted job descriptions in a ranked session bar.
- **100% Private & Zero External CDNs:** All libraries (`pdf.js`, `JSZip`, `jsPDF`) are bundled locally in `vendor/`. No resumes or job descriptions ever leave your browser.

## Deploy Free on GitHub Pages (3 Steps)
1. Create a new public GitHub repository and upload all files from this ZIP (`index.html`, `vendor/`, `README.md`, `LICENSE`).
2. Go to **Settings → Pages** in your repository.
3. Under **Build and deployment**, choose **Deploy from a branch**, select `main` and `/ (root)`, and click **Save**. Your live site will be ready in ~1 minute.

## License
MIT License — see `LICENSE` for details.
