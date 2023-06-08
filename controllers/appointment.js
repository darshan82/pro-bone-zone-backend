const catchAsync = require("../utils/catchAsync");

exports.getAppointments = catchAsync(async (req, res, next) =>
{
    const user = req.userData;
    res.status(200).json({
        error: false,
        message: "Bid created successfully",
    });
})