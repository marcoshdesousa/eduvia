// Processo separado do worker: npm run worker
import "dotenv/config";
import { startWorker } from "./start";

startWorker({ handleSignals: true }).catch((e) => {
  console.error(e);
  process.exit(1);
});
