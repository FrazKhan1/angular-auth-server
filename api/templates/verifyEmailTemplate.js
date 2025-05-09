const verifyEmailTemplate = (username, link) => `
  <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
    <div style="max-width: 600px; margin: auto; background: #fff; padding: 30px; border-radius: 8px;">
      <h2 style="color: #333;">Hi ${username || "there"},</h2>
      <p>Thank you for signing up! Please verify your email by clicking the button below:</p>
      <p style="text-align: center;">
        <a href="${link}" style="display: inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">Verify Email</a>
      </p>
      <p>If the button doesn't work, copy and paste this link into your browser:</p>
      <p style="word-break: break-all;">${link}</p>
      <hr>
      <p style="font-size: 12px; color: #777;">If you didn’t create an account, please ignore this email.</p>
    </div>
  </div>
`;

export default verifyEmailTemplate;
