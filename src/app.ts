import Main from './Components/Main';
import Table from './Components/Table';
import Fixtures from './Components/Fixtures';
import Club from './Components/Club';
import Router from './Router';
import './style/main.scss';

async function render() {
    let root = document.getElementById('root');

    let routes = [
        {
            path: 'table',
            component: Table
        },
        {
            path: 'fixtures',
            component: Fixtures
        },
        {
            path: 'club',
            component: Club
        }
    ];

    await Router.start(Main, root, routes);

    await Router.go('table', {});
}

render();