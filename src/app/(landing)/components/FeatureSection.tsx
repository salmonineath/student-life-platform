import { motion } from "framer-motion";

const FEATURES = [
  {
    icon: "📅",
    bgClass: "bg-primary/10",
    title: "Smart Schedule",
    description:
      "Weekly timetable with your classes. Add, edit, and get smart reminders so you never miss a lecture.",
  },
  {
    icon: "📝",
    bgClass: "bg-amber-light",
    title: "Assignment Tracker",
    description:
      "Never miss a deadline again. Track assignments, set due dates, mark as done, and see everything at a glance.",
  },
  {
    icon: "👥",
    bgClass: "bg-emerald-light",
    title: "Study Groups",
    description:
      "Create or join study groups for your subjects. Chat, share files, and collaborate easily.",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.15, ease: "easeOut" },
  }),
};

export default function FeatureSection() {
  return (
    <section id="features" className="py-20 md:py-28 px-6 bg-background">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Manage Your Student Life in One Place
          </h2>
          <p className="mt-4 text-foreground/60 text-lg max-w-xl mx-auto">
            Plan your schedule, track assignments, and study with friends
            without stress.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={cardVariants}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="bg-card border-2 border-border rounded-2xl p-7 hover:border-primary/40 hover:shadow-soft transition-all group cursor-default"
            >
              <div
                className={`w-12 h-12 ${f.bgClass} rounded-xl flex items-center justify-center text-2xl mb-5 group-hover:scale-110 transition-transform`}
              >
                {f.icon}
              </div>
              <h3 className="text-xl font-bold text-foreground">{f.title}</h3>
              <p className="mt-2.5 text-foreground/60 leading-relaxed text-[15px]">
                {f.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
