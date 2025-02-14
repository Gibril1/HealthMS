export interface IAddReviewInterface{
    meetingId: string,
    review: string
}


export interface IRecordInterface {
    meetingId: string,
    notes: string
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

export interface IAcceptMeetingInterface {
    meetingTime?: string,
    status: 'ACCEPTED' | 'REJECTED'
}