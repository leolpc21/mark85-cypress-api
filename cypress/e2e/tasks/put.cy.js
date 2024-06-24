
describe('PUT task/:id/done', function () {

  beforeEach(function () {
    cy.fixture('tasks/put').then(function (tasks) {
      this.tasks = tasks
    })
  })

  it('update task to done', function () {
    const { user, task } = this.tasks.update

    cy.task('removeTasksLike', task.name)
    cy.task('removeUser', user.email)
    cy.postUser(user)
    cy.postSession(user).then(respUser => {
      const { token } = respUser.body

      cy.postTask(task, token).then(taskResp => {
        const { _id } = taskResp.body

        cy.putTaskIdDone(_id, token).then(response => {
          const { status } = response

          expect(status).to.eq(204)
        })

        cy.getUniqueTask(_id, token).then(response => {
          const { status } = response
          const { is_done } = response.body

          expect(status).to.eq(200)
          expect(is_done).to.be.true
        })
      })
    })
  });

  it('finish task not found', function () {
    const { user, task } = this.tasks.not_found

    cy.task('removeTask', task.name, user.email)
    cy.task('removeUser', user.email)
    cy.postUser(user)
    cy.postSession(user).then(respUser => {
      const { token } = respUser.body

      cy.postTask(task, token).then(taskResp => {
        const { _id } = taskResp.body

        cy.deleteTaskId(_id, token)
        cy.putTaskIdDone(_id, token).then(response => {
          const { status } = response

          expect(status).to.eq(404)
        })
      });
    })
  })
})