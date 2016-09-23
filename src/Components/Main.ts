import * as Models from '../Models';
import Store from '../Store';
import Router from '../Router';

export default class Main extends Models.Component {
    private leagues: Models.League[];
    private years: string[];

    constructor(props: Models.Props, element: HTMLElement) {
        super(props, element);
    }

    protected async preRender(): Promise<void> {
        this.leagues = Store.leagues;
        this.years = Store.years;
    }

    protected async renderHtml(): Promise<string> {
        return `
            <header>
                <div class="content">
                    <div class="selects">
                        <img class="logo" />
                        <select name="leagues" id="leagues">
                            ${this.renderLeagueOptions(this.leagues)}
                        </select>
                        <select name="years" id="years">
                            ${this.renderYearOptions(this.years)}
                        </select>
                    </div>
                    <div class="links">
                        <a href="#table">Table</a>
                        <a href="#fixtures">Fixtures</a>
                    </div>
                </div>
            </header>
            <view></view>
        `;
    }

    protected async postRender(): Promise<void> {
        let leaguesSelect = document.getElementById('leagues') as HTMLSelectElement;

        leaguesSelect.addEventListener('change', async (event) => {
            let selectedLeague = leaguesSelect.options[leaguesSelect.selectedIndex] as HTMLOptionElement;

            Store.setLeague(selectedLeague.value);

            if(Router.currentPath == 'club') {
                await Router.go('table', {});
            } else {
                await Router.refresh();
            }

            this.setLeagueStyle();         
        });

        let yearSelect = document.getElementById('years') as HTMLSelectElement;

        yearSelect.addEventListener('change', async (event) => {
            let selectedYear = yearSelect.options[yearSelect.selectedIndex] as HTMLOptionElement;

            Store.setYear(selectedYear.value);

            await Router.refresh();
        });

        this.setLeagueStyle();
    }

    private renderLeagueOptions(leagues: Models.League[]): string {
        let selectedLeague = Store.getLeague();

        return leagues.map(league => {
            let selected = league == selectedLeague ? 'selected="selected"' : "";

            return `<option value="${league.key}" ${selected}>${league.name}</option>`
        }).join('');
    }

    private renderYearOptions(years: string[]) : string {
        let selectedYear = Store.getYear();

        return years.map(year => {
            let selected = year == selectedYear ? 'selected="selected"' : "";

            return `<option value="${year}" ${selected}>${year}</option>`
        }).join('');
    }

    private setLeagueStyle(): void {
        let league = Store.getLeague();

        let header = document.querySelector('header') as HTMLElement;

        header.className = league.key;

        let logo = header.querySelector('.logo') as HTMLImageElement;

        logo.src = <string>require('../img/' + league.key + '.png');
    }
}