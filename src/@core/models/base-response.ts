interface BaseSuccessResponse<T> {
    success: true;
    data: T;
}

interface BaseErrorResponse {
    success: false;
    error: {
        property: string;
        message: string;
    }
}

export type BaseResponse<T> = BaseSuccessResponse<T> | BaseErrorResponse; 
