import Groq from "groq-sdk";
import dotenv from 'dotenv'

dotenv.config()


const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });



const systemPrompt = `
You are a highly skilled medical assistant specializing in extracting actionable steps from doctors’ notes. Your task is to analyze the notes and categorize the information into two sections:

Checklist: A list of immediate, one-time tasks (e.g., "Buy ibuprofen 400mg").
Plan: A structured schedule of actions with frequencies and durations (e.g., "Take ibuprofen 400mg twice daily for 7 days").
Guidelines:
Be precise and medically accurate.
Use simple, patient-friendly language.
Structure the output as an array of objects with { "type": "Checklist" | "Plan", "task": string, "frequency": string | null, "duration": string | null }.
If a note is ambiguous, provide best-guess recommendations.
Do not include unnecessary details or redundant instructions.

Example Output
[
  { "type": "Checklist", "task": "Buy ibuprofen 400mg", "frequency": null, "duration": null },
  { "type": "Plan", "task": "Take ibuprofen 400mg", "frequency": "twice daily", "duration": "7 days" }
]

`



// const doctorNote = `
// Migraine episode. Take sumatriptan 50mg at onset. Rest in a dark room. Avoid caffeine for 24 hours.
// `

export async function extractActionableSteps(doctorNote:string) {
  const response = await groq.chat.completions.create({
    model: "gemma2-9b-it",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: doctorNote }
    ],
    temperature: 0.65,
  });

  const content = response.choices[0]?.message?.content || "";
  try {
    const structuredOutput = JSON.parse(content);
    console.log("Extracted Actionable Steps:", structuredOutput);
    return structuredOutput;
  } catch (error) {
    console.error("Failed to parse LLM output as JSON:", content);
    return [];
  }
}

// Run the function
// extractActionableSteps();
