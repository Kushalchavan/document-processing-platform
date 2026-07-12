import { gemini } from './infrastructure/ai/gemini';

async function main() {
  const models = await gemini.models.list();

  for await (const model of models) {
    console.log(model.name);
  }
}

main();
