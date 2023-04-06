'use client';

import Head from "next/head";
import { useState } from "react";
import styles from "./page.module.css";
import Alert from '@mui/material/Alert';
import LoadingButton from '@mui/lab/LoadingButton';
import { Navbar, ListItem, Typography, Link } from "@mui/material";
import Box from '@mui/material/Box';
import List from '@mui/material/List';

export default function Home() {
  const [questionInput, setQuestionInput] = useState("");
  const [questions, setQuestions] = useState([]);
  const [result, setResult] = useState();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);

  function addQuestion(question) {
    setQuestions((questions) => [...questions, question]);
  }

  function createMessagesFromQuestions() {
    let messages = [
      { role: "system", content: "You are a helpful assistant." },
    ];
    questions.forEach((question) => {
      messages.push({ role: "user", content: question.question });
      messages.push({ role: "assistant", content: question.answer });
    });
    messages.push({ role: "user", content: questionInput });
    return messages;
  }

  async function onSubmit(event) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const messages = createMessagesFromQuestions();
      const response = await fetch("/api/askgpt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messages),
      });
      setLoading(false);

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }
      addQuestion(
        {
          question: questionInput,
          answer: data.result,
        }
      );
      setResult(data.result);
      setQuestionInput("");
    } catch(error) {
      console.error(error);
      setError(error);
    }
  }

  return (
    <div>
      <main className={styles.main}>
        <link rel="icon" href="/dog.png" />
        <Link href="/tools/StringUtils">StringUtils</Link>
        <img src="/dog.png" className={styles.icon} />
        <h3>Ask GPT anything!</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="question"
            placeholder="Enter a question"
            value={questionInput}
            onChange={(e) => setQuestionInput(e.target.value)}
          />
          <LoadingButton
            type="submit" variant="contained" loading={loading}
            loadingPosition="end"
          >
            <span>Ask GPT</span>
          </LoadingButton>
        </form>
        <Typography className={styles.result}>{result}</Typography>
        { error &&
          <Alert severity="error">{error.message}</Alert>
        }
        <Box>
          <List>
            {questions.map((question, index) => (
              <ListItem key={`q-${index}`}>{question.question} : {question.answer}</ListItem>
            ))}
          </List>
        </Box>
      </main>
    </div>
  );
}
