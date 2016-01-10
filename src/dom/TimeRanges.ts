namespace videomock.dom {
  interface ITimeRange {
    start: number
    end: number
  }

  /**
   * TimeRanges Object implementation
   */
  export class TimeRanges {
    /**
     * Need public scope to be setted manually during progress
     */
    public ranges: Array<ITimeRange> = [];

    get length(): number {
      return this.ranges.length
    }

    public addRange(start: number, end: number): void {
      this.ranges.push(<ITimeRange>{'start' : start, 'end': end})
    }

    public start(index: number): number {
      return this.ranges[index].start
    }

    public end(index: number): number {
      return this.ranges[index].end
    }
  }
}
