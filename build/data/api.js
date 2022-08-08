export const apis = [
    {
        operation: "GET",
        endpoint: "/api/note/:title",
        description: "Get a note in Json format",
        parameters: "{title: note title;}",
        responses: "{\nnotes: array of note objects;\n}",
    },
    {
        operation: "GET",
        endpoint: "/api/note",
        description: "Get all notes in Json format",
        responses: "{\nexists: true if note exists, false otherwise;\nnote: note object in the form {title; body; createdAt; lastModifiedAt;};\n}",
    },
];
//# sourceMappingURL=api.js.map