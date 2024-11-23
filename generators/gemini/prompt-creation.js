import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

// Recriando __dirname
const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const filePath = path.resolve(dirname, '../../prisma/schema.prisma');

// Função para criar o prompt
export async function generatePrompt() {
  try {
    // Read the file content
    const schemaContent = fs.readFileSync(filePath, 'utf-8');

    // Build the prompt using the file content
    const prompt = `
    Here is the content of my schema.prisma file:
    \`\`\`
    ${schemaContent}
    \`\`\`
    
    Based on this schema, create a seed file in TypeScript that inserts one, and ONLY ONE, instance for each entity described in the schema. Respect the relationships between entities and ensure consistency with the defined data types. The script must be compatible with Prisma. When making a relation, you dont need to specify the entire instance, just the instance id.
        `;

    return prompt;
  } catch (error) {
    console.error('Error reading the file:', error);
    return null;
  }
}

// Executar a função
const request = await generatePrompt();
console.log(request);
