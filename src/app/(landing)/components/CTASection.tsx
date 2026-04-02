import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function CTASection() {
  const navigate = useNavigate();

  return (
    <section className="py-24 md:py-32 px-6 bg-gradient-cta relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-primary/5 rounded-full blur-3xl" />

      <div className="max-w-2xl mx-auto text-center relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight"
        >
          Ready to take control of your university life?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-5 text-lg md:text-xl text-white/80"
        >
          Join thousands of Cambodian students already organizing their academic
          life better.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <button
            onClick={() => navigate("/register")}
            className="mt-10 bg-white text-foreground hover:bg-white/95 hover:scale-[1.03] px-10 py-4 rounded-2xl font-bold text-lg transition-all active:scale-95 shadow-lg"
          >
            Create Your Free Account
          </button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-5 text-sm text-white/60"
        >
          Takes less than 30 seconds • No credit card needed
        </motion.p>
      </div>
    </section>
  );
}
