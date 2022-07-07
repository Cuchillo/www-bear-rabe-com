export const DataHolder = {

  getProject(__id) {
    return PROJECTS.filter(project => project.project_id == Number(__id))[0];
  },
}