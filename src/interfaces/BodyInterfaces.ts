
export interface IRecordInterface {
    patientId: string,
    remarks: string
}

export interface IPatientIDInterface {
    patientId: string
}

export interface IDoctorIDInterface {
    doctorId: string
}

export interface IExecutedMeeting {
    patientRemarks?: string
    rating?: number
}

export interface IUpdateMeetingDetails {
    patientRemarks?: string
    rating?: number,
    doctorId: string
}

export interface IDateTimeInterface {
    meetingTime?: Date,
    accept: boolean
}