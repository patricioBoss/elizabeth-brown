const resetPasswordMailTemplate = (name = '', link: string) => `
<!DOCTYPE html>
<html lang="en" dir="ltr">
    <head>
        <meta charset="UTF-8" />
        <title>Reset Password</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <meta content="Elizabeth Mende Brown Wealth Management" name="description" />
        <meta name="author" content="Ethervest" />
        <meta name="version" content="1.0.0" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />

        <!-- Font -->
        <link href="https://fonts.googleapis.com/css?family=Nunito:400,600,700&display=swap" rel="stylesheet">
    </head>

    <body class="font-nunito text-base text-black dark:text-white dark:bg-slate-900">

        <!-- Hero Start -->
        <div style="margin-top: 50px;">
            <table cellpadding="0" cellspacing="0" style="font-family: Nunito, sans-serif; font-size: 15px; font-weight: 400; max-width: 600px; border: none; margin: 0 auto; border-radius: 6px; overflow: hidden; background-color: #fff; box-shadow: 0 0 3px rgba(60, 72, 88, 0.15);">
            <thead>
            <tr style="background-color: #14609a; padding: 3px 0; border: none; line-height: 68px; text-align: center; color: #fff; font-size: 24px; letter-spacing: 1px;">
                <th scope="col"><img style="width: 300px; margin-top: 50px;" src="https://i.postimg.cc/GpLHBgVc/mail-logo.png" alt=""></th>
            </tr>
        </thead>

                <tbody>
                    <tr>
                        <td style="padding: 48px 24px 0; color: #161c2d; font-size: 18px; font-weight: 600;">
                            Hi, ${name}
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 15px 24px 15px; color: #595e64;">
                            To reset your password, please click the button below :
                        </td>
                    </tr>

                    <tr>
                        <td style="padding: 15px 24px;">
                            <a href="${link}" style="padding: 8px 20px; outline: none; text-decoration: none; font-size: 16px; letter-spacing: 0.5px; transition: all 0.3s; font-weight: 600; border-radius: 6px; background-color: #4f46e5; border: 1px solid #4f46e5; color: #ffffff;">Reset Password</a>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding: 15px 24px 0; color: #595e64;">
                            This link will be active for 30 minutes from the time this email was sent. If you did not request to reset your password, please ignore this email and your account will not be affected.
                        </td>
                    </tr>

                    <tr>
                        <td style="padding: 16px 8px; color: #676d74; background-color: #f8f9fc; text-align: center;">
                            © ${new Date().getFullYear()} Elizabeth Mende Brown Wealth Management.
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <!-- Hero End -->
    </body>
</html>
`;

export default resetPasswordMailTemplate;
