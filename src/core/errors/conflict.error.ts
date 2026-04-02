export class ConflictError extends Error {
    conflictProperty: string;

    constructor(conflictProperty: string, message = "Conflict occurred") {
        super(message);
        this.conflictProperty = conflictProperty;
        this.name = "ConflictError";
    }
}