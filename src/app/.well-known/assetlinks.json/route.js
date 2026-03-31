export async function GET() {
  return Response.json([
    {
      relation: ["delegate_permission/common.handle_all_urls"],
      target: {
        namespace: "android_app",
        package_name: "com.alertyai.app",
        sha256_cert_fingerprints: ["YOUR_SHA256_FINGERPRINT_HERE"]
      }
    }
  ])
}
