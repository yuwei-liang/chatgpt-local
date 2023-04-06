import { Configuration, OpenAIApi } from "openai";
import axios from 'axios';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
const GPT_3_5_TURBO = "gpt-3.5-turbo";
const GPT_4 = "gpt-4";
// const model = GPT_4
const model = GPT_3_5_TURBO;

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  try {
    const instance = axios.create({
        baseURL: 'https://api.openai.com/v1',
        // timeout: 1000,
        headers: {'Authorization': `Bearer ${configuration.apiKey}`},
      });
    const body = {
        model,
        // "messages": [{"role": "user", "content": question}]
        "messages": req.body
      }
    console.log("working on it ...");
    await instance.post('/chat/completions', body)
      .then(function (response) {
        console.log(response);
        const gptReply = response.data.choices[0].message.content;
        res.status(200).json({ result: gptReply });
      })
    console.log("DONE!");

  } catch(error) {
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}
