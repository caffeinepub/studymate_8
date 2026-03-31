import { Badge } from "@/components/ui/badge";
import { BookOpen, GraduationCap, Zap } from "lucide-react";
import { motion } from "motion/react";

const SUBJECTS = ["Mathematics", "Science", "English", "General Knowledge"];

const MENTORS = [
  { name: "Raunak Mahaseth", initials: "RM", color: "bg-red-500" },
  { name: "Subhash Yadav", initials: "SY", color: "bg-blue-500" },
  { name: "Aman Adhikari", initials: "AA", color: "bg-green-500" },
  { name: "Hemraj Gupta", initials: "HG", color: "bg-purple-500" },
];

const VIDEO_COST = 2;

function MentorCard({
  mentor,
  index,
}: { mentor: (typeof MENTORS)[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      data-ocid={`mentors.item.${index + 1}`}
      className="bg-card border border-border rounded-2xl p-6 shadow-card hover:border-primary/40 transition-all duration-200 hover:shadow-glow flex flex-col gap-4"
    >
      {/* Avatar + name */}
      <div className="flex items-center gap-4">
        <div
          className={`w-16 h-16 rounded-full ${mentor.color} flex items-center justify-center flex-shrink-0 shadow-lg`}
        >
          <span className="text-white font-bold text-xl">
            {mentor.initials}
          </span>
        </div>
        <div>
          <h3 className="font-bold text-foreground text-base leading-tight">
            {mentor.name}
          </h3>
          <div className="flex items-center gap-1.5 mt-1">
            <GraduationCap className="h-3.5 w-3.5 text-primary" />
            <span className="text-primary text-xs font-semibold">Mentor</span>
          </div>
        </div>
      </div>

      {/* Badges */}
      <div className="flex items-center gap-2 flex-wrap">
        <Badge className="bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20 text-xs font-medium">
          Available for all subjects
        </Badge>
        <span className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold px-2 py-0.5 rounded-full">
          <Zap className="h-3 w-3 fill-amber-400" />
          Videos cost {VIDEO_COST} CP each
        </span>
      </div>

      {/* Subjects */}
      <div>
        <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wide mb-2">
          Covers
        </p>
        <ul className="space-y-1.5">
          {SUBJECTS.map((s) => (
            <li
              key={s}
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              <BookOpen className="h-3 w-3 text-primary flex-shrink-0" />
              {s}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

export default function MentorsTab() {
  return (
    <div>
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10"
      >
        <h1 className="font-display font-bold text-4xl md:text-5xl text-foreground leading-tight mb-4">
          Meet Your
          <br />
          <span className="text-primary">Mentors</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-xl">
          Learn from experienced mentors who cover all subjects and guide you
          towards academic excellence.
        </p>
      </motion.section>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {MENTORS.map((mentor, i) => (
          <MentorCard key={mentor.name} mentor={mentor} index={i} />
        ))}
      </div>
    </div>
  );
}
