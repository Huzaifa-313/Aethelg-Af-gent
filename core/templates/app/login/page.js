# AETHELGARD MERGED FILE
# Origin Repository: thepopebot-1.2.72
# Original Path: templates\app\login\page.js
# Merge Date: 2026-05-07T19:25:13.475466
# ---

import { getPageAuthState } from 'thepopebot/auth';
import { AsciiLogo } from '../components/ascii-logo';
import { SetupForm } from '../components/setup-form';
import { LoginForm } from '../components/login-form';

export default async function LoginPage() {
  const { needsSetup } = await getPageAuthState();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <AsciiLogo />
      {needsSetup ? <SetupForm /> : <LoginForm />}
    </main>
  );
}
