
export const convertToTimestamp = (startTime: string, endTime: string) => {

    // 00:00:10.000 --> 00:00:13.000

    return `00:${startTime}.000 --> 00:${endTime}.000`

}