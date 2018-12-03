import * as authController from './auth_controller';
import * as timerController from './timer_controller';

export namespace Controllers {
  export namespace Auth {
    export import login = authController.login;
  }
  export namespace Timer {
    export import start = timerController.start;
    export import stop = timerController.stop;
  }
}