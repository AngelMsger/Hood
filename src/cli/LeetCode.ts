/**
 * @author  i@angelmsger.com
 * @date    2019/12/22
 */

import contrib from 'blessed-contrib';
import cheerio from 'cheerio';
import moment from 'moment-timezone';
import { LeetCodeConf } from '../conf/LeetCode';
import { httpRequest } from '../util/Rquest';
import GridElement = contrib.Widgets.GridElement;
import TableElement = contrib.Widgets.TableElement;

/**
 * leetcode submission information
 * @interface ISubmission
 */
interface ISubmission {
    name: string;
    lang: string;
    time: string;
    result: string;
}

/**
 * leetcode table chart
 */
let leetCodeChart: TableElement;

async function reloadCharts(
    grid: GridElement
): Promise<void> {
    const html = await httpRequest<string>({
        url: `https://leetcode.com/${ LeetCodeConf.username }/`
    });
    const $ = cheerio.load(html);
    const submissions: ISubmission[] = [];
    $('ul.list-group')
        .each(function () {
            $(this)
                .find('a.list-group-item')
                .each(function () {
                    const results: string[] = [];
                    $(this)
                        .children()
                        .each(function () {
                            results.push(
                                $(this)
                                    .text()
                                    .trim()
                            );
                        });
                    for (let i = 0; i + 3 < results.length; i += 4) {
                        submissions.push({
                            name: results[i + 2],
                            lang: results[i + 1],
                            time: results[i + 3],
                            result: results[i]
                        });
                    }
                });
        });
    if (!leetCodeChart) {
        leetCodeChart = grid.set(8, 6, 4, 6, contrib.table, {
            keys: true,
            fg: 'white',
            interactive: false,
            label: 'LeetCode',
            border: {
                type: 'line',
                fg: 'cyan'
            },
            columnSpacing: 5,
            columnWidth: [10, 5, 20, 20]
        });
    }
    leetCodeChart.setData({
        headers: [
            'name', 'lang', 'result', 'time'
        ],
        data: submissions.map((submission) => [
            submission.name,
            submission.lang,
            submission.result,
            submission.time
        ])
    });
}

/**
 * load and refresh leetcode table content
 * @param grid - blessed grid instance of screen
 * @async
 */
export async function loadLeetCode(
    grid: GridElement
): Promise<void> {
    await reloadCharts(grid);
    setInterval(
        () => reloadCharts(grid),
        moment.duration(5, 'minute').asMilliseconds()
    );
}
