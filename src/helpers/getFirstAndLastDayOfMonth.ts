export const getFirstAndLastDayOfMonth = (timestampParam) => {
    // Convert the timestamp to a Date object

    // Convert the month string to a number
    const timestamp = parseInt(timestampParam, 10);

    const date = new Date(timestamp);

    const year = date.getUTCFullYear();
    const month = date.getUTCMonth();

    // Get the first day of the month
    const firstDay = new Date(Date.UTC(year, month, 1));

    // Get the last day of the month
    const lastDay = new Date(Date.UTC(year, month + 1, 0)); // The 0th day of the next month

    return { firstDay, lastDay };
};
