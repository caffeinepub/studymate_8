import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  ChevronRight,
  HelpCircle,
  Info,
  LogIn,
  PlayCircle,
  Settings,
} from "lucide-react";
import { motion } from "motion/react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useGetBooks, useGetVideos } from "../hooks/useQueries";

export default function ProfileTab() {
  const { login, loginStatus, identity, clear } = useInternetIdentity();
  const isLoggedIn = loginStatus === "success" && !!identity;
  const principal = identity?.getPrincipal().toString() ?? "";
  const shortPrincipal = principal
    ? `${principal.slice(0, 8)}...${principal.slice(-4)}`
    : "";
  const avatarInitials = principal ? principal.slice(0, 2).toUpperCase() : "G";

  const { data: videos } = useGetVideos();
  const { data: books } = useGetBooks();

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
        className="grid grid-cols-2 gap-4 mb-8"
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
