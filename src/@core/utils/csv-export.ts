
import csvDownload from 'json-to-csv-export'

export interface IcsvExport {
    data: any,
    filename: string,
    headers: string[]
}

export const csvExport = async ({
    data,
    filename = `data`,
    headers = [],
}: IcsvExport) => {

    const dataToConvert = {
        data,
        filename: `${filename}-qac-${Date.now()}`,
        delimiter: ',',
        headers
    }

    csvDownload(dataToConvert)
}
