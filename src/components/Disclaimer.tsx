export default function Disclaimer() {
  return (
    <article aria-labelledby="disclaimer-title" className="max-w-3xl mx-auto">
      <header className="mb-8">
        <h1 id="disclaimer-title" className="text-2xl md:text-3xl font-bold text-slate-800 mb-3 tracking-tight">Disclaimer</h1>
        <p className="text-[13px] text-slate-400">Last updated: December 2024</p>
      </header>

      <div className="bg-white rounded-xl ring-1 ring-slate-100 shadow-sm p-6 md:p-8 space-y-6 text-[14px] text-slate-600 leading-relaxed">
        <section>
          <h2 className="text-base font-semibold text-slate-800 mb-2">1. General Disclaimer</h2>
          <p>The information provided on SFA Daily Articles is published for general informational and educational purposes only. All content is created by student writers and volunteers of the School-for-All Welfare Organization.</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-800 mb-2">2. Content Accuracy</h2>
          <p>While we strive to keep information accurate and up-to-date, SFA makes no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, or suitability of the information, articles, images, or other material contained on this website.</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-800 mb-2">3. Opinions & Views</h2>
          <p>The views and opinions expressed in articles, book reviews, letters, and stories are those of the individual student authors and do not necessarily reflect the official policy or position of the School-for-All Welfare Organization.</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-800 mb-2">4. External Links</h2>
          <p>Our website may contain links to external sites. SFA has no control over the content, privacy policies, or practices of any third-party websites. We encourage users to review the terms of any external site they visit.</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-800 mb-2">5. No Professional Advice</h2>
          <p>Content on this website does not constitute professional advice (educational, medical, legal, or otherwise). Readers should consult qualified professionals for specific guidance related to their circumstances.</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-800 mb-2">6. Limitation of Liability</h2>
          <p>In no event shall SFA, its writers, volunteers, or affiliates be liable for any loss or damage — including without limitation, indirect or consequential loss — arising from the use of this website or reliance on any content published herein.</p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-slate-800 mb-2">7. Contact</h2>
          <p>If you have concerns about any content on this website, please reach out to us through the contact form.</p>
        </section>
      </div>
    </article>
  );
}
