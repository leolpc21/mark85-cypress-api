
describe('GET tasks', function () {

  beforeEach(function () {
    cy.fixture('tasks/get').then(function (tasks) {
      this.tasks = tasks
    })
  })

  context('/tasks', function () {

    it('get my tasks', function () {
      const { user, tasks } = this.tasks.list

      cy.task('removeTasksLike', 'Estud4r')
      cy.task('removeUser', user.email)
      cy.postUser(user)
      cy.postSession(user).then(respUser => {
        const { token } = respUser.body

        tasks.forEach(function (task) {
          cy.postTask(task, token)
        })

        cy.getTasks(token).then(response => {
          const { status, body } = response

          expect(status).to.eq(200)
          expect(body.length).to.eq(tasks.length)
          expect(body).to.be.an('array')
        })
      })
    });
  })

  context('/tasks/:id', function () {

    it('get unique task', function () {
      const { user, task } = this.tasks.unique

      cy.task('removeTask', task.name, user.email)
      cy.task('removeUser', user.email)
      cy.postUser(user)
      cy.postSession(user).then(respUser => {
        const { token, user } = respUser.body

        cy.postTask(task, token).then(taskResp => {
          const { _id } = taskResp.body

          cy.getUniqueTask(_id, token).then(response => {
            const { status, body } = response

            expect(status).to.eq(200)
            expect(body.name).to.eq(task.name)
            expect(body.user).to.eq(user._id)
          })
        })
      })
    });

    it('task not found', function () {
      const { user, task } = this.tasks.not_found

      cy.task('removeTask', task.name, user.email)
      cy.task('removeUser', user.email)
      cy.postUser(user)
      cy.postSession(user).then(respUser => {
        const { token } = respUser.body

        cy.postTask(task, token).then(taskResp => {
          const { _id } = taskResp.body

          cy.deleteTaskId(_id, token)
          cy.getUniqueTask(_id, token).then(response => {
            const { status } = response

            expect(status).to.eq(404)
          })
        });
      })
    })
  })
});