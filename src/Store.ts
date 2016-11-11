import * as Models from './Models';
import http from './http';

class Store {
    private BASE_URL = 'https://raw.githubusercontent.com/openfootball/football.json/master';

    private league: Models.League;

    public leagues: Models.League[] = [
        {
            name: 'German Bundesliga',
            key: 'de',
            championsLeagueSpots: 4
        },
        {
            name: 'English Premier League',
            key: 'en',
            championsLeagueSpots: 4
        },
        {
            name: 'Spanish Primera División',
            key: 'es',
            championsLeagueSpots: 4
        },
        {
            name: 'Italian Serie A',
            key: 'it',
            championsLeagueSpots: 3
        }
    ];

    private year: string;

    public years: string[] = [
        '2016-17',
        '2015-16',
        '2014-15',
        '2013-14'
    ];

    private leaguesByYear: Models.LeagueByYear[] = []; 

    constructor() {
        this.setLeague('en');
        this.setYear('2016-17');
    }

    getLeague(): Models.League {
        return this.league;
    }

    setLeague(key: string): void {
        this.league = this.leagues.find(l => l.key == key);
    }

    getYear(): string {
        return this.year;
    }

    setYear(year: string): void {
        this.year = year;
    }

    async loadLeague(): Promise<Models.LeagueByYear> {
        let league = this.getLeague();
        let year = this.getYear();

        let leagueByYear = this.findLeagueByYear(league, year);

        if(leagueByYear != null) {
            return leagueByYear;
        }

        let fixturesUrl = `${this.BASE_URL}/${year}/${league.key}.1.json`;
        let clubsUrl = `${this.BASE_URL}/${year}/${league.key}.1.clubs.json`;

        let clubsResponse = await http.get(clubsUrl);
        let fixturesResponse = await http.get(fixturesUrl);

        let clubs: Models.Club[] = clubsResponse.clubs;
        let fixtures: Models.Round[] = fixturesResponse.rounds;

        let matches: Models.Match[] = this.getMatches(fixtures);

        let table = this.generateTable(clubs, matches);

        leagueByYear = {
            year,
            league,
            clubs,
            table,
            fixtures
        };

        this.leaguesByYear.push(leagueByYear);

        return leagueByYear;
    }

    getMatches(fixtures: Models.Round[], clubKey?: string) {
        return fixtures.reduce((prev: Models.Match[], curr) => {
            let matches: Models.Match[] = curr.matches;

            if(clubKey) {
                matches = matches.filter(match => match.team1.key == clubKey || match.team2.key == clubKey);
            }

            return [...prev, ...matches];
        }, []);
    }

    private findLeagueByYear(league: Models.League, year: string) {
        return this.leaguesByYear.find(leagueByYear => 
            leagueByYear.year == year &&
            leagueByYear.league == league
        );
    }

    private generateTable(clubs: Models.Club[], matches: Models.Match[]): Models.Table {
        let tableClubs: Models.TableClub[] = clubs.map((club: Models.Club) => {
            return <Models.TableClub> {
                code: club.code,
                name: club.name,
                key: club.key,
                played: 0,
                wins: 0,
                draws: 0,
                loses: 0,
                goalsFor: 0,
                goalsAgainst: 0,
                points: 0,
                goalDiff: 0
            }
        });

        matches.map(match => {
            if(match.score1 == null) {
                return;
            }

            let team1: Models.TableClub = tableClubs.find(c => c.key == match.team1.key);
            let team2: Models.TableClub = tableClubs.find(c => c.key == match.team2.key);

            team1.played += 1;
            team2.played += 1;

            team1.goalsFor += match.score1;
            team2.goalsFor += match.score2;

            team1.goalsAgainst += match.score2;
            team2.goalsAgainst += match.score1;

            team1.goalDiff += (match.score1 - match.score2);
            team2.goalDiff += (match.score2 - match.score1);

            if(match.score1 > match.score2) {
                team1.wins += 1;
                team1.points += 3;
                team2.loses += 1;
            } else if(match.score2 > match.score1) {
                team2.wins += 1;
                team2.points += 3;
                team1.loses += 1;
            } else {
                team1.draws += 1;
                team1.points += 1;
                team2.draws += 1;
                team2.points += 1;
            }
        });

        tableClubs.sort(this.tableSort);

        return {
            clubs: tableClubs
        };
    }

    private tableSort(a, b) {
        if(b.points != a.points) {
            return b.points - a.points;
        }

        if(b.goalDiff != a.goalDiff) {
            return b.goalDiff - a.goalDiff;
        }

        if(b.goalsFor != a.goalsFor) {
            return b.goalsFor - a.goalsFor;
        }

        if(a.name > b.name) {
            return 1;
        }

        if(b.name < a.name) {
            return -1;
        }

        return 0;      
    }
}

export default new Store();

