import { SQL } from "bun";
import { App } from "./server";
import { z } from "zod";
import { SignJWT, jwtVerify } from "jose";
import OpenAI from "openai"

const env = process.env;
const registerAndLoginBody = z.object({
    email: z.email().max(100),
    password: z.string().min(4).max(100),
});

const ai = new OpenAI({
    apiKey: env.OPENAI_API_KEY
})

// simple http server
const app = new App();
const db = new SQL({
    url: process.env.DATABASE_URL!,
});

const createAuditLog = (action: string, metadata?: any, uid?: string) => {
    return db`INSERT INTO audit_log (action, metadata, user_id) VALUES (${action}, ${metadata ? JSON.stringify(metadata) : null}, ${uid ? uid : null})`.catch(
        (e) => {
            console.error("Failed to create audit log:", e);
        },
    );
};
app.use(async (req, next) => {
    console.log(`${req.method} ${new URL(req.url).pathname}`);
    return next();
});

app.get("/", () => new Response("Hello Bun!"));
// app.get('/test_db', async () => {
//     const result = await db`SELECT 1`
//     return new Response(JSON.stringify(result))
// })

const JWT_SECRET = new TextEncoder().encode(env.JWT_SECRET); // replace with env var
const JWT_EXPIRY = "48h";

const sanitizeInput = (t: string) => t.replace(/['"]/g, "");

// 🔑 Generate JWT
async function generateToken(payload: object) {
    //@ts-ignore
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime(JWT_EXPIRY)
        .sign(JWT_SECRET);
}

// 🔑 Verify JWT
async function verifyToken(token: string) {
    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        return payload;
    } catch {
        return null;
    }
}

app.post("/register", async (req, res) => {
    const body = await req.json();
    const parsed = registerAndLoginBody.safeParse(body);
    if (!parsed.success) {
        return new Response(JSON.stringify(parsed.error.format()), { status: 400 });
    }
    const { email, password } = parsed.data;
    const passwordHash = Bun.password.hashSync(password);
    let uv = null;
    try {
        uv =
            await db`INSERT INTO users (email, password_hash) VALUES (${sanitizeInput(email)}, ${passwordHash})`;
    } catch (e) {
        console.error(e);
        return new Response("User already exists", { status: 400 });
    }
    createAuditLog(`UserRegistration`, { email }, undefined);
    const token = await generateToken({ email });
    return new Response(JSON.stringify({ token }), { status: 201 });
});
app.post("/login", async (req, res) => {
    const body = await req.json();
    const parsed = registerAndLoginBody.safeParse(body);
    if (!parsed.success) {
        return new Response(JSON.stringify(parsed.error.format()), { status: 400 });
    }
    const { email, password } = parsed.data;
    const user =
        await db`SELECT * FROM users WHERE email = ${sanitizeInput(email)}`;
    if (user.length === 0) {
        return new Response("Invalid email or password", { status: 400 });
    }
    const passwordHash = user[0].password_hash;
    if (!Bun.password.verify(password, passwordHash)) {
        return new Response("Invalid email or password", { status: 401 });
    }
    console.log(user);
    createAuditLog(`UserLogin`, { email }, user[0].id.toString());
    const token = await generateToken({ email });
    return new Response(JSON.stringify({ token }), { status: 200 });
});

app.get("/my-db-info", async (req, res) => {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return new Response("Unauthorized", { status: 401 });
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
        return new Response("Unauthorized", { status: 401 });
    }
    const payload = await verifyToken(token!);
    if (!payload) {
        return new Response("Unauthorized", { status: 401 });
    }
    const email = payload.email as string;
    const user =
        await db`SELECT id, email, created_at FROM users WHERE email = ${sanitizeInput(email)}`;
    if (user.length === 0) {
        return new Response("User not found", { status: 404 });
    }
    return new Response(JSON.stringify(user[0]), { status: 200 });
});
app.get("/health", async () => {
    await db`SELECT 1`;
    return new Response("200");
});
app.get('/admin/audit-logs', async (req) => {
    const queryParams = new URL(req.url).searchParams;
    const aq = queryParams.get('auth_query');
    if (!aq || aq && aq !== env.ADMIN_AUTH_QUERY) {
        return new Response("Unauthorized", { status: 401 });
    }

    const limit = queryParams.get("limit") ? parseInt(queryParams.get("limit")!) : 50;
    const offset = queryParams.get("offset") ? parseInt(queryParams.get("offset")!) : 0;

    const logs = await db`
        SELECT * FROM audit_log
        LIMIT ${limit}
        OFFSET ${offset}
    `;

    const rows = logs.map(log => `
        <tr>
            <td>${log.id}</td>
            <td>${log.action}</td>
            <td>${log.user_id}</td>
            <td>${log.created_at}</td>
        </tr>
    `).join("");

    const prevOffset = Math.max(offset - limit, 0);
    const nextOffset = offset + limit;

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Audit Logs</title>
        <style>
            body { font-family: sans-serif; padding: 20px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
            th { background: #f4f4f4; }
            .buttons { display: flex; gap: 10px; }
        </style>
    </head>
    <body>
        <h1>Audit Logs</h1>
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Action</th>
                    <th>User ID</th>
                    <th>Created At</th>
                </tr>
            </thead>
            <tbody>
                ${rows}
            </tbody>
        </table>
        <div class="buttons">
            <a href="/admin/audit-logs?limit=${limit}&offset=${prevOffset}&auth_query=${aq}">
                <button ${offset === 0 ? "disabled" : ""}>Prev</button>
            </a>
            <a href="/admin/audit-logs?limit=${limit}&offset=${nextOffset}&auth_query=${aq}">
                <button ${logs.length < limit ? "disabled" : ""}>Next</button>
            </a>
        </div>
    </body>
    </html>
    `;

    return new Response(html, {
        headers: { "Content-Type": "text/html" }
    });
});

app.post('/plantai', async (req) => {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return new Response("Unauthorized", { status: 401 });
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
        return new Response("Unauthorized", { status: 401 });
    }
    const payload = await verifyToken(token!);
    if (!payload) {
        return new Response("Unauthorized", { status: 401 });
    }
    const imageBase64 = await req.text();
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
    createAuditLog("PlantAi");
    return new Response(JSON.stringify(response.choices), { status: 200 });
})

app.listen(3000);
console.log(`Server running on http://localhost:3000`);
// audit log ts
createAuditLog(`ServerStarted`, { starting_date: new Date().toISOString() });
