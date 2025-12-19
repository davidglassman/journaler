import { notarize } from "@electron/notarize";
import "dotenv/config";
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

export default async function notarizing(context) {
  if (process.platform !== "darwin") {
    return;
  }

  console.log("afterSign hook triggered", context);

  const appId = "com.davidglassman.journaler";

  const appPath = path.join(context.appOutDir, `${context.packager.appInfo.productFilename}.app`);
  if (!fs.existsSync(appPath)) {
    console.log("skip");
    return;
  }

  console.log(`Notarizing ${appId} found at ${appPath} with Apple ID ${process.env.APPLE_ID}`);

  try {
    const notarizeResult = await notarize({
      appBundleId: appId,
      appPath: appPath,
      appleId: process.env.APPLE_ID,
      appleIdPassword: process.env.APPLE_ID_PASSWORD,
      teamId: process.env.APPLE_TEAM_ID,
      tool: "notarytool"
    });

    console.log(`Done notarizing ${appId}`);

    // Staple the notarization ticket to the app
    console.log(`Stapling ${appPath}`);
    execSync(`xcrun stapler staple "${appPath}"`, { stdio: "inherit" });
    console.log("Stapling complete");

    return notarizeResult;
  } catch (error) {
    console.error("Notarization failed with error:");
    console.error("Message:", error.message);
    if (error.stdout) console.error("stdout:", error.stdout);
    if (error.stderr) console.error("stderr:", error.stderr);
    throw error;
  }
}
