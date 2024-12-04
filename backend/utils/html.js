exports.forgetPasswordLinkMsg = (name, link)=>{
    return `
    <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: Arial, sans-serif;
      /* background-color: #f9f9f9; */
    background: linear-gradient(45deg, #002E6E, #00BAF6);

      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 20px;
    }

    .container {
      background: #fff;
      height: 400px;
      max-width: 600px;
      width: 100%;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      border-radius: 8px;
      padding: 20px;
      text-align: center;
    }

    .logo {
      font-size: 18px;
      font-weight: bold;
      color: #333;
      margin-bottom: 10px;
    }
    .name{
        margin: 10px;
        font-size: large;
        font-weight: 400;
    }
    .eyes {
      font-size: 30px;
      margin-bottom: 10px;
    }

    .title {
      font-size: 24px;
      font-weight: bold;
      color: #333;
      margin-bottom: 20px;
    }
    .text {
      font-size: 16px;
      color: #555;
      margin-bottom: 20px;
    }

    .email {
      font-weight: bold;
      color: #555;
    }

    .btn {
      display: inline-block;
      text-decoration: none;
      background: #007bff;
      color: #fff;
      font-weight: bold;
      padding: 12px 20px;
      border-radius: 5px;
      margin-bottom: 20px;
      transition: background 0.3s;
    }

    .btn:hover {
      background: #0056b3;
    }

    .footer {
      font-size: 12px;
      color: #5c5a5a;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo"><img src="" alt=""></div>
    <div class="eyes">👀</div>
    <div class="title">Password Reset Request</div>
    <div class="name">Hello, ${name} </div>
    <div class="text">
        Click the link below to reset your password. This link is valid for 1 hour.
    </div>
    <a href=${link} class="btn">Click here to reset your password</a>
    
    <div class="text">
        If you did not request this, please ignore this email.
    </div>
    <div class="footer">Copyright © 2021 Designmodo. All Rights Reserved.</div>
  </div>
</body>
</html>

    `
}


exports.otpMsg = (otp) =>{
    return `
        <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Email OTP Verification</title>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Poppins', sans-serif;
      background: linear-gradient(45deg, #002E6E, #00BAF6);
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      color: #fff;
    }
    
    .container {
      width: 100%;
      display: flex;
      justify-content: center;
    }
    
    .email-verification-card {
      background: #ffffff;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
      padding: 40px;
      max-width: 450px;
      width: 100%;
      text-align: center;
      border-radius: 12px;
      position: relative;
      z-index: 1;
    }
    
    .header .logo {
      width: 120px;
      /* height: 150px; */
      /* margin-bottom: 20px; */
    }
    
    h2 {
      font-size: 26px;
      font-weight: 600;
      color: #002e6e;
      margin-bottom: 15px;
    }
    
    .info-text {
      font-size: 16px;
      color: #333;
      margin-bottom: 20px;
    }
    
    .otp-container {
      display: flex;
      justify-content: center;
      margin-bottom: 30px;
      gap: 10px;
    }
    
    .otp-box {
      /* width: 50px; */
      height: 30px;
      /* background-color: #f1f1f1; */
      color: #002e6e;
      font-size: 28px;
      font-weight: bold;
      border-radius: 8px;
      display: flex;
      justify-content: center;
      align-items: center;
      /* box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); */
      transition: transform 0.3s ease, background-color 0.3s ease;
    }
    
    .otp-box:focus {
      transform: scale(1.1);
      background-color: #00baf6;
      color: #fff;
    }
    
    .confirm-button {
      background-color: #00baf6;
      border: none;
      padding: 14px 30px;
      color: #fff;
      font-size: 18px;
      font-weight: bold;
      border-radius: 50px;
      cursor: pointer;
      transition: background-color 0.3s ease, transform 0.3s ease;
      box-shadow: 0 5px 15px rgba(0, 186, 246, 0.3);
    }
    
    .confirm-button:hover {
      background-color: #009ac1;
      transform: scale(1.05);
    }
    
    .confirm-button:active {
      transform: scale(0.98);
    }
    
    .footer-text {
      font-size: 14px;
      color: #666;
      margin-top: 20px;
    }
    
    @media (max-width: 768px) {
      .email-verification-card {
        padding: 30px;
      }
    
      h2 {
        font-size: 22px;
      }
    
      .otp-box {
        font-size: 24px;
      }
    
      .confirm-button {
        padding: 12px 25px;
      }
    }
    
  </style>
</head>
<body>
  <div class="container">
    <div class="email-verification-card">
      <div class="header">
        <img src="http://res.cloudinary.com/dpnoynz7a/image/upload/v1732789583/z8swtvh3ixp4gg9wsbv5.png" alt="Company Logo" class="logo">
      </div>
      <h2>Complete Your Registration</h2>
      <p class="info-text">Enter the code we sent to your email address.</p>
      
      <div class="otp-container">
        <div class="otp-box">${otp}</div>
        
      </div>

      <p class="info-text">Use this code in the window where you started registering.</p>
      
      <button class="confirm-button">Confirm Your Email</button>

      <p class="footer-text">If you didn't create an account, please ignore this message.</p>
    </div>
  </div>
</body>
</html>

    `
}