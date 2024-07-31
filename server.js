import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { readFile } from "node:fs/promises";
import { genSalt, hash as _hash } from "bcrypt-ts";

const SALT_ROUNDS = 13;
const USERS = [];

// eslint-disable-next-line no-undef
const isProd = process.env["NODE_ENV"] === "production";
let html = await readFile(isProd ? "build/index.html" : "index.html", "utf8");
if (!isProd) {
    // Inject Vite client code to the HTML
    html = html.replace(
        "<head>",
        `<script type="module">
            import RefreshRuntime from "/@react-refresh"
            RefreshRuntime.injectIntoGlobalHook(window)
            window.$RefreshReg$ = () => {}
            window.$RefreshSig$ = () => (type) => type
            window.__vite_plugin_react_preamble_installed__ = true
        </script>
        <script type="module" src="/@vite/client"></script>`
    );
}

const app = new Hono();

app.get("/", (c) => c.html(html));

app.post("/signup", async (c) => {
    const { username, password } = await c.req.json();
    let newUser = {};
    try {
        const salt = await genSalt(SALT_ROUNDS);
        const hash = await _hash(password, salt);
        newUser = Object.freeze({ username, password: hash });
        USERS.push(newUser);
        return c.json({...newUser}, 201);
    } catch (error) {
        console.log("Failed to sign up new user: ", error.message);
    }
});

if (!isProd) {
    serve({ ...app, port: 3000 }, (info) => {
        console.log(`Listening on http://localhost:${info.port}`);
    });
}

if (isProd) {
    serve({ ...app, port: 4000 }, (info) => {
        console.log(`Listening on http://localhost:${info.port}`);
    });
}

export default app;
