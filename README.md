##Loan Application form

Created a verification form, at default url '/verify' in angular application.

The form have fields for City, PanNumber Fullname, Email, Mobile and OTP.

Form has verifications as follows-

City - required
PanNumber - required and valid PAN format for INDIA and max length of 10.
Fullname - required and max length of 140.
email - required and valid Email format and max length of 255.
Mobile - required and valid mobile format and max length of 10. (Shown with +91 prefix)
OTP - required and valid NUMBER ONLY format and max length of 4.(OTP field is hidden till getOTP API is successfully called)
As soon as mobile field is filled by user and is valid, then 'getOTP' API is called.

If 'getOTP' API is successful, 'Enter OTP' field is enabled and 'Resend OTP' link is disabled.

'Resend OTP' link remains disabled for 3 minutes and will get enable when 3 minutes lapse. Now user can click on 'Resend OTP' link again and if API is successfully called, above process is repeated.

User can click 'Resend OTP' link only 3 times, after that error message "Please try again after an hour" is shown and 'Resend OTP' link gets hidden.

As soon as user fills OTP field and its valid, 'verifyOTP' API is called.

If 'verifyOTP' API is successful, the message "Thank you for verification xxxx". XXXX is fullname filled by user in form.

Skilled used-
Material UI, angular services, RxJS, Routing.
