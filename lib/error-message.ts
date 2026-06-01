export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    const msg = error.message;
    if (msg.includes("Invalid login credentials")) return "이메일 또는 비밀번호가 올바르지 않습니다.";
    if (msg.includes("Email not confirmed")) return "이메일 인증이 필요합니다.";
    if (msg.includes("User already registered")) return "이미 가입된 이메일입니다.";
    if (msg.includes("Password should be at least")) return "비밀번호는 최소 6자 이상이어야 합니다.";
  }
  return "오류가 발생했습니다. 다시 시도해주세요.";
}