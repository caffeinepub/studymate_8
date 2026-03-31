import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BookOpen,
  ChevronRight,
  Clock,
  PlayCircle,
  TrendingUp,
  User,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import type { Video } from "../backend.d";
import { useGetVideos } from "../hooks/useQueries";

interface Props {
  searchQuery: string;
  credits: number;
  spendCredits: (n: number) => boolean;
  VIDEO_COST: number;
}

const CATEGORIES = [
  "All",
  "Mathematics",
  "Science",
  "English",
  "General Knowledge",
];

const MENTORS = [
  "All Mentors",
  "Raunak Mahaseth",
  "Subhash Yadav",
  "Aman Adhikari",
  "Hemraj Gupta",
];

const SUBJECT_COLORS: Record<string, string> = {
  Mathematics: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  Science: "bg-green-500/20 text-green-300 border-green-500/30",
  English: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  "General Knowledge": "bg-purple-500/20 text-purple-300 border-purple-500/30",
  Business: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  Arts: "bg-orange-500/20 text-orange-300 border-orange-500/30",
};

function VideoCard({
  video,
  index,
  spendCredits,
  VIDEO_COST,
}: {
  video: Video;
  index: number;
  spendCredits: (n: number) => boolean;
  VIDEO_COST: number;
}) {
  const subjectClass =
    SUBJECT_COLORS[video.subject] ??
    "bg-secondary text-muted-foreground border-border";
  const thumb = video.thumbnail_url || null;

  const handlePlay = () => {
    const success = spendCredits(VIDEO_COST);
    if (!success) {
      toast.error(
        `Not enough CP! You need ${VIDEO_COST} CP to watch this video.`,
      );
      return;
    }
    toast.success(`Now playing: ${video.title}`);
    alert(`\u25b6 Playing: ${video.title}\n\n${video.description}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.35 }}
      data-ocid={`videos.item.${index + 1}`}
      className="bg-card border border-border rounded-2xl overflow-hidden shadow-card hover:border-primary/40 transition-all duration-200 hover:shadow-glow group cursor-pointer"
    >
      {/* Thumbnail */}
      <div className="relative w-full aspect-video overflow-hidden bg-secondary">
        {thumb ? (
          <img
            src={thumb}
            alt={video.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #1a1040 0%, #0c2040 100%)",
            }}
          >
            <BookOpen className="h-10 w-10 text-muted-foreground/40" />
          </div>
        )}
        {video.duration && (
          <span className="absolute bottom-2 right-2 bg-black/75 text-foreground text-xs font-medium px-2 py-0.5 rounded flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {video.duration}
          </span>
        )}
        {/* CP cost badge on thumbnail */}
        <span className="absolute top-2 left-2 flex items-center gap-0.5 bg-black/70 border border-amber-500/40 text-amber-400 text-xs font-bold px-2 py-0.5 rounded-full">
          <Zap className="h-3 w-3 fill-amber-400" />
          {VIDEO_COST} CP
        </span>
        {/* Play overlay - accessible button */}
        <button
          type="button"
          aria-label={`Play ${video.title}`}
          onClick={handlePlay}
          className="absolute inset-0 bg-black/0 group-hover:bg-black/30 flex items-center justify-center transition-all duration-200 w-full"
        >
          <div className="w-12 h-12 rounded-full bg-primary/90 flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-200 shadow-glow">
            <PlayCircle className="h-6 w-6 text-primary-foreground fill-primary-foreground" />
          </div>
        </button>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${subjectClass}`}
          >
            {video.subject}
          </span>
        </div>
        <h3 className="font-bold text-foreground text-sm leading-snug mb-1 line-clamp-2 group-hover:text-primary transition-colors">
          {video.title}
        </h3>
        <p className="text-muted-foreground text-xs line-clamp-2 mb-3 leading-relaxed">
          {video.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-xs flex items-center gap-1">
            <User className="h-3 w-3" />
            {video.creator_name}
          </span>
          <button
            type="button"
            data-ocid="videos.play.button"
            onClick={handlePlay}
            className="flex items-center gap-1 bg-primary hover:bg-primary/80 transition-colors rounded-full px-2.5 py-1"
          >
            <PlayCircle className="h-3.5 w-3.5 text-primary-foreground" />
            <span className="text-primary-foreground text-xs font-semibold flex items-center gap-0.5">
              <Zap className="h-3 w-3 fill-amber-300 text-amber-300" />
              {VIDEO_COST}
            </span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function VideosTab({
  searchQuery,
  credits,
  spendCredits,
  VIDEO_COST,
}: Props) {
  const [category, setCategory] = useState("All");
  const [mentor, setMentor] = useState("All Mentors");
  const { data: backendVideos, isLoading } = useGetVideos();

  const allVideos = backendVideos ?? [];

  const filtered = useMemo(() => {
    let list = allVideos;
    if (category !== "All")
      list = list.filter(([, v]) => v.subject === category);
    if (mentor !== "All Mentors")
      list = list.filter(([, v]) => v.creator_name === mentor);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        ([, v]) =>
          v.title.toLowerCase().includes(q) ||
          v.description.toLowerCase().includes(q),
      );
    }
    return list;
  }, [allVideos, category, mentor, searchQuery]);

  return (
    <div>
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10"
      >
        <h1 className="font-display font-bold text-4xl md:text-5xl text-foreground leading-tight mb-4">
          Unlock Your
          <br />
          <span className="text-primary">Learning Potential</span>
        </h1>
        <p className="text-muted-foreground text-lg mb-4 max-w-xl">
          Curated educational content from world-class educators. Learn at your
          own pace, anytime, anywhere.
        </p>
        {/* Credits info bar */}
        <div className="flex items-center gap-2 mb-6">
          <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 rounded-full px-3 py-1.5">
            <Zap className="h-4 w-4 text-amber-400 fill-amber-400" />
            <span className="text-amber-400 font-bold text-sm">
              {credits} CP available
            </span>
          </div>
          <span className="text-muted-foreground text-sm">
            &middot; Each video costs {VIDEO_COST} CP
          </span>
        </div>
        <Button
          data-ocid="videos.browse.primary_button"
          className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 py-3 font-bold text-sm tracking-wide shadow-glow"
        >
          BROWSE ALL VIDEOS
        </Button>
      </motion.section>

      {/* Category filter */}
      <div
        className="flex items-center gap-2 flex-wrap mb-4"
        data-ocid="videos.filter.tab"
      >
        {CATEGORIES.map((cat) => (
          <button
            type="button"
            key={cat}
            data-ocid={`videos.${cat.toLowerCase().replace(/ /g, "-")}.tab`}
            onClick={() => setCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              category === cat
                ? "bg-primary border-primary text-primary-foreground shadow-glow"
                : "bg-secondary/50 border-border text-muted-foreground hover:text-foreground hover:border-primary/40"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Mentor filter */}
      <div className="flex items-center gap-2 flex-wrap mb-8">
        <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wider mr-1 flex items-center gap-1">
          <User className="h-3 w-3" />
          Filter by Mentor:
        </span>
        {MENTORS.map((m) => (
          <button
            type="button"
            key={m}
            data-ocid={`videos.${m.toLowerCase().replace(/ /g, "-")}.tab`}
            onClick={() => setMentor(m)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              mentor === m
                ? "bg-primary border-primary text-primary-foreground shadow-glow"
                : "bg-secondary/50 border-border text-muted-foreground hover:text-foreground hover:border-primary/40"
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      {/* Main grid + sidebar */}
      <div className="flex gap-8">
        {/* Grid */}
        <div className="flex-1 min-w-0">
          {isLoading ? (
            <div
              data-ocid="videos.loading_state"
              className="grid grid-cols-1 sm:grid-cols-2 gap-6"
            >
              {["a", "b", "c", "d", "e", "f"].map((k) => (
                <div
                  key={`skel-vid-${k}`}
                  className="bg-card border border-border rounded-2xl overflow-hidden"
                >
                  <Skeleton className="w-full aspect-video" />
                  <div className="p-4 space-y-2">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div
              data-ocid="videos.empty_state"
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <BookOpen className="h-16 w-16 text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground text-lg font-medium">
                No videos found
              </p>
              <p className="text-muted-foreground/60 text-sm mt-1">
                {mentor !== "All Mentors"
                  ? `No videos by ${mentor} in this category yet`
                  : "Videos will appear here once the admin uploads them"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {filtered.map(([id, video], i) => (
                <VideoCard
                  key={id.toString()}
                  video={video}
                  index={i}
                  spendCredits={spendCredits}
                  VIDEO_COST={VIDEO_COST}
                />
              ))}
            </div>
          )}

          {filtered.length > 0 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              {[1, 2, 3].map((p) => (
                <button
                  type="button"
                  key={p}
                  data-ocid={
                    p === 1
                      ? "videos.pagination_prev"
                      : p === 3
                        ? "videos.pagination_next"
                        : undefined
                  }
                  className={`w-8 h-8 rounded-lg text-sm font-medium border transition-colors ${
                    p === 1
                      ? "bg-primary border-primary text-primary-foreground"
                      : "border-border text-muted-foreground hover:text-foreground hover:border-primary/40"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="hidden xl:flex flex-col gap-5 w-64 flex-shrink-0">
          <div className="bg-card border border-border rounded-2xl p-5">
            <h3 className="font-bold text-foreground text-sm mb-4">
              Popular Categories
            </h3>
            <ul className="space-y-2">
              {CATEGORIES.filter((c) => c !== "All").map((cat) => (
                <li key={cat}>
                  <button
                    type="button"
                    onClick={() => setCategory(cat)}
                    className="flex items-center justify-between w-full text-sm text-muted-foreground hover:text-foreground transition-colors group"
                  >
                    <span className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${category === cat ? "bg-primary" : "bg-secondary"} transition-colors`}
                      />
                      {cat}
                    </span>
                    <ChevronRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-card border border-border rounded-2xl p-5">
            <h3 className="font-bold text-foreground text-sm mb-3">Mentors</h3>
            <ul className="space-y-2">
              {MENTORS.filter((m) => m !== "All Mentors").map((m) => (
                <li key={m}>
                  <button
                    type="button"
                    onClick={() => setMentor(m)}
                    className="flex items-center gap-2 w-full text-sm text-muted-foreground hover:text-foreground transition-colors group"
                  >
                    <User
                      className={`h-3 w-3 flex-shrink-0 ${
                        mentor === m ? "text-primary" : ""
                      }`}
                    />
                    <span
                      className={mentor === m ? "text-primary font-medium" : ""}
                    >
                      {m}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            {mentor !== "All Mentors" && (
              <button
                type="button"
                onClick={() => setMentor("All Mentors")}
                className="mt-3 text-xs text-primary hover:underline"
              >
                Clear mentor filter
              </button>
            )}
          </div>

          <div className="bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-4 w-4 text-primary" />
              <h3 className="font-bold text-foreground text-sm">
                Trending Now
              </h3>
            </div>
            <p className="text-muted-foreground text-xs leading-relaxed">
              Videos will appear here once uploaded by the admin.
            </p>
          </div>

          <div
            className="bg-primary/10 border border-primary/30 rounded-2xl p-5"
            style={{
              background:
                "linear-gradient(135deg, rgba(229,57,53,0.15) 0%, rgba(7,27,58,0.6) 100%)",
            }}
          >
            <BookOpen className="h-8 w-8 text-primary mb-3" />
            <h3 className="font-bold text-foreground text-sm mb-1">
              Explore More
            </h3>
            <p className="text-muted-foreground text-xs mb-3 leading-relaxed">
              Browse our curated textbook marketplace for course materials.
            </p>
            <button
              type="button"
              className="text-primary text-xs font-bold flex items-center gap-1 hover:underline"
            >
              Browse Books <ChevronRight className="h-3 w-3" />
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
