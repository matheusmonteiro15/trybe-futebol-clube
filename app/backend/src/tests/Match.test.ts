import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');
import { app } from '../app';
import MatchModel from '../database/models/SequelizeMatch';
import TeamModel from '../database/models/SequelizeTeam';
import {
  matchesMock,
  matchesInProgress,
  completedMatches,
  matchPOST,
} from './mocks/Match.mock';
import TokenManager from '../credentialsAcessControl/tokenManager';

const { expect } = chai;

chai.use(chaiHttp);

describe('Testes da rota /matches', function () {

  afterEach(function () {
    sinon.restore();
  });

  describe('Testes de GET /', function () {
    it('Deve retornar todas as partidas', async function () {
      sinon.stub(MatchModel, 'findAll').resolves(MatchModel.bulkBuild(matchesMock));
      const response = await chai.request(app).get('/matches');

      expect(response.status).to.be.equal(200);
      expect(response.body).to.deep.equal(matchesMock);
    });

    it('Deve retornar partidas em progresso', async function () {
      sinon.stub(MatchModel, 'findAll').resolves(MatchModel.bulkBuild(matchesInProgress));
      const response = await chai.request(app).get('/matches?inProgress=true');

      expect(response.status).to.be.equal(200);
      expect(response.body[0]).to.have.haveOwnProperty('inProgress', true);
    });

    it('Deve retornar partidas finalizadas', async function () {
      sinon.stub(MatchModel, 'findAll').resolves(MatchModel.bulkBuild(completedMatches));
      const response = await chai.request(app).get('/matches?inProgress=false');

      expect(response.status).to.be.equal(200);
      expect(response.body[1]).to.have.haveOwnProperty('inProgress', false);
    });

    it('Deve retornar status 500 em caso de erro na conexão externa', async function () {
      sinon.stub(MatchModel, 'findAll').rejects(new Error('Erro de conexão com o banco de dados'));
      const response = await chai.request(app).get('/matches');

      expect(response.status).to.be.equal(500);
      expect(response.body).to.deep.equal({ message: 'Internal server error' }); 
    });
  });

  describe('Testes de PATCH /matches/:id/finish', function () {
    it('Deve finalizar uma partida caso ela esteja em andamento', async function () {
      sinon.stub(MatchModel, 'findByPk').resolves(MatchModel.build(matchesInProgress[0]));
      sinon.stub(MatchModel.prototype, 'update').resolves(MatchModel.build(matchesInProgress[0]));

      const loginClassic = await chai // no time for efficiency
      .request(app)
      .post('/login')
      .send({
        email: 'admin@admin.com',
        password: 'secret_admin',
      });

    const token = loginClassic.body.token;

      const response = await chai
        .request(app)
        .patch('/matches/41/finish')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).to.be.equal(200);
      expect(response.body).to.deep.equal({ message: 'Finished' });
    });

    it('Deve retornar mensagem de erro caso a partida enviada não exista', async function () {
        sinon.stub(MatchModel, 'findByPk').returns(Promise.resolve(null));

        const loginClassic = await chai
        .request(app)
        .post('/login')
        .send({
          email: 'admin@admin.com',
          password: 'secret_admin',
        });
  
      const token = loginClassic.body.token;

        const response = await chai
          .request(app)
          .patch('/matches/492/finish')
          .set('Authorization', `Bearer ${token}`);
  
        expect(response.status).to.be.equal(404);
        expect(response.body).to.deep.equal({ message: 'Match not found' });
      });

      it("Deve retornar mensagem de erro caso não seja enviado token", async function () {
        const responseWithoutToken = await chai
        .request(app)
        .patch('/matches/41/finish');
  
        expect(responseWithoutToken.status).to.be.equal(401);
        expect(responseWithoutToken.body).to.deep.equal({ message: 'Token not found' });
      });

      it("Deve retornar mensagem de erro caso seja enviado um token inválido", async function () {
        const invalidToken = 'NinaLinda'
        const response = await chai
        .request(app)
        .patch('/matches/41/finish')
        .set('Authorization', `Bearer ${invalidToken}`);
  
        expect(response.status).to.be.equal(401);
        expect(response.body).to.deep.equal({ message: 'Token must be a valid token' });
      });

      it('Deve retornar status 500 em caso de erro na conexão externa', async function () {
        sinon.stub(MatchModel, 'findByPk').rejects(new Error('Erro de conexão com o banco de dados'));
 
        const loginAlternative = {
            id: 18,
            username: "MeEncontre",
            role: "admin",
            email: "Nina@linda.com"
        };

        const token = TokenManager.generateToken(loginAlternative);

        const response = await chai
          .request(app)
          .patch('/matches/nina/finish')
          .set('Authorization', `Bearer ${token}`);

        expect(response.status).to.be.equal(500);
        expect(response.body).to.deep.equal({ message: 'Internal server error' }); 
      });
  });

  describe('Testes de PATCH /matches/:matchId', function () {
    it('Deve atualizar os gols da partida', async function () {
        sinon.stub(MatchModel, 'findByPk').resolves(MatchModel.build(matchesInProgress[1]));
        sinon.stub(MatchModel.prototype, 'update').resolves(MatchModel.build(matchesInProgress[1]));

        const loginAlternative = {
            id: 18,
            username: "MeEncontre",
            role: "admin",
            email: "Nina@linda.com"
        };

        const token = TokenManager.generateToken(loginAlternative);
  
        const response = await chai
          .request(app)
          .patch('/matches/9')
          .set('Authorization', `Bearer ${token}`)
          .send({ homeTeamGoals: 6, awayTeamGoals: 10 });
  
        expect(response.status).to.be.equal(200);
        expect(response.body).to.deep.equal({ message: 'Changed' });
      });

      it('Deve retornar mensagem de erro se a partida não existir', async function () {
        sinon.stub(MatchModel, 'findByPk').resolves(null);

        const loginAlternative = {
            id: 18,
            username: "MeEncontre",
            role: "admin",
            email: "Nina@linda.com"
        };

        const token = TokenManager.generateToken(loginAlternative);
  
        const response = await chai
          .request(app)
          .patch('/matches/12')
          .set('Authorization', `Bearer ${token}`)
          .send({ homeTeamGoals: 5, awayTeamGoals: 0 });
  
        expect(response.status).to.be.equal(404);
        expect(response.body).to.deep.equal({ message: 'Match not found' });
      });

      it('Deve retornar status 500 em caso de erro na conexão externa', async function () {
        sinon.stub(MatchModel, 'findByPk').rejects(new Error('Erro de conexão com o banco de dados'));
  
        const loginClassic = await chai
        .request(app)
        .post('/login')
        .send({
          email: 'admin@admin.com',
          password: 'secret_admin',
        });
  
      const token = loginClassic.body.token;

        const response = await chai
          .request(app)
          .patch('/matches/15')
          .set('Authorization', `Bearer ${token}`)
          .send({ homeTeamGoals: 3, awayTeamGoals: 2 });
  
        expect(response.status).to.be.equal(500);
        expect(response.body).to.deep.equal({ message: 'Internal server error' }); 
      });
  });

  describe('Testes de POST /', function () {
    it('Deve retornar a criação de uma nova partida', async function () {
        sinon.stub(TeamModel, 'findByPk')
        .onFirstCall().resolves(TeamModel.build({ id: 17, teamName: 'ABC-RN' }))
        .onSecondCall().resolves(TeamModel.build({ id: 18, teamName: 'AMÉRICA-RN' }));
        sinon.stub(MatchModel, 'create').resolves(MatchModel.build(matchPOST));

        const loginClassic = await chai
        .request(app)
        .post('/login')
        .send({
          email: 'admin@admin.com',
          password: 'secret_admin',
        });

      const token = loginClassic.body.token;        
  
        const response = await chai
        .request(app)
        .post('/matches')
        .set('Authorization', `Bearer ${token}`)
        .send(matchPOST);
  
        expect(response.status).to.be.equal(201);
        expect(response.body).to.deep.equal(matchPOST);
      });

    it('Deve retornar mensagem de erro se os times requisitados forem iguais', async function () {
        const loginClassic = await chai
        .request(app)
        .post('/login')
        .send({
          email: 'admin@admin.com',
          password: 'secret_admin',
        });

      const token = loginClassic.body.token;

        const response = await chai
        .request(app)
        .post('/matches')
        .set('Authorization', `Bearer ${token}`)
        .send({ homeTeamId: 7, homeTeamGoals: 4, awayTeamId: 7, awayTeamGoals: 4 });
  
        expect(response.status).to.be.equal(422);
        expect(response.body).to.deep.equal({ message: 'It is not possible to create a match with two equal teams' });
      });
      

    it("Deve retornar mensagem de erro caso um dos times requisitados não seja encontrado pelo id", async function () {
        sinon.stub(TeamModel, 'findByPk').resolves(null);

        const loginAlternative = {
        id: 18,
        username: "MeEncontre",
        role: "admin",
        email: "Nina@linda.com"
        };

        const token = TokenManager.generateToken(loginAlternative);
      
        const response = await chai
          .request(app)
          .post('/matches')
          .set('Authorization', `Bearer ${token}`)
          .send({ homeTeamId: 4, homeTeamGoals: 4, awayTeamId: 99, awayTeamGoals: 6 });
  
        expect(response.status).to.be.equal(404);
        expect(response.body).to.deep.equal({ message: 'There is no team with such id!' });
      });

      it('Deve retornar status 500 em caso de erro na conexão externa', async function () {
        sinon.stub(TeamModel, 'findByPk').rejects(new Error('Erro de conexão com o banco de dados'));

        const loginAlternative = {
        id: 18,
        username: "MeEncontre",
        role: "admin",
        email: "Nina@linda.com"
        };

        const token = TokenManager.generateToken(loginAlternative);

        const response = await chai
        .request(app)
        .post('/matches')
        .set('Authorization', `Bearer ${token}`)
        .send({ homeTeamId: 2, homeTeamGoals: 3, awayTeamId: 7, awayTeamGoals: 10 });
  
        expect(response.status).to.be.equal(500);
        expect(response.body).to.deep.equal({ message: 'Internal server error' }); 
      });
  });
});
