import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { readFile } from "node:fs/promises";

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

app.get("/entry/:id", (c) => {
    // Log the entire request object for debugging
    console.log(":: request object: ", c.req);

    // Extract and log the id parameter
    const { id } = c.req.param();
    console.log(":: extracted id: ", id);

    // Fallback handling and logging
    if (id === undefined) {
        console.log(":: id is undefined, something went wrong.");
        return c.text("Error: ID parameter is missing or undefined", 400);
    }
    const response = { "your id is": id };
    console.log(":: response: ", response);
    return c.json({ "your id is": id });
});

app.get("/", (c) => c.html(html));

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
