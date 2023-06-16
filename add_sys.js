/* 
 * add_sys.js 
 *
 * This is a utility script to add a new system to the project given a name and 
 * a trigger (both in pascal case)
 */

const fs = require("fs");

const args = process.argv.slice(2);
const name = args[0];
const trigger = args[1];

const pascalToSnakeCase = str => {
    str = str[0].toLowerCase() + str.slice(1);
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
}

if (!name || !trigger) {
    console.log("Please provide a name and trigger for the system");
} else {
    const path = `./src/systems/${pascalToSnakeCase(name)}.ts`;
    const content = `import * as components from "../components";
import { System, SystemTrigger } from "../engine/ecs";

export default class ${name}System extends System {
    constructor() {
        super([
            // required components
        ], SystemTrigger.${trigger}, (game, entity) => {
            
        });
    }
}`

    fs.writeFileSync(path, content);
}