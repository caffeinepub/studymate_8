import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  BookOpen,
  CheckCircle,
  ChevronRight,
  HelpCircle,
  Info,
  LogIn,
  MessageSquare,
  PlayCircle,
  Settings,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useGetBooks, useGetVideos } from "../hooks/useQueries";

interface Props {
  credits: number;
  submitFeedback: (text: string) => boolean;
  feedbackGiven: boolean;
  FEEDBACK_REWARD: number;
}

export default function ProfileTab({
  credits,
  submitFeedback,
  feedbackGiven,
  FEEDBACK_REWARD,
}: Props) {
  const { login, loginStatus, identity, clear } = useInternetIdentity();
  const isLoggedIn = loginStatus === "success" && !!identity;
  const principal = identity?.getPrincipal().toString() ?? "";
  const shortPrincipal = principal
    ? `${principal.slice(0, 8)}...${principal.slice(-4)}`
    : "";
  const avatarInitials = principal ? principal.slice(0, 2).toUpperCase() : "G";

  const { data: videos } = useGetVideos();
  const { data: books } = useGetBooks();

  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(feedbackGiven);

  const myVideos =
    videos?.filter(([, v]) => v.creator_name === "Current User") ?? [];
  const myBooks =
    books?.filter(([, b]) => b.seller_name === "Current User") ?? [];

  const menuItems = [
    {
      icon: <Settings className="h-5 w-5" />,
      label: "Settings",
      ocid: "profile.settings.button",
    },
    {
      icon: <HelpCircle className="h-5 w-5" />,
      label: "Help & Support",
      ocid: "profile.help.button",
    },
    {
      icon: <Info className="h-5 w-5" />,
      label: "About StudyMate",
      ocid: "profile.about.button",
    },
  ];

  const handleFeedbackSubmit = () => {
    if (feedbackText.trim().length < 10) return;
    const success = submitFeedback(feedbackText);
    if (success) {
      setFeedbackSubmitted(true);
    }
  };

  if (!isLoggedIn) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto text-center py-20"
      >
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <LogIn className="h-10 w-10 text-primary" />
        </div>
        <h2 className="font-display font-bold text-2xl text-foreground mb-2">
          Sign In to StudyMate
        </h2>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          Log in with Internet Identity to access your profile, track your
          videos, and manage book listings.
        </p>
        <Button
          data-ocid="profile.login.primary_button"
          onClick={login}
          disabled={loginStatus === "logging-in"}
          className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 font-bold shadow-glow"
        >
          {loginStatus === "logging-in"
            ? "Connecting…"
            : "Login with Internet Identity"}
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      {/* Profile header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <Avatar className="w-20 h-20 mx-auto mb-4">
          <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
            {avatarInitials}
          </AvatarFallback>
        </Avatar>
        <h2 className="font-display font-bold text-2xl text-foreground mb-1">
          StudyMate User
        </h2>
        <p className="text-muted-foreground text-sm font-mono">
          {shortPrincipal}
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-3 gap-4 mb-8"
      >
        <div className="bg-card border border-border rounded-2xl p-5 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <PlayCircle className="h-5 w-5 text-primary" />
          </div>
          <p className="text-3xl font-bold text-primary mb-1">
            {myVideos.length}
          </p>
          <p className="text-muted-foreground text-sm">Videos Uploaded</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <BookOpen className="h-5 w-5 text-primary" />
          </div>
          <p className="text-3xl font-bold text-primary mb-1">
            {myBooks.length}
          </p>
          <p className="text-muted-foreground text-sm">Books Listed</p>
        </div>
        {/* CP Balance card */}
        <div
          data-ocid="profile.credits.card"
          className="bg-card border border-amber-500/30 rounded-2xl p-5 text-center"
          style={{
            background:
              "linear-gradient(135deg, rgba(245,158,11,0.08) 0%, rgba(10,6,8,0.9) 100%)",
          }}
        >
          <div className="flex items-center justify-center gap-1 mb-1">
            <Zap className="h-5 w-5 text-amber-400 fill-amber-400" />
          </div>
          <p className="text-3xl font-bold text-amber-400 mb-1">{credits}</p>
          <p className="text-muted-foreground text-sm">CP Balance</p>
        </div>
      </motion.div>

      {/* Feedback section */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12 }}
        data-ocid="profile.feedback.panel"
        className="bg-card border border-border rounded-2xl p-6 mb-6"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center flex-shrink-0">
            <MessageSquare className="h-4 w-4 text-amber-400" />
          </div>
          <div>
            <h3 className="font-bold text-foreground text-sm">
              Share Your Feedback
            </h3>
            {!feedbackSubmitted && (
              <p className="text-amber-400 text-xs font-semibold flex items-center gap-1 mt-0.5">
                <Zap className="h-3 w-3 fill-amber-400" />
                Earn {FEEDBACK_REWARD} CP by sharing your feedback!
              </p>
            )}
          </div>
        </div>

        {feedbackSubmitted ? (
          <div
            data-ocid="profile.feedback.success_state"
            className="flex items-center gap-3 bg-green-500/10 border border-green-500/30 rounded-xl p-4"
          >
            <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
            <div>
              <p className="text-green-400 font-semibold text-sm">
                Thanks! +{FEEDBACK_REWARD} CP added to your balance.
              </p>
              <p className="text-muted-foreground text-xs mt-0.5">
                Your feedback helps us improve StudyMate.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <Textarea
              data-ocid="profile.feedback.textarea"
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Share your thoughts about StudyMate… (min. 10 characters)"
              className="bg-secondary/50 border-border text-foreground placeholder:text-muted-foreground resize-none min-h-[96px]"
            />
            <div className="flex items-center justify-between">
              <span
                className={`text-xs ${feedbackText.length >= 10 ? "text-green-400" : "text-muted-foreground"}`}
              >
                {feedbackText.length} / 10 min chars
              </span>
              <Button
                data-ocid="profile.feedback.submit_button"
                onClick={handleFeedbackSubmit}
                disabled={feedbackText.trim().length < 10}
                size="sm"
                className="bg-amber-500 hover:bg-amber-500/90 text-black font-bold rounded-full px-4"
              >
                <Zap className="h-3.5 w-3.5 mr-1 fill-black" />
                Submit & Earn {FEEDBACK_REWARD} CP
              </Button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Menu */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="space-y-3 mb-8"
      >
        {menuItems.map((item) => (
          <button
            type="button"
            key={item.label}
            data-ocid={item.ocid}
            className="w-full flex items-center gap-4 bg-card border border-border rounded-2xl px-5 py-4 hover:border-primary/40 hover:shadow-glow transition-all text-left group"
          >
            <span className="text-muted-foreground group-hover:text-foreground transition-colors">
              {item.icon}
            </span>
            <span className="flex-1 text-foreground font-medium">
              {item.label}
            </span>
            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
          </button>
        ))}
      </motion.div>

      <Button
        data-ocid="profile.logout.button"
        variant="outline"
        onClick={clear}
        className="w-full border-border text-muted-foreground hover:text-foreground rounded-xl"
      >
        Sign Out
      </Button>
    </div>
  );
}
