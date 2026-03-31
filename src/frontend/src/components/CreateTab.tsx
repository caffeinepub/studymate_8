import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { BookOpen, Loader2, Lock, Upload, Video } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useAddBook, useAddVideo, useIsAdmin } from "../hooks/useQueries";

type FormTab = "video" | "book";
const SUBJECTS = ["Mathematics", "Science", "English", "General Knowledge"];
const CONDITIONS = ["Excellent", "Good", "Fair", "Poor"];

export default function CreateTab() {
  const [formTab, setFormTab] = useState<FormTab>("video");
  const { data: isAdmin } = useIsAdmin();

  const [videoForm, setVideoForm] = useState({
    title: "",
    subject: "",
    description: "",
    duration: "",
    creator_name: "",
  });
  const [bookForm, setBookForm] = useState({
    title: "",
    author: "",
    subject: "",
    price: "",
    condition: "Good",
    description: "",
  });

  const addVideo = useAddVideo();
  const addBook = useAddBook();

  const handleVideoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoForm.title.trim() || !videoForm.subject) {
      toast.error("Please fill in title and subject");
      return;
    }
    try {
      await addVideo.mutateAsync({
        title: videoForm.title,
        subject: videoForm.subject,
        description: videoForm.description,
        creator_name: videoForm.creator_name || "StudyMate Administrator",
        duration: videoForm.duration || "0:00",
        thumbnail_url: "",
        is_published: true,
      });
      toast.success("Video uploaded successfully!");
      setVideoForm({
        title: "",
        subject: "",
        description: "",
        duration: "",
        creator_name: "",
      });
    } catch {
      toast.error("Failed to upload video");
    }
  };

  const handleBookSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !bookForm.title.trim() ||
      !bookForm.author.trim() ||
      !bookForm.price.trim()
    ) {
      toast.error("Please fill in all required fields");
      return;
    }
    try {
      await addBook.mutateAsync({
        title: bookForm.title,
        author: bookForm.author,
        subject: bookForm.subject,
        price: bookForm.price,
        condition: bookForm.condition,
        description: bookForm.description,
        seller_name: "Current User",
      });
      toast.success("Book listing created successfully!");
      setBookForm({
        title: "",
        author: "",
        subject: "",
        price: "",
        condition: "Good",
        description: "",
      });
    } catch {
      toast.error("Failed to create listing");
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-2">
          Create <span className="text-primary">Content</span>
        </h1>
        <p className="text-muted-foreground">
          Share your knowledge or list textbooks for sale
        </p>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-3 mb-8">
        <button
          type="button"
          data-ocid="create.video.tab"
          onClick={() => setFormTab("video")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
            formTab === "video"
              ? "bg-primary border-primary text-primary-foreground shadow-glow"
              : "bg-card border-border text-muted-foreground hover:text-foreground"
          }`}
        >
          <Video className="h-4 w-4" />
          Upload Video
          {!isAdmin && <Lock className="h-3 w-3 opacity-60" />}
        </button>
        <button
          type="button"
          data-ocid="create.book.tab"
          onClick={() => setFormTab("book")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border text-sm font-semibold transition-all ${
            formTab === "book"
              ? "bg-primary border-primary text-primary-foreground shadow-glow"
              : "bg-card border-border text-muted-foreground hover:text-foreground"
          }`}
        >
          <BookOpen className="h-4 w-4" />
          Sell Book
        </button>
      </div>

      <AnimatePresence mode="wait">
        {formTab === "video" && (
          <motion.div
            key="video"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.2 }}
          >
            {!isAdmin ? (
              <div className="bg-card border border-border rounded-2xl p-10 text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
                  <Lock className="h-8 w-8 text-primary" />
                </div>
                <h2 className="font-bold text-foreground text-xl mb-2">
                  Admin Only
                </h2>
                <p className="text-muted-foreground text-sm max-w-xs mx-auto leading-relaxed">
                  Only application administrators can upload educational videos
                  to maintain content quality and curriculum standards.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleVideoSubmit}
                data-ocid="create.video.modal"
                className="bg-card border border-border rounded-2xl p-6 space-y-5"
              >
                <h2 className="font-bold text-foreground text-xl mb-1">
                  Upload Educational Video
                </h2>

                <div className="space-y-2">
                  <Label className="text-muted-foreground text-sm">
                    Video Title *
                  </Label>
                  <Input
                    data-ocid="create.video.input"
                    value={videoForm.title}
                    onChange={(e) =>
                      setVideoForm((p) => ({ ...p, title: e.target.value }))
                    }
                    placeholder="e.g. Introduction to Quantum Physics"
                    className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-muted-foreground text-sm">
                    Creator Name
                  </Label>
                  <Input
                    data-ocid="create.creator.input"
                    value={videoForm.creator_name}
                    onChange={(e) =>
                      setVideoForm((p) => ({
                        ...p,
                        creator_name: e.target.value,
                      }))
                    }
                    placeholder="Your name or channel"
                    className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-muted-foreground text-sm">
                    Subject *
                  </Label>
                  <div className="flex flex-wrap gap-2">
                    {SUBJECTS.map((s) => (
                      <button
                        type="button"
                        key={s}
                        onClick={() =>
                          setVideoForm((p) => ({ ...p, subject: s }))
                        }
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                          videoForm.subject === s
                            ? "bg-primary border-primary text-primary-foreground"
                            : "bg-secondary border-border text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-muted-foreground text-sm">
                    Duration (e.g. 15:30)
                  </Label>
                  <Input
                    data-ocid="create.duration.input"
                    value={videoForm.duration}
                    onChange={(e) =>
                      setVideoForm((p) => ({ ...p, duration: e.target.value }))
                    }
                    placeholder="15:30"
                    className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-muted-foreground text-sm">
                    Description
                  </Label>
                  <Textarea
                    data-ocid="create.video.textarea"
                    value={videoForm.description}
                    onChange={(e) =>
                      setVideoForm((p) => ({
                        ...p,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Describe your video content…"
                    rows={4}
                    className="bg-secondary border-border text-foreground placeholder:text-muted-foreground resize-none"
                  />
                </div>

                <Button
                  data-ocid="create.video.submit_button"
                  type="submit"
                  disabled={addVideo.isPending}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-bold py-3"
                >
                  {addVideo.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Uploading…
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Video
                    </>
                  )}
                </Button>
              </form>
            )}
          </motion.div>
        )}

        {formTab === "book" && (
          <motion.div
            key="book"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            <form
              onSubmit={handleBookSubmit}
              data-ocid="create.book.modal"
              className="bg-card border border-border rounded-2xl p-6 space-y-5"
            >
              <h2 className="font-bold text-foreground text-xl mb-1">
                List Textbook for Sale
              </h2>

              <div className="space-y-2">
                <Label className="text-muted-foreground text-sm">
                  Book Title *
                </Label>
                <Input
                  data-ocid="create.book.input"
                  value={bookForm.title}
                  onChange={(e) =>
                    setBookForm((p) => ({ ...p, title: e.target.value }))
                  }
                  placeholder="e.g. Calculus: Early Transcendentals"
                  className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground text-sm">
                  Author *
                </Label>
                <Input
                  data-ocid="create.author.input"
                  value={bookForm.author}
                  onChange={(e) =>
                    setBookForm((p) => ({ ...p, author: e.target.value }))
                  }
                  placeholder="Author name"
                  className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-sm">
                    Subject
                  </Label>
                  <Input
                    data-ocid="create.subject.input"
                    value={bookForm.subject}
                    onChange={(e) =>
                      setBookForm((p) => ({ ...p, subject: e.target.value }))
                    }
                    placeholder="e.g. Mathematics"
                    className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-sm">
                    Price (Rs) *
                  </Label>
                  <Input
                    data-ocid="create.price.input"
                    value={bookForm.price}
                    onChange={(e) => {
                      let v = e.target.value.replace(/[^0-9.]/g, "");
                      const parts = v.split(".");
                      if (parts.length > 2)
                        v = `${parts[0]}.${parts.slice(1).join("")}`;
                      setBookForm((p) => ({ ...p, price: v }));
                    }}
                    placeholder="0.00"
                    className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground text-sm">
                  Condition
                </Label>
                <div className="flex gap-2 flex-wrap">
                  {CONDITIONS.map((c) => (
                    <button
                      type="button"
                      key={c}
                      onClick={() =>
                        setBookForm((p) => ({ ...p, condition: c }))
                      }
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                        bookForm.condition === c
                          ? "bg-primary border-primary text-primary-foreground"
                          : "bg-secondary border-border text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-muted-foreground text-sm">
                  Description
                </Label>
                <Textarea
                  data-ocid="create.book.textarea"
                  value={bookForm.description}
                  onChange={(e) =>
                    setBookForm((p) => ({ ...p, description: e.target.value }))
                  }
                  placeholder="Describe the book's condition and any notable details…"
                  rows={4}
                  className="bg-secondary border-border text-foreground placeholder:text-muted-foreground resize-none"
                />
              </div>

              <Button
                data-ocid="create.book.submit_button"
                type="submit"
                disabled={addBook.isPending}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-bold py-3"
              >
                {addBook.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating Listing…
                  </>
                ) : (
                  <>
                    <BookOpen className="h-4 w-4 mr-2" />
                    List Book for Sale
                  </>
                )}
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
