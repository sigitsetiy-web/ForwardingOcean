import fs from "fs";
import path from "path";

/** Update or append key=value pairs in an env file (preserves other lines). */
export function updateEnvFile(
  filePath: string,
  vars: Record<string, string>
): void {
  let content = "";
  if (fs.existsSync(filePath)) {
    content = fs.readFileSync(filePath, "utf8");
  }

  for (const [key, value] of Object.entries(vars)) {
    const line = `${key}=${value}`;
    const regex = new RegExp(`^${key}=.*$`, "m");

    if (regex.test(content)) {
      content = content.replace(regex, line);
    } else {
      if (content.length > 0 && !content.endsWith("\n")) {
        content += "\n";
      }
      content += `${line}\n`;
    }
  }

  fs.writeFileSync(filePath, content, "utf8");
}

/** Persist Accurate credentials to .env.local and apply to current process. */
export function saveAccurateCredentials(
  signatureSecret: string,
  apiToken: string
): void {
  const root = process.cwd();
  const vars = {
    ACCURATE_SIGNATURE_SECRET: signatureSecret,
    ACCURATE_API_TOKEN: apiToken,
  };

  updateEnvFile(path.join(root, ".env.local"), vars);
  // Also update .env so production (pm2) picks up on restart if .env.local is missing
  updateEnvFile(path.join(root, ".env"), vars);

  process.env.ACCURATE_SIGNATURE_SECRET = signatureSecret;
  process.env.ACCURATE_API_TOKEN = apiToken;
}

export function hasAccurateCredentials(): boolean {
  const signatureSecret = process.env.ACCURATE_SIGNATURE_SECRET || "";
  const apiToken = process.env.ACCURATE_API_TOKEN || "";

  return Boolean(
    signatureSecret &&
      signatureSecret !== "your_signature_secret_here" &&
      apiToken &&
      !apiToken.includes("your_api_token")
  );
}
