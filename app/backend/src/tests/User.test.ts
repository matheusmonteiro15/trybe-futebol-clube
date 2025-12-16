import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');
import { app } from '../app';
import * as bcrypt from 'bcryptjs';
import UserModel from '../database/models/SequelizeUser';
import TokenManager from '../credentialsAcessControl/tokenManager';

const { expect } = chai;

chai.use(chaiHttp);

  describe('Testes da rota /login em POST /', function () {
    it('Deve fazer login com credenciais válidas e retornar um token', async () => {
      
      const response = await chai
        .request(app)
        .post('/login')
        .send({
          email: 'admin@admin.com',
          password: 'secret_admin',
        });

      expect(response).to.have.status(200);
      expect(response.body).to.have.key('token');
    })

    it('Deve fazer login sem credenciais e retornar mensagem de erro de body inválido', async function() {
        const response = await chai.request(app).post('/login').send({});
    
        expect(response).to.have.status(400);
        expect(response.body).to.deep.equal({ message: 'All fields must be filled' });
      });

      it('Deve fazer login com o campo do email vazio e retornar mensagem de erro de body inválido', async function () {
        const missingEmail = {
        email: "",
        password: "ElderDruid"
    };
        const response = await chai.request(app).post('/login').send(missingEmail);
        expect(response).to.have.status(400);
        expect(response.body).to.deep.equal({ message: 'All fields must be filled' });
      });
    
      it('Deve fazer login com o campo da senha vazio e retornar mensagem de erro de body inválido', async function () {
        const missingPassword = {
        email: "nina@gmail.com",
        password: ""
    };
        const response = await chai.request(app).post('/login').send(missingPassword);
        expect(response).to.have.status(400);
        expect(response.body).to.deep.equal({ message: 'All fields must be filled' });
      });

      it('Deve fazer login com email inválido e retornar mensagem de erro de email inválido', async function () {
        const invalidEmail = {
        email: "Nina@linda",
        password: "ElderDruid"
    };
        const response = await chai.request(app).post('/login').send(invalidEmail);
        expect(response).to.have.status(401);
        expect(response.body).to.deep.equal({ message: 'Invalid email or password' });
      });
    
      it('Deve fazer login com senha inválida e retornar mensagem de erro de senha inválida', async function () {
        const invalidPassword = {
        id: 1,
        email: "nina@gmail.com",
        password: "au",
        username: 'matheus',
        role: 'admin'
    };

    sinon.stub(UserModel, 'findOne').resolves(UserModel.build(invalidPassword));
    sinon.stub(bcrypt, 'compareSync').returns(false);
        const response = await chai.request(app).post('/login').send(invalidPassword);
        expect(response).to.have.status(401);
        expect(response.body).to.deep.equal({ message: 'Invalid email or password' });
      });
  });

  describe('Testes da rota /login em GET /role', function () {
    it('Requisição feita com token válido deve retornar ROLE do usuário', async function () {
        const login = await chai
        .request(app)
        .post('/login')
        .send({
          email: 'admin@admin.com',
          password: 'secret_admin',
        });

      const token = login.body.token;

        const response = await chai
        .request(app)
        .get('/login/role')
        .set('Authorization', `Bearer ${token}`);

      expect(response).to.have.status(200);
      expect(response.body).to.deep.equal({ role: 'admin' });
    });

    it("Requisição feita com campo do token vazio retorna mensagem de erro de token não encontrado", async function () {
      const response = await chai.request(app).get('/login/role').set({ "Authorization": '' });

      expect(response).to.have.status(401);
      expect(response.body).to.deep.equal({ message: 'Token not found' });
    });

    it("Requisição feita com token inválido retorna mensagem de erro de token inválido", async function () {
      const invalidToken = 'NinaLinda'
      const response = await chai
      .request(app)
      .get('/login/role')
      .set('Authorization', `Bearer ${invalidToken}`);

      expect(response).to.have.status(401);
      expect(response.body).to.deep.equal({ message: 'Token must be a valid token' });
    });

    it("Deve retornar 404 em caso do usuário não existir", async function () {
      sinon.stub(UserModel, 'findByPk').resolves(null);
      const login2 = {
        id: 18,
        username: "MeEncontre",
        role: "admin",
        email: "Nina@linda.com"
    }; 
      const token = TokenManager.generateToken(login2);
      const response = await chai
        .request(app)
        .get('/login/role')
        .set('Authorization', `Bearer ${token}`);

      expect(response).to.have.status(404);
      expect(response.body).to.deep.equal({ message: 'User not found' }); 
    });

    it("Deve retornar status 500 em caso de erro na conexão externa", async function () {
      sinon.stub(UserModel, 'findAll').rejects(new Error("Erro de conexão com o banco de dados"));
      const login3 = {
        id: 18,
        username: "Nina",
        role: "admin",
        email: "Nina@linda.com"
    }; 
      const token = TokenManager.generateToken(login3);
      const response = await chai
        .request(app)
        .get('/login/role')
        .set('Authorization', `Bearer ${token}`);

      expect(response).to.have.status(500);
      expect(response.body).to.deep.equal({ message: 'Internal server error' }); 
    });
  });
  afterEach(function () {
    sinon.restore();
});
