import { ConfigService, container, IApp } from "artos";
import { UserModel } from "./models/user.model";
import { router } from "./routes";

container.set("model.user", UserModel);
const configService: ConfigService = container.getService(ConfigService);

const app: IApp = {
  domain: configService.get("API_HOST", "api.test.test"),
  type: "api",
  routes: router,
  corsConfig: { origin: new RegExp(`^https?:\\/\\/${configService.get("SPA_HOST", "www.test.test").replace(/\./g, "\\.")}(:\\d+$|$)`) },
};

export default app;
