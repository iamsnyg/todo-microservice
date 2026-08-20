import fs from "fs/promises";
import path from "path";

export async function loadTemplate(fileName, variables = {}) {
    const templatePath = path.join(process.cwd(), "src", "templates", fileName);

    let html = await fs.readFile(templatePath, "utf-8");

    for (const key in variables) {
        html = html.replaceAll(`{{${key}}}`, variables[key]);
    }

    return html;
}
