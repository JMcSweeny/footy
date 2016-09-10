import * as Models from '../Models';
import Store from '../Store';

export default class Table extends Models.Component {
    private league: Models.LeagueByYear;

    constructor(props: Models.Props) {
        super(props);
    }

    async preRender(): Promise<void> {
        this.league = await Store.loadLeague();
    }

    async render(): Promise<string> {
        return `
            <table class="league-table">
                <thead>
                    <tr>
                        <th class="place">#</th>
                        <th class="club">Club</th>
                        <th class="played">Played</th>
                        <th class="won">W</th>
                        <th class="drawn">D</th>
                        <th class="lost">L</th>
                        <th class="goals-for">GF</th>
                        <th class="goals-against">GA</th>
                        <th class="goal-diff">GD</th>
                        <th class="points">P</th>
                    </tr>
                </thead>
                <tbody>
                    ${this.renderTable(this.league.table)}
                </tbody>
            </table>
        `;
    }

    async postRender(): Promise<void> {
        let table = document.querySelector('.league-table');
        let rows = table.querySelectorAll('tbody tr');

        for(let i = 0; i < this.league.league.championsLeagueSpots; i++) {
            rows[i].classList.add('champ');
        }

        for(let i = rows.length - 1; i > rows.length - 4; i--) {
            rows[i].classList.add('rel');
        }
    }

    renderTable(table: Models.Table): string {
        return table.clubs.map((club, i) => {
            return `
                <tr>
                    <td class="place">${i+1}</td>
                    <td class="club"><a href="#club?name=${club.key}">${club.name}</a></td>
                    <td class="played">${club.played}</td>
                    <td class="wins">${club.wins}</td>
                    <td class="drawn">${club.draws}</td>
                    <td class="lost">${club.loses}</td>
                    <td class="goals-for">${club.goalsFor}</td>
                    <td class="goals-against">${club.goalsAgainst}</td>
                    <td class="goal-diff">${club.goalDiff}</td>
                    <td class="points">${club.points}</td>
                </tr>
            `
        }).join('');
    }
}