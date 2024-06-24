/// <reference types="cypress" />

describe('POST /user', () => {

  beforeEach(function () {
    cy.fixture('users').then(function (users) {
      this.users = users
    })
  })

  it('Register a new user', function () {
    const user = this.users.create

    cy.task('removeUser', user.email)

    cy.postUser(user)
      .then(response => {
        expect(response.status).to.eq(201)
        cy.log(JSON.stringify(response.body))
      })
  });

  it('Duplicate email', function () {
    const user = this.users.dup_email

    cy.task('removeUser', user.email)
    cy.postUser(user)

    cy.postUser(user)
      .then(response => {
        const { message } = response.body

        expect(response.status).to.eq(409)
        expect(message).to.eq('Duplicated email!')
      })
  });

  context('Required fields', () => {
    let user;

    beforeEach(function () {
      user = this.users.required
    })

    it('Name is required', function () {
      delete user.name

      cy.postUser(user)
        .then(response => {
          const { message } = response.body
          expect(response.status).to.eq(400)
          expect(message).to.eq('ValidationError: \"name\" is required')
        })
    });

    it('Email is required', () => {
      delete user.email

      cy.postUser(user)
        .then(response => {
          const { message } = response.body
          expect(response.status).to.eq(400)
          expect(message).to.eq('ValidationError: \"email\" is required')
        })
    });

    it('Password is required', () => {
      delete user.password

      cy.postUser(user)
        .then(response => {
          const { message } = response.body
          expect(response.status).to.eq(400)
          expect(message).to.eq('ValidationError: \"password\" is required')
        })
    });
  })
})