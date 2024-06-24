/// <reference types="cypress" />

describe('POST /sessions', () => {

  beforeEach(function () {
    cy.fixture('users').then(function (users) {
      this.users = users
    })
  })

  it('User session', () => {

    cy.fixture('users').then(function (users) {
      const userData = users.login

      cy.task('removeUser', userData.email)
      cy.postUser(userData)

      cy.postSession(userData)
        .then(response => {
          expect(response.status).to.eq(200)

          const { user, token } = response.body

          expect(user.name).to.eq(userData.name)
          expect(user.email).to.eq(userData.email)
          expect(token).not.to.be.empty
          expect(user['_id']).not.to.be.empty
        })
    })
  });

  it('Invalid password', function () {
    const user = this.users.inv_pass

    cy.postSession(user)
      .then(response => {
        expect(response.status).to.eq(401)
      })
  });

  it('Email not found', function () {
    const user = this.users.email_404

    cy.postSession(user)
      .then(response => {
        expect(response.status).to.eq(401)
      })
  });
})