import { motion } from "framer-motion";

export default function TrustBar() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="py-8 border-b border-border bg-muted/40"
    >
      <div className="max-w-5xl mx-auto px-6 flex flex-wrap justify-center items-center gap-x-10 gap-y-4">
        <p className="text-sm font-medium text-muted-foreground">
          Trusted by students at:
        </p>
        <div className="flex gap-8 font-bold text-sm tracking-wide text-foreground/70">
          {["CADT", "ITC", "RUPP", "UEC", "NPIC"].map((uni) => (
            <span key={uni} className="hover:text-primary transition-colors cursor-default">{uni}</span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
