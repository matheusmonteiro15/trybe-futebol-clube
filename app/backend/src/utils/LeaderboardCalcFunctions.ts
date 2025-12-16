import InterfaceTeam from '../Interfaces/InterfaceTeam';
import InterfaceMatch from '../Interfaces/InterfaceMatch';

export default class LeaderboardCalcFunctions {
  public name: string;
  public totalPoints = 0;
  public totalGames = 0;
  public totalVictories = 0;
  public totalDraws = 0;
  public totalLosses = 0;
  public goalsFavor = 0;
  public goalsOwn = 0;
  public goalsBalance = 0;
  public efficiency = 0;

  constructor(
    team: InterfaceTeam,
    allFinishedMatches: InterfaceMatch[],
  ) {
    this.name = team.teamName;
    this.calculateHomeTeamResults(team, allFinishedMatches);
    this.calculateHomeTeamGoals(team, allFinishedMatches);
    this.calculateTotalPoints();
    this.calculateEfficiency();
  }

  private calculateHomeTeamResults(team: InterfaceTeam, finishedMatches: InterfaceMatch[]): void {
    const homeTeamMatches = finishedMatches.filter((match) => match.homeTeamId === team.id);
    this.totalGames = homeTeamMatches.length;
    homeTeamMatches.forEach((match) => {
      switch (true) {
        case match.homeTeamGoals > match.awayTeamGoals:
          this.totalVictories += 1;
          break;
        case match.homeTeamGoals < match.awayTeamGoals:
          this.totalLosses += 1;
          break;
        default:
          this.totalDraws += 1;
          break;
      }
    });
  }

  private calculateHomeTeamGoals(team: InterfaceTeam, allFinishedMatches: InterfaceMatch[]) {
    const homeTeamMatches2 = allFinishedMatches.filter((match) => match.homeTeamId === team.id);
    this.goalsFavor = homeTeamMatches2.reduce((acc, match) => acc + match.homeTeamGoals, 0);
    this.goalsOwn = homeTeamMatches2.reduce((acc, match) => acc + match.awayTeamGoals, 0);
    this.goalsBalance = this.goalsFavor - this.goalsOwn;
  }

  private calculateEfficiency(): number {
    this.efficiency = parseFloat(((this.totalPoints / (this.totalGames * 3)) * 100).toFixed(2));
    return this.efficiency;
  }

  private calculateTotalPoints() {
    this.totalPoints = this.totalVictories * 3 + this.totalDraws;
  }
}
