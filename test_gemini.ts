import { askGemini } from "./src/lib/gemini.ts";

async function test() {
  try {
    const res = await askGemini("Bonjour");
    console.log("Success:", res);
  } catch(e) {
    console.error("Fail:", e.message);
  }
}

test();
