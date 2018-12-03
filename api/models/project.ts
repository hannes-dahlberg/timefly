import { Models, ORM } from 'artoo';

export class Project extends ORM.Model {
  public static table = 'projects';

  public timers() { return this.belongsToMany }
}