
describe('DELETE tasks', function () {

  beforeEach(function () {
    cy.fixture('tasks/delete').then(function (tasks) {
      this.tasks = tasks
    })
  })

  context('/tasks/:id', function () {

    it('remove unique task', function () {
      const { user, task } = this.tasks.remove

      cy.task('removeTask', task.name, user.email)
      cy.task('removeUser', user.email)
      cy.postUser(user)
      cy.postSession(user).then(respUser => {
        const { token } = respUser.body

        cy.postTask(task, token).then(taskResp => {
          const { _id } = taskResp.body

          cy.deleteTaskId(_id, token).then(response => {
            const { status } = response

            expect(status).to.eq(204)
          })
        })
      })
    });

    it('remove task not found', function () {
      const { user, task } = this.tasks.not_found

      cy.task('removeTask', task.name, user.email)
      cy.task('removeUser', user.email)
      cy.postUser(user)
      cy.postSession(user).then(respUser => {
        const { token } = respUser.body

        cy.postTask(task, token).then(taskResp => {
          const { _id } = taskResp.body

          cy.deleteTaskId(_id, token)
          cy.deleteTaskId(_id, token).then(response => {
            const { status } = response

            expect(status).to.eq(404)
          })
        });
      })
    })
  })
});