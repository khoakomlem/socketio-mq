export type RequestData = {
    event: string;
    args: any[];
    from: string;
};
export type ResponseData = {
    status: "success";
    data: any;
} | {
    status: "error";
    error: {
        message: string;
        stack: string;
    };
};
