import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { getLocalIp } from "./utils.js";
import express from "express";
import { engine } from "express-handlebars";
import { logSuccess } from "./log.js";
import notes from "./notes.js";
import { apis } from "./data/api.js";
export const serve = (port = 3000) => {
    const app = express();
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const __rootDir = join(__dirname, "..");
    app.use(express.static(join(__rootDir, "public")));
    app.engine("handlebars", engine());
    app.set("view engine", "handlebars");
    app.set("views", join(__rootDir, "views"));
    app.get("/notes?", (req, res) => {
        res.render("notes", {
            title: "Notes",
            css: [{ name: "notes" }],
        });
    });
    app.get("/api", (req, res) => {
        res.render("api", {
            title: "API",
            css: [{ name: "api" }],
            operations: apis,
        });
    });
    app.get("/about", (req, res) => {
        res.render("about", {
            title: "About",
        });
    });
    app.get("/api/notes?", (req, res) => {
        res.json({
            notes: notes.getAllNotes(),
        });
    });
    app.get("/api/notes?/:title", (req, res) => {
        res.json({
            exists: notes.hasNote(req.params.title),
            note: notes.getNote(req.params.title),
        });
    });
    app.get("/note/*", (req, res) => {
        res.json({
            error: "Note not found",
        });
    });
    app.get("*", (req, res) => {
        res.json({
            error: "Page not found",
        });
    });
    app.listen(port, () => {
        logSuccess(`Server Started listening on port ${port}!`);
        console.log(`- On This Machine: http://localhost:${port}`);
        console.log(`- On LAN Machines: http://${getLocalIp()}:${port}`);
        console.log("\nYou can see notes in the browser with the address,");
        console.log("or fetch notes data in json from the server using REST API.");
    });
};
//# sourceMappingURL=express.js.map