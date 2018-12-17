import { ConfigService, container, IApp } from "artoo";
import { UserModel } from "./models/user_model";
import { router } from "./routes";
container.set("model.user", UserModel);
const configService: ConfigService = container.getService(ConfigService);

const app: IApp = {
  corsConfig: `http://${configService.get("SPA_HOST", "*.test.test")}:${configService.get("PORT", "1234")}`,
  domain: configService.get("API_HOST", "api.test.test"),
  routes: router,
  type: "api",
};

export default app;
