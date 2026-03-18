function requiredEnv(name) {
  return process.env[name] || "";
}

function hasEnv(name) {
  return Boolean(process.env[name] && process.env[name].trim());
}

module.exports = {
  app: {
    username: requiredEnv("APP_ADMIN_USERNAME"),
    password: requiredEnv("APP_ADMIN_PASSWORD"),
    sessionSecret: requiredEnv("APP_SESSION_SECRET")
  },
  supabase: {
    url: requiredEnv("SUPABASE_URL"),
    anonKey: requiredEnv("SUPABASE_ANON_KEY"),
    serviceRoleKey: requiredEnv("SUPABASE_SERVICE_ROLE_KEY")
  },
  mailchimp: {
    serverPrefix: requiredEnv("MAILCHIMP_SERVER_PREFIX"),
    apiKey: requiredEnv("MAILCHIMP_API_KEY"),
    oauthAccessToken: requiredEnv("MAILCHIMP_OAUTH_ACCESS_TOKEN")
  },
  streamline: {
    baseUrl: requiredEnv("STREAMLINE_API_BASE_URL"),
    apiKey: requiredEnv("STREAMLINE_API_KEY"),
    accountId: requiredEnv("STREAMLINE_ACCOUNT_ID")
  },
  flags: {
    mailchimpConfigured: hasEnv("MAILCHIMP_API_KEY") || hasEnv("MAILCHIMP_OAUTH_ACCESS_TOKEN"),
    streamlineConfigured: hasEnv("STREAMLINE_API_KEY"),
    authConfigured: hasEnv("APP_ADMIN_USERNAME") && hasEnv("APP_ADMIN_PASSWORD") && hasEnv("APP_SESSION_SECRET"),
    supabaseAdminConfigured: hasEnv("SUPABASE_URL") && hasEnv("SUPABASE_SERVICE_ROLE_KEY")
  }
};
