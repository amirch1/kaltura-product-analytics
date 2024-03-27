export class DateFilterUtils {
  static getTimeZoneOffset(): number {
    const today: Date = new Date();
    return today.getTimezoneOffset();
  }

  static toServerDate(value: Date, startDate: boolean): number | undefined {

    let dateClone = new Date(value.getTime());    // clone date to prevent changing the date passed by reference
    if (startDate) {
      dateClone.setHours(0, 0, 0);     // force start of day
    } else {
      const currentOffset = this.getTimeZoneOffset();
      const dateOffset = dateClone.getTimezoneOffset();
      const hoursDiff = (currentOffset - dateOffset) / 60;
      const updatedHours =  hoursDiff < 0 ? 23 + hoursDiff : 23;
      dateClone.setHours(updatedHours, 59, 59);  // force end of day
    }
    return value ? Math.floor(dateClone.getTime() / 1000) : undefined; // divide by 1000 to convert to seconds as required by Kaltura API
  }
  
  static formatFullDateString(value: string): string {
    let result = '';
    const year: string = value.substring(0, 4);
    const month: string = value.substring(4, 6);
    const day: string = value.substring(6, 8);
    result = day + '/' + month + '/' + year;
    return result;
  }

  static fromServerDate(value: number): Date | null{
    return (value ? new Date(value * 1000) : null);
  }


  static getDay(value: Date): string {
    return value.getFullYear().toString() + DateFilterUtils.getFull(value.getMonth() + 1) + DateFilterUtils.getFull(value.getDate());
  }

  static getFull(num: number): string {
    return num > 9 ? num.toString() : ( '0' + num.toString());
  }
  
}
