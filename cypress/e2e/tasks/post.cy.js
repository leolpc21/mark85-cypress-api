
describe('POST /tasks', function () {

  beforeEach(function () {
    cy.fixture('tasks/post').then((tasks) => {
      this.task = tasks;
    })
  });

  context('register a new task', function () {
    before(function () {
      cy.purgeQueueMessage().then(response => {
        expect(response.status).to.eq(204)
      })
    })

    it('post task', function () {
      const { user, task } = this.task.create;

      cy.task('removeTask', task.name, user.email)
      cy.task('removeUser', user.email)
      cy.postUser(user)

      cy.postSession(user).then((respUser) => {
        const { token, user } = respUser.body
        const { _id: userId } = user

        cy.postTask(task, token)
          .then(response => {
            expect(response.status).to.eq(201)

            const { name, tags, _id, is_done, user } = response.body
            expect(name).to.eq(task.name)
            expect(_id).not.to.be.empty
            expect(_id.length).to.eq(24)
            expect(tags).to.deep.eq(task.tags)
            expect(is_done).to.be.false
            expect(user).to.eq(userId)
          })
      });
    });

    after(function () {
      const { user, task } = this.task.create;

      cy.wait(3000)
      cy.getMessageQueue().then(response => {
        expect(response.status).to.eq(200)
        expect(response.body[0].payload).to.include(user.name.split(' ')[0])
        expect(response.body[0].payload).to.include(task.name)
        expect(response.body[0].payload).to.include(user.email)

        cy.log(JSON.stringify(response.body[0].payload))
      })
    })
  })

  it('duplicate task', function () {
    const { user, task } = this.task.dup;

    cy.task('removeUser', user.email)
    cy.postUser(user)

    cy.postSession(user).then((respUser) => {
      const { token, user } = respUser.body

      cy.task('removeTask', task.name, user.email)
      cy.postTask(task, token)
      cy.postTask(task, token)
        .then(response => {
          expect(response.status).to.eq(409)

          const { message } = response.body
          expect(message).to.eq("Duplicated task!")
        })
    });
  });
});