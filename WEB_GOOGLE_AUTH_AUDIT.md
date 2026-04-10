# Web Google Auth Audit

## Context

This project had a web-only Google authentication issue:

- Google sign-in worked on mobile
- Google sign-in failed on web
- After the failed auth flow, requests such as reading `app_settings` returned `401 Unauthorized`

The most important observation was that `app_settings` already allows anon read through RLS, so the `401` strongly suggested that the web app was not establishing the expected Supabase identity/session correctly after Google auth.

---

## Files inspected

### Web entry
- `web/index.html`

### Supabase config / initialization
- `lib/services/supabase_config.dart`
- `lib/services/supabase_client.dart`
- `assets/supabase_client.json`

### Google auth flow
- `lib/features/auth/google_auth_flow.dart`

---

## Root cause found

## 1) Missing Google web client meta tag in `web/index.html`

The file originally did **not** contain:

```html
<meta
  name="google-signin-client_id"
  content="1097420115480-316v83f82lelnevclorq8i6ivm4r2v87.apps.googleusercontent.com"
>
```

This was the clearest missing web-specific configuration.

### Why this matters

The web flow in this project uses `google_sign_in` and then exchanges the Google token with Supabase:

```dart
final google = GoogleSignIn(
  scopes: const ['email'],
  serverClientId: webClientId.isNotEmpty ? webClientId : null,
);

final googleAccount = await google.signIn();
final auth = await googleAccount.authentication;

final authResp = await SupabaseService.client.auth.signInWithIdToken(
  provider: OAuthProvider.google,
  idToken: idToken,
  accessToken: accessToken.isEmpty ? null : accessToken,
);
```

On web, missing Google web configuration can cause the popup/token flow to complete incorrectly or return an unusable token for Supabase session creation.

That leads to:
- no valid Supabase session
- missing/invalid bearer token on later requests
- eventual `401 Unauthorized`

---

## 2) Web flow was using the wrong auth strategy

The old implementation on web relied on:

- `GoogleSignIn`
- `googleAccount.authentication`
- `signInWithIdToken(...)`

This is more fragile on Flutter Web and also surfaced the deprecation warning for the old web Google Sign-In plugin flow.

### Fix applied

The web flow now uses Supabase browser OAuth directly:

```dart
await SupabaseService.client.auth.signInWithOAuth(
  OAuthProvider.google,
  redirectTo: '$origin/auth-check',
);
```

while mobile keeps using the existing token-based Google sign-in flow.

### Why this is the correct web approach

For web, Supabase OAuth redirect flow is the more stable pattern because:
- Supabase handles the browser redirect/callback flow directly
- session creation/restoration is clearer on web
- it avoids depending on the deprecated `google_sign_in` browser flow
- it matches how browser auth is typically configured in Supabase

### UI handling change

A dedicated outcome was added:

```dart
class GoogleAuthRedirectStarted extends GoogleAuthOutcome
```

This lets the login/signup screen show a temporary message while the browser is being redirected to Google.

---

## Verified config loading behavior

### `lib/services/supabase_config.dart`

The app loads public client config from:

```dart
assets/supabase_client.json
```

and only falls back to:

```dart
String.fromEnvironment('SUPABASE_BASE_URL')
String.fromEnvironment('SUPABASE_ANON_KEY')
String.fromEnvironment('GOOGLE_WEB_CLIENT_ID')
```

### `lib/services/supabase_client.dart`

Supabase is initialized using:

```dart
final config = await SupabaseConfig.fromAssets();
await Supabase.initialize(url: config.baseUrl, anonKey: config.anonKey);
```

### `assets/supabase_client.json`

The file contains:

```json
{
  "baseUrl": "https://xmmidaovcgwebzyqibev.supabase.co",
  "anonKey": "sb_publishable_nJot37RmrgF9DNO3G6A1vw_NnMmm8IV",
  "googleWebClientId": "1097420115480-316v83f82lelnevclorq8i6ivm4r2v87.apps.googleusercontent.com"
}
```

### Conclusion about `.env`

This project is **not** depending on `.env` for runtime web auth config.

Current config resolution is:

1. `assets/supabase_client.json`
2. fallback to `--dart-define`
3. not `.env`

So a `.env` file is **not required** for Google web auth to work in this project.

What is required instead:
- valid `assets/supabase_client.json`
- correct Google Web Client ID
- correct Supabase project URL / anon key
- correct Google + Supabase dashboard configuration for web OAuth

---

## Fixes applied

### 1) Added the Google web client meta tag to `web/index.html`

```html
<meta
  name="google-signin-client_id"
  content="1097420115480-316v83f82lelnevclorq8i6ivm4r2v87.apps.googleusercontent.com"
>
```

### 2) Switched web Google auth to Supabase OAuth redirect flow

In `lib/features/auth/google_auth_flow.dart`:

- web now uses `signInWithOAuth(...)`
- redirect target is based on `Uri.base.origin`
- redirect currently points to:

```text
{origin}/auth-check
```

### 3) Updated login/signup screens to handle redirect startup gracefully

Updated files:
- `lib/features/auth/login_screen.dart`
- `lib/features/auth/signup_screen.dart`

### 4) Fixed anonymous REST header behavior in `lib/services/api_service.dart`

The app was previously sending:

```http
Authorization: Bearer sb_publishable_...
```

when no logged-in auth token was available.

That is incorrect for PostgREST/Supabase REST calls. The publishable/anon key belongs in:

```http
apikey: ...
```

and should **not** be reused as a bearer access token.

The header builder was changed from:

```dart
'Authorization':
    'Bearer ${cleanAuthToken.isNotEmpty ? cleanAuthToken : _anonKey}',
```

to:

```dart
if (cleanAuthToken.isNotEmpty) 'Authorization': 'Bearer $cleanAuthToken',
```

### Why this second fix matters

Using the publishable key as a bearer token can trigger `401 Unauthorized` / "غير مصرح بهذا الإجراء" even on reads that should work anonymously.

So the web issue had two layers:

1. Missing Google web configuration
2. Incorrect fallback auth header construction for REST calls

---

## What was NOT found

### No conflicting Google scripts
`web/index.html` does not include extra Google auth scripts that obviously conflict with Flutter or Supabase.

### No `redirectTo` bug in current code
There is no `redirectTo` in the current code path because the app is not using OAuth redirect flow on web.

---

## Recommended checklist for any future developer

If Google auth breaks on web again, verify the following in order:

---

## Vercel deployment note

If Google auth returns to:

```text
/auth-check?code=...
```

and Vercel shows its own `404 NOT_FOUND` page, then the OAuth flow itself is not the problem.

That means the browser successfully returned to the website, but the deployment is missing an SPA fallback rewrite for client-side routes.

### Symptom

- Root path `/` works
- Google account picker works
- Browser returns to the same production domain
- Any direct route such as `/auth-check` returns Vercel 404 before Flutter loads

### Required Vercel fix

Add a `vercel.json` file at the deployed project root with:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

If the Vercel project root is the Flutter app folder, it can also declare:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "outputDirectory": "build/web",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Why this is needed

Flutter Web uses client-side routing. Routes such as `/auth-check` are handled by Flutter after `index.html` loads.

Without the rewrite, Vercel tries to find a real file named `/auth-check` and returns its own 404 page instead.

### A. `web/index.html`
- Confirm `google-signin-client_id` exists
- Confirm the value is the real **Web Client ID**
- Confirm there are no duplicate/conflicting Google auth scripts

### B. Google Cloud Console
- Confirm the client ID is a **Web application** client
- Confirm the deployed domain is allowed in **Authorized JavaScript origins**
- Confirm any needed redirect URLs are added if moving to OAuth redirect flow

### C. Supabase Dashboard
- Confirm Google provider is enabled
- Confirm redirect URLs match the deployed domain if using `signInWithOAuth`
- Confirm auth callback URLs are correct

### D. App config
- Confirm `assets/supabase_client.json` is bundled in the web build
- Confirm `googleWebClientId` is populated with the correct web client ID
- Confirm `Supabase.initialize(...)` receives the correct `baseUrl` and `anonKey`

### E. Auth implementation
- If web remains unstable, migrate web auth to:
  - `signInWithOAuth(OAuthProvider.google, redirectTo: ...)`
- Keep native/mobile flow separate if necessary

---

## Practical interpretation of the old `401 app_settings` error

That `401` was not only a sign-in symptom.

It was also explained by a REST header bug:
- the app could send the publishable key as `Authorization: Bearer ...`
- PostgREST expects a real JWT bearer token there
- anonymous access should rely on `apikey`, not a fake bearer token

So the failure after selecting the Google account could surface as:
- web Google auth/session instability
- and/or an invalid bearer header on follow-up REST requests such as `app_settings`

---

## Final conclusion

The web auth baseline fix now includes:

1. `google-signin-client_id` in `web/index.html`
2. web Google auth moved to `SupabaseService.client.auth.signInWithOAuth(...)`
3. incorrect fallback bearer header removed from `lib/services/api_service.dart`
4. invalid runtime non-Supabase base URLs rejected in `lib/services/supabase_config.dart`

This should be considered the current correct web auth implementation for this project.
