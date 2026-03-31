import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { BookOpen, Search, Tag } from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";
import type { Textbook } from "../backend.d";
import { useGetBooks } from "../hooks/useQueries";

const PRICE_FILTERS = [
  "All",
  "Under Rs 200",
  "Under Rs 300",
  "Under Rs 500",
  "Over Rs 500",
];

const CONDITION_COLORS: Record<string, string> = {
  Excellent: "bg-green-500/20 text-green-300 border-green-500/30",
  Good: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  Fair: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  Poor: "bg-red-500/20 text-red-300 border-red-500/30",
};

const BOOK_COVERS = [
  "/assets/generated/book-cover-1.dim_240x320.jpg",
  "/assets/generated/book-cover-2.dim_240x320.jpg",
];

const SAMPLE_BOOKS: Array<[bigint, Textbook]> = [
  [
    1n,
    {
      title: "Calculus: Early Transcendentals, 9th Edition",
      author: "James Stewart",
      subject: "Mathematics",
      price: "4099",
      condition: "Good",
      description:
        "Comprehensive calculus textbook covering single and multivariable calculus with applications.",
      seller_name: "Emma Johnson",
    },
  ],
  [
    2n,
    {
      title: "Introduction to Algorithms (CLRS)",
      author: "Cormen, Leiserson, Rivest",
      subject: "Programming",
      price: "5400",
      condition: "Excellent",
      description:
        "The definitive algorithms textbook. Covers sorting, searching, graph algorithms and more.",
      seller_name: "DevStudent99",
    },
  ],
  [
    3n,
    {
      title: "Biology: The Science of Life",
      author: "Robert Wallace",
      subject: "Science",
      price: "180",
      condition: "Fair",
      description:
        "Introductory biology covering cell theory, genetics, evolution, and ecology.",
      seller_name: "BiologyMajor",
    },
  ],
  [
    4n,
    {
      title: "A Brief History of Time",
      author: "Stephen Hawking",
      subject: "Science",
      price: "250",
      condition: "Good",
      description:
        "Classic popular science book exploring time, black holes, and the Big Bang.",
      seller_name: "PhysicsNerd",
    },
  ],
  [
    5n,
    {
      title: "The Elements of Style",
      author: "Strunk & White",
      subject: "Languages",
      price: "120",
      condition: "Excellent",
      description: "Timeless guide to English composition and writing style.",
      seller_name: "LitMajor",
    },
  ],
  [
    6n,
    {
      title: "World History: Patterns of Interaction",
      author: "Beck, Black, Krieger",
      subject: "History",
      price: "350",
      condition: "Good",
      description:
        "Comprehensive world history textbook with maps, primary sources, and analysis.",
      seller_name: "HistoryBuff",
    },
  ],
];

function BookCard({
  id,
  book,
  index,
}: { id: bigint; book: Textbook; index: number }) {
  const condClass =
    CONDITION_COLORS[book.condition] ??
    "bg-secondary text-muted-foreground border-border";
  const cover = BOOK_COVERS[Number(id) % BOOK_COVERS.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.35 }}
      data-ocid={`books.item.${index + 1}`}
      className="bg-card border border-border rounded-2xl p-4 flex gap-4 hover:border-primary/40 hover:shadow-glow transition-all duration-200 cursor-pointer group"
    >
      {/* Cover */}
      <div className="flex-shrink-0 w-16 h-24 rounded-xl overflow-hidden bg-secondary">
        <img
          src={cover}
          alt={book.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-foreground text-sm leading-snug mb-1 line-clamp-2">
          {book.title}
        </h3>
        <p className="text-muted-foreground text-xs mb-2">{book.author}</p>
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Tag className="h-3 w-3" />
            {book.subject}
          </span>
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full border ${condClass}`}
          >
            {book.condition}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-primary font-bold text-lg">
            Rs {book.price}
          </span>
          <span className="text-muted-foreground text-xs">
            by {book.seller_name}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default function BooksTab() {
  const [search, setSearch] = useState("");
  const [priceFilter, setPriceFilter] = useState("All");
  const { data: backendBooks, isLoading } = useGetBooks();

  const allBooks =
    backendBooks && backendBooks.length > 0 ? backendBooks : SAMPLE_BOOKS;

  const filtered = useMemo(() => {
    let list = allBooks;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        ([, b]) =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          b.subject.toLowerCase().includes(q),
      );
    }
    if (priceFilter !== "All") {
      list = list.filter(([, b]) => {
        const p = Number.parseFloat(b.price);
        if (priceFilter === "Under Rs 200") return p < 200;
        if (priceFilter === "Under Rs 300") return p < 300;
        if (priceFilter === "Under Rs 500") return p < 500;
        if (priceFilter === "Over Rs 500") return p > 500;
        return true;
      });
    }
    return list;
  }, [allBooks, search, priceFilter]);

  return (
    <div>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="font-display font-bold text-3xl md:text-4xl text-foreground mb-2">
          Textbook <span className="text-primary">Marketplace</span>
        </h1>
        <p className="text-muted-foreground">
          Find affordable textbooks from fellow students
        </p>
      </motion.div>

      {/* Search */}
      <div className="relative mb-6 max-w-lg">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          data-ocid="books.search_input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search books, authors, subjects…"
          className="pl-9 bg-card border-border text-foreground placeholder:text-muted-foreground rounded-xl"
        />
      </div>

      {/* Price filters */}
      <div
        className="flex items-center gap-2 flex-wrap mb-8"
        data-ocid="books.filter.tab"
      >
        {PRICE_FILTERS.map((f) => (
          <button
            type="button"
            key={f}
            data-ocid={`books.${f.replace(/[^a-z0-9]/gi, "").toLowerCase()}.tab`}
            onClick={() => setPriceFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              priceFilter === f
                ? "bg-primary border-primary text-primary-foreground shadow-glow"
                : "bg-secondary/50 border-border text-muted-foreground hover:text-foreground hover:border-primary/40"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Count */}
      <p className="text-muted-foreground text-sm mb-4">
        {filtered.length} {filtered.length === 1 ? "book" : "books"} available
      </p>

      {/* Grid */}
      {isLoading ? (
        <div
          data-ocid="books.loading_state"
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {["a", "b", "c", "d", "e", "f"].map((k) => (
            <div
              key={`skel-book-${k}`}
              className="bg-card border border-border rounded-2xl p-4 flex gap-4"
            >
              <Skeleton className="w-16 h-24 rounded-xl" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-3 w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div
          data-ocid="books.empty_state"
          className="flex flex-col items-center justify-center py-20 text-center"
        >
          <BookOpen className="h-16 w-16 text-muted-foreground/30 mb-4" />
          <p className="text-muted-foreground text-lg font-medium">
            No books found
          </p>
          <p className="text-muted-foreground/60 text-sm mt-1">
            Try adjusting your search or price filter
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(([id, book], i) => (
            <BookCard key={id.toString()} id={id} book={book} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
