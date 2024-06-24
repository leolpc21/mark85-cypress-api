Cypress.Commands.add('purgeQueueMessage', () => {
  cy.api({
    url: Cypress.env('amqpHost') + '/tasks/contents',
    method: 'DELETE',
    body: {
      vhost: "lzrfggna",
      name: Cypress.env('amqpQueue'),
      mode: "purge"
    },
    headers: { authorization: Cypress.env('amqpToken') },
    failOnStatusCode: false
  }).then(response => { return response })
});

Cypress.Commands.add('getMessageQueue', () => {
  cy.api({
    url: Cypress.env('amqpHost') + '/tasks/get',
    method: 'POST',
    body: {
      ackmode: "ack_requeue_true",
      count: "1",
      encoding: "auto",
      name: Cypress.env('amqpQueue'),
      truncate: "50000",
      vhost: "lzrfggna"
    },
    headers: { authorization: Cypress.env('amqpToken') },
    failOnStatusCode: false
  }).then(response => { return response })
});