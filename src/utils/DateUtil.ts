class DateUtils {
    static addTimezoneOffset(dateString: string): string {
        const date = new Date(dateString);

        const timezoneOffset = -date.getTimezoneOffset();

        const hoursOffset = Math.floor(Math.abs(timezoneOffset) / 60);
        const minutesOffset = Math.abs(timezoneOffset) % 60;

        const offsetString = `${timezoneOffset < 0 ? '-' : '+'}${String(hoursOffset)
            .padStart(2, '0')}:${String(minutesOffset).padStart(2, '0')}`;

        return `${dateString}${offsetString}`;
    }
}

export default DateUtils;
