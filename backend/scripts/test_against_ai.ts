// testing openai or smt
import OpenAI from "openai";
import fs from "fs";
const ai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
const imageBase64 = fs.readFileSync(__dirname + "/plant.jpg", {
  encoding: "base64",
});

const response = await ai.chat.completions.create({
  model: "gpt-5",
  messages: [
    {
      role: "user",
      content: [
        {
          type: "text",
          text:
            "Identify the plant in this image." +
            "Provide the most likely name of the plant as well as its scientific name." +
            "Give your answer in the following format:" +
            "{" +
            "name: <\name>," +
            "scientific_name: <scientific_name>," +
            "areas_commonly_found_in: <areas_commonly_found_in>," +
            "fun_fact_about_this_plant" +
            "}." +
            "Do not provide any other information apart from anything within the JSON." +
            "Use as few tokens as possible." +
            "Keep answer as short as possible, but detailed enough to still have all of the information requested.",
        },
        {
          type: "image_url",
          image_url: { url: `data:image/jpeg;base64,${imageBase64}` },
        },
      ],
    },
  ],
});

console.log(response.choices);
