import * as Models from './Models';

class Router {
    private routes: Models.Route[];
    private rootElement: HTMLElement;
    private routeElement: HTMLElement;

    public currentPath: string;

    constructor() {

    }

    async start(rootComponent: typeof Models.Component, rootElement: HTMLElement, routes: Models.Route[]): Promise<void> {
        this.rootElement = rootElement;
        this.routes = routes;

        await this.renderComponent(rootComponent, this.rootElement, {});

        window.addEventListener('hashchange', async (event) => {
            await this.refresh();
        });
    }

    async refresh(): Promise<void> {
        let urlParts = this.getUrlParts(location.hash);

        await this.go(urlParts.path, urlParts.props);
    }

    async go(path: string, props: Models.Props) {
        await this.renderRoute(path, props);

        location.hash = this.buildUrl(path, props);
    }

    async renderComponent(component: typeof Models.Component, element: HTMLElement, props: Models.Props): Promise<void> {
        let comp = new component(props, element);

        await comp.render();
    }

    private async renderRoute(path: string, props: Models.Props): Promise<void> {
        this.routeElement = this.rootElement.querySelector('content') as HTMLElement;

        if(!this.rootElement) {
            return;
        }

        let route = this.findRouteByPath(path);

        if(!route) {
            return;
        }

        await this.renderComponent(route.component, this.routeElement, props);

        this.currentPath = path;
    }

    private findRouteByPath(path: string) {
        for(let route of this.routes) {
            if(route.path == path) {
                return route;
            }
        }
    }

    private buildUrl(path: string, props: Models.Props) {
        let url: string = path;

        let i = 0;

        for(let prop in props) {
            let seperator = i == 0 ? '?' : '&';

            url += `${seperator}${prop}=${props[prop]}`;

            i++;
        }

        return url;
    }

    private getUrlParts(hash: string): Models.UrlParts {
        if(hash.substring(0, 1) == '#') {
            hash = hash.substring(1);
        }

        let parts = hash.split('?');

        let path = parts[0];
        let props: Models.Props = {};

        if(parts.length > 1) {
            props = this.getPropsFromQuery(parts[1]);
        }

        return {
            path,
            props
        };
    }

    private getPropsFromQuery(params: string): Models.Props {
        let props: Models.Props = {};

        for(let param of params.split('&')) {
            let parts = param.split('=');

            let key = parts[0];
            let value = parts[1];

            props[key] = value;
        }

        return props;
    }
}

export default new Router();