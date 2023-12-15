const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const Account = require('../models/Account');
const Email = require('../utils/email');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

const createSendToken = (account, statusCode, req, res) => {
    const token = signToken(account.id);

    res.cookie("jwt", token, {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly: true, // cookie cannot be accessed or modified in any way by the browser
        secure: req.secure || req.headers["x-forwarded-proto"] === "https"
    });

    // Remove password from output
    account.password = undefined;
    account.passwordConfirm = undefined;

    res.status(statusCode).json({
        status: "success",
        token,
        data: {
            account
        }
    });
};

module.exports = {
    signup: catchAsync(async (req, res, next) => {
        const newAccount = await Account.create({
            email: req.body.email,
            address: req.body.address,
            phoneNumber: req.body.phoneNumber,
            residentId: req.body.residentId,
            username: req.body.username,
            password: req.body.password,
            passwordConfirm: req.body.passwordConfirm
        });

        createSendToken(newAccount, 201, req, res);
    }),
    signin: catchAsync(async (req, res, next) => {
        const { email, password } = req.body;
        // Check if email and password exist
        if (!email || !password) {
            return next(new AppError("Please provide email and password!", 400));
        }

        // Check if user exists && password is correct      
        const account = await Account.findOne({
            where: { email },
            attributes: { include: 'password' }
        });

        if (!account || !(await account.correctPassword(password))) {
            return next(new AppError("Incorrect email or password", 401));
        }

        // If everything ok, send token to client
        createSendToken(account, 200, req, res);
    }),
    signout: (req, res) => {
        res.cookie("jwt", "loggedout", {
            expires: new Date(Date.now() + 10 * 1000),
            httpOnly: true
        });
        res.status(200).json({ status: "success" });
    },
    protect: catchAsync(async (req, res, next) => {
        // Getting token and check if it's there
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        } else if (req.cookies.jwt) {
            token = req.cookies.jwt;
        }

        if (!token) {
            return next(new AppError("You are not logged in! Please log in to get access.", 401));
        }

        // Verification token
        const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

        // Check if account still exists
        const currentAccount = await Account.findByPk(decoded.id);
        if (!currentAccount) {
            return next(new AppError("The user belonging to this token does no longer exist.", 401));
        }

        // Check if account changed password after the token was issued
        if (currentAccount.changedPasswordAfter(decoded.iat)) {
            return next(new AppError("User recently changed password! Please log in again.", 401));
        }

        // GRANT ACCESS TO PROTECTED ROUTE
        req.user = currentAccount;
        res.locals.user = currentAccount;
        next();
    }),
    // Only for rendered pages, no errors!
    isLoggedIn: async (req, res, next) => {
        if (req.cookies.jwt) {
            try {
                // Verify token
                const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);

                // Check if user still exists
                const currentAccount = await Account.findByPk(decoded.id);
                if (!currentAccount) {
                    return next();
                }

                // Check if user changed password after the token was issued
                if (currentAccount.changedPasswordAfter(decoded.iat)) {
                    return next();
                }

                // THERE IS A LOGGED IN USER
                res.locals.user = currentAccount;
                return next();
            } catch (err) {
                return next();
            }
        }
        next();
    },
    restrictTo: (...roles) => {
        return (req, res, next) => {
            if (!roles.includes(req.user.role)) {
                return next(new AppError("You do not have permission to perform this action", 403));
            }

            next();
        };
    },
    forgotPassword: catchAsync(async (req, res, next) => {
        // Get account based on POSTed email
        const account = await Account.findOne({
            where: { email: req.body.email }
        });

        if (!account) {
            return next(new AppError("There is no user with this email address.", 404));
        }

        // Generate the random reset token
        const resetToken = account.createPasswordResetToken();
        await account.save({ validate: false });

        // Send it to user's email
        try {
            const resetURL = `${req.protocol}://${req.get(
                "host"
            )}/api/accounts/resetPassword/${resetToken}`;
            await new Email(account, resetURL).sendPasswordReset();

            res.status(200).json({
                status: "success",
                message: "Token sent to email!"
            });
        } catch (err) {
            console.log(err);
            account.passwordResetToken = null;
            account.passwordResetExpires = null;
            await account.save({ validate: false });
            return next(new AppError("There was an error sending the email. Try again later!"), 500);
        }
    }),
    resetPassword: catchAsync(async (req, res, next) => {
        // Get account based on the token
        const hashedToken = crypto
            .createHash("sha256")
            .update(req.params.token)
            .digest("hex");

        const account = await Account.findOne({
            where: {
                passwordResetToken: hashedToken,
                passwordResetExpires: {
                    [Op.gt]: Date.now(),
                },
            },
        });

        // If token has not expired, and there is user, set the new password
        if (!account) {
            return next(new AppError("Token is invalid or has expired", 400));
        }
        account.password = req.body.password;
        account.passwordConfirm = req.body.passwordConfirm;
        account.passwordResetToken = undefined;
        account.passwordResetExpires = undefined;
        await account.save();

        // Log the user in, send JWT
        createSendToken(account, 200, req, res);
    }),
    updatePassword: catchAsync(async (req, res, next) => {
        // Get user
        const account = await Account.findByPk(req.user.id, { attributes: { include: 'password' } });

        // Check if POSTed current password is correct
        if (!(await account.correctPassword(req.body.passwordCurrent))) {
            return next(new AppError("Your current password is wrong.", 401));
        }

        // If so, update password
        account.password = req.body.password;
        account.passwordConfirm = req.body.passwordConfirm;
        await account.save();

        // Log user in, send JWT
        createSendToken(account, 200, req, res);
    })
};