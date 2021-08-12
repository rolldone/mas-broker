import GroupModel, { GroupModelInterface } from "@root/app/member/models/GroupModel";
import Group from "@root/sequelize/models/Group";

export const GROUP_STATUS = {
  ON: 1,
  OFF: 0
}

export default GroupModel.extend<GroupModelInterface>({
  model : Group
})