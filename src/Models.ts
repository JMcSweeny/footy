
export interface League {
    name: string,
    key: string
    championsLeagueSpots: number
}

export interface Club {
    code: string,
    key: string,
    name: string
}

export interface TableClub extends Club {
    played: number,
    wins: number,
    draws: number,
    loses: number,
    goalsFor: number,
    goalsAgainst: number,
    points: number,
    goalDiff: number
}

export interface Table {
    clubs: TableClub[]
}

export interface Round {
    name: string;
    matches: Match[];
}

export interface Match {
    date: string,
    score1: number,
    score2: number,
    team1: Club,
    team2: Club
}

export interface LeagueByYear {
    year: string,
    league: League,
    clubs: Club[],
    table: Table,
    fixtures: Round[]
}

export interface IComponent {
    preRender(): Promise<void>;
    render(): Promise<string>;
    postRender(): Promise<void>;
}

export interface Props {
    [propName: string]: any
}

export interface Route {
    component: typeof Component;
    path: string;
}

export interface UrlParts {
    path: string;
    props: Props;
}

export class Component implements IComponent {
    protected props: Props;

    constructor(props: Props) {
        this.props = props;
    }
    
    async preRender(): Promise<void> {
        return;
    }

    async render(): Promise<string> {
        return '';
    }

    async postRender(): Promise<void> {
        return;
    }

    getPrettyDate(matchDate: string): string {
        let date = new Date(matchDate);

        let months = [
            'JAN', 'FEB', 'MAR', 
            'APR', 'MAY', 'JUN', 
            'JUL', 'AUG', 'SEP', 
            'OCT', 'NOV', 'DEC'
        ];

        let month = months[date.getUTCMonth()];
        let day = date.getUTCDate();

        return `${day} ${month}`;
    }

    getScore(score1: number, score2: number): string {
        if(score1 == null) {
            return 'vs';
        }

        return `${score1} - ${score2}`;
    }
}