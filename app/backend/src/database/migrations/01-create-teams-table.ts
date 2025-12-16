import { DataTypes, Model, QueryInterface } from 'sequelize';
import InterfaceTeam from '../../Interfaces/InterfaceTeam';

export default {
  up(queryInterface: QueryInterface) {
    return queryInterface.createTable<Model<InterfaceTeam>>('teams', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      teamName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'team_name',
      },
    })
  },

  down(queryInterface: QueryInterface) {
    return queryInterface.dropTable('teams');
  }
}