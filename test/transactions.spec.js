const request = require("supertest");
const { expect } = require("chai");
const { Transaction } = require("../database/models");

const app = require("../app");

let token, id;

describe("[TEST-TRANSACTIONS]", () => {
  const newTrasaction = {
    description: "test description",
    amount: "1000",
    userId: 1,
    categoryId: 1
  };

  const updateTrasaction = {
    description: "test description",
    amount: "1000",
    userId: 1,
    categoryId: 1
  };

  before(async () => {
    const { body } = await request(app).post('/auth/login')
      .set('Accept', 'application/json')
      .send({
        email: 'RichardFreeman@mail.com',
        password: '123456'
      })
      .expect('Content-Type', /json/)

    const { body: response } = body;
    token = response.token
    id = response.user.id
  })

  describe("[LIST-TRANSACTIONS]", () => {
    it("should return a list of trasactions", async () => {
      const { body } = await request(app)
        .get("/transactions?page=1")
        .set('Authorization', `Bearer ${token}`)
        .set("Accept", "aplication/json")
        .expect("Content-type", /json/);

      const { code, message, body: response } = body;
      expect(body.code).to.be.a("number");
      expect(code).to.equal(200);
      expect(message).to.equal("Transactions retrieved successfully");
      expect(response).to.be.a("string");
    });
  });
  describe("[CREATE-TRANSACTION]", () => {
    it("should return an new transaction", async () => {
      const { body } = await request(app).post(`/transactions`)
        .send(newTrasaction)
        .set('Authorization', `Bearer ${token}`)
        .set("Accept", "aplication/json")
        .expect("Content-type", /json/);
      const { code, message, body: response } = body;

       expect(code).to.be.a("number"); 
      expect(code).to.equal(200);

      expect(message).to.equal("Transaction created");
      expect(response).to.be.a("string");
    });

    it(`'should return an error Transaction creation failed`, async () => {
      const { error } = await request(app)
        .post(`/transactions`)
        .send(newTrasaction)
        .set("Accept", "text/html; charset=utf-8")
        .expect("Content-Type", /text\/html/);
      const { status, text } = error;
      expect(status).to.be.a("number");
      expect(status).to.equal(403);
    });
  });
  describe("[UPDATE-TRANSACTIONS]", () => {
    it(`'should return an error The transactions not exists`, async () => {
      const { error } = await request(app).put(`/transactions/89`)
        .send(updateTrasaction)
        .set('Authorization', `Bearer ${token}`)
        .set("Accept", "text/html; charset=utf-8")
        .expect("Content-Type", /text\/html/);

      const { status,text  } = error;
      expect(status).to.be.a("number");
      expect(status).to.equal(404);
      expect(text).to.be.a("string");
      expect(text).to.contain("transaction by Id not found");
    });

    it("should return an update transaction", async () => {
      const transaction = await Transaction.findOne({
        where: { description:"test description" },
      });
      const { body } = await request(app)
        .put(`/transactions/${transaction.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send(updateTrasaction)
        .set("Accept", "aplication/json")
        .expect("Content-Type", /json/);
      const { code, message, body: response } = body;

      expect(code).to.be.a("number");
      expect(code).to.equal(200);
      expect(message).to.equal("result successfully");
    });
  });
  describe("[DELETE-TRANSACTION]", () => {
    it("should delete a transaction", async () => {
      const transaction = await Transaction.findOne({
        where: { description:"test description" },
      });
      const { body } = await request(app)
        .delete(`/transactions/${transaction.id}`)
        .set('Authorization', `Bearer ${token}`)
        .set("Accept", "aplication/json")
        .expect("Content-Type", /json/);
      const { code, message, body: response } = body;

      expect(code).to.be.a("number");
      expect(code).to.equal(200);
      expect(message).to.be.a("string");
      expect(message).to.equal("Transaction successfully deleted");
      expect(response).to.equal(1);
    });
  });
});
