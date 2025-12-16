import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');
import { app } from '../app';
import TeamModel from '../database/models/SequelizeTeam';
import TeamsMock from './mocks/Team.mock';

const { expect } = chai;

chai.use(chaiHttp);

describe('Testes da rota /Teams', () => {
  it('GET - /teams, deve retornar todos os times', async function () {
    sinon.stub(TeamModel, 'findAll').resolves(TeamModel.bulkBuild(TeamsMock.teams));

    const { status, body } = await chai.request(app).get('/teams');

    expect(status).to.equal(200);
    expect(body).to.deep.equal(TeamsMock.teams)
  });

  it('GET - /teams/:id, deve retornar um time pelo seu id', async function() {
    sinon.stub(TeamModel, 'findByPk').resolves(TeamModel.build(TeamsMock.team));

    const { status, body } = await chai.request(app).get('/teams/17');

    expect(status).to.equal(200);
    expect(body).to.deep.equal(TeamsMock.team);
  });

  it('GET - /teams/18, deve retornar status 404 quando requisitado um time inexistente', async function() {
    sinon.stub(TeamModel, 'findOne').resolves(null);

    const { status, body } = await chai.request(app).get('/teams/18');

    expect(status).to.equal(404);
    expect(body).to.deep.equal({ message: `Team 18 not found` })
  });

  it('GET - /teams, deve retornar status 500 em caso de erro na conexão ao banco', async function () {
    sinon.stub(TeamModel, 'findAll').rejects(new Error("Erro na conexão com o banco de dados"));

    const response = await chai.request(app).get('/teams');

    expect(response.status).to.be.equal(500);
  });

  it('GET - /teams:id - deve retornar status 500 em caso de erro na conexão ao banco', async function () {
    sinon.stub(TeamModel, 'findByPk').rejects(new Error("Erro na conexão com o banco de dados"));

    const response = await chai.request(app).get('/teams/17');

    expect(response.status).to.be.equal(500);
  });
  afterEach(sinon.restore);
});
