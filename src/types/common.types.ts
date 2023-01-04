// https://stackoverflow.com/questions/39392853/is-there-a-type-for-class-in-typescript-and-does-any-include-it
export interface Type<T> extends Function { new (...args: any[]): T; }

export type Class = { new(...args: any[]): any; };