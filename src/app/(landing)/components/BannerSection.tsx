import { motion } from "framer-motion";

const UNIVERSITIES = ["CADT", "ITC", "RUPP", "UEC", "AUPP", "PUC"];

export default function BannerSection() {
  return (
    <section id="for-students" className="py-20 md:py-28 px-6 bg-background">
      <div className="max-w-4xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold text-foreground"
        >
          Built for University Students
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-6 text-lg text-foreground/60 leading-relaxed"
        >
          Managing university life is difficult when information is scattered
          across Telegram, Facebook groups, and notebooks.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-3 text-foreground/70 font-medium"
        >
          Student Life brings everything together into one simple, clean, and
          reliable platform.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8 flex flex-wrap justify-center gap-3"
        >
          {UNIVERSITIES.map((uni) => (
            <motion.span
              key={uni}
              whileHover={{ scale: 1.05 }}
              className="px-5 py-2 rounded-full border-2 border-border text-sm font-semibold text-foreground/80 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all cursor-default"
            >
              {uni}
            </motion.span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
