export const authMessageMap = {
  "user not found": "کاربر پیدا نشد",
  "invalid credentials": "نام کاربری یا رمز اشتباه است",
  "access denied, no token provided": "توکن ارسال نشده، دسترسی امکان‌پذیر نیست",
  "invalid or expired token": "توکن نامعتبر یا منقضی شده است",
  "email already exists": "ایمیل قبلاً ثبت شده است",
  "username already exists": "نام کاربری تکراری است",
  "user already exists": "نام کاربری تکراری است",
  "server error": "خطای داخلی سرور",
  "password must be at least 6 characters": "رمز عبور باید حداقل ۶ کاراکتر باشد",
  "email is invalid": "فرمت ایمیل نامعتبر است",
  "too many requests": "درخواست‌های زیاد، لطفا بعدا تلاش کنید",
};

export function toPersian(msg) {
  if (!msg) return "خطایی رخ داد";
  const key = msg.trim().toLowerCase();
  return authMessageMap[key] || msg;
}
