import * as Models from '../Models';
import Store from '../Store';

interface ClubProps extends Models.Props {
    name: string;
}

export default class Fixtures extends Models.Component {
    private league: Models.LeagueByYear;
    private key: string;
    private club: Models.Club;

    constructor(props: ClubProps, element: HTMLElement) {
        super(props, element);

        this.key = props.name;
    }

    protected async preRender(): Promise<void> {
        this.league = await Store.loadLeague();
        this.club = this.league.clubs.find(c => c.key == this.key);
    }

    protected async renderHtml(): Promise<string> {
        if(!this.club) {
            return `<div>Club did not compete in the ${this.league.year} ${this.league.league.name}`;
        }

        return `
            <h2 class="club-name">${this.league.year} ${this.club.name}</h2>
            ${this.renderFixtures()}
        `;
    }

    private renderFixtures(): string {
        let matches = Store.getMatches(this.league.fixtures, this.key);

        return `
            <table class="fixtures-table">
                <tbody>
                    ${this.renderMatches(matches)}
                </tbody>
            </table>
        `;
    }

    private renderMatches(matches: Models.Match[]): string {
        return matches.map(match => {
            return `
                <tr>
                    <td class="date">${this.getPrettyDate(match.date)}</td>
                    <td class="club"><a href="#club?name=${match.team1.key}">${match.team1.name}</a></td>
                    <td class="score">${this.getScore(match.score1, match.score2)}</td>
                    <td class="club"><a href="#club?name=${match.team2.key}">${match.team2.name}</a></td>
                </tr>
            `;
        }).join('');
    }
}