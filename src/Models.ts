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
  render(): Promise<void>;
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
  protected element: HTMLElement;

  constructor(props: Props, element: HTMLElement) {
    this.props = props;
    this.element = element;
  }

  protected async preRender(): Promise<void> {
    return;
  }

  protected async renderHtml(): Promise<string> {
    return '';
  }

  protected async postRender(): Promise<void> {
    return;
  }

  async render(): Promise<void> {
    await this.preRender();
    this.element.innerHTML = await this.renderHtml();
    await this.postRender();
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
    if (score1 == null) {
      return 'vs';
    }

    return `${score1} - ${score2}`;
  }
}