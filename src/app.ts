#!/usr/bin/env node
import notes, { Note } from "./notes.js";
import { serve } from "./express.js";
import { hideBin } from "yargs/helpers";
import yargs from "yargs";
import { formatError } from "./log.js";
import {
  FunLanguage,
  translateFun,
  TranslationResponse,
} from "./shakespeare.js";

yargs(hideBin(process.argv))
  .scriptName("exp")
  .locale("en")
  .command({
    command: "add",
    describe: "Add a new note",
    builder: {
      title: {
        describe: "Note title",
        demandOption: true,
        type: "string", // string, number, boolean, array, object, or function; boolean is default
        alias: "t",
      },
      body: {
        describe: "Note body",
        demandOption: true,
        type: "string",
        alias: "b",
      },
    },
    handler: (argv) => {
      notes.addNote(String(argv.title), String(argv.body)); //TODO: do type checking the right way
    },
  })
  .command({
    command: "rm",
    describe: "Remove a note",
    builder: {
      title: {
        describe: "Note title",
        demandOption: true,
        type: "string",
        alias: "t",
      },
    },
    handler: (argv) => {
      notes.removeNote(String(argv.title));
    },
  })
  .command({
    command: "get",
    describe: "Print notes/infos",
    builder: {
      title: {
        describe: "Note title",
        demandOption: false,
        type: "string",
        alias: "t",
      },
      full: {
        describe: "Print full note",
        demandOption: false,
        type: "boolean",
        alias: "f",
      },
    },
    handler: (argv) => {
      if (argv.title) {
        if (typeof argv.full === "undefined" || argv.full === true) {
          notes.printNote(String(argv.title));
        } else {
          //Print short note only explicitly specified full===false
          notes.printNoteInfo(String(argv.title));
        }
      } else {
        if (argv.full) {
          notes.printAllNotes();
        } else {
          //Print short note by default
          notes.printAllNoteInfo();
        }
      }
    },
  })
  .command({
    command: "edit",
    describe: "Edit a note",
    builder: {
      title: {
        describe: "Note title",
        demandOption: true,
        type: "string",
        alias: "t",
      },
      body: {
        describe: "Note body",
        demandOption: true,
        type: "string",
        alias: "b",
      },
      append: {
        describe: "Flag to Append to note body",
        demandOption: false,
        type: "boolean",
        alias: "a",
      },
    },
    handler: (argv) => {
      if (argv.append) {
        notes.addOrAppendNote(String(argv.title), String(argv.body));
      } else {
        notes.editNote(String(argv.title), String(argv.body));
      }
    },
  })
  .command({
    command: "fun",
    describe: "Translate a note with a fun language",
    builder: {
      title: {
        describe: "Title of the note",
        demandOption: true,
        type: "string",
        alias: "t",
      },
      fun: {
        describe: "Fun language Type",
        demandOption: true,
        type: "string",
        alias: "f",
      },
      overwrite: {
        describe: "Overwrite the original note with the translated one",
        demandOption: false,
        type: "boolean",
        alias: "o",
      },
    },
    handler: async (argv) => {
      const typeStr: string = String(argv.fun);
      let funEnum: FunLanguage =
        FunLanguage[typeStr as keyof typeof FunLanguage];
      if (typeof funEnum === "undefined") {
        console.log(
          formatError(`Invalid language: ${typeStr}\n`) +
            "Available languages are: " +
            Object.keys(FunLanguage).join(", ")
        );
        return;
      }
      const note: Note | undefined = notes.getNote(String(argv.title));
      if (note) {
        await translateFun(note.body, funEnum).then(
          (response: TranslationResponse | undefined) => {
            if (response) {
              if (argv.overwrite && argv.overwrite === true) {
                notes.editNote(String(argv.title), response.translated);
              }
            }
          }
        );
      }
    },
  })
  .command({
    command: "server",
    describe: "Start a server",
    builder: {
      port: {
        describe: "Port to listen on (3000 by default)",
        demandOption: false,
        type: "number",
        alias: "p",
      },
    },
    handler: (argv) => {
      let port: number = 3000;
      if (argv.port) {
        const parsed = parseInt(String(argv.port)); //if String(argv.port).match(/^[0-9]+$/)
        port = isNaN(parsed) ? 3000 : parsed;
      }
      serve(port);
    },
  })
  .help()
  .version()
  .strict()
  .demandCommand(1, "You need at least one command before moving on.").argv;
