import { existsSync, readFileSync, writeFileSync } from "fs";
import { formatError, formatSuccess, formatWarning } from "./log.js";

export class Note {
  title: string;
  body: string;
  createdAt: Date;
  lastModifiedAt: Date;

  constructor(title: string, body: string, createdAt: Date = new Date(), lastModifiedAt: Date = new Date()) {
    this.title = title;
    this.body = body;
    this.createdAt = createdAt;
    this.lastModifiedAt = lastModifiedAt;
  }

  toString = (): string => {
    return `${this.info()}\n${this.body}\n`;
  }

  info = (): string => {
    return `=== ${this.title} ===\nCreated at:${this.createdAt}\nLast Modified at:${this.lastModifiedAt}\n`;
  }
}

export class NotesData {
  notes: Map<string, Note>;

  constructor(notes: Map<string, Note> = new Map<string, Note>()) {
    this.notes = notes;
  }

  static serializationReplacer(key: string, value: any): any {
    if (value instanceof Map<string, Note>) {
      return {
        dataType: "Map",
        value: Array.from(value.entries()), // or with spread: value: [...value]
      };
    }
    return value;
  }

  static deserializationReviver(key: string, value: any): any {
    if (typeof value === "object" && value !== null) {
      if (value.dataType === "Map") {
        const map = new Map<string, Note>();
        value.value.forEach(([k, v]:[string, Note]) => {
          map.set(k, new Note(k, v.body, v.createdAt, v.lastModifiedAt));
        } );
        return map;
      }
    }
    return value;
  }

  add = (title: string, body: string) : boolean => {
    if (!this.exist(title)) {
      const newNote : Note = new Note(title, body);
      this.notes.set(title, newNote);
      console.log(formatSuccess("New note added!\n") + newNote.toString());
      return true;
    } 
    console.log(formatWarning(`Note of the same title already exists!\n`) + this.notes.get(title)!.toString());
    return false;
  }

  remove = (title: string): boolean => {
    if (this.exist(title)) {
      this.notes.delete(title);
      console.log(formatSuccess("Note deleted!\n") + `${title}`);
      return true;
    }
    NotesData.warnNoteNotExist(title);
    return false;
  }

  update = (title: string, newBody: string): boolean => {
    if (this.exist(title)) {
      const noteOfInterest : Note = this.notes.get(title)!;
      const origBody: string = noteOfInterest.body;
      if (origBody !== newBody) {
        noteOfInterest.body = newBody;
        noteOfInterest.lastModifiedAt = new Date();
        console.log(formatSuccess("Note updated!\n") + noteOfInterest.toString());
        return true;
      } else {
        console.log(formatWarning(`Note title does not need to be updated!\n`) + noteOfInterest.info());
        return false;
      }
    }
    NotesData.warnNoteNotExist(title);
    return false;
  }

  exist = (title: string) : boolean => {
    return this.notes.has(title);
  }

  titles = (): string[] => {
    return Array.from(this.notes.keys());
  }

  static warnNoteNotExist(title: string) {
      console.log(formatError(`Note of this title does not exist!\n`) + title);
  }
}

const NOTES_FILE_PATH: string = "./notes/notes.json";

export const getNote = (title: string): Note|undefined => {
  const allNotes: NotesData = loadNotes();
  if (hasNote(title)) {
    return allNotes.notes.get(title)!;
  }
  NotesData.warnNoteNotExist(title);
  return undefined;
}

export const hasNote = (title: string): boolean => {
  const allNotes: NotesData = loadNotes();
  return allNotes.exist(title);
}

export const addNote = (title: string, body: string) => {
  const allNotes: NotesData = loadNotes();
  if (allNotes.add(title, body)) {
    saveNotes(allNotes);
  }
};

export const removeNote = (title: string) => {
  const allNotes: NotesData = loadNotes();
  if(allNotes.remove(title)) {
    saveNotes(allNotes);
  }
};

export const printNote = (title: string) => {
  const allNotes: NotesData = loadNotes();
  if (allNotes.exist(title)) {
    console.log(allNotes.notes.get(title)!.toString());
  } else {
    NotesData.warnNoteNotExist(title);
  }
};

export const printNoteInfo = (title: string) => {
  const allNotes: NotesData = loadNotes();
  if (allNotes.exist(title)) {
    console.log(allNotes.notes.get(title)!.info());
  } else {
    NotesData.warnNoteNotExist(title);
  }
}

const doItForAllNotes = (func: (title: string) => void) => {
  const allNotes: NotesData = loadNotes();
  allNotes.titles().forEach(func);
}
export const printAllNotes = () => {
  doItForAllNotes(printNote);
};

export const printAllNoteInfo = () => {
  doItForAllNotes(printNoteInfo);
}

export const getAllNotes = () : Map<string, Note> => {
  return loadNotes().notes;
}

export const editNote = (title: string, body: string) => {
  const allNotes: NotesData = loadNotes();
  if (allNotes.update(title, body)) {
    saveNotes(allNotes);
  }
};

export const addOrAppendNote = (title: string, body: string) => {
  const allNotes: NotesData = loadNotes();
  if (allNotes.exist(title)) {
    if (allNotes.update(title, allNotes.notes.get(title)!.body + body)) {
      saveNotes(allNotes);
    }
  } else {
    addNote(title, body);
  }
};

const loadNotes = (): NotesData => {
  if (!existsSync(NOTES_FILE_PATH)) {
    return new NotesData();
  }
  const dataBuffer: Buffer = readFileSync(NOTES_FILE_PATH);
  const dataJSON: string = dataBuffer.toString();
  const data: NotesData = new NotesData(JSON.parse(
    dataJSON,
    NotesData.deserializationReviver
  ).notes);
  return data;
};

const saveNotes = (notes: NotesData) => {
  // 2 is the indentation for dev build readability; remove it in production
  const dataJSON: string = JSON.stringify(notes, NotesData.serializationReplacer, 2);
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
