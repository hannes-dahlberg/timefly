import { ModelModule } from 'artoo';
import { UserModel, ProjectModel } from './';

export class ReportModel extends ModelModule {
  public static table = 'reports';
  public static fields = ['id', 'user_id', 'project_id', 'start', 'end', 'comment'];
  public static fillable = ['start', 'end', 'comment']


  public User() { return this.belongsTo(UserModel, 'user_id'); }
  public Project() { return this.belongsTo(ProjectModel, 'project_id'); }
}