import * as Models from '../Models';
import Store from '../Store';

export default class Fixtures extends Models.Component {
  private league: Models.LeagueByYear;

  constructor(props: Models.Props, element: HTMLElement) {
    super(props, element);
  }

  protected async preRender(): Promise<void> {
    this.league = await Store.loadLeague();
  }

  protected async renderHtml(): Promise<string> {
    return this.renderFixtures(this.league.fixtures);
  }

  private renderFixtures(fixtures: Models.Round[]): string {
    return fixtures.map(fixture => {
      return `
        <h2 class="matchday">${fixture.name}</h2>
        <table class="fixtures-table">
          <tbody>
            ${this.renderMatches(fixture.matches)}
          </tbody>
        </table>
      `;
    }).join('');
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