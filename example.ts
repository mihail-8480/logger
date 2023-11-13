import { commit, createSubscriber } from "@mojsoski/streams";
import { createLogger } from "./lib";

type ExampleLog = {
  message: string;
  type: "INFO" | "WARN" | "ERROR";
};
const logger = createLogger<ExampleLog>((log) => JSON.stringify(log));

const consoleSubscriber = createSubscriber<ExampleLog>({
  data(log) {
    switch (log.type) {
      case "INFO":
        console.log(log.message);
        break;
      case "WARN":
        console.warn(log.message);
        break;
      case "ERROR":
        console.error(log.message);
        break;
    }
  },
  end() {},
});

commit(logger.copyTo(consoleSubscriber));

function main() {
  logger.log({ message: "This is a log with type info", type: "INFO" });
  logger.log({ message: "This is a log with type warn", type: "WARN" });
  logger.log({ message: "This is a log with type error", type: "ERROR" });
}

main();
