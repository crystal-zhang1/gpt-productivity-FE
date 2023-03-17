
export function getDefaultSchedule() {
    const now = Date.now();
    const nextMinute = (now + 59000) / 60000 * 60000;

    return {
        start: new Date(nextMinute),
        end: new Date(nextMinute + 30 * 60 * 1000)
    }
}


