import { existsSync, readFileSync, writeFileSync } from "fs";
import { formatError, formatSuccess, formatWarning } from "./log.js";
export class Note {
    constructor(title, body, createdAt = new Date(), lastModifiedAt = new Date()) {
        this.toString = () => {
            return `${this.info()}\n${this.body}\n`;
        };
        this.info = () => {
            return `=== ${this.title} ===\nCreated at:${this.createdAt}\nLast Modified at:${this.lastModifiedAt}\n`;
        };
        this.title = title;
        this.body = body;
        this.createdAt = createdAt;
        this.lastModifiedAt = lastModifiedAt;
    }
}
export class NotesData {
    constructor(notes = new Map()) {
        this.add = (title, body) => {
            if (!this.exist(title)) {
                const newNote = new Note(title, body);
                this.notes.set(title, newNote);
                console.log(formatSuccess("New note added!\n") + newNote.toString());
                return true;
            }
            console.log(formatWarning(`Note of the same title already exists!\n`) + this.notes.get(title).toString());
            return false;
        };
        this.remove = (title) => {
            if (this.exist(title)) {
                this.notes.delete(title);
                console.log(formatSuccess("Note deleted!\n") + `${title}`);
                return true;
            }
            NotesData.warnNoteNotExist(title);
            return false;
        };
        this.update = (title, newBody) => {
            if (this.exist(title)) {
                const noteOfInterest = this.notes.get(title);
                const origBody = noteOfInterest.body;
                if (origBody !== newBody) {
                    noteOfInterest.body = newBody;
                    noteOfInterest.lastModifiedAt = new Date();
                    console.log(formatSuccess("Note updated!\n") + noteOfInterest.toString());
                    return true;
                }
                else {
                    console.log(formatWarning(`Note title does not need to be updated!\n`) + noteOfInterest.info());
                    return false;
                }
            }
            NotesData.warnNoteNotExist(title);
            return false;
        };
        this.exist = (title) => {
            return this.notes.has(title);
        };
        this.titles = () => {
            return Array.from(this.notes.keys());
        };
        this.notes = notes;
    }
    static serializationReplacer(key, value) {
        if (value instanceof (Map)) {
            return {
                dataType: "Map",
                value: Array.from(value.entries()),
            };
        }
        return value;
    }
    static deserializationReviver(key, value) {
        if (typeof value === "object" && value !== null) {
            if (value.dataType === "Map") {
                const map = new Map();
                value.value.forEach(([k, v]) => {
                    map.set(k, new Note(k, v.body, v.createdAt, v.lastModifiedAt));
                });
                return map;
            }
        }
        return value;
    }
    static warnNoteNotExist(title) {
        console.log(formatError(`Note of this title does not exist!\n`) + title);
    }
}
const NOTES_FILE_PATH = "./notes/notes.json";
export const getNote = (title) => {
    const allNotes = loadNotes();
    if (hasNote(title)) {
        return allNotes.notes.get(title);
    }
    NotesData.warnNoteNotExist(title);
    return undefined;
};
export const hasNote = (title) => {
    const allNotes = loadNotes();
    return allNotes.exist(title);
};
export const addNote = (title, body) => {
    const allNotes = loadNotes();
    if (allNotes.add(title, body)) {
        saveNotes(allNotes);
    }
};
export const removeNote = (title) => {
    const allNotes = loadNotes();
    if (allNotes.remove(title)) {
        saveNotes(allNotes);
    }
};
export const printNote = (title) => {
    const allNotes = loadNotes();
    if (allNotes.exist(title)) {
        console.log(allNotes.notes.get(title).toString());
    }
    else {
        NotesData.warnNoteNotExist(title);
    }
};
export const printNoteInfo = (title) => {
    const allNotes = loadNotes();
    if (allNotes.exist(title)) {
        console.log(allNotes.notes.get(title).info());
    }
    else {
        NotesData.warnNoteNotExist(title);
    }
};
const doItForAllNotes = (func) => {
    const allNotes = loadNotes();
    allNotes.titles().forEach(func);
};
export const printAllNotes = () => {
    doItForAllNotes(printNote);
};
export const printAllNoteInfo = () => {
    doItForAllNotes(printNoteInfo);
};
export const getAllNotes = () => {
    return loadNotes().notes;
};
export const editNote = (title, body) => {
    const allNotes = loadNotes();
    if (allNotes.update(title, body)) {
        saveNotes(allNotes);
    }
};
export const addOrAppendNote = (title, body) => {
    const allNotes = loadNotes();
    if (allNotes.exist(title)) {
        if (allNotes.update(title, allNotes.notes.get(title).body + body)) {
            saveNotes(allNotes);
        }
    }
    else {
        addNote(title, body);
    }
};
const loadNotes = () => {
    if (!existsSync(NOTES_FILE_PATH)) {
        return new NotesData();
    }
    const dataBuffer = readFileSync(NOTES_FILE_PATH);
    const dataJSON = dataBuffer.toString();
    const data = new NotesData(JSON.parse(dataJSON, NotesData.deserializationReviver).notes);
    return data;
};
const saveNotes = (notes) => {
    const dataJSON = JSON.stringify(notes, NotesData.serializationReplacer, 2);
    writeFileSync(NOTES_FILE_PATH, dataJSON, { flag: "w" });
};
const notes = {
    hasNote,
    getNote,
    getAllNotes,
    addNote,
    removeNote,
    editNote,
    addOrAppendNote,
    printNote,
    printNoteInfo,
    printAllNotes,
    printAllNoteInfo,
};
export default notes;
//# sourceMappingURL=notes.js.map