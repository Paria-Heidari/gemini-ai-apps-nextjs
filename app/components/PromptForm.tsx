"use client";
import { FormEvent, useState } from "react";
import styles from "./PromptForm.module.css";

const promptInit = "Gemini vs ChatGPT";
const BASE_URL = (process.env.NEXT_PUBLIC_BASE_URL ?? "").replace(/\/$/, "");

export const apiUrl = (path: string) =>
  path.startsWith("http")
    ? path
    : `${BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;

const PromptForm = () => {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>(promptInit);

  const generateText = async (event: FormEvent) => {
    event.preventDefault();
    setSummary(null);
    setLoading(true);

    try {
      const response = await fetch(apiUrl("/api//generate-gemini-ai"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error(data?.error);
      } else {
        setSummary(data.summary);
      }
    } catch (error) {
      console.error("Error:", error);
      return null;
    }

    setLoading(false);
  };
  return (
    <>
      <form onSubmit={generateText} className={styles.form}>
        <label className={styles.label}>Prompt</label>
        <textarea
          value={prompt}
          rows={5}
          onChange={(e) => setPrompt(e.target.value)}
          className={styles.textarea}
          required
        />
        <div className={styles.actions}>
          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? "Generating..." : "Generate"}
          </button>
          <button
            type="button"
            className={styles.button}
            onClick={() => {
              setPrompt("");
              setSummary(null);
            }}
          >
            Clear
          </button>
        </div>
      </form>
      {summary && (
        <div className={styles.summaryCard}>
          <h2> Response </h2>
          <div className={styles.summary}>{summary}</div>
        </div>
      )}
    </>
  );
};

export default PromptForm;
