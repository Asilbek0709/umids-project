"use client";

import { motion, AnimatePresence } from "motion/react";
import { TextField } from "@mui/material";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { styled } from "@mui/material/styles";
import { InputBase } from "@mui/material";
import OutlinedInput from "@mui/material/OutlinedInput";
import ListItemText from "@mui/material/ListItemText";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { useState, useEffect, useRef, useCallback, useMemo } from "react";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
      background: "rgb(22, 22, 22)",
      color: "white",
    },
  },
};

const darkRedSelectSx = {
  background: "rgb(22, 22, 22)",
  borderRadius: "8px",
  color: "white",
  fontFamily: "'Outfit', sans-serif",
  "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,0.2)" },
  "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "red" },
  "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "red" },
  "& .MuiSelect-icon": { color: "rgba(255,255,255,0.5)" },
};

const darkLabelSx = {
  color: "rgba(255,255,255,0.4)",
  fontFamily: "'Outfit', sans-serif",
  "&.Mui-focused": { color: "red" },
};

const BootstrapInput = styled(InputBase)(() => ({
  marginTop: 24,
  "& .MuiInputBase-input": {
    borderRadius: 8,
    backgroundColor: "rgb(22, 22, 22)",
    border: "1px solid rgba(255,255,255,0.2)",
    fontSize: 16,
    padding: "10px 12px",
    outline: "none",
    color: "white",
    fontFamily: "'Outfit', sans-serif",
    transition: "border-color 0.2s",
    "&:hover": { borderColor: "red" },
    "&:focus": { borderColor: "red" },
  },
}));

const genres = [
  { value: "all", label: "All" },
  { value: "action", label: "Action" },
  { value: "adventure", label: "Adventure" },
  { value: "animation", label: "Animation" },
  { value: "comedy", label: "Comedy" },
  { value: "crime", label: "Crime" },
  { value: "documentary", label: "Documentary" },
  { value: "drama", label: "Drama" },
  { value: "family", label: "Family" },
  { value: "fantasy", label: "Fantasy" },
  { value: "history", label: "History" },
  { value: "horror", label: "Horror" },
  { value: "music", label: "Music" },
  { value: "mystery", label: "Mystery" },
  { value: "romance", label: "Romance" },
  { value: "sci-fi", label: "Sci-Fi" },
  { value: "thriller", label: "Thriller" },
  { value: "tv-movie", label: "TV Movie" },
  { value: "war", label: "War" },
  { value: "western", label: "Western" },
];

// Debounce hook
function useDebounce(value, delay = 150) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

// Qidirilgan qismni qizil rangda ko'rsatish
function HighlightedText({ text, query }) {
  if (!query || !text) return <span>{text}</span>;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return <span>{text}</span>;
  return (
    <span>
      {text.slice(0, idx)}
      <span style={{ color: "red", fontWeight: 700 }}>
        {text.slice(idx, idx + query.length)}
      </span>
      {text.slice(idx + query.length)}
    </span>
  );
}

function SearchWithAutocomplete({ query, setQuery, getSuggestions }) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapperRef = useRef(null);
  const debouncedQuery = useDebounce(query, 150);

  // Lokal suggestions — sinxron, debounce bilan
  const suggestions = useMemo(() => {
  if (!getSuggestions || debouncedQuery.trim().length < 2) {
    return [];
  }

  return getSuggestions(debouncedQuery);
}, [debouncedQuery, getSuggestions]);

  // Tashqaridan bosiganda yopish
  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = useCallback(
    (title) => {
      setQuery(title);
    },
    [setQuery]
  );

  const handleKeyDown = (e) => {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      handleSelect(suggestions[activeIndex].title);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const isDropdownOpen =
    debouncedQuery.trim().length >= 2 && suggestions.length > 0;

  return (
    <div ref={wrapperRef} style={{ position: "relative", width: "min(900px, 90vw)" }}>
      <TextField
        id="outlined-basic"
        label="Qidirish..."
        variant="outlined"
        color="error"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => {
          if (suggestions.length > 0) setOpen(true);
        }}
        onKeyDown={handleKeyDown}
        autoComplete="off"
        sx={{
          width: "100%",
          "& .MuiOutlinedInput-root": {
            background: "rgb(22, 22, 22)",
            borderRadius: isDropdownOpen ? "12px 12px 0 0" : "12px",
            fontFamily: "'Outfit', sans-serif",
            transition: "background 0.2s",
            "&:hover": { background: "rgb(28, 28, 28)" },
          },
          "& .MuiInputLabel-root": {
            color: "rgba(255,255,255,0.4)",
            fontFamily: "'Outfit', sans-serif",
          },
          "& .MuiOutlinedInput-input": {
            color: "white",
            fontSize: "1rem",
            padding: "16px 20px",
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(255,255,255,0.2)",
            borderBottomColor: isDropdownOpen ? "transparent" : "rgba(255,255,255,0.2)",
          },
        }}
      />

      {/* Suggestions dropdown */}
      <AnimatePresence>
        {isDropdownOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.12 }}
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              background: "rgb(22, 22, 22)",
              border: "1px solid rgba(255,255,255,0.15)",
              borderTop: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "0 0 12px 12px",
              zIndex: 1000,
              overflow: "hidden",
              boxShadow: "0 20px 50px rgba(0,0,0,0.7)",
            }}
          >
            {suggestions.map((item, idx) => (
              <div
                key={item.id}
                onClick={() => handleSelect(item.title)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "10px 16px",
                  cursor: "pointer",
                  background: activeIndex === idx ? "rgba(255,0,0,0.1)" : "transparent",
                  borderBottom:
                    idx < suggestions.length - 1
                      ? "1px solid rgba(255,255,255,0.05)"
                      : "none",
                  transition: "background 0.12s",
                }}
                onMouseEnter={() => setActiveIndex(idx)}
                onMouseLeave={() => setActiveIndex(-1)}
              >
                {/* Poster */}
                <div
                  style={{
                    width: 34,
                    height: 50,
                    borderRadius: 5,
                    overflow: "hidden",
                    flexShrink: 0,
                    background: "rgb(38,38,38)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {item.poster ? (
                    <img
                      src={item.poster}
                      alt={item.title}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <span style={{ fontSize: 18 }}>🎬</span>
                  )}
                </div>

                {/* Nomi */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      color: "white",
                      fontFamily: "'Outfit', sans-serif",
                      fontSize: 14,
                      fontWeight: 500,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    <HighlightedText text={item.title} query={query} />
                  </div>
                  {item.originalTitle && item.originalTitle !== item.title && (
                    <div
                      style={{
                        color: "rgba(255,255,255,0.38)",
                        fontFamily: "'Outfit', sans-serif",
                        fontSize: 11,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {item.originalTitle}
                    </div>
                  )}
                </div>

                {/* Meta */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    gap: 3,
                    flexShrink: 0,
                  }}
                >
                  {item.year && (
                    <span
                      style={{
                        color: "rgba(255,255,255,0.4)",
                        fontFamily: "'Outfit', sans-serif",
                        fontSize: 11,
                      }}
                    >
                      {item.year}
                    </span>
                  )}
                  <span
                    style={{
                      background:
                        item.type === "Film"
                          ? "rgba(180,0,0,0.3)"
                          : "rgba(0,80,200,0.3)",
                      color: item.type === "Film" ? "#ff7070" : "#70aaff",
                      fontFamily: "'Outfit', sans-serif",
                      fontSize: 10,
                      padding: "2px 7px",
                      borderRadius: 20,
                      fontWeight: 600,
                    }}
                  >
                    {item.type}
                  </span>
                  {item.rating && (
                    <span
                      style={{
                        color: "#ffd700",
                        fontFamily: "'Outfit', sans-serif",
                        fontSize: 11,
                      }}
                    >
                      ★ {item.rating}
                    </span>
                  )}
                </div>
              </div>
            ))}

            {/* Klaviatura hint */}
            <div
              style={{
                padding: "5px 16px",
                borderTop: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <span
                style={{
                  color: "rgba(255,255,255,0.18)",
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: 10,
                }}
              >
                ↑↓ ko'chirish &nbsp;·&nbsp; Enter tanlash &nbsp;·&nbsp; Esc yopish
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function GenreSelect({ selectedGenres, setSelectedGenres }) {
  const handleChange = (event) => {
    const { value } = event.target;
    setSelectedGenres(typeof value === "string" ? value.split(",") : value);
  };

  return (
    <FormControl size="small" sx={{ minWidth: 160 }}>
      <InputLabel id="genre-multi-label" sx={darkLabelSx}>Janr</InputLabel>
      <Select
        labelId="genre-multi-label"
        multiple
        value={selectedGenres}
        onChange={handleChange}
        input={<OutlinedInput label="Janr" />}
        renderValue={(selected) => (
          <span style={{ color: "white", fontFamily: "'Outfit', sans-serif", fontSize: 14 }}>
            {selected.join(", ")}
          </span>
        )}
        MenuProps={MenuProps}
        sx={darkRedSelectSx}
      >
        {genres.map(({ value, label }) => {
          const isSelected = selectedGenres.includes(value);
          const Icon = isSelected ? CheckBoxIcon : CheckBoxOutlineBlankIcon;
          return (
            <MenuItem
              key={value}
              value={value}
              sx={{
                fontFamily: "'Outfit', sans-serif",
                color: "rgba(255,255,255,0.85)",
                "&:hover": { background: "rgba(255,0,0,0.08)" },
                "&.Mui-selected": { background: "#750d0d" },
              }}
            >
              <Icon
                fontSize="small"
                style={{
                  marginRight: 8,
                  padding: 9,
                  boxSizing: "content-box",
                  color: isSelected ? "red" : "rgba(255,255,255,0.4)",
                }}
              />
              <ListItemText primary={label} />
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
}

function LanguageSelect({ selectedLang, setSelectedLang }) {
  return (
    <FormControl size="small" sx={{ minWidth: 120 }}>
      <InputLabel id="lang-label" sx={darkLabelSx}>Til</InputLabel>
      <Select
        labelId="lang-label"
        value={selectedLang}
        label="Til"
        onChange={(e) => setSelectedLang(e.target.value)}
        sx={darkRedSelectSx}
      >
        <MenuItem value="" sx={{ fontFamily: "'Outfit', sans-serif", color: "rgba(255,255,255,0.5)" }}>
          Barchasi
        </MenuItem>
        {["uz", "ru"].map((l) => (
          <MenuItem
            key={l}
            value={l}
            sx={{
              fontFamily: "'Outfit', sans-serif",
              color: "white",
              "&:hover": { background: "rgba(255,0,0,0.08)" },
            }}
          >
            {l === "uz" ? "O'zbek" : "Rus"}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

function TypeSelect({ selectedType, setSelectedType }) {
  return (
    <FormControl size="small" sx={{ minWidth: 120 }}>
      <InputLabel id="type-label" sx={darkLabelSx}>Tur</InputLabel>
      <Select
        labelId="type-label"
        value={selectedType}
        label="Tur"
        onChange={(e) => setSelectedType(e.target.value)}
        sx={darkRedSelectSx}
      >
        <MenuItem value="" sx={{ fontFamily: "'Outfit', sans-serif", color: "rgba(255,255,255,0.5)" }}>
          Barchasi
        </MenuItem>
        {[{ v: "movies", l: "Filmlar" }, { v: "serials", l: "Seriallar" }].map(({ v, l }) => (
          <MenuItem
            key={v}
            value={v}
            sx={{
              fontFamily: "'Outfit', sans-serif",
              color: "white",
              "&:hover": { background: "rgba(255,0,0,0.08)" },
            }}
          >
            {l}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

function YearInput({ selectedYear, setSelectedYear }) {
  return (
    <FormControl variant="standard">
      <InputLabel shrink htmlFor="year-input" sx={darkLabelSx}>Yil</InputLabel>
      <BootstrapInput
        id="year-input"
        placeholder="2024"
        value={selectedYear}
        onChange={(e) => setSelectedYear(e.target.value)}
      />
    </FormControl>
  );
}

const Search = ({
  query,
  setQuery,
  selectedGenres,
  setSelectedGenres,
  selectedLang,
  setSelectedLang,
  selectedType,
  setSelectedType,
  selectedYear,
  setSelectedYear,
  getSuggestions, // Movies.jsx dan keladi
}) => {
  return (
    <div>
      <motion.div
        className="w-full"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col gap-4 items-center justify-end h-[200px]">
          <motion.h1
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="text-xl text-white"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            Qaysi filmni yoki serialni Topmoqchisiz?
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <SearchWithAutocomplete
              query={query}
              setQuery={setQuery}
              getSuggestions={getSuggestions}
            />
          </motion.div>
        </div>
      </motion.div>

      <Box
        sx={{
          display: "flex",
          gap: 2,
          p: "16px 0",
          flexWrap: "wrap",
          alignItems: "flex-end",
          width: "min(900px, 90vw)",
          margin: "0 auto",
        }}
      >
        <GenreSelect selectedGenres={selectedGenres} setSelectedGenres={setSelectedGenres} />
        <TypeSelect selectedType={selectedType} setSelectedType={setSelectedType} />
        <LanguageSelect selectedLang={selectedLang} setSelectedLang={setSelectedLang} />
        <YearInput selectedYear={selectedYear} setSelectedYear={setSelectedYear} />
      </Box>
    </div>
  );
};

export default Search;