/**
 * @author  i@angelmsger.com
 * @date    2019/12/22
 */

import contrib from 'blessed-contrib';
import _ from 'lodash';
import moment from 'moment-timezone';
import { CLIConf } from '../conf/CLI';
import { WebEndpoint } from '../conf/Web';
import { IWakatimeSummaryData } from '../entity/wakatime/Summary';
import { WakatimeSummaryType } from '../enum';
import { httpRequest } from '../util/Rquest';
import BarElement = contrib.Widgets.BarElement;
import DonutData = contrib.Widgets.DonutData;
import DonutElement = contrib.Widgets.DonutElement;
import GridElement = contrib.Widgets.GridElement;
import TableElement = contrib.Widgets.TableElement;

/**
 * fix number digits
 * @param val - raw number
 */
function fixFloat(
    val: number
): number {
    return Number.parseFloat(Number(val).toFixed(2));
}

/**
 * wakatime project bar chart
 */
let projectChart: BarElement;

/**
 * load and refresh wakatime project bar chart
 * @param grid - blessed grid instance of screen
 * @param projects - projects
 */
function loadProjects(
    grid: GridElement,
    projects: IWakatimeSummaryData[]
): void {
    projects = _.take(projects, CLIConf.chart.project.size);
    if (!projectChart) {
        projectChart = grid.set(0, 0, 6, 6, contrib.bar, {
            label: 'Projects (min)',
            barWidth: 8,
            barSpacing: 2,
            xOffset: 0,
            maxHeight: 9,
            barBgColor: CLIConf.chart.project.color,
            barFgColor: 'white'
        });
    }
    const titles: string[] = [];
    const data: number[] = [];
    projects.forEach((projectData) => {
        titles.push(projectData.name);
        data.push(fixFloat(projectData.totalSeconds / 60));
    });
    projectChart.setData({ titles, data });
}

/**
 * wakatime editor bar chart
 */
let editorChart: BarElement;

/**
 * load and refresh editor chart
 * @param grid - blessed grid instance of screen
 * @param editors - editors
 */
function loadEditors(
    grid: GridElement,
    editors: IWakatimeSummaryData[]
): void {
    editors = _.take(editors, CLIConf.chart.editor.size);
    if (!editorChart) {
        editorChart = grid.set(6, 0, 6, 6, contrib.bar, {
            label: 'Editors (min)',
            barWidth: 6,
            barSpacing: 8,
            xOffset: 0,
            maxHeight: 9,
            barBgColor: CLIConf.chart.project.color,
            barFgColor: 'white'
        });
    }
    const titles: string[] = [];
    const data: number[] = [];
    editors.forEach((editorData) => {
        titles.push(editorData.name);
        data.push(fixFloat(editorData.totalSeconds / 60));
    });
    editorChart.setData({ titles, data });
}

/**
 * wakatime language donut chart
 */
let languageChart: DonutElement;

/**
 * load and refresh language chart
 * @param grid - blessed grid instance of screen
 * @param languages - languages
 */
function loadLanguages(
    grid: GridElement,
    languages: IWakatimeSummaryData[]
): void {
    languages = _.take(languages, CLIConf.chart.language.size);
    if (!languageChart) {
        languageChart = grid.set(0, 6, 4, 6, contrib.donut, {
            label: 'Languages (%)',
            radius: 8,
            arcWidth: 3,
            remainColor: 'black',
            yPadding: 2
        });
    }
    const data: DonutData[] = [];
    languages.forEach((language) => {
        data.push({
            label: language.name,
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore FIXME: d.ts wrong
            percent: fixFloat(language.percent / 100),
            color: _.get(
                CLIConf.chart.language.languageColor,
                [language.name],
                CLIConf.chart.language.color
            )
        });
    });
    languageChart.setData(data);
}

/**
 * wakatime dependency table chart
 */
let dependencyChart: TableElement;

/**
 * load and refresh dependency chart
 * @param grid - blessed grid instance of screen
 * @param dependencies - dependencies
 */
function loadDependencies(
    grid: GridElement,
    dependencies: IWakatimeSummaryData[]
): void {
    if (!dependencyChart) {
        dependencyChart = grid.set(4, 6, 4, 6, contrib.table, {
            keys: true,
            fg: 'white',
            interactive: false,
            label: 'Dependency',
            border: {
                type: 'line',
                fg: 'cyan'
            },
            columnSpacing: 5,
            columnWidth: [20, 10, 10]
        });
    }
    const data: string[][] = [];
    dependencies.forEach((dependency) => {
        data.push([
            dependency.name,
            `${ fixFloat(dependency.totalSeconds / 60) }`,
            `${ dependency.percent }`
        ]);
    });
    dependencyChart.setData({
        headers: ['name', 'minutes', 'percent'],
        data
    });
}

/**
 * load and refresh chart
 * @param grid - blessed grid instance of screen
 * @async
 */
async function reloadCharts(
    grid: GridElement
): Promise<void> {
    const resultContent = await httpRequest({
        url: `${ WebEndpoint }/wakatime/user/summary`,
        json: true
    }) as unknown[];
    const results = _.reduce(resultContent, (memo, result) => {
        const type: WakatimeSummaryType = _.get(result, ['_id']);
        const summary: IWakatimeSummaryData[] = _.get(result, ['data']);
        return _.set(memo, [type], _.chain(summary)
            .reject((summary) => /unknown/.test(summary.name.toLowerCase()))
            .sortBy((val) => val.totalSeconds * -1)
            .value());
    }, {} as Record<WakatimeSummaryType, IWakatimeSummaryData[]>);
    loadProjects(grid, results.projects);
    loadEditors(grid, results.editors);
    loadLanguages(grid, results.languages);
    loadDependencies(grid, results.dependencies);
    grid.options.screen.render();
}

/**
 * load and refresh wakatime charts
 * @param grid - blessed grid instance of screen
 * @async
 */
export async function loadWakatime(
    grid: GridElement
): Promise<void> {
    await reloadCharts(grid);
    setInterval(
        () => reloadCharts(grid),
        moment.duration(5, 'minute').asMilliseconds()
    );
}
