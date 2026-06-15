import "dotenv/config";
import { writeFile } from "node:fs/promises";
import { generateDataset } from "./utils/generateDataset";

async function main(): Promise<void> {
  const dataset = await generateDataset();
  console.log(dataset);

  await writeFile("dataset.json", JSON.stringify(dataset, null, 2));
  console.log("Wrote dataset.json");
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
