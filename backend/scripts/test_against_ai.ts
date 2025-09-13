// testing openai or smt
import OpenAI from "openai"
import fs from "fs"
const ai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
})
const imageBase64 = fs.readFileSync(__dirname + "/plant.jpg", { encoding: "base64" });

const response = await ai.chat.completions.create({
    model: "gpt-5",
    messages: [
        {
            role: "user",
            content: [
                { type: "text", text: "Identify the plant in this image.please provide specifics data about it." },
                {
                    type: "image_url",
                    image_url: { url: `data:image/jpeg;base64,${imageBase64}` },
                },
            ],
        },
    ],
});

console.log(response.choices)



