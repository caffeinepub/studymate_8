import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/sonner";
import {
  Bell,
  BookMarked,
  BookOpen,
  GraduationCap,
  LogIn,
  LogOut,
  PlayCircle,
  Search,
  User,
  Zap,
} from "lucide-react";
import { useState } from "react";
import BooksTab from "./components/BooksTab";
import CreateTab from "./components/CreateTab";
import MentorsTab from "./components/MentorsTab";
import ProfileTab from "./components/ProfileTab";
import VideosTab from "./components/VideosTab";
import { useCreditSystem } from "./hooks/useCreditSystem";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useIsAdmin } from "./hooks/useQueries";

type Tab = "videos" | "books" | "create" | "profile" | "mentors";

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("videos");
  const [searchQuery, setSearchQuery] = useState("");
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const { data: isAdmin } = useIsAdmin();
  const {
    credits,
    spendCredits,
    submitFeedback,
    feedbackGiven,
    VIDEO_COST,
    FEEDBACK_REWARD,
  } = useCreditSystem();

  const isLoggedIn = loginStatus === "success" && !!identity;
  const principal = identity?.getPrincipal().toString();
  const avatarInitials = principal ? principal.slice(0, 2).toUpperCase() : "G";

  const allTabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "videos", label: "Videos", icon: <PlayCircle className="h-4 w-4" /> },
    { id: "books", label: "Books", icon: <BookMarked className="h-4 w-4" /> },
    {
      id: "mentors",
      label: "Mentors",
      icon: <GraduationCap className="h-4 w-4" />,
    },
    { id: "profile", label: "Profile", icon: <User className="h-4 w-4" /> },
  ];

  // Only show Create tab to admins
  const tabs = isAdmin
    ? [
        {
          id: "videos" as Tab,
          label: "Videos",
          icon: <PlayCircle className="h-4 w-4" />,
        },
        {
          id: "books" as Tab,
          label: "Books",
          icon: <BookMarked className="h-4 w-4" />,
        },
        {
          id: "mentors" as Tab,
          label: "Mentors",
          icon: <GraduationCap className="h-4 w-4" />,
        },
        {
          id: "create" as Tab,
          label: "Create",
          icon: <BookOpen className="h-4 w-4" />,
        },
        {
          id: "profile" as Tab,
          label: "Profile",
          icon: <User className="h-4 w-4" />,
        },
      ]
    : allTabs;

  return (
    <div className="min-h-screen font-sans">
      <Toaster theme="dark" />

      {/* Sticky header */}
      <header
        className="sticky top-0 z-50 border-b border-border"
        style={{
          background: "rgba(10, 6, 8, 0.88)",
          backdropFilter: "blur(16px)",
        }}
      >
        <div className="max-w-screen-xl mx-auto px-6 h-16 flex items-center gap-6">
          {/* Brand */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center shadow-glow overflow-hidden bg-gradient-to-br from-primary/30 to-blue-900/40 border border-primary/20">
              <img
                src="/assets/generated/open-book-logo-transparent.dim_400x400.png"
                className="w-8 h-8 object-contain"
                alt="StudyMate"
              />
            </div>
            <span className="font-display font-bold text-foreground text-lg tracking-tight">
              StudyMate
            </span>
          </div>

          {/* Center Nav */}
          <nav
            className="hidden md:flex items-center gap-1 flex-1 justify-center"
            data-ocid="main.link"
          >
            {tabs.map((tab) => (
              <button
                type="button"
                key={tab.id}
                data-ocid={`nav.${tab.id}.link`}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                {tab.icon}
                {tab.label}
                {activeTab === tab.id && (
                  <span className="absolute bottom-0 left-4 right-4 h-0.5 rounded-full bg-primary" />
                )}
              </button>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="hidden lg:flex items-center gap-2 bg-secondary/60 border border-border rounded-full px-3 py-1.5">
              <Search className="h-3.5 w-3.5 text-muted-foreground" />
              <Input
                data-ocid="header.search_input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search resources…"
                className="border-0 bg-transparent h-auto p-0 text-sm w-36 focus-visible:ring-0 text-foreground placeholder:text-muted-foreground"
              />
            </div>

            {/* CP Badge */}
            <div
              data-ocid="header.credits.panel"
              className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 rounded-full px-3 py-1 cursor-default"
              title="Credit Points"
            >
              <Zap className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
              <span className="text-amber-400 font-bold text-xs">
                {credits} CP
              </span>
            </div>

            <button
              type="button"
              className="relative w-8 h-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              <Bell className="h-4 w-4" />
            </button>

            {isLoggedIn ? (
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
                    {avatarInitials}
                  </AvatarFallback>
                </Avatar>
                <Button
                  data-ocid="header.logout.button"
                  variant="ghost"
                  size="sm"
                  onClick={clear}
                  className="hidden lg:flex text-muted-foreground hover:text-foreground h-8 px-2"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </Button>
              </div>
            ) : (
              <Button
                data-ocid="header.login.button"
                size="sm"
                onClick={login}
                disabled={loginStatus === "logging-in"}
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-4 text-xs font-semibold"
              >
                <LogIn className="h-3.5 w-3.5 mr-1" />
                {loginStatus === "logging-in" ? "Connecting…" : "Login"}
              </Button>
            )}
          </div>

          {/* Mobile nav */}
          <div className="flex md:hidden items-center gap-1 ml-auto">
            {tabs.map((tab) => (
              <button
                type="button"
                key={tab.id}
                data-ocid={`nav.${tab.id}.tab`}
                onClick={() => setActiveTab(tab.id)}
                className={`p-2 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {tab.icon}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Tab content */}
      <main className="max-w-screen-xl mx-auto px-4 md:px-6 py-8">
        {activeTab === "videos" && (
          <VideosTab
            searchQuery={searchQuery}
            credits={credits}
            spendCredits={spendCredits}
            VIDEO_COST={VIDEO_COST}
          />
        )}
        {activeTab === "books" && <BooksTab />}
        {activeTab === "create" && isAdmin && <CreateTab />}
        {activeTab === "mentors" && <MentorsTab />}
        {activeTab === "profile" && (
          <ProfileTab
            credits={credits}
            submitFeedback={submitFeedback}
            feedbackGiven={feedbackGiven}
            FEEDBACK_REWARD={FEEDBACK_REWARD}
          />
        )}
      </main>

      <footer
        className="border-t border-border mt-16"
        style={{ background: "rgba(10,6,8,0.9)" }}
      >
        <div className="max-w-screen-xl mx-auto px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-md overflow-hidden flex items-center justify-center bg-gradient-to-br from-primary/30 to-blue-900/40 border border-primary/20">
                  <img
                    src="/assets/generated/open-book-logo-transparent.dim_400x400.png"
                    className="w-7 h-7 object-contain"
                    alt="StudyMate"
                  />
                </div>
                <span className="font-display font-bold text-foreground">
                  StudyMate
                </span>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Unlock your learning potential with curated educational videos
                and affordable textbooks.
              </p>
            </div>
            <div>
              <h4 className="text-foreground font-semibold mb-3 text-sm">
                Platform
              </h4>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveTab("videos")}
                    className="hover:text-foreground transition-colors"
                  >
                    Browse Videos
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveTab("books")}
                    className="hover:text-foreground transition-colors"
                  >
                    Marketplace
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setActiveTab("mentors")}
                    className="hover:text-foreground transition-colors"
                  >
                    Our Mentors
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-foreground font-semibold mb-3 text-sm">
                Subjects
              </h4>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>Mathematics</li>
                <li>Science</li>
                <li>English</li>
                <li>General Knowledge</li>
              </ul>
            </div>
            <div>
              <h4 className="text-foreground font-semibold mb-3 text-sm">
                Support
              </h4>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>
                  <a
                    href="/"
                    className="hover:text-foreground transition-colors"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="/"
                    className="hover:text-foreground transition-colors"
                  >
                    Community
                  </a>
                </li>
                <li>
                  <a
                    href="/"
                    className="hover:text-foreground transition-colors"
                  >
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-muted-foreground text-xs">
            <span>
              © {new Date().getFullYear()} StudyMate. All rights reserved.
            </span>
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              Built with ♥ using caffeine.ai
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
