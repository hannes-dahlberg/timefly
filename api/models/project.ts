import { ModelModule } from 'artoo';

export class ProjectModel extends ModelModule {
  public static table = 'projects';

  public timers() { return this.belongsToMany }
}