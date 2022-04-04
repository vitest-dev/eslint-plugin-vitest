import { readdirSync } from "fs";
import { dirname, join, parse } from "path";
import { fileURLToPath } from "url";

const rulesDir = dirname(fileURLToPath(import.meta.url));

console.log({ rulesDir })

const values = readdirSync(rulesDir)
    .map(rule => parse(rule).name)
    .reduce((allRules, ruleName) => ({
        ...allRules,
        [ruleName]: import(join(rulesDir, ruleName)),
    }), {})


console.log({ values })
