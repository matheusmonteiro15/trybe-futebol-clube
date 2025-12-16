const matchesMock = [
  {
    "id": 1,
    "homeTeamId": 16,
    "homeTeamGoals": 1,
    "awayTeamId": 8,
    "awayTeamGoals": 1,
    "inProgress": false,
    // "homeTeam": {
    //   "teamName": "São Paulo"
    // },
    // "awayTeam": {
    //   "teamName": "Grêmio"
    // }
  },
  {
    "id": 39,
    "homeTeamId": 3,
    "homeTeamGoals": 2,
    "awayTeamId": 11,
    "awayTeamGoals": 0,
    "inProgress": false,
    // "homeTeam": {
    //   "teamName": "Botafogo"
    // },
    // "awayTeam": {
    //   "teamName": "Napoli-SC"
    // }
  },
  {
    "id": 47,
    "homeTeamId": 8,
    "homeTeamGoals": 1,
    "awayTeamId": 14,
    "awayTeamGoals": 2,
    "inProgress": true,
    // "homeTeam": {
    //   "teamName": "Grêmio"
    // },
    // "awayTeam": {
    //   "teamName": "Santos"
    // }
  },
];

const matchesInProgress = [
  {
    "id": 41,
    "homeTeamId": 16,
    "homeTeamGoals": 2,
    "awayTeamId": 9,
    "awayTeamGoals": 0,
    "inProgress": true,
    // "homeTeam": {
    //   "teamName": "São Paulo"
    // },
    // "awayTeam": {
    //   "teamName": "Internacional"
    // }
  },
  {
    "id": 42,
    "homeTeamId": 6,
    "homeTeamGoals": 1,
    "awayTeamId": 1,
    "awayTeamGoals": 0,
    "inProgress": true,
    // "homeTeam": {
    //   "teamName": "Ferroviária"
    // },
    // "awayTeam": {
    //   "teamName": "Avaí/Kindermann"
    // }
  },
];

const completedMatches = [
  {
    "id": 8,
    "homeTeamId": 15,
    "homeTeamGoals": 0,
    "awayTeamId": 1,
    "awayTeamGoals": 1,
    "inProgress": false,
    // "homeTeam": {
    //   "teamName": "São José-SP"
    // },
    // "awayTeam": {
    //   "teamName": "Avaí/Kindermann"
    // }
  },
  {
    "id": 9,
    "homeTeamId": 1,
    "homeTeamGoals": 0,
    "awayTeamId": 12,
    "awayTeamGoals": 3,
    "inProgress": false,
    // "homeTeam": {
    //   "teamName": "Avaí/Kindermann"
    // },
    // "awayTeam": {
    //   "teamName": "Palmeiras"
    // }
  },
]

const matchPOST =
  {
    "id": 99,
    "homeTeamId": 17,
    "homeTeamGoals": 4,
    "awayTeamId": 7,
    "awayTeamGoals": 3,
    "inProgress": true,
  }

export {
    matchesMock,
    matchesInProgress,
    completedMatches,
    matchPOST
}
