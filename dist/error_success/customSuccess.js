export const sendSuccess = (message, statusCode, data, res) => {
    res.status(statusCode).json({
        message,
        statusCode,
        data,
        success: true,
    });
};
