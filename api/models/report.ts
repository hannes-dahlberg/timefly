import { Models, ORM } from 'artoo';
import { User, Project } from './';

export class Report extends ORM.Model {
  public static table = 'reports';
  public static fields = ['id', 'user_id', 'project_id', 'start', 'end', 'comment'];
  public static fillable = ['start', 'end', 'comment']


  public User() { return this.belongsTo(User, 'user_id'); }
  public Project() { return this.belongsTo(Project, 'project_id'); }
}