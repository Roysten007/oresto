import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = "AIzaSyBy45mr2PAXkE5G9G8oJDZH-RnDrfjKPjo";

async function listModels() {
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
  const data = await response.json();
  console.log(data.models.map(m => m.name));
}

listModels();
