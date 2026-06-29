import { convertToTimestamp } from "../helper/convertToTimestamp";

export function convertToDuration(seconds: number) {
    const durationSeconds = seconds;
    const minutes = Math.floor(durationSeconds / 60);
    const remainingSeconds = durationSeconds % 60;
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = remainingSeconds.toString().padStart(2, '0');
    return `${formattedMinutes}:${formattedSeconds}`;
}

export const getSecondsFromDuration = (duration: string) => {
    const timeArray = duration.split(":");
    const minutes = parseInt(timeArray[0]);
    const seconds = parseInt(timeArray[1]);
    const totalSeconds = (minutes * 60) + seconds;
    return totalSeconds
}

export function makeVTTSingle(array: { start: string, end: string, text: string }[]) {
    // setFlag(true)

    //@ts-ignore
    const text = array.reduce((str, { start, end, text }, index) => {
      // you would also have to make a "seconds to timestamp" parser
      // but I leave it to the reader as an exercise

      // if (text === undefined || text.length == 1) return

      const formatedTimeStamp = convertToTimestamp(start, end)

      // 00:00:10.500 --> 00:00:13.000

      return (
        str +
        `
      ${formatedTimeStamp}
      ${text}`
      )
    }, `WEBVTT`)

    return new Blob([text], { type: 'text/plain' })
  }
