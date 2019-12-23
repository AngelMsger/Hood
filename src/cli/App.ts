/**
 * @author  i@angelmsger.com
 * @date    2019/12/22
 */

import blessed, { Widgets } from 'blessed';
import contrib from 'blessed-contrib';
import _ from 'lodash';
import { loadLeetCode } from './LeetCode';
import { loadWakatime } from './Wakatime';

/**
 * start CLI dashboard
 * @param screen - blessed screen instance
 * @async
 */
async function bootstrap(
    screen: Widgets.Screen
): Promise<void> {
    const grid = new contrib.grid({
        rows: 12,
        cols: 12,
        screen
    });
    await Promise.all([
        loadWakatime(grid),
        loadLeetCode(grid)
    ]);
    screen.render();
}

/**
 * blessed screen singleton
 */
const screen = blessed.screen();

// bind exit key
screen.key([
    'escape', 'q', 'C-c'
], () => process.exit());

// start CLI dashboard
_.noop(bootstrap(screen));
