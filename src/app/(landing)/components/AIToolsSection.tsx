import { motion } from "framer-motion";

export default function AIToolsSection() {
  return (
    <section id="ai" className="py-20 md:py-28 px-6 bg-muted/50">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold mb-4">
            ✨ Optional AI Features
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Study smarter with AI
          </h2>
          <p className="mt-4 text-foreground/60 text-lg max-w-xl mx-auto">
            Use AI when you need. Stay in full control over your learning.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            whileHover={{ y: -4 }}
            className="bg-card rounded-2xl p-8 border-2 border-border hover:border-primary/40 hover:shadow-soft transition-all"
          >
            <h3 className="text-xl font-bold text-foreground">
              AI Study Plan Generator
            </h3>
            <p className="mt-3 text-foreground/60 text-[15px] leading-relaxed">
              Create an assignment → click "Generate Study Plan". Get a
              personalized breakdown of what to study and when.
            </p>
            <ul className="mt-5 space-y-2.5 text-[15px] text-foreground/70">
              <li className="flex items-center gap-2">
                <span className="text-primary font-bold">✓</span> Accept, edit,
                or ignore the plan
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary font-bold">✓</span> Works with
                your real deadlines
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            whileHover={{ y: -4 }}
            className="bg-card rounded-2xl p-8 border-2 border-border hover:border-primary/40 hover:shadow-soft transition-all"
          >
            <h3 className="text-xl font-bold text-foreground">
              AI Chat Tutor + Summarizer
            </h3>
            <p className="mt-3 text-foreground/60 text-[15px] leading-relaxed">
              Upload notes, ask questions, get step-by-step solutions, or ask
              the AI to summarize your lecture.
            </p>
            <div className="mt-6 p-5 bg-muted rounded-xl text-[15px] border border-border text-foreground/70 italic">
              "Explain Newton's second law with examples from daily life in
              Cambodia"
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
